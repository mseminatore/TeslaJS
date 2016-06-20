//=====================================================================
// This is a Node.js module encapsulating the unofficial Tesla API set
//
// Github: https://github.com/mseminatore/TeslaJS
// NPM: https://www.npmjs.com/package/teslajs
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var request = require('request');
var colors = require('colors');

//=======================
// Streaming API portal
//=======================
var streamingPortal = "https://streaming.vn.teslamotors.com/stream/";
exports.streamingPortal = streamingPortal;

//===========================
// New OAuth-based API portal
//===========================
var portal = "https://owner-api.teslamotors.com/";
exports.portal = portal;

var portalBaseURI = process.env.TESLAJS_SERVER || portal;

//=======================
// Log levels
//=======================
var API_CALL_LEVEL = 1;
exports.API_CALL_LEVEL = API_CALL_LEVEL;

var API_RETURN_LEVEL = 2;
exports.API_RETURN_LEVEL = API_RETURN_LEVEL;

var API_BODY_LEVEL = 3;
exports.API_BODY_LEVEL = API_BODY_LEVEL;

var API_REQUEST_LEVEL = 4;
exports.API_REQUEST_LEVEL = API_REQUEST_LEVEL;

var API_RESPONSE_LEVEL = 5;
exports.API_RESPONSE_LEVEL = API_RESPONSE_LEVEL;

var API_LOG_ALL = 255;	// this value must be the last
exports.API_LOG_ALL = API_LOG_ALL;

var logLevel = process.env.TESLAJS_LOG || 0;

//===========================
// Adjustable console logging
//===========================
function log(level, str) {
    if (logLevel <= level)
        return;
    console.log(str);
}

//==========================
// Set/get the logging level
//==========================
exports.setLogLevel = function setLogLevel(level) {
    logLevel = level;
}

exports.getLogLevel = function getLogLevel(level) {
    return logLevel;
}

//============================
// set/get the portal base URI
//============================
exports.setPortalBaseURI = function setPortalBaseURI(uri) {
    if (!uri)
        portalBaseURI = portal; // reset to the default Tesla servers
    else
        portalBaseURI = uri;
}

exports.getPortalBaseURI = function getPortalBaseURI() {
    return portalBaseURI;
}

//==================================
// Log error messages to the console
//==================================
function err(str) {
    console.error(str.red);
}

//===============================================
// Login to the server and receive an OAuth token
//===============================================
exports.login = function login(username, password, callback) {
    log(API_CALL_LEVEL, "TeslaJS.login()".cyan);

    if (!callback)
        callback = function (result) { /* do nothing! */}

    var req = {
        method: 'POST',
        url: portalBaseURI + '/oauth/token',
        form: {
            "grant_type": "password",
            "client_id": c_id,
            "client_secret": c_sec,
            "email": username,
            "password": password
        }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req).green);

    request(req, function (error, response, body) {

        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(body).magenta);

        var authToken;

        try {
            var authdata = JSON.parse(body);
            authToken = authdata.access_token;
        } catch (e) {
            err('Error parsing response to oauth token request');
        }

        callback({ error: error, response: response, body: body, authToken: authToken });

        log(API_RETURN_LEVEL, "TeslaJS.login() completed.".cyan);
    });
}

//==================================
// Invalidate the current auth token
//==================================
exports.logout = function logout(authToken, callback) {
    log(API_CALL_LEVEL, "TeslaJS.logout()".cyan);

    if (!callback)
        callback = function (result) { /* do nothing! */ }

    callback({ error: "Not implemented!", response: "Not implemented!", body: "Not implemented!" });

    log(API_RETURN_LEVEL, "TeslaJS.logout() completed.".cyan);

/*
    request({
        method: 'DELETE',
        url: portalBaseURI + 'logout',
        headers: { Authorization: "Bearer " + authToken, 'Content-Type': 'application/json; charset=utf-8' }
    }, function (error, response, body) {

        callback({ error: error, response: response, body: body });

        log(API_RETURN_LEVEL, "TeslaJS.logout() completed.");
    });
*/
}

//====================================================
// Return vehicle information on the requested vehicle
//====================================================
exports.vehicles = function vehicles(options, callback) {
    log(API_CALL_LEVEL, "TeslaJS.vehicles()".cyan);

    if (!callback)
        callback = function (vehicle) { /* do nothing! */ }

    var req = {
        method: 'GET',
        url: portalBaseURI + '/api/1/vehicles',
        headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8' }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req).green);

    request(req, function (error, response, body) {
        if (error)
            err(error);

        try {
            var data = JSON.parse(body);
        } catch (e) {
            err('Error parsing vehicles response');
        }

        data = data.response[options.carIndex || 0];
        data.id = data.id_s;

        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(data).magenta);

        callback(data);

        log(API_RETURN_LEVEL, "\nGET request: " + "/vehicles".cyan + " completed.");
    });
}

