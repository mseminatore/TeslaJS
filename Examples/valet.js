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
    var modeIndex = 2;
    var pinIndex = 3;

    if (process.argv.length > 4) {
        modeIndex = 4;
        pinIndex = 5;
    }

    var mode = process.argv[modeIndex];
    var pin = process.argv[pinIndex];

    if (mode == "on" || mode == "ON")
        mode = true;
    else
        mode = false;

    tjs.setValetMode(options, mode, pin, function (response) {
        if (response.result) {
            var str = mode ? "ENABLED" : "DISABLED";
            console.log("\nValet mode " + str + "!");
        }
        else
            console.error(response.reason);
    });
}

//
//
//
function usage() {
    console.log("\nUsage: node <sample_name> <email> <password> ON|OFF pin\n");
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
