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

var streamingBaseURI = process.env.TESLAJS_STREAMING || streamingPortal;

//===========================
// New OAuth-based API portal
//===========================
/**   
 * @global   
 * @default  
 */
var portal = "https://owner-api.teslamotors.com";
exports.portal = portal;

var portalBaseURI = process.env.TESLAJS_SERVER || portal;

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

var logLevel = process.env.TESLAJS_LOG || 0;

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

    return colors[paintColor] || "black";
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
    
    credentials = credentials || {};
    callback = callback || function (err, result) { /* do nothing! */ }

    if (!credentials.username || !credentials.password) {
        callback("login() requires username and password", null);
        return;
    }

    require('./src/auth').login({identity: credentials.username, credential: credentials.password, mfaPassCode: credentials.mfaPassCode, mfaDeviceName: credentials.mfaDeviceName}, function (error, response, body) {
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));
        log(API_RESPONSE_LEVEL, "\nBody: " + JSON.stringify(body));

        var loginResult = body || {};

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
    
    callback = callback || function (err, result) { /* do nothing! */ }

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

    callback = callback || function (err, result) { /* do nothing! */ }

    request({
        method: 'POST',
        url: portalBaseURI + '/oauth/revoke',
        headers: { Authorization: "Bearer " + authToken, 'Content-Type': 'application/json; charset=utf-8' }
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
 * Return vehicle information on the requested vehicle
 * @function vehicle
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicle} vehicle JSON data
 */
exports.vehicle = function vehicle(options, callback) {
    log(API_CALL_LEVEL, "TeslaJS.vehicle()");

    callback = callback || function (err, vehicle) { /* do nothing! */ }

    var req = {
        method: 'GET',
        url: portalBaseURI + '/api/1/vehicles',
        headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8' }
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
            body = body.response[options.carIndex || 0];
            body.id = body.id_s;
            options.vehicleID = body.id;
            
            callback(null, body);
        } catch (e) {
            log(API_ERR_LEVEL, 'Error parsing vehicles response');
            callback(e, null);
        }

        log(API_RETURN_LEVEL, "\nGET request: " + "/vehicles" + " completed.");
    });
}

/**
 * Return vehicle information on the requested vehicle
 * @function vehicleAsync
 * @param {optionsType} options - options object
 * @returns {Promise} vehicle JSON data
 */
exports.vehicleAsync = Promise.denodeify(exports.vehicle);

/**
 * Return vehicle information on the requested vehicle. Uses options.vehicleID
 * to determine which vehicle to fetch data for.
 * @function vehicleById
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicle} vehicle JSON data
 */
 exports.vehicleById = function vehicle(options, callback) {
  log(API_CALL_LEVEL, "TeslaJS.vehicleById()");

  callback = callback || function (err, vehicle) { /* do nothing! */ }

  var req = {
      method: 'GET',
      url: portalBaseURI + '/api/1/vehicles/' + options.vehicleID,
      headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8' }
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
        log(API_ERR_LEVEL, 'Error parsing vehicle response');
        callback(e, null);
    }

      log(API_RETURN_LEVEL, "\nGET request: " + "/vehicles/" + options.vehicleID + " completed.");
  });
}

/**
* Return vehicle information on the requested vehicle. Uses options.vehicleID
* to determine which vehicle to fetch data for.
* @function vehicleByIdAsync
* @param {optionsType} options - options object
* @returns {Promise} vehicle JSON data
*/
exports.vehicleByIdAsync = Promise.denodeify(exports.vehicleById);

/**
 * Return vehicle information on ALL vehicles
 * @function vehicles
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Vehicles[]} array of vehicle JSON data
 */
exports.vehicles = function vehicles(options, callback) {
    log(API_CALL_LEVEL, "TeslaJS.vehicles()");

    callback = callback || function (err, vehicle) { /* do nothing! */ }

    var req = {
        method: 'GET',
        url: portalBaseURI + '/api/1/vehicles',
        headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8' }
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
            log(API_ERR_LEVEL, 'Error parsing vehicles response');
            callback(e, null);
        }

        log(API_RETURN_LEVEL, "\nGET request: " + "/vehicles" + " completed.");
    });
}

/**
 * Return vehicle information on ALL vehicles
 * @function vehiclesAsync
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {Promise} array of vehicle JSON data
 */
exports.vehiclesAsync = Promise.denodeify(exports.vehicles);

/**
 * Generic REST call for GET commands
 * @function get_command
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {nodeBack} callback - Node-style callback
 */
