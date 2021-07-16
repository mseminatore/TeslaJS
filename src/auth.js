"use strict";

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Ignore 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' authorization error

var request = require('request').defaults({
    headers: {
        "Accept" : "*/*"
    },
    gzip: true,
//    timeout: 60000,
//    followRedirect: false,
    jar: true
//    ,proxy: "http://127.0.0.1:8888" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
});
var crypto = require('crypto');
var Promise = require('promise');

exports.login = function login(credentials, callback) {
    var codeVerifier = generateCodeVerifier();
    var codeChallenge = generateCodeChallenge(codeVerifier);
    var queryString = {
//        audience: '',
        client_id: 'ownerapi',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        locale: 'en',
        prompt: 'login',
        redirect_uri: 'https://auth.tesla.com/void/callback',
        response_type: 'code',
        scope: 'openid email offline_access',
        state: generateCodeChallenge(generateCodeVerifier()),
        login_hint: credentials.identity
    };
    var transactionId = null;
    var loginHost = null;
    var loginUrl = null;

    req({
        method: 'GET',
        url: 'https://auth.tesla.com/oauth2/v3/authorize',
        qs: queryString,
        headers: {
            "sec-fetch-site": "none",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document"
        }
    }).then(function (result) {
        // Record the final URL we got redirected to; this is where we will send our credentials
        loginUrl = result.response.request.href;
        loginHost = "https://" + require('url').parse(loginUrl).host;
        var form = {};
        
        var hiddenFormFields = result.body.match(/<input type="hidden" [^>]+>/g);
        hiddenFormFields.forEach(function (field) {
            var name = field.match(/name="([^"]+)"/);
            var value = field.match(/value="([^"]*)"/);
            if (name && value) {
                form[name[1]] = value[1];
            }
        });

        transactionId = form.transaction_id;
        
        form.identity = credentials.identity;
        form.credential = credentials.credential;

        return req({
            method: 'POST',
            url: loginUrl,
            form: form,
            headers: {
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "navigate",
                "sec-fetch-user": "?1",
                "sec-fetch-dest": "document",
                "referer": loginUrl,
                "origin": loginHost
            }
        });
    }).then(function (result) {
        if (result.body.includes('/oauth2/v3/authorize/mfa/verify')) {
            // MFA is required
            if (!credentials.mfaPassCode) {
                throw new Error("MFA passcode required");
            }
        
            return mfaVerify(transactionId, loginHost, loginUrl, credentials.mfaPassCode, credentials.mfaDeviceName);
        }
    
        // No need to handle MFA
        return result;
    }).then(function (result) {
        var location = result.response.headers.location;
        if (!location) {
            throw new Error("Login credentials rejected");
        }

        var url = require('url').parse(location, true);
        if (!url.query || !url.query.code) {
            throw new Error("No authorization code issued; credentials likely incorrect");
        }

        return req({
            method: 'POST',
            url: (url.query.issuer || 'https://auth.tesla.com/oauth2/v3') + '/token',
            jar: false,
            json: true,
            headers: {
                "Accept": "*/*",
                "Content-Type" : "application/json",
                "Connection" : "keep-alive"
            },
            body: {
                grant_type: 'authorization_code',
                client_id: 'ownerapi',
                code_verifier: codeVerifier,
                code: url.query.code,
                redirect_uri: url.protocol + '//' + url.host + url.pathname
            }
        });
    }).then(function (result) {
        return req({
            method: 'POST',
            url: 'https://owner-api.teslamotors.com/oauth/token',
            headers: {
                Authorization: 'Bearer ' + result.body.access_token
            },
            json: true,
            body: {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                client_id: _0x2dc0[0]
            }
        });
    }).then(function (result) {
        callback(null, result.response, result.body);
    }).catch(function (error) {
        callback(error);
    });
}

