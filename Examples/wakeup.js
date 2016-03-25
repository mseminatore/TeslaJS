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
        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tjs.wakeUp(options, function (result) {
        if (result)
            console.log("\nWakeUp command acknowledged.");
        else {
            console.error("Error waking up vehicle!");
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

    var options = { email: process.argv[2], password: process.argv[3] };
    tjs.login(options.email, options.password, login_cb);
}