exports.get_command = get_command;
function get_command(options, command, callback) {
    log(API_CALL_LEVEL, "GET call: " + command + " start.");

    callback = callback || function (err, data) { /* do nothing! */ }

    var req = {
        method: "GET",
        url: portalBaseURI + "/api/1/vehicles/" + options.vehicleID + "/" + command,
        headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8'}
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function (error, response, body) {
        if (error) {
            log(API_ERR_LEVEL, error);
            return callback(error, null);
        }

        if (response.statusCode != 200) {
            var str = "Error response: " + response.statusCode;
            log(API_ERR_LEVEL, str);
            return callback(str, null);
        }

        log(API_BODY_LEVEL, "\nBody: " + JSON.stringify(body));
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));

        try {
            body = body.response;

            callback(null, body);
        } catch (e) {
            log(API_ERR_LEVEL, 'Error parsing GET call response');
            log(API_ERR_LEVEL, e);
            callback(e, null);
        }

        log(API_RETURN_LEVEL, "\nGET request: " + command + " completed.");
    });
}

/**
 * Generic Async REST call for GET commands
 * @function get_commandAsync
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @returns {Promise} result
 */
exports.get_commandAsync = Promise.denodeify(exports.get_command);

/**
 * Generic REST call for POST commands
 * @function
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} body - JSON payload
 * @param {nodeBack} callback - Node-style callback
 */
exports.post_command = post_command;
function post_command(options, command, body, callback) {
    log(API_CALL_LEVEL, "POST call: " + command + " start.");

    callback = callback || function (err, data) { /* do nothing! */ }

    var cmd = {
        method: "POST",
        url: portalBaseURI + "/api/1/vehicles/" + options.vehicleID + "/" + command,
        headers: { Authorization: "Bearer " + options.authToken, 'content-type': 'application/json; charset=UTF-8' },
        body: body || null
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(cmd));

    request(cmd, function (error, response, body) {
        if (error) {
            log(API_ERR_LEVEL, error);
            return callback(error, null);
        }

        if (response.statusCode != 200) {
            var str = "Error response: " + response.statusCode;
            log(API_ERR_LEVEL, str);
            return callback(str, null);
        }

        log(API_BODY_LEVEL, "\nBody: " + JSON.stringify(body));
        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(response));

        try {
            body = body.response;

            callback(null, body);
        } catch (e) {
            log(API_ERR_LEVEL, 'Error parsing POST call response');
            callback(e, null);
        }

        log(API_RETURN_LEVEL, "\nPOST command: " + command + " completed.");
    });
}

/**
 * Generic Async REST call for POST commands
 * @function post_commandAsync
 * @param {optionsType} options - options object
 * @param {string} command - REST command
 * @param {object} body - JSON payload
 * @returns {Promise} result
 */
exports.post_commandAsync = Promise.denodeify(exports.post_command);

/**
 * GET all vehicle data in a single call
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_data object
 */
exports.vehicleData = function vehicleData(options, callback){
    get_command(options, "vehicle_data", callback);
}

/**
 * Async version to GET all vehicle data in a single call
 * @function vehicleDataAsync
 * @param {optionsType} options - options object
 * @returns {Promise} vehicle_data object
 */
exports.vehicleDataAsync = Promise.denodeify(exports.vehicleData);

/**
 * GET the vehicle config
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_config object
 */
exports.vehicleConfig = function vehicleConfig(options, callback) {
    get_command(options, "data_request/vehicle_config", callback);
}

/**
 * Async version to GET the vehicle config
 * @function vehicleConfigAsync
 * @param {optionsType} options - options object
 * @returns {Promise} vehicle_config object
 */
exports.vehicleConfigAsync = Promise.denodeify(exports.vehicleConfig);

/**
 * GET the vehicle state
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} vehicle_state object
 */
exports.vehicleState = function vehicleState(options, callback) {
    get_command(options, "data_request/vehicle_state", callback);
}

/**
 * Async version to GET the vehicle state
 * @function vehicleStateAsync
 * @param {optionsType} options - options object
 * @returns {Promise} vehicle_state object
 */
exports.vehicleStateAsync = Promise.denodeify(exports.vehicleState);

/**
 * GET the climate state
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} climate_state object
 */
exports.climateState = function climateState(options, callback) {
    get_command(options, "data_request/climate_state", callback);
}

/**
 * GET the climate state
 * @function climateStateAsync
 * @param {optionsType} options - options object
 * @returns {Promise} climate_state object
 */
exports.climateStateAsync = Promise.denodeify(exports.climateState);

/**
 * GET nearby charging sites
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} climate_state object
 */
exports.nearbyChargers = function nearbyChargers(options, callback) {
    get_command(options, "nearby_charging_sites", callback);
}

