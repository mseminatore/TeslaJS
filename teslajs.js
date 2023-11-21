/* jshint esversion: 11 */
/**
 * @file This is a Node.js module encapsulating the unofficial Tesla API set
 * 
 * Github: https://github.com/mseminatore/TeslaJS
 * NPM: https://www.npmjs.com/package/teslajs
 * 
 * @copyright Copyright (c) 2016 Mark Seminatore
 * 
 * @license MIT
 * 
 * Refer to included LICENSE file for usage rights and restrictions
 */

"use strict";

var request = require('request').defaults({
    headers: {
        "x-tesla-user-agent": "TeslaApp/3.4.4-350/fad4a582e/android/8.1.0",
        "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; Pixel XL Build/OPM4.171019.021.D1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36"
    },
    json: true,
    gzip: true,
    body: {}
});
var Promise = require('promise');
var websocket = require('ws');

//=======================
// Streaming API portal
//=======================
/** 
 * @global 
 * @default
 */
var streamingPortal = "wss://streaming.vn.teslamotors.com/streaming/";
exports.streamingPortal = streamingPortal;

var streamingBaseURI = process.env.TESLAJS_STREAMING ?? streamingPortal;

//===========================
// New OAuth-based API portal
//===========================
/**   
 * @global   
 * @default  
 */
var portal = "https://owner-api.teslamotors.com";
exports.portal = portal;

var portalBaseURI = process.env.TESLAJS_SERVER ?? portal;

//=======================
// Log levels
//=======================
/**   
 * @global   
 * @default  
 */
var API_LOG_ALWAYS = 0;
exports.API_LOG_ALWAYS = API_LOG_ALWAYS;

/**   
 * @global   
 * @default  
 */
var API_ERR_LEVEL = 1;
exports.API_ERR_LEVEL = API_ERR_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_CALL_LEVEL = 2;
exports.API_CALL_LEVEL = API_CALL_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_RETURN_LEVEL = 3;
exports.API_RETURN_LEVEL = API_RETURN_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_BODY_LEVEL = 4;
exports.API_BODY_LEVEL = API_BODY_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_REQUEST_LEVEL = 5;
exports.API_REQUEST_LEVEL = API_REQUEST_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_RESPONSE_LEVEL = 6;
exports.API_RESPONSE_LEVEL = API_RESPONSE_LEVEL;

/**   
 * @global   
 * @default  
 */
var API_LOG_ALL = 255;	// this value must be the last
exports.API_LOG_ALL = API_LOG_ALL;

var logLevel = process.env.TESLAJS_LOG ?? 0;

/**
 * Node-style callback function
 * @callback nodeBack
 * @param {function} error - function which receives the error result
 * @param {function} data - function which receives the data result
 */

/**
 * TeslaJS options parameter
 * @typedef optionsType
 * @type {object}
 * @property {string} authToken - Tesla provided OAuth token
 * @property {string} vehicleID - Tesla provided long vehicle id
 * @property {?int} [carIndex] - index of vehicle within vehicles JSON
 */

/*
 * Adjustable console logging
 * @param {int} level - logging level
 * @param {string} str - text to log
 */
function log(level, str) {
    if (logLevel < level) {
        return;
    }
//    console.log("[" + new Date().toISOString() + "] " + str);
    console.log(str);
}

/*
 * Ensure value is within [min..max]
 */
function clamp(value, min, max) {
    if (value < min) {
        value = min;
    }

    if (value > max) {
        value = max;
    }

    return value;
}

/**
 * Set the current logging level
 * @param {int} level - logging level
 */
exports.setLogLevel = function setLogLevel(level) {
    logLevel = level;
}

/**
 * Get the current logging level
 * @return {int} the current logging level
 */
exports.getLogLevel = function getLogLevel() {
    return logLevel;
}

/**
 * Set the portal base URI
 * @param {string} uri - URI for Tesla servers
 */
exports.setPortalBaseURI = function setPortalBaseURI(uri) {
    if (!uri) {
        portalBaseURI = portal; // reset to the default Tesla servers
    } else {
        portalBaseURI = uri;
    }
}

/**
 * Get the portal base URI
 * @return {string} URI for Tesla servers
 */
exports.getPortalBaseURI = function getPortalBaseURI() {
    return portalBaseURI;
}

/**
 * Set the streaming base URI
 * @param {string} uri - URI for Tesla streaming servers
 */
exports.setStreamingBaseURI = function setStreamingBaseURI(uri) {
    if (!uri) {
        streamingBaseURI = streamingPortal; // reset to the default Tesla servers
    } else {
        streamingBaseURI = uri;
    }
}

/**
 * Get the streaming base URI
 * @return {string} URI for Tesla streaming servers
 */
exports.getStreamingBaseURI = function getStreamingBaseURI() {
    return streamingBaseURI;
}

/**
 * Return the car model from vehicle JSON information
 * @param {object} vehicle - vehicle JSON
 * @return {string} vehicle model string
 */
exports.getModel = function getModel(vehicle) {
    var result = exports.vinDecode(vehicle);
    return result.carType;
}

/**
 * Return an object containing properties decoded from the vehicle VIN
 * @param {object} vehicle - vehicle JSON
 * @return {object} vehicle properties
 */
exports.vinDecode = function vinDecode(vehicle) {
    var result = {
        carType: "Model S",
        awd: false,
        year: 2012
    };

    if (!vehicle || !vehicle.vin) {
        return result;
    }

    var dateCode = vehicle.vin.charCodeAt(9);
    result.year = 2010 + dateCode - 'A'.charCodeAt(0);

    // handle the skipped 'I' code. We may also need to skip 'O'
    if (dateCode > 73) {
        result.year--;
    }

    var model = vehicle.vin.charAt(3);
    switch (model) {
        case "S":
            result.carType = "Model S";
            break;

        case "3":
            result.carType = "Model 3";
            break;

        case "X":
            result.carType = "Model X";
            break;
        
        case "Y":
            result.carType = "Model Y";
            break;

        case "R":
            result.carType = "Roadster";
               break;
    }

    // Check for AWD config 2, 4 or B
    if (
            vehicle.vin.charAt(7) == "2" || // Dual Motor (standard) (Designated for Model S & Model X)
            vehicle.vin.charAt(7) == "4" || // Dual Motor (performance) (Designated for Model S & Model X)
            vehicle.vin.charAt(7) == "B" || // Dual motor - standard Model 3
            vehicle.vin.charAt(7) == "C" || // Dual motor - performance Model 3
            vehicle.vin.charAt(7) == "E"    // Dual motor - Model Y
        ) {
        result.awd = true;
    }
    
    return result;
}

