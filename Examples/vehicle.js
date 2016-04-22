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
var program = require('commander');

//
//
//
program
  .option('-u, --username [string]', 'username (needed only if token not cached)')
  .option('-p, --password [string]', 'password (needed only if token not cached)')
  .option('-i, --index <n>', 'vehicle index (first car by default)', parseInt)
  .option('-U, --uri [string]', 'URI of test server (e.g. http://127.0.0.1:3000)')
  .parse(process.argv);

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!".red);
        console.warn(JSON.stringify(result.error));
        return;
    }

    var options = { authToken: result.authToken, carIndex: program.index || 0 };
    tjs.vehicles(options, function (vehicle) {
        console.log("\nVehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state.toUpperCase().bold.green);

        if (vehicle.state != "online") {
            console.log("\nUnable to contact vehicle.\n");
            return;
        }

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tjs.vehicleState(options, function (vehicle_state) {
        var str = vehicle_state.locked ? "LOCKED".green : "UNLOCKED".yellow;

        console.log("\nCar name: " + vehicle_state.vehicle_name.green);

        console.log("\nDoors: " + str);
        if (vehicle_state.sun_roof_installed) {
            var state = "CLOSED";

            if (vehicle_state.sun_roof_state != "unknown")
                state = vehicle_state.sun_roof_state;

            console.log("Sunroof: " + state.green);
        }

        console.log("Firmware: " + vehicle_state.car_version.green);

        str = vehicle_state.valet_mode ? "ON" : "OFF";
        console.log("Valet mode: " + str.green);
    });
}

//
// Sample starts here
//
if (process.env.TESLAJS_LOG)
    tjs.setLogLevel(process.env.TESLAJS_LOG);

var tokenFound = false;

try {
    tokenFound = fs.statSync('.token').isFile();
} catch (e) {
}

if (program.uri) {
    console.log("Setting portal URI to: " + program.uri);
    tjs.setPortalBaseURI(program.uri);
}

if (tokenFound) {
    var token = JSON.parse(fs.readFileSync('.token', 'utf8'));

    if (!token)
        program.help();

    login_cb({ error: false, authToken: token });
} else {
    // no saved token found, expect username and password on command line
    var username = program.username;
    var password = program.password;

    if (!username || !password)
        program.help();

    tjs.login(email, password, login_cb);
}