/**
 * @function nearbyChargersAsync
 * @param {optionsType} options - options object
 * @returns {Promise} climate_state object
 */
exports.nearbyChargersAsync = Promise.denodeify(exports.nearbyChargers);

/**
 * GET the drive state
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} drive_state object
 */
exports.driveState = function driveState(options, callback) {
    get_command(options, "data_request/drive_state", callback);
}

/**
 * @function driveStateAsync
 * @param {optionsType} options - options object
 * @returns {Promise} drive_state object
 */
exports.driveStateAsync = Promise.denodeify(exports.driveState);

/**
 * GET the charge state
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} charge_state object
 */
exports.chargeState = function chargeState(options, callback) {
    get_command(options, "data_request/charge_state", callback);
}

/**
 * @function chargeStateAsync
 * @param {optionsType} options - options object
 * @returns {Promise} charge_state object
 */
exports.chargeStateAsync = Promise.denodeify(exports.chargeState);

/**
 * GET the GUI settings
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} gui_settings object
 */
exports.guiSettings = function guiSettings(options, callback) {
    get_command(options, "data_request/gui_settings", callback);
}

/**
 * @function guiSettingsAsync
 * @param {optionsType} options - options object
 * @returns {Promise} gui_settings object
 */
exports.guiSettingsAsync = Promise.denodeify(exports.guiSettings);

/**
 * GET the mobile enabled status
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} mobile_enabled object
 */
exports.mobileEnabled = function mobileEnabled(options, callback) {
    get_command(options, "mobile_enabled", callback);
}

/**
 * @function mobileEnabledAsync
 * @param {optionsType} options - options object
 * @returns {Promise} mobile_enabled object
 */
exports.mobileEnabledAsync = Promise.denodeify(exports.mobileEnabled);

/**
 * Honk the horn
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.honkHorn = function honk(options, callback) {
    post_command(options, "command/honk_horn", null, callback);
}

/**
 * @function honkHornAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.honkHornAsync = Promise.denodeify(exports.honkHorn);

/**
 * Flash the lights
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.flashLights = function flashLights(options, callback) {
    post_command(options, "command/flash_lights", null, callback);
}

/**
 * @function flashLightsAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.flashLightsAsync = Promise.denodeify(exports.flashLights);

/**
 * Start charging the car
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.startCharge = function startCharge(options, callback) {
    post_command(options, "command/charge_start", null, callback);
}

/**
 * Start charging the car
 * @function startChargeAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.startChargeAsync = Promise.denodeify(exports.startCharge);

/**
 * Stop charging the car
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.stopCharge = function stopCharge(options, callback) {
    post_command(options, "command/charge_stop", null, callback);
}

/**
 * Stop charging the car
 * @function stopChargeAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.stopChargeAsync = Promise.denodeify(exports.stopCharge);

/**
 * Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.openChargePort = function openChargePort(options, callback) {
    post_command(options, "command/charge_port_door_open", null, callback);
}

/**
 * Open the charge port, or releases the latch if the charge port is open, a cable is plugged in, and charging is stopped 
 * @function openChargePortAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.openChargePortAsync = Promise.denodeify(exports.openChargePort);

/**
 * Close the charge port for appropriately equipped vehicles
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.closeChargePort = function closeChargePort(options, callback) {
    post_command(options, "command/charge_port_door_close", null, callback);
}

/**
 * Close the charge port for appropriately equipped vehicles
 * @function closeChargePortAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.closeChargePortAsync = Promise.denodeify(exports.closeChargePort);

/**
 * Schedule a firmware update
 * @function scheduleSoftwareUpdate
 * @param {optionsType} options - options object
 * @param {number} offset - delay in ms before installation begins
 * @returns {object} result
*/
exports.scheduleSoftwareUpdate = function scheduleSoftwareUpdate(options, offset, callback) {
    post_command(options, "command/schedule_software_update", { "offset_sec": offset }, callback);
}

/**
 * Schedule a firmware update
 * @function scheduleSoftwareUpdateAsync
 * @param {optionsType} options - options object
 * @param {number} offset - delay in ms before installation begins
 * @returns {Promise} result
*/
exports.scheduleSoftwareUpdateAsync = Promise.denodeify(exports.scheduleSoftwareUpdate);

/** 
 * Cancel a scheduled software update
 * @function cancelSoftwareUpdate
 * @param {optionsType} options - options object
 * @returns {object} result
*/
exports.cancelSoftwareUpdate = function cancelSoftwareUpdate(options, callback) {
    post_command(options, "command/cancel_software_update", null, callback);
}