/**
 * Return the paint color from vehicle JSON information
 * @param {object} vehicle - vehicle JSON
 * @return {string} the vehicle paint color
 */
exports.getPaintColor = function getPaintColor(vehicle) {
    var colors = {
        "PBCW": "white",
        "PBSB": "black",
        "PMAB": "metallic brown",
        "PMBL": "metallic black",
        "PMMB": "metallic blue",
        "PMMR": "multi-coat red",
        "PPMR": "multi-coat red",
        "PMNG": "steel grey",
        "PMSG": "metallic green",
        "PMSS" : "metallic silver",
        "PPSB": "ocean blue",
        "PPSR" : "signature red",  //premium signature red"
        "PPSW": "pearl white",
        "PPTI": "titanium",
        "PMTG": "metallic grey"   // dolphin grey
    };

    var paintColor = vehicle.option_codes.match(/PBCW|PBSB|PMAB|PMBL|PMMB|PMMR|PPMR|PMNG|PMSG|PMSS|PPSB|PPSR|PPSW|PPTI|PMTG/);

    return colors[paintColor] ?? "black";
}

/**
 * Return the vehicle VIN from vehicle JSON information
 * @param {object} vehicle - vehicle JSON
 * @return {string} the vehicle VIN
 */
exports.getVin = function getVin(vehicle) {
    if (!vehicle || !vehicle.vin) {
        throw new Error("invalid parameter");
    }

    return vehicle.vin;
}

/**
 * Return the vehicle VIN from vehicle JSON information
 * @param {object} vehicle - vehicle JSON
 * @return {string} the short version of the vehicle VIN
 */
exports.getShortVin = function getShortVin(vehicle) {
    if (!vehicle || !vehicle.vin) {
        throw new Error("invalid parameter");
    }

    return vehicle.vin.substr(11);
}

/**
 * Login to the server and receive OAuth tokens
 * @function login
 * @param {Object} credentials - object of Tesla credentials
 * @param {string} credentials.username - email address used on Tesla.com
 * @param {string} credentials.password - password used on Tesla.command
 * @param {string} credentials.mfaPassCode - MFA password
 * @param {string} credentials.mfaDeviceName - MFA device name
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} {response, body, authToken, refreshToken}
 */
exports.login = function login(credentials, callback) {
    log(API_CALL_LEVEL, "TeslaJS.login()");
    
    // Compatibility with old username/password API
    if (typeof arguments[0] == 'string' && typeof arguments[1] == 'string') {
        credentials = {username: arguments[0], password: arguments[1]};
        callback = arguments[2];
    }
    
    credentials = credentials ?? {};
    callback = callback ?? function (err, result) { /* do nothing! */ }

    if (!credentials.username || !credentials.password) {
        callback("login() requires username and password", null);
        return;
    }

    require('./src/auth').login({identity: credentials.username, credential: credentials.password, mfaPassCode: credentials.mfaPassCode, mfaDeviceName: credentials.mfaDeviceName}, function (error, response, body) {
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));
        log(API_RESPONSE_LEVEL, "\nBody: " + JSON.stringify(body));

        var loginResult = body ?? {};

        callback(error, { error: error, response: response, body: body, authToken: loginResult.access_token, refreshToken: loginResult.refresh_token });

        log(API_RETURN_LEVEL, "TeslaJS.login() completed.");
    });
}

/**
 * Login to the server and receive OAuth tokens
 * @function loginAsync
 * @param {Object} credentials - object of Tesla credentials
 * @param {string} credentials.username - email address used on Tesla.com
 * @param {string} credentials.password - password used on Tesla.command
 * @param {string} credentials.mfaPassCode - MFA password
 * @param {string} credentials.mfaDeviceName - MFA device name
 * @returns {Promise} {response, body, authToken, refreshToken}
 */
exports.loginAsync = Promise.denodeify(exports.login);

/**
 * Retrieve new OAuth and refresh tokens using a refresh_token
 * @param {string} refresh_token - a valid OAuth refresh_token from a previous login
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} {response, body, authToken, refreshToken}
 */
exports.refreshToken = function refreshToken(refresh_token, callback) {
    log(API_CALL_LEVEL, "TeslaJS.refreshToken()");
    
    callback = callback ?? function (err, result) { /* do nothing! */ }

    if (!refresh_token) {
        callback("refreshToken() requires a refresh_token", null);
        return;
    }

    var req = {
        method: 'POST',
        url: portalBaseURI + '/oauth/token',
        body: {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function (error, response, body) {

        log(API_RESPONSE_LEVEL, "\nResponse: " + body);

        callback(error, { error: error, response: response, body: JSON.stringify(body), authToken: body.access_token, refreshToken: body.refresh_token });

        log(API_RETURN_LEVEL, "TeslaJS.refreshToken() completed.");
    });
}

/**
 * Async call to retrieve new OAuth and refresh tokens using a refresh_token
 * @function refreshTokenAsync
 * @param {string} refresh_token - a valid OAuth refresh_token from a previous login
 * @returns {Promise} {response, body, authToken, refreshToken}
 */
exports.refreshTokenAsync = Promise.denodeify(exports.refreshToken);

/**
 * Logout and invalidate the current auth token
 * @param {string} authToken - Tesla provided OAuth token
 * @param {nodeBack} callback - Node-style callback
 */
exports.logout = function logout(authToken, callback) {
    log(API_CALL_LEVEL, "TeslaJS.logout()");

    callback = callback ?? function (err, result) { /* do nothing! */ }

    request({
        headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'POST',
        url: portalBaseURI + '/oauth/revoke',
    }, function (error, response, body) {

        callback(error, { error: error, response: response, body: JSON.stringify(body) });

        log(API_RETURN_LEVEL, "TeslaJS.logout() completed.");
    });
}

/**
 * Logout and invalidate the current auth token
 * @function logoutAsync
 * @param {string} authToken - Tesla provided OAuth token
 * @returns {Promise} result
 */
exports.logoutAsync = Promise.denodeify(exports.logout);

/**
 * Do an authentivated GET request to the portal
 * @function get
 * @param {optionsType} options - options object
 * @param {string} serviceURL - Service URL starting with '/'
 * @param {object} qs - Query string parameters
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} JSON data
 */
exports.get = function get(options, serviceURL, qs, callback) {
    log(API_CALL_LEVEL, "TeslaJS.get()");

    callback = callback ?? function (err, body) { /* do nothing! */ }

    var req = {
        headers: {
            "Authorization": `Bearer ${options.authToken}`,
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'GET',
        url: portalBaseURI + serviceURL,
        qs: qs,
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function (error, response, body) {
        if (error) {
            log(API_ERR_LEVEL, error);
            return callback(error, null);
        }

        if (response.statusCode != 200) {
            return callback(response.statusMessage, null);
        }

        log(API_BODY_LEVEL, "\nBody: " + JSON.stringify(body));
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));

        try {
            body = body.response;
            
            callback(null, body);
        } catch (e) {
            log(API_ERR_LEVEL, `Error parsing ${serviceURL} response`);
            callback(e, null);
        }

        log(API_RETURN_LEVEL, `\nGET request: ${serviceURL} completed.`);
    });
}

