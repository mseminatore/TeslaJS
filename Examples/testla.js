//==========================================================================
// This Express sample demonstrates mocking the TeslaJS REST API for testing
//
// Github: https://github.com/mseminatore/TeslaJS
// NPM: https://www.npmjs.com/package/teslajs
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//==========================================================================

var express = require('express');
var program = require('commander');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/json

//
//
//
program
//  .option('-u, --username [string]', 'username (used to mock login validation)')
//  .option('-p, --password [string]', 'password (used to mock login validation)')
  .option('-P, --port <n>', 'port number for the server', parseInt)
  .parse(process.argv);

//[]======================[]
// Global state
//[]======================[]
var vid = 321;
var username = null;
var password = null;
var valetPin = 0;
var mobileEnabled = true;

var driveState = {
    "shift_state": null,          //
    "speed": null,                //
    "latitude": 33.794839,        // degrees N of equator
    "longitude": -84.401593,      // degrees W of the prime meridian
    "heading": 4,                 // integer compass heading, 0-359
    "gps_as_of": 1359863204       // Unix timestamp of GPS fix
};

var chargeState = {
    "charging_state": "Complete",  // "Charging", ??
    "charge_to_max_range": false,  // current std/max-range setting
    "max_range_charge_counter": 0,
    "fast_charger_present": false, // connected to Supercharger?
    "battery_range": 239.02,       // rated miles
    "est_battery_range": 155.79,   // range estimated from recent driving
    "ideal_battery_range": 275.09, // ideal miles
    "battery_level": 91,           // integer charge percentage
    "battery_current": -0.6,       // current flowing into battery
    "charge_starting_range": null,
    "charge_starting_soc": null,
    "charger_voltage": 0,          // only has value while charging
    "charger_pilot_current": 40,   // max current allowed by charger & adapter
    "charger_actual_current": 0,   // current actually being drawn
    "charger_power": 0,            // kW (rounded down) of charger
    "time_to_full_charge": null,   // valid only while charging
    "charge_rate": -1.0,           // float mi/hr charging or -1 if not charging
    "charge_port_door_open": true,
    "charge_limit_soc": 90
};

var climateState =
{
    "inside_temp": 17.0,          // degC inside car
    "outside_temp": 9.5,          // degC outside car or null
    "driver_temp_setting": 22.6,  // degC of driver temperature setpoint
    "passenger_temp_setting": 22.6, // degC of passenger temperature setpoint
    "is_auto_conditioning_on": false, // apparently even if on
    "is_front_defroster_on": null, // null or boolean as integer?
    "is_rear_defroster_on": false,
    "fan_status": 0               // fan speed 0-6 or null
};

var vehicleState =
{
    "df": false,                  // driver's side front door open
    "dr": false,                  // driver's side rear door open
    "pf": false,                  // passenger's side front door open
    "pr": false,                  // passenger's side rear door open
    "ft": false,                  // front trunk is open
    "rt": false,                  // rear trunk is open
    "car_version": "2.15.16",     // car firmware version
    "locked": true,               // car is locked
    "sun_roof_installed": true,   // panoramic roof is installed
    "sun_roof_state": "unknown",
    "sun_roof_percent_open": 0,   // null if not installed
    "dark_rims": false,           // gray rims installed
    "wheel_type": "Base19",       // wheel type installed
    "has_spoiler": false,         // spoiler is installed
    "roof_color": "None",         // "None" for panoramic roof, "Colored" otherwise
    "perf_config": "Base",
    "vehicle_name": "Kit",        // display name if set
    "valet_mode": false           // true if valet mode is active
};

var guiSettings =
{
    "gui_distance_units": "mi/hr",
    "gui_temperature_units": "F",
    "gui_charge_rate_units": "mi/hr",
    "gui_24_hour_time": false,
    "gui_range_display": "Rated"
};

var resultSuccess = {
    "response": {
        "result": true,
        "reason": ""
    }
};

//===============================
// Get the default web view
//===============================
app.get('/', function (req, res) {
  res.send('Hello from TesTla!');
});

//=============================
// Mock the OAuth login command
//=============================
app.post('/oauth/token', function (req, res) {
    console.log(JSON.stringify(req));

    // TODO - validate the request before responding
    res.json({
        "access_token": "abc123",
        "token_type": "bearer",
        "expires_in": 7776000,
        "created_at": new Date().getMilliseconds()   // 1457385291
    });
});

//==========================
// Mock the GET vehicles cmd
//==========================
app.get('/api/1/vehicles', function (req, res) {
    res.json({
        "response": [
            {
                "color": "black",
                "display_name": "Kit",
                "id": vid,
                "id_s": vid.toString(),
                "option_codes": "MS01,RENA,TM00,DRLH,PF00,BT85,PBCW,RFPO,WT19,IBMB,IDPB,TR00,SU01,SC01,TP01,AU01,CH00,HP00,PA00,PS00,AD02,X020,X025,X001,X003,X007,X011,X013",
                "user_id": 123,
                "vehicle_id": 1234567890,
                "vin": "5YJSA1CN5CFP01657",
                "tokens": [
                    "123",
                    "456"],
                "state": "online"
            }],
        "count": 1
    });
});