/** 
 * Cancel a scheduled software update
 * @function cancelSoftwareUpdateAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
*/
exports.cancelSoftwareUpdateAsync = Promise.denodeify(exports.cancelSoftwareUpdate);

/**
 * Send a navigation request to the car
 * @function navigationRequest
 * @param {optionsType} options - options object
 * @param {string} subject - short-hand name for the destination
 * @param {string} text - address details including things like name, address, map link
 * @param {string} locale - the language locale, for example "en-US"
 * @returns {object} result
 */
exports.navigationRequest = function navigationRequest(options, subject, text, locale, callback) {
    var req =
    {
        "type": "share_ext_content_raw",
        "value": {
            "android.intent.ACTION": "android.intent.action.SEND",
            "android.intent.TYPE": "text\/plain",
            "android.intent.extra.SUBJECT": subject,
            "android.intent.extra.TEXT": text
        },
        "locale": locale,
        "timestamp_ms": Date.now()
    };

    post_command(options, "command/navigation_request", req, callback);
}

/**
 * Send a navigation request to the car
 * @function navigationRequestAsync
 * @param {optionsType} options - options object
 * @param {string} subject - short-hand name for the destination
 * @param {string} text - address details including things like name, address, map link
 * @param {string} locale - the language locale, for example "en-US"
 * @returns {Promise} result
 */
exports.navigationRequestAsync = Promise.denodeify(exports.navigationRequest);

/**
 * Toggle media playback
 * @function mediaTogglePlayback
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaTogglePlayback = function mediaTogglePlayback(options, callback) {
    post_command(options, "command/media_toggle_playback", null, callback);
}

/**
 * Toggle media playback
 * @function mediaTogglePlaybackAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaTogglePlaybackAsync = Promise.denodeify(exports.mediaTogglePlayback);

/**
 * Media play next track
 * @function mediaPlayNext
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaPlayNext = function mediaPlayNext(options, callback) {
    post_command(options, "command/media_next_track", null, callback);
}

/**
 * Media play next track
 * @function mediaPlayNextAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaPlayNextAsync = Promise.denodeify(exports.mediaPlayNext);

/**
 * Media play previous track
 * @function mediaPlayPrevious
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaPlayPrevious = function mediaPlayPrevious(options, callback) {
    post_command(options, "command/media_prev_track", null, callback);
}

/**
 * Media play previous track
 * @function mediaPlayPreviousAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaPlayPreviousAsync = Promise.denodeify(exports.mediaPlayPrevious);

/**
 * Media play next favorite
 * @function mediaPlayNextFavorite
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaPlayNextFavorite = function mediaPlayNextFavorite(options, callback) {
    post_command(options, "command/media_next_fav", null, callback);
}

/**
 * Media play next favorite
 * @function mediaPlayNextFavoriteAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaPlayNextFavoriteAsync = Promise.denodeify(exports.mediaPlayNextFavorite);

/**
 * Media play previous favorite
 * @function mediaPlayPreviousFavorite
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaPlayPreviousFavorite = function mediaPlayPreviousFavorite(options, callback) {
    post_command(options, "command/media_prev_fav", null, callback);
}

/**
 * Media play previous favorite
 * @function mediaPlayPreviousFavoriteAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaPlayPreviousFavoriteAsync = Promise.denodeify(exports.mediaPlayPreviousFavorite);

/**
 * Media volume up
 * @function mediaVolumeUp
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaVolumeUp = function mediaVolumeUp(options, callback) {
    post_command(options, "command/media_volume_up", null, callback);
}

/**
 * Media volume up
 * @function mediaVolumeUpAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaVolumeUpAsync = Promise.denodeify(exports.mediaVolumeUp);

/**
 * Media volume down
 * @function mediaVolumeDown
 * @param {optionsType} options - options object
 * @returns {object} result
 */
exports.mediaVolumeDown = function mediaVolumeDown(options, callback) {
    post_command(options, "command/media_volume_down", null, callback);
}

/**
 * Media volume down
 * @function mediaVolumeDownAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.mediaVolumeDownAsync = Promise.denodeify(exports.mediaVolumeDown);

/**
 * Activate speed limitation
 * @function speedLimitActivate
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {object} result
 */
exports.speedLimitActivate = function speedLimitActivate(options, pin, callback) {
    post_command(options, "command/speed_limit_activate", { pin: pin }, callback);
}

/**
 * Activate speed limitation
 * @function speedLimitActivateAsync
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitActivateAsync = Promise.denodeify(exports.speedLimitActivate);

/**
 * Deactivate speed limitation
 * @function speedLimitDeactivate
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {object} result
 */