/**
 * Do an authentivated GET request to the portal
 * @function get
 * @param {optionsType} options - options object
 * @param {string} serviceURL - Service URL starting with '/'
 * @param {object} qs - Query string parameters
 * @param {nodeBack} callback - Node-style callback
 * @returns {Promise} result
 */
exports.getAsync = Promise.denodeify(exports.get);

/**
 * Do an authentivated POST request to the portal
 * @function get
 * @param {optionsType} options - options object
 * @param {string} serviceURL - Service URL starting with '/'
 * @param {object} qs - Query string parameters
 * @param {object} body - Body
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} JSON data
 */
exports.post = function post(options, serviceURL, qs, body, callback) {
    log(API_CALL_LEVEL, "TeslaJS.post()");

    callback = callback ?? function (err, body) { /* do nothing! */ }

    var req = {
        headers: {
            "Authorization": `Bearer ${options.authToken}`,
            "Content-Type": "application/json; charset=utf-8"
        },
        method: 'POST',
        url: portalBaseURI + serviceURL,
        qs: qs,
        body: body,
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function (error, response, body) {
        if (error) {
            log(API_ERR_LEVEL, error);
            return callback(error, null);
        }

        if (response.statusCode != 200) {
            return callback(response.statusMessage, null);
        }

        log(API_BODY_LEVEL, "\nBody: " + JSON.stringify(body));
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));

        try {
            body = body.response;
            
            callback(null, body);
        } catch (e) {
            log(API_ERR_LEVEL, `Error parsing ${serviceURL} response`);
            callback(e, null);
        }

        log(API_RETURN_LEVEL, `\nPOST request: ${serviceURL} completed.`);
    });
}

/**
 * Do an authentivated GET request to the portal
 * @function get
 * @param {optionsType} options - options object
 * @param {string} serviceURL - Service URL starting with '/'
 * @param {object} qs - Query string parameters
 * @param {object} body - Body
 * @param {nodeBack} callback - Node-style callback
 * @returns {Promise} result
 */
exports.postAsync = Promise.denodeify(exports.post);

/**
 * Return vehicle information on the requested vehicle
 * @function vehicle
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicle} vehicle JSON data
 */
exports.vehicle = function vehicle(options, args, callback) {
    callback = callback ?? function (err, vehicle) { /* do nothing! */ }
    exports.vehicles(options, args, function (err, vehicles) {
        if (err) { return callback(err, null); }
        try {
            let vehicle = vehicles[args?.carIndex ?? 0];
            callback(null, vehicle);
        } catch (e) {
            log(API_ERR_LEVEL, 'Error parsing vehicles response');
            callback(e, null);
        }        
    })
}

/**
 * Return vehicle information on the requested vehicle
 * @function vehicleAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} vehicle JSON data
 */
exports.vehicleAsync = Promise.denodeify(exports.vehicle);

/**
 * Return vehicle information on the requested vehicle. Uses options.vehicleID
 * to determine which vehicle to fetch data for.
 * @function vehicleById
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicle} vehicle JSON data
 */
exports.vehicleById = function vehicle(options, args, callback) {
    exports.get(options, `/api/1/vehicles/${options.vehicleID}`, null, callback)
}

/**
 * Return vehicle information on the requested vehicle. Uses options.vehicleID
 * to determine which vehicle to fetch data for.
 * @function vehicleByIdAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} vehicle JSON data
 */
exports.vehicleByIdAsync = Promise.denodeify(exports.vehicleById);

/**
 * Return vehicle information on ALL vehicles
 * @function vehicles
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicles[]} array of vehicle JSON data
 */
exports.vehicles = function vehicles(options, args, callback) {
    exports.get(options, '/api/1/vehicles', null, callback);
}

/**
 * Return vehicle information on ALL vehicles
 * @function vehiclesAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} array of vehicle JSON data
 */
exports.vehiclesAsync = Promise.denodeify(exports.vehicles);

/**
 * Generic REST call for GET commands
 * @function get_command
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} qs - URL query string parameters
 * @param {nodeBack} callback - Node-style callback
 */
exports.get_command = get_command;
function get_command(options, command, qs, callback) {
    exports.get(options, `/api/1/vehicles/${options.vehicleID}/${command}`, qs, callback)
}

/**
 * Generic Async REST call for GET commands
 * @function get_commandAsync
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} qs - URL query string parameters
 * @returns {Promise} result
 */
exports.get_commandAsync = Promise.denodeify(exports.get_command);

/**
 * Generic REST call for POST commands
 * @function
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} qs - URL query string parameters
 * @param {object} body - JSON payload
 * @param {nodeBack} callback - Node-style callback
 */
exports.post_command = post_command;
function post_command(options, command, qs, body, callback) {
    exports.post(options, `/api/1/vehicles/${options.vehicleID}/${command}`, qs, body, callback)
}

