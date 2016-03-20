//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tms = require('../TeslaJS');
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
    tms.vehicles(options, function (vehicle) {
        console.log("Vehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tms.vehicleState(options, function (vehicle_state) {
        var str = vehicle_state.locked ? "locked." : "unlocked.";

        console.log("\nCar name: " + vehicle_state.vehicle_name);

        console.log("\nDoors: " + str);
        console.log("Firmware: " + vehicle_state.car_version + ".");

        str = vehicle_state.valet_mode ? "ON" : "OFF";
        console.log("Valet mode: " + str);

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

    var options = { email: process.argv[2], password: process.argv[3] };
    tms.login(options.email, options.password, login_cb);
}