//====================================
// Generic REST call for GET commands
//====================================
function get_command(options, command, callback) {
    log(API_CALL_LEVEL, "GET call: " + command.cyan + " start.");

    if (!callback)
        callback = function (data) { /* do nothing! */ }

    var req = {
        method: "GET",
        url: portalBaseURI + "/api/1/vehicles/" + options.vehicleID + "/" + command,
        headers: { Authorization: "Bearer " + options.authToken, 'Content-Type': 'application/json; charset=utf-8'}
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req).green);

    request(req, function (error, response, body) {

        if (error)
            err(error);

        try {
            var data = JSON.parse(body);
        } catch (e) {
            err('Error parsing response');
            err(body);
        }

        data = data.response;

        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(data).magenta);

        callback(data);

        log(API_RETURN_LEVEL, "\nGET request: " + command.cyan + " completed.");
    });
}

//====================================
// Generic REST call for POST commands
//====================================
function post_command(options, command, body, callback) {
    log(API_CALL_LEVEL, "POST call: " + command.cyan + " start.");

    if (!callback)
        callback = function (data) { /* do nothing! */ }

    var cmd = {
        method: "POST",
        url: portalBaseURI + "/api/1/vehicles/" + options.vehicleID + "/" + command,
        headers: { Authorization: "Bearer " + options.authToken, 'content-type': 'application/json; charset=UTF-8' },
        form: body || null
    };

    log(API_BODY_LEVEL, "\nRequest: " + JSON.stringify(cmd).green);

    request(cmd, function (error, response, body) {

        if (error)
            err(error);

        try {
            var data = JSON.parse(body);
        } catch (e) {
            err('Error parsing response');
        }

        data = data.response;

        log(API_RESPONSE_LEVEL, "\nResponse: " + JSON.stringify(data).magenta);

        callback(data);

        log(API_RETURN_LEVEL, "\nPOST command: " + command.cyan + " completed.");
    });
}

//=====================
// GET the vehicle state
//=====================
exports.vehicleState = function vehicleState(options, callback) {
    get_command(options, "data_request/vehicle_state", callback);
}

//=====================
// GET the climate state
//=====================
exports.climateState = function climateState(options, callback) {
    get_command(options, "data_request/climate_state", callback);
}

//=====================
// GET the drive state
//=====================
exports.driveState = function driveState(options, callback) {
    get_command(options, "data_request/drive_state", callback);
}

//=====================
// GET the charge state
//=====================
exports.chargeState = function chargeState(options, callback) {
    get_command(options, "data_request/charge_state", callback);
}

//=====================
// GET the GUI settings
//=====================
exports.guiSettings = function guiSettings(options, callback) {
    get_command(options, "data_request/gui_settings", callback);
}

//==============================
// GET the modile enabled status
//==============================
exports.mobileEnabled = function mobileEnabled(options, callback) {
    get_command(options, "mobile_enabled", callback);
}

//=====================
// Honk the horn
//=====================
exports.honkHorn = function honk(options, callback) {
    post_command(options, "command/honk_horn", null, callback);
}

//=====================
// Flash the lights
//=====================
exports.flashLights = function flashLights(options, callback) {
    post_command(options, "command/flash_lights", null, callback);
}

//=======================
// Start charging the car
//=======================
exports.startCharge = function startCharge(options, callback) {
    post_command(options, "command/charge_start", null, callback);
}

//======================
// Stop charging the car
//======================
exports.stopCharge = function stopCharge(options, callback) {
    post_command(options, "command/charge_stop", null, callback);
}

//=====================
// Open the charge port
//=====================
exports.openChargePort = function openChargePort(options, callback) {
    post_command(options, "command/charge_port_door_open", null, callback);
}

//=====================
// Close the charge port
//=====================
exports.closeChargePort = function closeChargePort(options, callback) {
    post_command(options, "command/charge_port_door_close", null, callback);
}

//=====================
// Set the charge limit
//=====================
exports.CHARGE_STORAGE = 50;
exports.CHARGE_DAILY = 70;
exports.CHARGE_STANDARD = 90;
exports.CHARGE_RANGE = 100;     // note: using thsi frequently is not recommended for long-term battery health!

exports.setChargeLimit = function setChargeLimit(options, amt, callback) {
    post_command(options, "command/set_charge_limit", { percent: amt }, callback);
}

//========================
// Set charge limit to 90%
//========================
exports.chargeStandard = function chargeStandard(options, callback) {
    post_command(options, "command/charge_standard", null, callback);
}

//=========================
// Set charge limit to 100%
//=========================
exports.chargeMaxRange = function chargeMaxRange(options, callback) {
    post_command(options, "command/charge_max_range", null, callback);
}

//=====================
// Lock the car doors
//=====================
exports.doorLock = function doorLock(options, callback) {
    post_command(options, "command/door_lock", null, callback);
}