/**
 * Generic Async REST call for POST commands
 * @function post_commandAsync
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} qs - URL query string parameters
 * @param {object} body - JSON payload
 * @returns {Promise} result
 */
exports.post_commandAsync = Promise.denodeify(exports.post_command);

/**
 * GET all vehicle data in a single call
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {array} args.endpoints - endpoints to get
 * @param {boolean} args.let_sleep - null or true 
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_data object
 */
exports.vehicleData = function vehicleData(options, args, callback){
    /*
      null or array of individual endpoints:
      - charge_state
      - climate_state
      - closures_state
      - drive_state
      - gui_settings
      - location_state
      - vehicle_state
      - vehicle_config
    */
    var endpoints = args?.endpoints ?? [ 'climate_state', 'charge_state', 'drive_state', 'gui_settings', 'vehicle_state', 'vehicle_config' ]
    if (Array.isArray(endpoints)) { endpoints = endpoints.join(';'); }
    /*
      null or true
    */
    var let_sleep = args?.let_sleep
    get_command(options, 'vehicle_data', { endpoints, let_sleep }, callback);
}

/**
 * Async version to GET all vehicle data in a single call
 * @function vehicleDataAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {array} args.endpoints - endpoints to get
 * @param {boolean} args.let_sleep - null or true 
 * @returns {Promise} vehicle_data object
 */
exports.vehicleDataAsync = Promise.denodeify(exports.vehicleData);

/**
 * GET the vehicle config
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_config object
 */
exports.vehicleConfig = function vehicleConfig(options, args, callback) {
    get_command(options, "data_request/vehicle_config", null, callback);
}

/**
 * Async version to GET the vehicle config
 * @function vehicleConfigAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} vehicle_config object
 */
exports.vehicleConfigAsync = Promise.denodeify(exports.vehicleConfig);

/**
 * GET the vehicle state
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_state object
 */
exports.vehicleState = function vehicleState(options, args, callback) {
    get_command(options, "data_request/vehicle_state", null, callback);
}

/**
 * Async version to GET the vehicle state
 * @function vehicleStateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} vehicle_state object
 */
exports.vehicleStateAsync = Promise.denodeify(exports.vehicleState);

/**
 * GET the climate state
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} climate_state object
 */
exports.climateState = function climateState(options, args, callback) {
    get_command(options, "data_request/climate_state", null, callback);
}

/**
 * GET the climate state
 * @function climateStateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} climate_state object
 */
exports.climateStateAsync = Promise.denodeify(exports.climateState);

/**
 * GET nearby charging sites
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} climate_state object
 */
exports.nearbyChargers = function nearbyChargers(options, args, callback) {
    get_command(options, "nearby_charging_sites", null, callback);
}

/**
 * @function nearbyChargersAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} climate_state object
 */
exports.nearbyChargersAsync = Promise.denodeify(exports.nearbyChargers);

/**
 * GET the drive state
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} drive_state object
 */
exports.driveState = function driveState(options, args, callback) {
    get_command(options, "data_request/drive_state", null, callback);
}

/**
 * @function driveStateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} drive_state object
 */
exports.driveStateAsync = Promise.denodeify(exports.driveState);

/**
 * GET the charge state
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} charge_state object
 */
exports.chargeState = function chargeState(options, args, callback) {
    get_command(options, "data_request/charge_state", null, callback);
}

/**
 * @function chargeStateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} charge_state object
 */
exports.chargeStateAsync = Promise.denodeify(exports.chargeState);

/**
 * GET the GUI settings
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} gui_settings object
 */
exports.guiSettings = function guiSettings(options, args, callback) {
    get_command(options, "data_request/gui_settings", null, callback);
}

/**
 * @function guiSettingsAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} gui_settings object
 */
exports.guiSettingsAsync = Promise.denodeify(exports.guiSettings);

/**
 * GET the mobile enabled status
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} mobile_enabled object
 */
exports.mobileEnabled = function mobileEnabled(options, args, callback) {
    get_command(options, "mobile_enabled", null, callback);
}

/**
 * @function mobileEnabledAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} mobile_enabled object
 */
exports.mobileEnabledAsync = Promise.denodeify(exports.mobileEnabled);

/**
 * Honk the horn
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.honkHorn = function honk(options, args, callback) {
    post_command(options, "command/honk_horn", null, null, callback);
}

/**
 * @function honkHornAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.honkHornAsync = Promise.denodeify(exports.honkHorn);

/**
 * Flash the lights
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.flashLights = function flashLights(options, args, callback) {
    post_command(options, "command/flash_lights", null, null, callback);
}

/**
 * @function flashLightsAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.flashLightsAsync = Promise.denodeify(exports.flashLights);

/**
 * Start charging the car
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.startCharge = function startCharge(options, args, callback) {
    post_command(options, "command/charge_start", null, null, callback);
}

/**
 * Start charging the car
 * @function startChargeAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.startChargeAsync = Promise.denodeify(exports.startCharge);

/**
 * Stop charging the car
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.stopCharge = function stopCharge(options, args, callback) {
    post_command(options, "command/charge_stop", null, null, callback);
}

/**
 * Stop charging the car
 * @function stopChargeAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.stopChargeAsync = Promise.denodeify(exports.stopCharge);

/**
 * Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.openChargePort = function openChargePort(options, args, callback) {
    post_command(options, "command/charge_port_door_open", null, null, callback);
}

/**
 * Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped 
 * @function openChargePortAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.openChargePortAsync = Promise.denodeify(exports.openChargePort);

/**
 * Close the charge port for appropriately equipped vehicles
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.closeChargePort = function closeChargePort(options, args, callback) {
    post_command(options, "command/charge_port_door_close", null, null, callback);
}

/**
 * Close the charge port for appropriately equipped vehicles
 * @function closeChargePortAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.closeChargePortAsync = Promise.denodeify(exports.closeChargePort);

/**
 * Schedule a firmware update
 * @function scheduleSoftwareUpdate
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.offset - delay in ms before installation begins
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
*/
exports.scheduleSoftwareUpdate = function scheduleSoftwareUpdate(options, args, callback) {
    post_command(options, "command/schedule_software_update", null, { "offset_sec": args?.offset }, callback);
}