//================================
// Mock the GET mobile_enabled cmd
//================================
app.get('/api/1/vehicles/:vid/mobile_enabled', function (req, res) {
    res.json({ "response": mobileEnabled });
});

//===============================
// Mock the GET charge_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/charge_state', function (req, res) {
    res.json({
        "response": chargeState
    });
});

//===============================
// Mock the GET climate_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/climate_state', function (req, res) {
    res.json({
        "response": climateState
    });
});

//===============================
// Mock the GET drive_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/drive_state', function (req, res) {
    res.json({
        "response": driveState
    });
});

//===============================
// Mock the GET gui_settings cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/gui_settings', function (req, res) {
    res.json({
        "response": guiSettings
    });
});

//===============================
// Mock the GET vehicle_state cmd
//===============================
app.get('/api/1/vehicles/:vid/data_request/vehicle_state', function (req, res) {
    res.json({
        "response": vehicleState
    });
});

//===============================
// Mock the POST wake_up cmd
//===============================
app.post('/api/1/vehicles/:vid/wake_up', function (req, res) {
    res.json(resultSuccess);
});

//=================================
// Mock the POST set_valet_mode cmd
//=================================
app.post('/api/1/vehicles/:vid/command/set_valet_mode', function (req, res) {
    if (req.body.on && valetPin == 0) {
        vehicleState.valet_mode = true;
        valetPin = req.body.password;
        res.json(resultSuccess);
        return;
    }

    if (!req.body.on && valetPin == req.body.password) {
        vehicleState.valet_mode = false;
        valetPin = 0;
        res.json(resultSuccess);
        return;
    }

    res.json({
        "response": {
            "result": false,
            "reason": "invalid_pin"
        }
    });
});

//==================================
// Mock the POST reset_valet_pin cmd
//==================================
app.post('/api/1/vehicles/:vid/command/reset_valet_pin', function (req, res) {
    // TODO - does this reset valet mode?
    vehicleState.valet_mode = false;
    valetPin = 0;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_port_door_open cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_port_door_open', function (req, res) {
    chargeState.charge_port_door_open = true;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_standard cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_standard', function (req, res) {
    if (chargeState.charge_limit_soc == 90) {
        res.json({
            "response": {
                "result": false,
                "reason": "already_standard"
            }
        });
    }

    chargeState.charge_limit_soc = 90;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_max_range cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_max_range', function (req, res) {
    if (chargeState.charge_limit_soc == 100) {
        res.json({
            "response": {
                "result": false,
                "reason": "already_max_range"
            }
        });
    }

    chargeState.charge_limit_soc = 100;
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_charge_limit cmd
//========================================
app.post('/api/1/vehicles/:vid/command/set_charge_limit', function (req, res) {
    var auth = req.get('Authorization');
    // TODO - validate the auth token

    // ensure valid percent value
    var percent = req.body.percent;
    if (percent < 50)
        percent = 50;
    if (percent > 100)
        percent = 100;

    // process the state change
    chargeState.charge_limit_soc = percent;

    // TODO - validate the vehicleID matches
//    console.log(req.params.vid);

    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_start', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_stop', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST flash_lights cmd
//========================================
app.post('/api/1/vehicles/:vid/command/flash_lights', function (req, res) {
    // no state changes here
    res.json(resultSuccess);
});

//========================================
// Mock the POST honk_horn cmd
//========================================
app.post('/api/1/vehicles/:vid/command/honk_horn', function (req, res) {
    // no state changes here
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_unlock cmd
//========================================
app.post('/api/1/vehicles/:vid/command/door_unlock', function (req, res) {
    vehicleState.locked = false;
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_lock cmd
//========================================
app.post('/api/1/vehicles/:vid/command/door_lock', function (req, res) {
    vehicleState.locked = true;
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_temps cmd
//========================================
app.post('/api/1/vehicles/:vid/command/set_temps', function (req, res) {
    var driverTemp = req.body.driver_temp;
    var passTemp = req.body.passenger_temp;

    // TODO - clamp temp values to appropriate ranges

    climateState.driver_temp_setting = driverTemp;
    climateState.passenger_temp_setting = passTemp;

    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_start', function (req, res) {
    climateState.is_auto_conditioning_on = true;
    climateState.fan_status = 6;
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_stop', function (req, res) {
    climateState.is_auto_conditioning_on = false;
    climateState.fan_status = 0;
    res.json(resultSuccess);
});

//========================================
// Mock the POST sun_roof_control cmd
//========================================
app.post('/api/1/vehicles/:vid/command/sun_roof_control', function (req, res) {
    vehicleState.sun_roof_percent_open = req.body.percent;

    // TODO - clamp percent values

    res.json(resultSuccess);
});

//========================================
// Mock the POST remote_start_drive cmd
//========================================
app.post('/api/1/vehicles/:vid/command/remote_start_drive', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST trunk_open cmd
//========================================
app.post('/api/1/vehicles/:vid/command/trunk_open', function (req, res) {
    res.json(resultSuccess);
});

//[]===============================[]
// Setup our listen server
//[]===============================[]
var port = program.port || 3000;

app.listen(port, function () {
  console.log('TesTla app listening at http://127.0.0.1:' + port);
});

module.exports = app;