//=====================
// Unlock the car doors
//=====================
exports.doorUnlock = function doorUnlock(options, callback) {
    post_command(options, "command/door_unlock", null, callback);
}

//=====================
// Turn on HVAC
//=====================
exports.climateStart = function climateStart(options, callback) {
    post_command(options, "command/auto_conditioning_start", null, callback);
}

//=====================
// Turn off HVAC
//=====================
exports.climateStop = function climateStop(options, callback) {
    post_command(options, "command/auto_conditioning_stop", null, callback);
}

//==================================
// Set the sun roof to specific mode
//==================================
exports.SUNROOF_OPEN = "open";
exports.SUNROOF_VENT = "vent";
exports.SUNROOF_CLOSED = "close";
exports.SUNROOF_COMFORT = "comfort";

exports.sunRoofControl = function sunRoofControl(options, state, callback) {
    post_command(options, "command/sun_roof_control", { "state": state }, callback);
}

//======================
// Set sun roof position
//======================
exports.sunRoofMove = function sunRoofMove(options, percent, callback) {
    post_command(options, "command/sun_roof_control", { "state": "move", "percent": percent }, callback);
}

//==============================================
// Set the driver/passenger climate temperatures
//==============================================
exports.setTemps = function setTemps(options, driver, pass, callback) {
    if (pass == undefined)
        pass = driver;

    post_command(options, "command/set_temps", { driver_temp: driver, passenger_temp: pass }, callback);
}

//=====================
// Remote start the car
//=====================
exports.remoteStart = function remoteStartDrive(options, password, callback) {
    post_command(options, "command/remote_start_drive", { "password": password }, callback);
}

//=====================
// Open the trunk/frunk
//=====================
exports.FRUNK = "frunk";
exports.TRUNK = "trunk";
exports.openTrunk = function openTrunk(options, which, callback) {
    post_command(options, "command/trunk_open", { which_trunk: which }, callback);
}

//===============================
// Wake up a car that is sleeping
//===============================
exports.wakeUp = function wakeUp(options, callback) {
    post_command(options, "wake_up", null, callback);
}

//=======================
// Turn valet mode on/off
//=======================
exports.setValetMode = function setValetMode(options, onoff, pin, callback) {
    post_command(options, "command/set_valet_mode", { on : onoff, password : pin }, callback);
}

//=======================
// Reset the valet pin
//=======================
exports.resetValetPin = function resetValetPin(options, callback) {
    post_command(options, "command/reset_valet_pin", null, callback);
}

//=======================
// Send a calendar entry
//=======================
exports.calendar = function calendar(options, entry, callback) {
    post_command(options, "command/upcoming_calendar_entries", entry, callback);
}

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

//==============================
// Trigger homelink
//==============================
exports.homelink = function homelink(options, lat, long, token, callback) {
    post_command(options, "command/trigger_homelink", { lat: lat, long: long, token: token } , callback);
}

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
exports.streamingColumns = ['elevation', 'est_heading', 'est_lat', 'est_lng', 'est_range', 'heading', 'odometer', 'power', 'range', 'shift_state', 'speed', 'soc'];

//=====================================================
// Options = {username, password, vehicle_id, values[]}
//=====================================================
exports.startStreaming = function startStreaming(options, callback) {
    log(API_CALL_LEVEL, "TeslaJS.startStreaming()");

    if (!callback)
        callback = function (error, response, body) { /* do nothing! */ }

    if (!options.values)
        options.values = exports.streamingColumns;

    var req = {
        method: 'GET',
        url: streamingPortal + options.vehicle_id + '/?values=' + options.values.join(','),
        auth:
        {
            username: options.username,
            password: options.password,
        }
    };

    log(API_REQUEST_LEVEL, "\nRequest: " + JSON.stringify(req).green);

    request(req, callback);
}

var _0x2dc0 = ["\x65\x34\x61\x39\x39\x34\x39\x66\x63\x66\x61\x30\x34\x30\x36\x38\x66\x35\x39\x61\x62\x62\x35\x61\x36\x35\x38\x66\x32\x62\x61\x63\x30\x61\x33\x34\x32\x38\x65\x34\x36\x35\x32\x33\x31\x35\x34\x39\x30\x62\x36\x35\x39\x64\x35\x61\x62\x33\x66\x33\x35\x61\x39\x65", "\x63\x37\x35\x66\x31\x34\x62\x62\x61\x64\x63\x38\x62\x65\x65\x33\x61\x37\x35\x39\x34\x34\x31\x32\x63\x33\x31\x34\x31\x36\x66\x38\x33\x30\x30\x32\x35\x36\x64\x37\x36\x36\x38\x65\x61\x37\x65\x36\x65\x37\x66\x30\x36\x37\x32\x37\x62\x66\x62\x39\x64\x32\x32\x30"]; var c_id = _0x2dc0[0]; var c_sec = _0x2dc0[1];