exports.speedLimitDeactivate = function speedLimitDeactivate(options, pin, callback) {
    post_command(options, "command/speed_limit_deactivate", { pin: pin }, callback);
}

/**
 * Deactivate speed limitation
 * @function speedLimitDeactivateAsync
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitDeactivateAsync = Promise.denodeify(exports.speedLimitDeactivate);

/**
 * Clear speed limitation pin
 * @function speedLimitClearPin
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {object} result
 */
exports.speedLimitClearPin = function speedLimitClearPin(options, pin, callback) {
    post_command(options, "command/speed_limit_clear_pin", { pin: pin }, callback);
}

/**
 * Clear speed limitation pin
 * @function speedLimitClearPinAsync
 * @param {optionsType} options - options object
 * @param {number} pin - Activation pin code. Not the same as valet pin
 * @returns {Promise} result
 */
exports.speedLimitClearPinAsync = Promise.denodeify(exports.speedLimitClearPin);

/**
 * Set speed limit
 * @function speedLimitSetLimit
 * @param {optionsType} options - options object
 * @param {number} limit - Speed limit in mph
 * @returns {object} result
 */
exports.speedLimitSetLimit = function speedLimitSetLimit(options, limit, callback) {
    post_command(options, "command/speed_limit_set_limit", { limit_mph: limit }, callback);
}

/**
 * Set speed limit
 * @function speedLimitSetLimitAsync
 * @param {optionsType} options - options object
 * @param {number} limit - Speed limit in mph
 * @returns {Promise} result
 */
exports.speedLimitSetLimitAsync = Promise.denodeify(exports.speedLimitSetLimit);

/**
 * Enable or disable sentry mode
 * @function setSentryMode
 * @param {optionsType} options - options object
 * @param {boolean} onoff - true to turn on sentry mode, false to turn off
 * @returns {object} result
 */
exports.setSentryMode = function setSentryMode(options, onoff, callback) {
	post_command(options, "command/set_sentry_mode", { on: onoff }, callback);
}

/**
 * Enable or disable sentry mode
 * @function setSentryModeAsync
 * @param {boolean} onoff - true to turn on sentry mode, false to turn off
 * @returns {Promise} result
 */
exports.setSentryModeAsync = Promise.denodeify(exports.setSentryMode);

/**
 * Remote seat heater
 * @function seatHeater
 * @param {optionsType} options - options object
 * @param {number} heater - Which heater to adjust (0-5)
 * @param {number} level - Level for the heater (0-3)
 * @returns {object} result
 */
exports.seatHeater = function seatHeater(options, heater, level, callback) {
    post_command(options, "command/remote_seat_heater_request", { "heater": heater, "level": level }, callback);
}

/**
 * Remote seat heater
 * @function seatHeaterAsync
 * @param {optionsType} options - options object
 * @param {number} heater - Which heater to adjust (0-5)
 * @param {number} level - Level for the heater (0-3)
 * @returns {Promise} result
 */
exports.seatHeaterAsync = Promise.denodeify(exports.seatHeater);

/**
 * Remote steering heater
 * @function steeringHeater
 * @param {optionsType} options - options object
 * @param {number} level - Level for the heater (0-3)
 * @returns {object} result
 */
exports.steeringHeater = function steeringHeater(options, level, callback) {
    post_command(options, "command/remote_steering_wheel_heater_request", { "on": level }, callback);
}

/**
 * Remote steering heater
 * @function seatHeaterAsync
 * @param {optionsType} options - options object
 * @param {number} level - Level for the heater (0-3)
 * @returns {Promise} result
 */
exports.steeringHeaterAsync = Promise.denodeify(exports.steeringHeater);

/**
 * Max Defrost
 * @function maxDefrost
 * @param {optionsType} options - options object
 * @param {boolean} onoff - true for on, false for off
 * @returns {object} result
 */
exports.maxDefrost = function maxDefrost(options, onoff, callback) {
    post_command(options, "command/set_preconditioning_max", { "on": onoff }, callback);
}

/**
 * Remote steering heater
 * @function maxDefrostAsync
 * @param {optionsType} options - options object
 * @param {boolean} onoff - true for on, false for off
 * @returns {Promise} result
 */
exports.maxDefrostAsync = Promise.denodeify(exports.maxDefrost);

/**
 * Window control
 * @function windowControl
 * @param {optionsType} options - options object
 * @param {string} command - Allowable values are 'vent' and 'close'
 * @param {number} lat - User latitude (can be 0 if not 'close' command)
 * @param {number} lon - User longitude (can be 0 if not 'close' command)
 * @returns {object} result
 */