/**
 * Schedule a firmware update
 * @function scheduleSoftwareUpdateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.offset - delay in ms before installation begins
 * @returns {Promise} result
*/
exports.scheduleSoftwareUpdateAsync = Promise.denodeify(exports.scheduleSoftwareUpdate);

/** 
 * Cancel a scheduled software update
 * @function cancelSoftwareUpdate
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
*/
exports.cancelSoftwareUpdate = function cancelSoftwareUpdate(options, args, callback) {
    post_command(options, "command/cancel_software_update", null, null, callback);
}

/** 
 * Cancel a scheduled software update
 * @function cancelSoftwareUpdateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
*/
exports.cancelSoftwareUpdateAsync = Promise.denodeify(exports.cancelSoftwareUpdate);

/**
 * Send a navigation request to the car
 * @function navigationRequest
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.subject - short-hand name for the destination
 * @param {string} args.text - address details including things like name, address, map link
 * @param {string} args.locale - the language locale, for example "en-US"
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.navigationRequest = function navigationRequest(options, args, callback) {
    var req =
    {
        "type": "share_ext_content_raw",
        "value": {
            "android.intent.ACTION": "android.intent.action.SEND",
            "android.intent.TYPE": "text/plain",
            "android.intent.extra.SUBJECT": args?.subject,
            "android.intent.extra.TEXT": args?.text
        },
        "locale": args?.locale,
        "timestamp_ms": Date.now()
    };

    post_command(options, "command/navigation_request", null, req, callback);
}

/**
 * Send a navigation request to the car
 * @function navigationRequestAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.subject - short-hand name for the destination
 * @param {string} args.text - address details including things like name, address, map link
 * @param {string} args.locale - the language locale, for example "en-US"
 * @returns {Promise} result
 */
exports.navigationRequestAsync = Promise.denodeify(exports.navigationRequest);

/**
 * Toggle media playback
 * @function mediaTogglePlayback
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaTogglePlayback = function mediaTogglePlayback(options, args, callback) {
    post_command(options, "command/media_toggle_playback", null, null, callback);
}

/**
 * Toggle media playback
 * @function mediaTogglePlaybackAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaTogglePlaybackAsync = Promise.denodeify(exports.mediaTogglePlayback);

/**
 * Media play next track
 * @function mediaPlayNext
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaPlayNext = function mediaPlayNext(options, args, callback) {
    post_command(options, "command/media_next_track", null, null, callback);
}

/**
 * Media play next track
 * @function mediaPlayNextAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaPlayNextAsync = Promise.denodeify(exports.mediaPlayNext);

/**
 * Media play previous track
 * @function mediaPlayPrevious
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaPlayPrevious = function mediaPlayPrevious(options, args, callback) {
    post_command(options, "command/media_prev_track", null, null, callback);
}

/**
 * Media play previous track
 * @function mediaPlayPreviousAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaPlayPreviousAsync = Promise.denodeify(exports.mediaPlayPrevious);

/**
 * Media play next favorite
 * @function mediaPlayNextFavorite
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaPlayNextFavorite = function mediaPlayNextFavorite(options, args, callback) {
    post_command(options, "command/media_next_fav", null, null, callback);
}

/**
 * Media play next favorite
 * @function mediaPlayNextFavoriteAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaPlayNextFavoriteAsync = Promise.denodeify(exports.mediaPlayNextFavorite);

/**
 * Media play previous favorite
 * @function mediaPlayPreviousFavorite
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaPlayPreviousFavorite = function mediaPlayPreviousFavorite(options, args, callback) {
    post_command(options, "command/media_prev_fav", null, null, callback);
}

/**
 * Media play previous favorite
 * @function mediaPlayPreviousFavoriteAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaPlayPreviousFavoriteAsync = Promise.denodeify(exports.mediaPlayPreviousFavorite);

/**
 * Media volume up
 * @function mediaVolumeUp
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaVolumeUp = function mediaVolumeUp(options, args, callback) {
    post_command(options, "command/media_volume_up", null, null, callback);
}

/**
 * Media volume up
 * @function mediaVolumeUpAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaVolumeUpAsync = Promise.denodeify(exports.mediaVolumeUp);

/**
 * Media volume down
 * @function mediaVolumeDown
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.mediaVolumeDown = function mediaVolumeDown(options, args, callback) {
    post_command(options, "command/media_volume_down", null, null, callback);
}

/**
 * Media volume down
 * @function mediaVolumeDownAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.mediaVolumeDownAsync = Promise.denodeify(exports.mediaVolumeDown);

/**
 * Activate speed limitation
 * @function speedLimitActivate
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.speedLimitActivate = function speedLimitActivate(options, args, callback) {
    post_command(options, "command/speed_limit_activate", null, args, callback);
}

/**
 * Activate speed limitation
 * @function speedLimitActivateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitActivateAsync = Promise.denodeify(exports.speedLimitActivate);

/**
 * Deactivate speed limitation
 * @function speedLimitDeactivate
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.speedLimitDeactivate = function speedLimitDeactivate(options, args, callback) {
    post_command(options, "command/speed_limit_deactivate", null, args, callback);
}

/**
 * Deactivate speed limitation
 * @function speedLimitDeactivateAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitDeactivateAsync = Promise.denodeify(exports.speedLimitDeactivate);

/**
 * Clear speed limitation pin
 * @function speedLimitClearPin
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.speedLimitClearPin = function speedLimitClearPin(options, args, callback) {
    post_command(options, "command/speed_limit_clear_pin", null, args, callback);
}

/**
 * Clear speed limitation pin
 * @function speedLimitClearPinAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitClearPinAsync = Promise.denodeify(exports.speedLimitClearPin);

/**
 * Set speed limit
 * @function speedLimitSetLimit
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.limit - Speed limit in mph
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.speedLimitSetLimit = function speedLimitSetLimit(options, args, callback) {
    post_command(options, "command/speed_limit_set_limit", null, { limit_mph: args?.limit }, callback);
}

/**
 * Set speed limit
 * @function speedLimitSetLimitAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.limit - Speed limit in mph
 * @returns {Promise} result
 */
