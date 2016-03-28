//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tjs = require('../TeslaJS');
var fs = require('fs');

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!");
        console.warn(JSON.stringify(result.error));
        return;
    }

    var options = { authToken: result.authToken, carIndex: 0 };
    tjs.vehicles(options, function (vehicle) {
        console.log("Vehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tjs.chargeState(options, function (chargeState) {
        if (chargeState.charging_state == "Charging") {
            console.log("\nState: Charging");

            var hours = Math.floor(chargeState.time_to_full_charge);
            var mins = Math.round((chargeState.time_to_full_charge - hours) * 60);
            console.log("Time remaining: " + hours + ":" + mins);
        } else if (chargeState.charging_state == "Disconnected") {
            console.log("\nState: Unplugged");
        } else {
            console.log("\nState: PluggedIn");
        }

        console.log("\nCurrent charge level: " + chargeState.battery_level + '%');
        console.log("Target charge level: " + chargeState.charge_limit_soc + '%');
        console.log("\nIdeal range: " + Math.round(chargeState.ideal_battery_range) + ' miles');
        console.log("Rated range: " + Math.round(chargeState.battery_range) + ' miles');
        console.log("Projected range: " + Math.round(chargeState.est_battery_range) + ' miles');

        if (chargeState.scheduled_charging_pending) {
            var scheduledChargeTime = new Date(chargeState.scheduled_charging_start_time * 1000);
            console.log("\nCharge scheduled for " + scheduledChargeTime.toLocaleTimeString());
        }
    });
}

//
//
//
function usage() {
    console.log("\nUsage: node <sample_name> <email> <password>\n");
}

//
// Sample starts here
//
var tokenFound = false;

try {
    tokenFound = fs.statSync('.token').isFile();
} catch (e) {
}

if (tokenFound) {
    var token = JSON.parse(fs.readFileSync('.token', 'utf8'));
    login_cb({ error: false, authToken: token });
} else {
    // no saved token found, expect username and password on command line
    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    tjs.login(process.argv[2], process.argv[3], login_cb);
}
