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
require('colors');
var program = require('commander');

//
//
//
program
  .option('-u, --username [string]', 'username (needed only if token not cached)')
  .option('-p, --password [string]', 'password (needed only if token not cached)')
  .option('-i, --index <n>', 'vehicle index (first car by default)', parseInt)
  .option('-n, --name [string]', 'phone name')
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

        if (vehicle.state.toUpperCase() == "OFFLINE") {
            console.log("\nResult: " + "Unable to contact vehicle, exiting!".red);
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
    var entry = tjs.makeCalendarEntry(
        "Event name",
        "Home",
        new Date(2016, 4, 5, 12, 0).getTime(),
        new Date(2016, 4, 5, 1, 0).getTime(),
        "you@gmail.com",
        "Phone Bluetooth name"
        );

    console.log(JSON.stringify(entry));

    tjs.calendar(options, entry, function (result) {
        if (result.result) {
            console.log("\nCalendar updated! ".bold.green);
        } else {
            console.log(result.reason.red);
        }
    });
}

//
// Sample starts here
//
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

    if (!token) {
        program.help();
    }

    login_cb({ error: false, authToken: token });
} else {
    // no saved token found, expect username and password on command line
    var username = program.username;
    var password = program.password;

    if (!username || !password) {
        program.help();
    }

    tjs.login(username, password, login_cb);
}