function mfaVerify(transactionId, host, referer, mfaPassCode, mfaDeviceName) {
    return req({
        method: 'GET',
        url: host + '/oauth2/v3/authorize/mfa/factors?transaction_id=' + transactionId,
        headers: {
            "x-requested-with": "XMLHttpRequest",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "referer": referer
        },
        json: true
    }).then(function (result) {
        if (!result.body || !result.body.data || result.body.data.length == 0) {
            throw new Error('No MFA devices found');
        }
        
        var device = result.body.data[0];
        if (mfaDeviceName) {
            // Find the specific device we're looking for
            device = result.body.data.find(function (dev) { return dev.name == mfaDeviceName; });
            if (!device) {
                throw new Error('No MFA device found with name ' + mfaDeviceName);
            }
        }
        
        return req({
            method: 'POST',
            url: host + '/oauth2/v3/authorize/mfa/verify',
            headers: {
                "x-requested-with": "XMLHttpRequest",
                "origin": host,
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "referer": referer
            },
            json: true,
            body: {
                transaction_id: transactionId,
                factor_id: device.id,
                passcode: mfaPassCode
            }
        });
    }).then(function (result) {
        if (!result.body || !result.body.data || !result.body.data.approved || !result.body.data.valid) {
            throw new Error('MFA passcode rejected');
        }
        
        // MFA auth has succeeded, so now repeat the authorize request with just the transaction id
        return req({
            method: 'POST',
            url: referer,
            headers: {
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "navigate",
                "sec-fetch-user": "?1",
                "sec-fetch-dest": "document",
                "referer": referer,
                "origin": host
            },
            form: {
                transaction_id: transactionId
            },
            json: true
        });
    });
}

function generateCodeVerifier() {
    // Tesla might use something more sophisticated, but in my experience it's a 112-char alphanumeric string so let's just do that
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var random = crypto.randomBytes(86);
    var output = '';
    for (var i = 0; i < random.length; i++) {
        output += chars[random[i] % chars.length];
    }
    return output;
}

function generateCodeChallenge(verifier) {
    var hash = crypto.createHash('sha256');
    hash.update(verifier);
    return hash.digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function req(parameters) {
    return new Promise(function (resolve, reject) {
        request(parameters, function (error, response, body) {
            if (error /*|| response.statusCode >= 400*/) {
                return reject(error || new Error("HTTP error " + response.statusCode));
            }

            resolve({response: response, body: body});
        });
    });
}

//var _0x2dc0 = ["\x65\x34\x61\x39\x39\x34\x39\x66\x63\x66\x61\x30\x34\x30\x36\x38\x66\x35\x39\x61\x62\x62\x35\x61\x36\x35\x38\x66\x32\x62\x61\x63\x30\x61\x33\x34\x32\x38\x65\x34\x36\x35\x32\x33\x31\x35\x34\x39\x30\x62\x36\x35\x39\x64\x35\x61\x62\x33\x66\x33\x35\x61\x39\x65", "\x63\x37\x35\x66\x31\x34\x62\x62\x61\x64\x63\x38\x62\x65\x65\x33\x61\x37\x35\x39\x34\x34\x31\x32\x63\x33\x31\x34\x31\x36\x66\x38\x33\x30\x30\x32\x35\x36\x64\x37\x36\x36\x38\x65\x61\x37\x65\x36\x65\x37\x66\x30\x36\x37\x32\x37\x62\x66\x62\x39\x64\x32\x32\x30"];
var _0x2dc0 = ["\x38\x31\x35\x32\x37\x63\x66\x66\x30\x36\x38\x34\x33\x63\x38\x36\x33\x34\x66\x64\x63\x30\x39\x65\x38\x61\x63\x30\x61\x62\x65\x66\x62\x34\x36\x61\x63\x38\x34\x39\x66\x33\x38\x66\x65\x31\x65\x34\x33\x31\x63\x32\x65\x66\x32\x31\x30\x36\x37\x39\x36\x33\x38\x34", "\x63\x37\x32\x35\x37\x65\x62\x37\x31\x61\x35\x36\x34\x30\x33\x34\x66\x39\x34\x31\x39\x65\x65\x36\x35\x31\x63\x37\x64\x30\x65\x35\x66\x37\x61\x61\x36\x62\x66\x62\x64\x31\x38\x62\x61\x66\x62\x35\x63\x35\x63\x30\x33\x33\x62\x30\x39\x33\x62\x62\x32\x66\x61\x33"];