exports.windowControl = function windowControl(options, command, lat, lon, callback) {
    post_command(options, "command/window_control", { "command": command, "lat":lat || 0, "lon":lon || 0 }, callback);
}

/**
 * Window control
 * @function windowControlAsync
 * @param {optionsType} options - options object
 * @param {string} command - Allowable values are 'vent' and 'close'
 * @param {number} lat - User latitude (can be 0 if not 'close' command)
 * @param {number} lon - User longitude (can be 0 if not 'close' command)
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
 * @param {int} amt - charge limit in percent
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setChargeLimit = function setChargeLimit(options, amt, callback) {
    amt = clamp(amt, exports.CHARGE_STORAGE, exports.CHARGE_RANGE);
    post_command(options, "command/set_charge_limit", { percent: amt }, callback);
}

/**
 * Set the charge limit async and return Promise.
 * Note: charging to 100% frequently is NOT recommended for long-term battery health!
 * @function setChargeLimitAsync
 * @param {optionsType} options - options object
 * @param {int} amt - charge limit in percent
 * @returns {Promise} result
 */
exports.setChargeLimitAsync = Promise.denodeify(exports.setChargeLimit);

/**
 * Set the charge limit to (standard) 90%
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.chargeStandard = function chargeStandard(options, callback) {
    post_command(options, "command/charge_standard", null, callback);
}

/**
 * @function chargeStandardAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.chargeStandardAsync = Promise.denodeify(exports.chargeStandard);

/**
 * Set charge limit to 100%
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.chargeMaxRange = function chargeMaxRange(options, callback) {
    post_command(options, "command/charge_max_range", null, callback);
}

/**
 * @function chargeMaxRangeAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.chargeMaxRangeAsync = Promise.denodeify(exports.chargeMaxRange);

/**
 * Set the charging amps.
 * @param {optionsType} options - options object
 * @param {int} amps - charging amps
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setChargingAmps = function setChargingAmps(options, amps, callback) {
    post_command(options, "command/set_charging_amps", { charging_amps: amps }, callback);
}

/**
 * Set the charging amps async and return Promise.
 * @function setChargingAmpsAsync
 * @param {optionsType} options - options object
 * @param {int} amps - charging amps
 * @returns {Promise} result
 */
exports.setChargingAmpsAsync = Promise.denodeify(exports.setChargingAmps);

/**
 * Set the scheduled charging time.
 * @param {optionsType} options - options object
 * @param {boolean} enable - true for on, false for off
 * @param {int} time - time in minutes since midnight, 15min step
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setScheduledCharging = function setScheduledCharging(options, enable, time, callback) {
    post_command(options, "command/set_scheduled_charging", { enable: enable, time: time }, callback);
}

/**
 * Set the scheduled charging time async and return Promise.
 * @function setScheduledCharging
 * @param {optionsType} options - options object
 * @param {boolean} enable - true for on, false for off
 * @param {int} time - time in minutes since midnight, 15min step
 * @returns {Promise} result
 */
exports.setScheduledChargingAsync = Promise.denodeify(exports.setScheduledCharging);

/**
 * Set the scheduled departure.
 * @param {optionsType} options - options object
 * @param {boolean} enable - true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future)
 * @param {int} departure_time - time in minutes since midnight, 15min step
 * @param {boolean} preconditioning_enabled - true for on, false for off
 * @param {boolean} preconditioning_weekdays_only - true for on, false for off
 * @param {boolean} off_peak_charging_enabled - true for on, false for off
 * @param {boolean} off_peak_charging_weekdays_only - true for on, false for off
 * @param {int} end_off_peak_time - time in minutes since midnight, 15min step
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setScheduledDeparture = function setScheduledDeparture(options, enable, departure_time, preconditioning_enabled, preconditioning_weekdays_only, off_peak_charging_enabled, off_peak_charging_weekdays_only, end_off_peak_time, callback) {
    post_command(options, "command/set_scheduled_departure", {
	    "enable":enable,
	    "departure_time":departure_time,
	    "preconditioning_enabled":preconditioning_enabled,
	    "preconditioning_weekdays_only":preconditioning_weekdays_only,
	    "off_peak_charging_enabled":off_peak_charging_enabled,
	    "off_peak_charging_weekdays_only":off_peak_charging_weekdays_only,
	    "end_off_peak_time":end_off_peak_time }, callback);
}

/**
 * Set the scheduled departure async and return Promise.
 * @function setScheduledDeparture
 * @param {optionsType} options - options object
 * @param {boolean} enable - true if (preconditioning_enabled || off_peak_charging_enabled), false otherwise (this condition may change in the future)
 * @param {int} departure_time - time in minutes since midnight, 15min step
 * @param {boolean} preconditioning_enabled - true for on, false for off
 * @param {boolean} preconditioning_weekdays_only - true for on, false for off
 * @param {boolean} off_peak_charging_enabled - true for on, false for off
 * @param {boolean} off_peak_charging_weekdays_only - true for on, false for off
 * @param {int} end_off_peak_time - time in minutes since midnight, 15min step
 * @returns {Promise} result
 */
