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

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

function ctof(degc) {
    return Math.round(degc * 9 / 5 + 32);
}

//
//
//
function sampleMain(options) {
    tjs.climateState(options, function (climate_state) {
        if (climate_state.inside_temp && climate_state.inside_temp != 0)
            console.log("\nInterior: " + ctof(climate_state.inside_temp).toString().green + " Deg.F");

        if (climate_state.outside_temp && climate_state.outside_temp != 0)
            console.log("Exterior: " + ctof(climate_state.outside_temp).toString().green + " Deg.F");

        console.log("\nDriver setting: " + ctof(climate_state.driver_temp_setting).toString().green + " Deg.F");
        console.log("Passenger setting: " + ctof(climate_state.passenger_temp_setting).toString().green + " Deg.F");

        var str = climate_state.is_auto_conditioning_on ? "ON" : "OFF";
        console.log("\nClimate is currently: " + str.green);

        if (climate_state.fan_status)
            console.log("Fan Speed: " + climate_state.fan_status.toString().green);
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

    tjs.login(username, password, login_cb);
}