exports.speedLimitSetLimitAsync = Promise.denodeify(exports.speedLimitSetLimit);

/**
 * Enable or disable sentry mode
 * @function setSentryMode
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true to turn on sentry mode, false to turn off
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setSentryMode = function setSentryMode(options, args, callback) {
	post_command(options, "command/set_sentry_mode", null, { on: args?.onoff }, callback);
}

/**
 * Enable or disable sentry mode
 * @function setSentryModeAsync
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true to turn on sentry mode, false to turn off
 * @returns {Promise} result
 */
exports.setSentryModeAsync = Promise.denodeify(exports.setSentryMode);

/**
 * Remote seat heater
 * @function seatHeater
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.heater - Which heater to adjust (0-5)
 * @param {number} args.level - Level for the heater (0-3)
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.seatHeater = function seatHeater(options, args, callback) {
    post_command(options, "command/remote_seat_heater_request", null, args, callback);
}

/**
 * Remote seat heater
 * @function seatHeaterAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.heater - Which heater to adjust (0-5)
 * @param {number} args.level - Level for the heater (0-3)
 * @returns {Promise} result
 */
exports.seatHeaterAsync = Promise.denodeify(exports.seatHeater);

/**
 * Remote steering heater
 * @function steeringHeater
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.level - Level for the heater (0-3)
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.steeringHeater = function steeringHeater(options, args, callback) {
    post_command(options, "command/remote_steering_wheel_heater_request", null, { "on": args?.level }, callback);
}

/**
 * Remote steering heater
 * @function seatHeaterAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.level - Level for the heater (0-3)
 * @returns {Promise} result
 */
exports.steeringHeaterAsync = Promise.denodeify(exports.steeringHeater);

/**
 * Max Defrost
 * @function maxDefrost
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true for on, false for off
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.maxDefrost = function maxDefrost(options, args, callback) {
    post_command(options, "command/set_preconditioning_max", null, { "on": args?.onoff }, callback);
}

/**
 * Remote steering heater
 * @function maxDefrostAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true for on, false for off
 * @returns {Promise} result
 */
exports.maxDefrostAsync = Promise.denodeify(exports.maxDefrost);

/**
 * Window control
 * @function windowControl
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.command - Allowable values are 'vent' and 'close'
 * @param {number} args.lat - User latitude (can be 0 if not 'close' command)
 * @param {number} args.lon - User longitude (can be 0 if not 'close' command)
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.windowControl = function windowControl(options, args, callback) {
    post_command(options, "command/window_control", null, { "command": args?.command, "lat": args?.lat ?? 0, "lon": args?.lon ?? 0 }, callback);
}

/**
 * Window control
 * @function windowControlAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.command - Allowable values are 'vent' and 'close'
 * @param {number} args.lat - User latitude (can be 0 if not 'close' command)
 * @param {number} args.lon - User longitude (can be 0 if not 'close' command)
 * @returns {Promise} result
 */
exports.windowControlAsync = Promise.denodeify(exports.windowControl);

//=====================
// Charge limit constants
//=====================
/**   
 * @global   
 * @default  
 */
exports.CHARGE_STORAGE  = 50;
/**   
 * @global   
 * @default  
 */
exports.CHARGE_DAILY    = 70;
/**   
 * @global   
 * @default  
 */
exports.CHARGE_STANDARD = 90;
/**   
 * @global   
 * @default  
 */
exports.CHARGE_RANGE    = 100;

/**
 * Set the charge limit.
 * Note: charging to 100% frequently is NOT recommended for long-term battery health!
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.amt - charge limit in percent
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setChargeLimit = function setChargeLimit(options, args, callback) {
    var amt = clamp(args?.amt ?? exports.CHARGE_DAILY, exports.CHARGE_STORAGE, exports.CHARGE_RANGE);
    post_command(options, "command/set_charge_limit", null, { percent: amt }, callback);
}

/**
 * Set the charge limit async and return Promise.
 * Note: charging to 100% frequently is NOT recommended for long-term battery health!
 * @function setChargeLimitAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.amt - charge limit in percent
 * @returns {Promise} result
 */
exports.setChargeLimitAsync = Promise.denodeify(exports.setChargeLimit);

/**
 * Set the charge limit to (standard) 90%
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.chargeStandard = function chargeStandard(options, args, callback) {
    post_command(options, "command/charge_standard", null, null, callback);
}

/**
 * @function chargeStandardAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.chargeStandardAsync = Promise.denodeify(exports.chargeStandard);

/**
 * Set charge limit to 100%
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.chargeMaxRange = function chargeMaxRange(options, args, callback) {
    post_command(options, "command/charge_max_range", null, null, callback);
}

/**
 * @function chargeMaxRangeAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.chargeMaxRangeAsync = Promise.denodeify(exports.chargeMaxRange);

/**
 * Set the charging amps.
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.amps - charging amps
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setChargingAmps = function setChargingAmps(options, args, callback) {
    post_command(options, "command/set_charging_amps", null, { charging_amps: args?.amps }, callback);
}

/**
 * Set the charging amps async and return Promise.
 * @function setChargingAmpsAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.amps - charging amps
 * @returns {Promise} result
 */
exports.setChargingAmpsAsync = Promise.denodeify(exports.setChargingAmps);

/**
 * Set the scheduled charging time.
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.enable - true for on, false for off
 * @param {int} args.time - time in minutes since midnight, 15min step
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setScheduledCharging = function setScheduledCharging(options, args, callback) {
    post_command(options, "command/set_scheduled_charging", null, args, callback);
}

/**
 * Set the scheduled charging time async and return Promise.
 * @function setScheduledCharging
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.enable - true for on, false for off
 * @param {int} args.time - time in minutes since midnight, 15min step
 * @returns {Promise} result
 */
exports.setScheduledChargingAsync = Promise.denodeify(exports.setScheduledCharging);

