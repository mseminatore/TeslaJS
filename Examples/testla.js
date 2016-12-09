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
var path = require('path');
var cookieParser = require('cookie-parser');
require('serve-favicon');
require('colors');

// pages
var index = require('./routes/index');
var driveStatePage = require('./routes/driveStatePage');
var climateStatePage = require('./routes/climateStatePage');
var chargeStatePage = require('./routes/chargeStatePage');
var vehicleStatePage = require('./routes/vehicleStatePage');

var chargingTimer;

//var vehicles = [vehicle];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/json
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define routes
app.use('/', index);
app.use('/driveState', driveStatePage);
app.use('/chargeState', chargeStatePage);
app.use('/climateState', climateStatePage);
app.use('/vehicleState', vehicleStatePage);

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
//var username = null;
//var password = null;
var valetPin = 0;
var mobileEnabled = true;

/*
var vehicle = {
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
};
*/

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
    "battery_range": 219.02,       // rated miles
    "est_battery_range": 155.79,   // range estimated from recent driving
    "ideal_battery_range": 275.09, // ideal miles
    "battery_level": 80,           // integer charge percentage
    "battery_current": -0.6,       // current flowing into battery
    "charge_starting_range": null,
    "charge_starting_soc": null,
    "charger_voltage": 0,          // only has value while charging
    "charger_pilot_current": 40,   // max current allowed by charger & adapter
    "charger_actual_current": 0,   // current actually being drawn
    "charger_power": 0,            // kW (rounded down) of charger
    "time_to_full_charge": null,   // valid only while charging
    "charge_rate": -1.0,           // float mi/hr charging or -1 if not charging
    "charge_port_door_open": false,
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
    "car_type": "",               // either 's' or 'x'
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

//
// TODO - find a way for this to go away.  Perhaps add as members of app??
//
app.locals.driveState = driveState;
app.locals.climateState = climateState;
app.locals.vehicleState = vehicleState;
app.locals.chargeState = chargeState;

//=============================
// Update the drive state
//=============================
app.post('/driveState', function (req, res, next) {
    console.log(req.body);

    driveState = req.body;
    app.locals.driveState = driveState;

    res.send("Drive State Updated! <br><br><button onclick=\"location.href='/driveState'\">Go Back</button>");
});

//=============================
// Update the climate state
//=============================
app.post('/climateState', function (req, res, next) {
    console.log(req.body);

    climateState.inside_temp = parseInt(req.body.inside_temp);
    climateState.outside_temp = parseInt(req.body.outside_temp);
    climateState.driver_temp_setting = parseInt(req.body.driver_temp_setting);
    climateState.passenger_temp_setting = parseInt(req.body.passenger_temp_setting);
    climateState.is_auto_conditioning_on = req.body.is_auto_conditioning_on == "on" ? true : false;
    climateState.is_front_defroster_on = req.body.is_front_defroster_on == "on" ? true : false;
    climateState.is_rear_defroster_on = req.body.is_rear_defroster_on == "on" ? true : false;
    climateState.fan_status = req.body.fan_status;

    app.locals.climateState = climateState;

    res.send("Climate State Updated! <br><br><button onclick=\"location.href='/climateState'\">Go Back</button>");
});

//=============================
// Update the charge state
//=============================
app.post('/chargeState', function (req, res, next) {
    console.log(req.body);

    chargeState.charging_state = req.body.charging_state;
    chargeState.battery_range = parseInt(req.body.battery_range);
    chargeState.est_battery_range = parseInt(req.body.est_battery_range);
    chargeState.ideal_battery_range = parseInt(req.body.ideal_battery_range);
    chargeState.battery_level = parseInt(req.body.battery_level);
    chargeState.charge_limit_soc = parseInt(req.body.charge_limit_soc);
    chargeState.charge_port_door_open = req.body.charge_port_door_open == "on" ? true : false;
    chargeState.fast_charger_present = req.body.fast_charger_present == "on" ? true : false;

    app.locals.chargeState = chargeState;

    res.send("Charge State Updated! <br><br><button onclick=\"location.href='/chargeState'\">Go Back</button>");
});

