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
var colors = require('colors');

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!".red);
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
    var pctIndex = 2;

    if (process.argv.length > 3) {
        pctIndex = 3;
    }

    var amt = process.argv[pctIndex];

    if (amt.toLowerCase() == "open")
        amt = 100;
    else if (amt.toLowerCase() == "close")
        amt = 0;
    else if (amt.toLowerCase() == "vent")
        amt = 15;
    else if (amt.toLowerCase() == "comfort")
        amt = 80;

    tjs.sunRoofMove(options, amt, function (result) {
        if (result.result) {
            var str = (amt + "%").green;
            console.log("\nSunroof successfully moved to : " + str);
        } else
            console.log(result.reason);
    });
}

//
//
//
function usage() {
    console.log("\nUsage: node <sample_name> <email> <password> percentage|open|close|vent|comfort\n");
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

    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    login_cb({ error: false, authToken: token });
} else {
    // no saved token found, expect username and password on command line
    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    tjs.login(process.argv[2], process.argv[3], login_cb);
}
