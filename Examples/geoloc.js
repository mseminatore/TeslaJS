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
var request = require('request');
var colors = require('colors');
var program = require('commander');

//
//
//
program
  .option('-u, --username [string]', 'username (needed only if token not cached)')
  .option('-p, --password [string]', 'password (needed only if token not cached)')
  .option('-g, --geocode', 'geocode the street address')
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
            console.log("\nState: " + state.green);

            if (drive_state.speed) {
                var str = drive_state.speed || 0;
                console.log("Speed: " + str.green);
            }

            console.log("Heading: " + compassDirs(drive_state.heading).green);

            var lat = drive_state.latitude || 0;
            var long = drive_state.longitude || 0;
            console.log("GPS: " + lat.toString().green + ", " + long.toString().green);

            if (program.geocode) {
                request({
                    method: 'GET',
                    url: "http://api.geonames.org/findNearestAddressJSON?lat=" + lat + "&lng=" + long + "&username=demo",
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                }, function (error, response, body) {
                    var res = JSON.parse(body).address;

                    console.log('\nClosest resolved address');
                    console.log('------------------------');
                    console.log(res.streetNumber + " " + res.street);
                    console.log(res.placename + ", " + res.adminCode1 + " " + res.postalcode + " " + res.countryCode);
                });
            }
        }
        else
            console.log(drive_state.reason.red);
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
