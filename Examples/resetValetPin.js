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

    var options = { authToken: result.authToken, carIndex: 0 };
    tjs.vehicles(options, function (vehicle) {
        console.log("\nVehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state.toUpperCase().bold.green);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tjs.resetValetPin(options, function (result) {
        if (result.result)
            console.log("\nPIN reset completed successfully!");
        else
            console.log(result.reason.red);
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