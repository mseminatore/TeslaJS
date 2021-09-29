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
        state: generateCodeChallenge(generateCodeVerifier())
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
