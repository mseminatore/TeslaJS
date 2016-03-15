//=====================================================================
// This sample demonstrates flashing the lights using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tms = require('../TeslaJS');

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
    tms.vehicles(options, function (vehicle) {
        console.log("Vehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tms.flashLights(options, function (result) {
        if (result.result)
            console.log("\nCommand completed successfully!");
        else
            console.log(result.reason);
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
if (process.argv.length < 3) {
    usage();
    process.exit(1);
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.login(options.email, options.password, login_cb);