/**
 * Set the scheduled departure.
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.enable - true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future)
 * @param {int} args.departure_time - time in minutes since midnight, 15min step
 * @param {boolean} args.preconditioning_enabled - true for on, false for off
 * @param {boolean} args.preconditioning_weekdays_only - true for on, false for off
 * @param {boolean} args.off_peak_charging_enabled - true for on, false for off
 * @param {boolean} args.off_peak_charging_weekdays_only - true for on, false for off
 * @param {int} args.end_off_peak_time - time in minutes since midnight, 15min step
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setScheduledDeparture = function setScheduledDeparture(options, args, callback) {
    post_command(options, "command/set_scheduled_departure", null, args, callback);
}

/**
 * Set the scheduled departure async and return Promise.
 * @function setScheduledDeparture
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.enable - true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future)
 * @param {int} args.departure_time - time in minutes since midnight, 15min step
 * @param {boolean} args.preconditioning_enabled - true for on, false for off
 * @param {boolean} args.preconditioning_weekdays_only - true for on, false for off
 * @param {boolean} args.off_peak_charging_enabled - true for on, false for off
 * @param {boolean} args.off_peak_charging_weekdays_only - true for on, false for off
 * @param {int} args.end_off_peak_time - time in minutes since midnight, 15min step
 * @returns {Promise} result
 */
exports.setScheduledDepartureAsync = Promise.denodeify(exports.setScheduledDeparture);

/**
 * Lock the car doors
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.doorLock = function doorLock(options, args, callback) {
    post_command(options, "command/door_lock", null, null, callback);
}

/**
 * @function doorLockAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.doorLockAsync = Promise.denodeify(exports.doorLock);

/**
 * Unlock the car doors
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.doorUnlock = function doorUnlock(options, args, callback) {
    post_command(options, "command/door_unlock", null, null, callback);
}

/**
 * @function doorUnlockAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.doorUnlockAsync = Promise.denodeify(exports.doorUnlock);

/**
 * Turn on HVAC system
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.climateStart = function climateStart(options, args, callback) {
    post_command(options, "command/auto_conditioning_start", null, null, callback);
}

/**
 * @function climateStartAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.climateStartAsync = Promise.denodeify(exports.climateStart);

/**
 * Turn off HVAC system
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.climateStop = function climateStop(options, args, callback) {
    post_command(options, "command/auto_conditioning_stop", null, null, callback);
}

/**
 * @function climateStopAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.climateStopAsync = Promise.denodeify(exports.climateStop);

//==================================
// Set the sun roof to specific mode
//==================================
/**   
 * @global   
 * @default  
 */
exports.SUNROOF_VENT = "vent";
/**   
 * @global   
 * @default  
 */
exports.SUNROOF_CLOSED = "close";

/**
 * Set sun roof mode
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.state - one of "vent", "close"
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.sunRoofControl = function sunRoofControl(options, args, callback) {
    post_command(options, "command/sun_roof_control", null, args, callback);
}

/**
 * @function sunRoofControlAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.state - one of "vent", "close"
 * @returns {Promise} result
 */
exports.sunRoofControlAsync = Promise.denodeify(exports.sunRoofControl);

/**
 * Set sun roof position
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.percent - position in percent
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.sunRoofMove = function sunRoofMove(options, args, callback) {
    post_command(options, "command/sun_roof_control", null, { "state": "move", "percent": args?.percent }, callback);
}

/**
 * @function sunRoofMoveAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {int} args.percent - position in percent
 * @returns {Promise} result
 */
exports.sunRoofMoveAsync = Promise.denodeify(exports.sunRoofMove);

//==============================================
// Temperature Limits
//==============================================

/**   
 * @global   
 * @default  
 */
exports.MIN_TEMP = 15;    // 59 Deg.F
/**   
 * @global   
 * @default  
 */
exports.MAX_TEMP = 28;    // 82.4 Deg.F

/**
 * Set the driver/passenger climate temperatures
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.driver - driver temp in Deg.C
 * @param {number} args.pass - passenger temp in Deg.C
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setTemps = function setTemps(options, args, callback) {
    args = args ?? {}
    if (args.pass == null) {
        args.pass = args.driver;
    }

    // ensure valid temp range
    args.driver = clamp(args.driver, exports.MIN_TEMP, exports.MAX_TEMP);
    args.pass = clamp(args.pass, exports.MIN_TEMP, exports.MAX_TEMP);

    post_command(options, "command/set_temps", null, { driver_temp: args.driver, passenger_temp: args.pass }, callback);
}

/**
 * @function setTempsAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.driver - driver temp in Deg.C
 * @param {number} args.pass - passenger temp in Deg.C
 * @returns {Promise} result
 */
exports.setTempsAsync = Promise.denodeify(exports.setTemps);

/**
 * Remote start the car
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.remoteStart = function remoteStartDrive(options, args, callback) {
    post_command(options, "command/remote_start_drive", null, null, callback);
}

/**
 * @function remoteStartAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.remoteStartAsync = Promise.denodeify(exports.remoteStart);

//=====================
// Trunk/Frunk constants
//=====================

/**   
 * @global   
 * @default  
 */
exports.FRUNK = "front";
/**   
 * @global   
 * @default  
 */
exports.TRUNK = "rear";

/**
 * Open the trunk/frunk
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.which - FRUNK or TRUNK constant
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.openTrunk = function openTrunk(options, args, callback) {
    post_command(options, "command/actuate_trunk", null, { which_trunk: args?.which }, callback);
}

/**
 * @function openTrunkAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {string} args.which - FRUNK or TRUNK constant
 * @returns {Promise} result
 */
exports.openTrunkAsync = Promise.denodeify(exports.openTrunk);

/**
 * Wake up a car that is sleeping
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.wakeUp = function wakeUp(options, args, callback) {
    post_command(options, "wake_up", null, null, callback);
}

/**
 * @function wakeUpAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.wakeUpAsync = Promise.denodeify(exports.wakeUp);

/**
 * Turn valet mode on/off
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true for on, false for off
 * @param {int} args.pin - pin code
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setValetMode = function setValetMode(options, args, callback) {
    post_command(options, "command/set_valet_mode", null, { on: args?.onoff, password: args?.pin }, callback);
}

/**
 * @function setValetModeAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {boolean} args.onoff - true for on, false for off
 * @param {int} args.pin - pin code
 * @returns {Promise} result
 */
exports.setValetModeAsync = Promise.denodeify(exports.setValetMode);