exports.setScheduledDepartureAsync = Promise.denodeify(exports.setScheduledDeparture);

/**
 * Lock the car doors
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.doorLock = function doorLock(options, callback) {
    post_command(options, "command/door_lock", null, callback);
}

/**
 * @function doorLockAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.doorLockAsync = Promise.denodeify(exports.doorLock);

/**
 * Unlock the car doors
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.doorUnlock = function doorUnlock(options, callback) {
    post_command(options, "command/door_unlock", null, callback);
}

/**
 * @function doorUnlockAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.doorUnlockAsync = Promise.denodeify(exports.doorUnlock);

/**
 * Turn on HVAC system
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.climateStart = function climateStart(options, callback) {
    post_command(options, "command/auto_conditioning_start", null, callback);
}

/**
 * @function climateStartAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.climateStartAsync = Promise.denodeify(exports.climateStart);

/**
 * Turn off HVAC system
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.climateStop = function climateStop(options, callback) {
    post_command(options, "command/auto_conditioning_stop", null, callback);
}

/**
 * @function climateStopAsync
 * @param {optionsType} options - options object
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
 * @param {string} state - one of "vent", "close"
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.sunRoofControl = function sunRoofControl(options, state, callback) {
    post_command(options, "command/sun_roof_control", { "state": state }, callback);
}

/**
 * @function sunRoofControlAsync
 * @param {optionsType} options - options object
 * @param {string} state - one of "vent", "close"
 * @returns {Promise} result
 */
exports.sunRoofControlAsync = Promise.denodeify(exports.sunRoofControl);

/**
 * Set sun roof position
 * @param {optionsType} options - options object
 * @param {int} percent - position in percent
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.sunRoofMove = function sunRoofMove(options, percent, callback) {
    post_command(options, "command/sun_roof_control", { "state": "move", "percent": percent }, callback);
}

/**
 * @function sunRoofMoveAsync
 * @param {optionsType} options - options object
 * @param {int} percent - position in percent
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
 * @param {number} driver - driver temp in Deg.C
 * @param {number} pass - passenger temp in Deg.C
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setTemps = function setTemps(options, driver, pass, callback) {
    if (!pass) {
        pass = driver;
    }

    // ensure valid temp range
    driver = clamp(driver, exports.MIN_TEMP, exports.MAX_TEMP);
    pass = clamp(pass, exports.MIN_TEMP, exports.MAX_TEMP);

    post_command(options, "command/set_temps", { driver_temp: driver, passenger_temp: pass }, callback);
}

/**
 * @function setTempsAsync
 * @param {optionsType} options - options object
 * @param {number} driver - driver temp in Deg.C
 * @param {number} pass - passenger temp in Deg.C
 * @returns {Promise} result
 */
exports.setTempsAsync = Promise.denodeify(exports.setTemps);

/**
 * Remote start the car
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.remoteStart = function remoteStartDrive(options, callback) {
    post_command(options, "command/remote_start_drive", null, callback);
}

/**
 * @function remoteStartAsync
 * @param {optionsType} options - options object
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
 * @param {string} which - FRUNK or TRUNK constant
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.openTrunk = function openTrunk(options, which, callback) {
    post_command(options, "command/actuate_trunk", { which_trunk: which }, callback);
}

/**
 * @function openTrunkAsync
 * @param {optionsType} options - options object
 * @param {string} which - one of "trunk", "frunk"
 * @returns {Promise} result
 */
exports.openTrunkAsync = Promise.denodeify(exports.openTrunk);

/**
 * Wake up a car that is sleeping
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.wakeUp = function wakeUp(options, callback) {
    post_command(options, "wake_up", null, callback);
}

/**
 * @function wakeUpAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.wakeUpAsync = Promise.denodeify(exports.wakeUp);

/**
 * Turn valet mode on/off
 * @param {optionsType} options - options object
 * @param {boolean} onoff - true for on, false for off
 * @param {int} pin - pin code
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.setValetMode = function setValetMode(options, onoff, pin, callback) {
    post_command(options, "command/set_valet_mode", { on : onoff, password : pin }, callback);
}

/**
 * @function setValetModeAsync
 * @param {optionsType} options - options object
 * @param {boolean} onoff - true for on, false for off
 * @param {int} pin - pin code
 * @returns {Promise} result
 */
