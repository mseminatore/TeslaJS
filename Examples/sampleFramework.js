//=====================================================================
// This sample framework is used to demonstrate using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================
"use strict";

var fs = require('fs');
var tjs = require('../TeslaJS');
require('colors');

function logo() {
    console.log("\n");
    console.log("TTTTT EEEEE SSSSS L     AAAAA     J SSSSS");
    console.log("  T   EEEEE S     L     AAAAA     J S");
    console.log(" TTT        s     L               J S");
    console.log("  T   EEEEE SSSSS L     AAAAA     J SSSSS");
    console.log("  T             S L     A   A     J     S");
    console.log("  T   EEEEE     S L     A   A J   J     S");
    console.log("  T   EEEEE SSSSS LLLLL A   A JJJJJ SSSSS");
    console.log("=========================================");
}

exports.SampleFramework = function SampleFramework(program, main) {
    this.program = program;
    this.tokenFound = false;
    this.main = main;

    this.login_cb = function (err, result) {
        if (result.error) {
            console.error("Login failed!".red);
            console.warn(JSON.stringify(result.error));
            return;
        }

        logo();

        var options = { authToken: result.authToken };
        tjs.allVehicles(options, function (err, vehicles) {
            if (err) {
                console.log(err);
                return;
            }

            var vehicle = vehicles[program.index || 0];
            options.vehicleID = vehicle.id_s;
            options.vehicle_id = vehicle.vehicle_id;
            options.tokens = vehicle.tokens;

            if (vehicle.state.toUpperCase() == "OFFLINE") {
                console.log("\nResult: " + "Unable to contact vehicle, exiting!".bold.red);
                return;
            }

            var carType = tjs.getModel(vehicle);
            
            console.log("\nVehicle " + vehicle.vin.green + " - " + carType.green + " ( '" + vehicle.display_name.cyan + "' ) is: " + vehicle.state.toUpperCase().bold.green);

            if (main) {
                main(tjs, options);
            }
        });
    }

    this.run = function () {
        try {
            this.tokenFound = fs.statSync('.token').isFile();
        } catch (e) {
        }

        if (program.uri) {
            console.log("Setting portal URI to: " + program.uri);
            tjs.setPortalBaseURI(program.uri);
        }

        if (this.tokenFound) {
            var token = JSON.parse(fs.readFileSync('.token', 'utf8'));

            if (!token) {
                program.help();
            }

            this.login_cb(null, { error: false, authToken: token });
        } else {
            var username = program.username || process.env.TESLAJS_USER;
            var password = program.password || process.env.TESLAJS_PASS;

            if (!username || !password) {
                program.help();
            }

            tjs.login(username, password, this.login_cb);
        }
    }
}