/**
 * Reset the valet pin
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.resetValetPin = function resetValetPin(options, args, callback) {
    post_command(options, "command/reset_valet_pin", null, null, callback);
}

/**
 * @function resetValetPinAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @returns {Promise} result
 */
exports.resetValetPinAsync = Promise.denodeify(exports.resetValetPin);

/**
 * Set a calendar entry
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {object} args.entry - calendar entry object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.calendar = function calendar(options, args, callback) {
    post_command(options, "command/upcoming_calendar_entries", null, args?.entry, callback);
}

/**
 * @function calendarAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {object} args.entry - calendar entry object
 * @returns {Promise} result
 */
exports.calendarAsync = Promise.denodeify(exports.calendar);

/**
 * Create a calendar entry
 * @param {string} eventName - name of the event
 * @param {string} location - location of the event
 * @param {number} startTime - Javascript timestamp for start of event
 * @param {number} endTime - Javascript timestamp for end of event
 * @param {string} accountName - name of the calendar account
 * @param {string} phoneName - phone bluetooth name
 * @returns {object} result
 */
exports.makeCalendarEntry = function makeCalendarEntry(eventName, location, startTime, endTime, accountName, phoneName) {
    var entry = {
        "calendar_data": {
            "access_disabled": false,
            "calendars": [
                {
                    "color": "ff9a9cff",
                    "events": [
                        {
                            "allday": false,
                            "color": "ff9a9cff",
                            "end": endTime ?? Date.now(),
                            "start": startTime ?? Date.now(),
                            "cancelled": false,
                            "tentative": false,
                            "location": location ?? "",
                            "name": eventName ?? "Event name",
                            "organizer": ""
                        }
                    ],
                    "name": accountName ?? ""    // calendar account name?
                }
            ],
            "phone_name": phoneName,    // Bluetooth name of phone
            "uuid": "333239059961778"   // any random value OK?
        }
    };

    return entry;
}

/**
 * Trigger homelink
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.lat - vehicle GPS latitude
 * @param {number} args.long - vehicle GPS longitude
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.homelink = function homelink(options, args, callback) {
    post_command(options, "command/trigger_homelink", null, { lat: args?.lat, lon: args?.long } , callback);
}

/**
 * @function homelinkAsync
 * @param {optionsType} options - options object
 * @param {object} args - command arguments
 * @param {number} args.lat - vehicle GPS latitude
 * @param {number} args.long - vehicle GPS longitude
 * @returns {Promise} result
 */
exports.homelinkAsync = Promise.denodeify(exports.homelink);

/**
 * Return list of products
 * @function products
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {products[]} array of products JSON data
 */
exports.products = function products(options, callback) {
    exports.get("/api/1/products", null, callback);
}

/**
 * Return list of products
 * @function productsAsync
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Promise} array of products JSON data
 */
exports.productsAsync = Promise.denodeify(exports.products);

/**
 * Return live status from solar installation
 * @function solarStatus
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {solarStatus} solarStatus JSON data
 */
exports.solarStatus = function solarStatus(options, callback) {
    exports.get(`/api/1/energy_sites/${options.siteId}/live_status`, null, callback);
}

/**
 * Return solar status information
 * @function solarStatusAsync
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Promise} solar JSON data
 */
exports.solarStatusAsync = Promise.denodeify(exports.solarStatus);


/*
//
// [Alpha impl] Not yet supported
//
exports.frontDefrostOn = function frontDefrostOn(options, args, callback) {
    post_command(options, "command/front_defrost_on", null, null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.frontDefrostOff = function frontDefrostOff(options, args, callback) {
    post_command(options, "command/front_defrost_off", null, null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.rearDefrostOn = function rearDefrostOn(options, args, callback) {
    post_command(options, "command/rear_defrost_on", null, null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.rearDefrostOff = function rearDefrostOff(options, args, callback) {
    post_command(options, "command/rear_defrost_off", null, null, callback);
}
*/

//
// [Alpha impl] Auto Park
//
/*
exports.autoParkForward = function autoParkForward(options, args, callback) {
    autoPark(options, args, "start_forward", callback);
}

exports.autoParkBackward = function autoParkBackward(options, args, callback) {
    autoPark(options, args, "start_reverse", callback);
}

exports.autoPark = function autoPark(options, args, action, callback) {
    post_command(options, "command/autopark_request", null, { lat: args?.lat, long: args?.long, action: action}, callback);
}
*/

//=================================
// Available streaming data options
//=================================
/**   
 * @global   
 * @default  
 */
exports.streamingColumns = ['elevation', 'est_heading', 'est_lat', 'est_lng', 'est_range', 'heading', 'odometer', 'power', 'range', 'shift_state', 'speed', 'soc'];

/**
 * Start streaming car data
 * @param {object} options - {username, token, vehicle_id, columns[]}
 * @param {nodeBack} callback - Node-style callback
 * @param {nodeBack} onDataCb - Node-style callback
 * @returns {object} result
 */
exports.startStreaming = function startStreaming(options, callback, onDataCb) {
    log(API_CALL_LEVEL, "TeslaJS.startStreaming()");

    callback = callback ?? function (error, response, body) { /* do nothing! */ }
    onDataCb = onDataCb ?? function (data) { /* do nothing! */ }

    options.values = options.values ?? exports.streamingColumns;

    var ws = new websocket(streamingBaseURI, {
        perMessageDeflate: false
    });

    ws.on('message', function incoming(data) {
        var d = JSON.parse(data);
        if (d.msg_type == 'control:hello') {
            ws.send(JSON.stringify({
                msg_type: 'data:subscribe_oauth',
                token: options.authToken,
                value: options.values.join(','),
                tag: options.vehicle_id.toString()
            }));
        } else if (d.msg_type == 'data:error') {
            callback('Error: ' + d.value);
        } else {
            callback(null, null, d);
        }
    });

    ws.on('close', function close() {
        callback('Websocket disconnected');
    });

    ws.on('error', function error() {
        callback('Websocket error');
    });
}

var promises = {};
for (var name in exports) {
    if (name.endsWith('Async')) {
        continue;
    }
    var nameAsync = name + 'Async';
    if (nameAsync in exports) {
        promises[name] = exports[nameAsync];
    } else {
        promises[name] = exports[name];
    }
}
exports.promises = promises;