exports.setValetModeAsync = Promise.denodeify(exports.setValetMode);

/**
 * Reset the valet pin
 * @param {optionsType} options - options object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.resetValetPin = function resetValetPin(options, callback) {
    post_command(options, "command/reset_valet_pin", null, callback);
}

/**
 * @function resetValetPinAsync
 * @param {optionsType} options - options object
 * @returns {Promise} result
 */
exports.resetValetPinAsync = Promise.denodeify(exports.resetValetPin);

/**
 * Set a calendar entry
 * @param {optionsType} options - options object
 * @param {object} entry - calendar entry object
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.calendar = function calendar(options, entry, callback) {
    post_command(options, "command/upcoming_calendar_entries", entry, callback);
}

/**
 * @function calendarAsync
 * @param {optionsType} options - options object
 * @param {object} entry - calendar entry object
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
                            "end": endTime || new Date().getTime(),
                            "start": startTime || new Date().getTime(),
                            "cancelled": false,
                            "tentative": false,
                            "location": location || "",
                            "name": eventName || "Event name",
                            "organizer": ""
                        }
                    ],
                    "name": accountName || ""    // calendar account name?
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
 * @param {number} lat - vehicle GPS latitude
 * @param {number} long - vehicle GPS longitude
 * @param {string} string - one of the tokens from vehicle JSON
 * @param {nodeBack} callback - Node-style callback
 * @returns {object} result
 */
exports.homelink = function homelink(options, lat, long, callback) {
    post_command(options, "command/trigger_homelink", { lat: lat, lon: long } , callback);
}

/**
 * @function homelinkAsync
 * @param {optionsType} options - options object
 * @param {number} lat - vehicle GPS latitude
 * @param {number} long - vehicle GPS longitude
 * @param {string} string - one of the tokens from vehicle JSON
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
    log(API_CALL_LEVEL, "TeslaJS.products()");

    callback =
      callback ||
      function(err, products) {
        /* do nothing! */
      };

    var req = {
      method: "GET",
      url: portalBaseURI + "/api/1/products",
      headers: {
        Authorization: "Bearer " + options.authToken,
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function(error, response, body) {
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
        console.log(e);
        log(API_ERR_LEVEL, "Error parsing products response");
        callback(e, null);
      }

      log(API_RETURN_LEVEL, "\nGET request: " + "/products" + " completed.");
    });
  };

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
    log(API_CALL_LEVEL, "TeslaJS.solarStatus()");

    callback =
      callback ||
      function(err, solarStatus) {
        /* do nothing! */
      };

    var req = {
      method: "GET",
      url: portalBaseURI + "/api/1/energy_sites/" + options.siteId + "/live_status",
      headers: {
        Authorization: "Bearer " + options.authToken,
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req));

    request(req, function(error, response, body) {
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
        log(API_ERR_LEVEL, "Error parsing solarStatus response");
        callback(e, null);
      }

      log(API_RETURN_LEVEL, "\nGET request: " + "/solarStatus" + " completed.");
    });
  };

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
exports.frontDefrostOn = function frontDefrostOn(options, callback) {
    post_command(options, "command/front_defrost_on", null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.frontDefrostOff = function frontDefrostOff(options, callback) {
    post_command(options, "command/front_defrost_off", null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.rearDefrostOn = function rearDefrostOn(options, callback) {
    post_command(options, "command/rear_defrost_on", null, callback);
}

//
// [Alpha impl] Not yet supported
//
exports.rearDefrostOff = function rearDefrostOff(options, callback) {
    post_command(options, "command/rear_defrost_off", null, callback);
}
*/

//
// [Alpha impl] Auto Park
//
/*
exports.autoParkForward = function autoParkForward(options, lat, long, callback) {
    autoPark(options, lat, long, "start_forward", callback);
}

exports.autoParkBackward = function autoParkBackward(options, lat, long, callback) {
    autoPark(options, lat, long, "start_reverse", callback);
}

exports.autoPark = function autoPark(options, lat, long, action, callback) {
    post_command(options, "command/autopark_request", { lat: lat, long: long, action: action}, callback);
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

    callback = callback || function (error, response, body) { /* do nothing! */ }
    onDataCb = onDataCb || function (data) { /* do nothing! */ }

    options.values = options.values || exports.streamingColumns;

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
