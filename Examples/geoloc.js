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
//  Turn compass heading into friendly heading (NSEW, etc.)
//
function compassDirs(heading) {
    if (heading > 337 || heading < 23)
        return "North";
    if (heading < 67)
        return "North East";
    if (heading < 112)
        return "East";
    if (heading < 157)
        return "South East";
    if (heading < 202)
        return "South";
    if (heading < 247)
        return "South West";
    if (heading < 292)
        return "West";
    if (heading < 337)
        return "North West";

    return heading;
}

//
//
//
function sampleMain(options) {
    tjs.driveState(options, function (drive_state) {
        if (drive_state) {
            var state = drive_state.shift_state || "Parked";
            console.log("State: " + state);

            if (drive_state.speed)
                console.log("Speed: " + drive_state.speed || 0);

            console.log("Heading: " + compassDirs(drive_state.heading));

            var lat = drive_state.latitude || 0;
            var long = drive_state.longitude || 0;
            console.log("GPS: " + lat + ", " + long);
        }
        else
            console.log(drive_state.reason);
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
