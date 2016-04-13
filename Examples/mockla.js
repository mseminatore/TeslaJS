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
var app = express();
var program = require('commander');

//
//
//
program
//  .option('-u, --username [string]', 'username (used to mock login validation)')
//  .option('-p, --password [string]', 'password (used to mock login validation)')
  .option('-P, --port <n>', 'port number for the server', parseInt)
  .parse(process.argv);

// Globals
var vid = 321;
var username = null;
var password = null;

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
  res.send('Hello from Mockla!');
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
app.get('/api/1/vehicles/321/mobile_enabled', function (req, res) {
    res.json({ "response": true });
});

//===============================
// Mock the GET charge_state cmd
//===============================
app.get('/api/1/vehicles/321/data_request/charge_state', function (req, res) {
    res.json({
        "response": {
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
        }
    });
});

//===============================
// Mock the GET climate_state cmd
//===============================
app.get('/api/1/vehicles/321/data_request/climate_state', function (req, res) {
    res.json({
        "response": {
            "inside_temp": 17.0,          // degC inside car
            "outside_temp": 9.5,          // degC outside car or null
            "driver_temp_setting": 22.6,  // degC of driver temperature setpoint
            "passenger_temp_setting": 22.6, // degC of passenger temperature setpoint
            "is_auto_conditioning_on": false, // apparently even if on
            "is_front_defroster_on": null, // null or boolean as integer?
            "is_rear_defroster_on": false,
            "fan_status": 0               // fan speed 0-6 or null
        }
    });
});

//===============================
// Mock the GET drive_state cmd
//===============================
app.get('/api/1/vehicles/321/data_request/drive_state', function (req, res) {
    res.json({
        "response": {
            "shift_state": null,          //
            "speed": null,                //
            "latitude": 33.794839,        // degrees N of equator
            "longitude": -84.401593,      // degrees W of the prime meridian
            "heading": 4,                 // integer compass heading, 0-359
            "gps_as_of": 1359863204       // Unix timestamp of GPS fix
        }
    });
});

//===============================
// Mock the GET gui_settings cmd
//===============================
app.get('/api/1/vehicles/321/data_request/gui_settings', function (req, res) {
    res.json({
        "response": {
            "gui_distance_units": "mi/hr",
            "gui_temperature_units": "F",
            "gui_charge_rate_units": "mi/hr",
            "gui_24_hour_time": false,
            "gui_range_display": "Rated"
        }
    });
});

//===============================
// Mock the GET vehicle_state cmd
//===============================
app.get('/api/1/vehicles/321/data_request/vehicle_state', function (req, res) {
    res.json({
        "response": {
            "df": false,                  // driver's side front door open
            "dr": false,                  // driver's side rear door open
            "pf": false,                  // passenger's side front door open
            "pr": false,                  // passenger's side rear door open
            "ft": false,                  // front trunk is open
            "rt": false,                  // rear trunk is open
            "car_version": "1.19.42",      // car firmware version
            "locked": true,               // car is locked
            "sun_roof_installed": false,  // panoramic roof is installed
            "sun_roof_state": "unknown",
            "sun_roof_percent_open": 0,   // null if not installed
            "dark_rims": false,           // gray rims installed
            "wheel_type": "Base19",       // wheel type installed
            "has_spoiler": false,         // spoiler is installed
            "roof_color": "Colored",      // "None" for panoramic roof
            "perf_config": "Base",
            "vehicle_name": "Kit",        // display name if set
            "valet_mode": false           // true if valet mode is active
        }
    });
});

//===============================
// Mock the POST wake_up cmd
//===============================
app.post('/api/1/vehicles/321/wake_up', function (req, res) {
    res.json(resultSuccess);
});

//=================================
// Mock the POST set_valet_mode cmd
//=================================
app.post('/api/1/vehicles/321/command/set_valet_mode', function (req, res) {
    res.json(resultSuccess);
});

//==================================
// Mock the POST reset_valet_pin cmd
//==================================
app.post('/api/1/vehicles/321/command/reset_valet_pin', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_port_door_open cmd
//========================================
app.post('/api/1/vehicles/321/command/charge_port_door_open', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_standard cmd
//========================================
app.post('/api/1/vehicles/321/command/charge_standard', function (req, res) {
    res.json({
        "response": {
            "result": false,
            "reason": "already_standard"
        }
    });
});

//========================================
// Mock the POST charge_max_range cmd
//========================================
app.post('/api/1/vehicles/321/command/charge_max_range', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_charge_limit cmd
//========================================
app.post('/api/1/vehicles/321/command/set_charge_limit', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_start cmd
//========================================
app.post('/api/1/vehicles/321/command/charge_start', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_stop cmd
//========================================
app.post('/api/1/vehicles/321/command/charge_stop', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST flash_lights cmd
//========================================
app.post('/api/1/vehicles/321/command/flash_lights', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST honk_horn cmd
//========================================
app.post('/api/1/vehicles/321/command/honk_horn', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_unlock cmd
//========================================
app.post('/api/1/vehicles/321/command/door_unlock', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_lock cmd
//========================================
app.post('/api/1/vehicles/321/command/door_lock', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST set_temps cmd
//========================================
app.post('/api/1/vehicles/321/command/set_temps', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_start cmd
//========================================
app.post('/api/1/vehicles/321/command/auto_conditioning_start', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_stop cmd
//========================================
app.post('/api/1/vehicles/321/command/auto_conditioning_stop', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST sun_roof_control cmd
//========================================
app.post('/api/1/vehicles/321/command/sun_roof_control', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST remote_start_drive cmd
//========================================
app.post('/api/1/vehicles/321/command/remote_start_drive', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST trunk_open cmd
//========================================
app.post('/api/1/vehicles/321/command/trunk_open', function (req, res) {
    res.json(resultSuccess);
});

//[]===============================[]
// Setup our listen server
//[]===============================[]
var port = program.port || 3000;

app.listen(port, function () {
  console.log('Mockla app listening on port ' + port + '!');
});