//=============================
// Update the vehicle state
//=============================
app.post('/vehicleState', function (req, res, next) {
    console.log(req.body);

    // copy over the fields that were updated
    vehicleState.car_version = req.body.car_version;
    vehicleState.df = req.body.df;
    vehicleState.dr = req.body.dr;
    vehicleState.pf = req.body.pf;
    vehicleState.pr = req.body.pr;
    vehicleState.locked = req.body.locked;
    vehicleState.ft = req.body.ft;
    vehicleState.rt = req.body.rt;
    vehicleState.sun_roof_installed = req.body.sun_roof_installed;
    vehicleState.sun_roof_percent_open = req.body.sun_roof_percent_open;
    vehicleState.vehicle_name = req.body.vehicle_name;
    vehicleState.valet_mode = req.body.valet_mode;

    app.locals.vehicleState = vehicleState;

    res.send("Vehicle State Updated! <br><br><button onclick=\"location.href='/vehicleState'\">Go Back</button>");
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
    // TODO - add option_code 'MDLX' if this car is a Model X
    // TODO - add support for multiple vehicles
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
    if (req.body.on && valetPin === 0) {
        vehicleState.valet_mode = true;
        valetPin = req.body.password;

        app.locals.vehicleState = vehicleState;
        res.json(resultSuccess);
        return;
    }

    if (!req.body.on && valetPin == req.body.password) {
        vehicleState.valet_mode = false;
        valetPin = 0;

        app.locals.vehicleState = vehicleState;
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

    app.locals.vehicleState = vehicleState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_port_door_open cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_port_door_open', function (req, res) {
    chargeState.charge_port_door_open = true;

    app.locals.chargeState = chargeState;
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
//    var auth = req.get('Authorization');
    // TODO - validate the auth token

    // ensure valid percent value
    var percent = req.body.percent;
    if (percent < 50) {
        percent = 50;
    }

    if (percent > 100) {
        percent = 100;
    }

    // process the state change
    chargeState.charge_limit_soc = percent;

    // TODO - validate the vehicleID matches
//    console.log(req.params.vid);

    res.json(resultSuccess);
});

//
//
//
function socToRatedMiles(soc) {
    // 265 rated miles at 100% SOC
    return Math.round(soc * 2.65);
}

//
//
//
function ratedToIdealMiles(rated) {
    return Math.round(rated * 350 / 265);
}

//
//
//
function chargePowerToRatedRange(power) {
    return Math.round(power/1000 * 3);
}

//
//
//
function updateChargeCB() {
    console.log("Charging tick.");

    if (chargeState.battery_level < chargeState.charge_limit_soc) {
        chargeState.battery_level = 1.0 + chargeState.battery_level;
        chargeState.battery_range = socToRatedMiles(chargeState.battery_level);
        chargeState.ideal_battery_range = ratedToIdealMiles(chargeState.battery_range);
        chargeState.est_battery_range = Math.round(chargeState.battery_range * 0.85);
        // TODO - recompute finish time and update time_to_full_charge
    }
    else {
        if (chargingTimer) {
            clearInterval(chargingTimer);
            chargingTimer = null;
            chargeState.charging_state = "Complete";
            console.log("Charging complete.");
        }
    }
}

//========================================
// Mock the POST charge_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_start', function (req, res) {
    if (chargeState.battery_level < chargeState.charge_limit_soc) {
        var tickRate;

        if (chargeState.fast_charger_present) {
            chargeState.charger_actual_current = 360;
            chargeState.charger_voltage = 390;
            tickRate = 1000;
        }
        else {
            chargeState.charger_actual_current = 40;
            chargeState.charger_voltage = 240;
            tickRate = 5000;
        }

        chargeState.charging_state = "Charging";
        chargeState.charger_power = parseInt(chargeState.charger_actual_current) * parseInt(chargeState.charger_voltage);
        chargeState.time_to_full_charge = 10000;
        chargeState.charge_rate = chargePowerToRatedRange(chargeState.charger_power);

        // set timer to update simulation
        chargingTimer = setInterval(updateChargeCB, tickRate);
    }

    app.locals.chargeState = chargeState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST charge_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/charge_stop', function (req, res) {
    if (chargingTimer) {
        clearInterval(chargingTimer);
        chargingTimer = null;
    }

    app.locals.chargeState = chargeState;
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

    app.locals.vehicleState = vehicleState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST door_lock cmd
//========================================
app.post('/api/1/vehicles/:vid/command/door_lock', function (req, res) {
    vehicleState.locked = true;

    app.locals.vehicleState = vehicleState;
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

    app.locals.climateState = climateState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_start cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_start', function (req, res) {
    climateState.is_auto_conditioning_on = true;
    climateState.fan_status = 6;

    climateState.inside_temp = climateState.driver_temp_setting;

    app.locals.climateState = climateState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST auto_conditioning_stop cmd
//========================================
app.post('/api/1/vehicles/:vid/command/auto_conditioning_stop', function (req, res) {
    climateState.is_auto_conditioning_on = false;
    climateState.fan_status = 0;

    climateState.inside_temp = climateState.outside_temp;

    app.locals.climateState = climateState;
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
    vehicleState.rt = true;

    app.locals.vehicleState = vehicleState;
    res.json(resultSuccess);
});

//========================================
// Mock the POST trigger_homelink cmd
//========================================
app.post('/api/1/vehicles/:vid/command/trigger_homelink', function (req, res) {
    res.json(resultSuccess);
});

//========================================
// Mock the POST upcoming_calendar_entries cmd
//========================================
app.post('/api/1/vehicles/:vid/command/upcoming_calendar_entries', function (req, res) {
    res.json(resultSuccess);
});

//[]===============================[]
// Setup our listen server
//[]===============================[]
var port = program.port || 3000;

app.listen(port, function () {
    var str = "http://127.0.0.1:" + port;
    console.log("TesTla".cyan + " listening at " + str.green);
});

//========================================
// catch 404 and forward to error handler
//========================================
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//[]===============================[]
// error handlers
//[]===============================[]

//========================================
// development error handler
// will print stacktrace
//========================================
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//========================================
// production error handler
// no stacktraces leaked to user
//========================================
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
