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
  .usage('[options] username')
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

        options.vehicle_id = vehicle.vehicle_id;
        options.tokens = vehicle.tokens;

        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    var streamingOptions = {
        username: program.args[0],
        password: options.tokens[0],
        vehicle_id: options.vehicle_id
    };

    console.log("\nNote: " + "Inactive vehicle streaming responses can take up to several minutes.".green);
    console.log("\nStreaming starting...".cyan);

    console.log("Columns: timestamp," + tjs.streamingColumns.toString());

    tjs.startStreaming(streamingOptions, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }

        // display the streaming results
        console.log(body);

        console.log("...Streaming ended.".cyan);
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

    if (!token || program.args.length < 1) {
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
