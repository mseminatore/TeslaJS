"use strict";

var request = require('request').defaults({
    headers: {
        "x-tesla-user-agent": "TeslaApp/3.10.8-421/adff2e065/android/8.1.0",
        "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; Pixel XL Build/OPM4.171019.021.D1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36",
        "x-requested-with": "com.teslamotors.tesla"
    },
    gzip: true,
    jar: true
});
var crypto = require('crypto');
var Promise = require('promise');

exports.login = function login(credentials, callback) {
    var codeVerifier = generateCodeVerifier();
    var codeChallenge = generateCodeChallenge(codeVerifier);
    var queryString = {
        audience: '',
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

    req({
        method: 'GET',
        url: 'https://auth-global.tesla.com/oauth2/v3/authorize',
        qs: queryString,
        headers: {
            "sec-fetch-site": "none",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document"
        }
    }).then(function (result) {
        // Record the final URL we got redirected to; this is where we will send our credentials
        var loginUrl = result.response.request.href;
        var form = {};
        
        var hiddenFormFields = result.body.match(/<input type="hidden" [^>]+>/g);
        hiddenFormFields.forEach(function (field) {
            var name = field.match(/name="([^"]+)"/);
            var value = field.match(/value="([^"]*)"/);
            if (name && value) {
                form[name[1]] = value[1];
            }
        });

        Object.assign(form, credentials);

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
                "origin": "https://" + require('url').parse(loginUrl).host
            }
        });
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
                authorization: 'bearer ' + result.body.access_token
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

function generateCodeVerifier() {
    // Tesla might use something more sophisticated, but in my experience it's a 112-char alphanumeric string so let's just do that
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var random = crypto.randomBytes(112);
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
            if (error || response.statusCode >= 400) {
                return reject(error || new Error("HTTP error " + response.statusCode));
            }

            resolve({response: response, body: body});
        });
    });
}

//var _0x2dc0 = ["\x65\x34\x61\x39\x39\x34\x39\x66\x63\x66\x61\x30\x34\x30\x36\x38\x66\x35\x39\x61\x62\x62\x35\x61\x36\x35\x38\x66\x32\x62\x61\x63\x30\x61\x33\x34\x32\x38\x65\x34\x36\x35\x32\x33\x31\x35\x34\x39\x30\x62\x36\x35\x39\x64\x35\x61\x62\x33\x66\x33\x35\x61\x39\x65", "\x63\x37\x35\x66\x31\x34\x62\x62\x61\x64\x63\x38\x62\x65\x65\x33\x61\x37\x35\x39\x34\x34\x31\x32\x63\x33\x31\x34\x31\x36\x66\x38\x33\x30\x30\x32\x35\x36\x64\x37\x36\x36\x38\x65\x61\x37\x65\x36\x65\x37\x66\x30\x36\x37\x32\x37\x62\x66\x62\x39\x64\x32\x32\x30"];
var _0x2dc0 = ["\x38\x31\x35\x32\x37\x63\x66\x66\x30\x36\x38\x34\x33\x63\x38\x36\x33\x34\x66\x64\x63\x30\x39\x65\x38\x61\x63\x30\x61\x62\x65\x66\x62\x34\x36\x61\x63\x38\x34\x39\x66\x33\x38\x66\x65\x31\x65\x34\x33\x31\x63\x32\x65\x66\x32\x31\x30\x36\x37\x39\x36\x33\x38\x34", "\x63\x37\x32\x35\x37\x65\x62\x37\x31\x61\x35\x36\x34\x30\x33\x34\x66\x39\x34\x31\x39\x65\x65\x36\x35\x31\x63\x37\x64\x30\x65\x35\x66\x37\x61\x61\x36\x62\x66\x62\x64\x31\x38\x62\x61\x66\x62\x35\x63\x35\x63\x30\x33\x33\x62\x30\x39\x33\x62\x62\x32\x66\x61\x33"];
