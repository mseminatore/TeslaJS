//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================
"use strict";

require('colors');
var program = require('commander');
var framework = require('./sampleFramework.js');

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
var sample = new framework.SampleFramework(program, sampleMain);
sample.run();

//
//
//
function sampleMain(tjs, options) {
    tjs.vehicleDataAsync(options).then( function(vehicleData) {
        var vehicle_state = vehicleData.vehicle_state;
        var charge_state = vehicleData.charge_state;

        var str = vehicle_state.locked ? "LOCKED".bgGreen : "UNLOCKED".yellow;

        console.log("\nCharging state: " + charge_state.charging_state.green);
        console.log("Battery level: "+ charge_state.battery_level.toString().green);
        console.log("Charge limit: " + charge_state.charge_limit_soc.toString().green);
        console.log("Rated range: " + Math.round(charge_state.battery_range).toString().green);
        console.log("Projected range: " + Math.round(charge_state.est_battery_range).toString().green);

        console.log("\nDoors: " + str);
        if (vehicle_state.df) {
            console.log("Driver door: " + "OPEN".red);
        } 
        if (vehicle_state.pf) {
            console.log("Passenger door: " + "OPEN".red);
        }
        if (vehicle_state.dr) {
            console.log("Driver side rear door: " + "OPEN".red);
        }
        if (vehicle_state.pr) {
            console.log("Passenger side rear door: " + "OPEN".red);
        }
        if (vehicle_state.ft) {
            console.log("Front trunk: " + "OPEN".red);
        }
        if (vehicle_state.rt) {
            console.log("Rear trunk: " + "OPEN".red);
        }

        if (vehicle_state.sun_roof_installed) {
            var state = "CLOSED".green;

            if (vehicle_state.sun_roof_state != "unknown") {
                state = vehicle_state.sun_roof_state.toUpperCase().red;
            }

            console.log("Sunroof: " + state);
        }

        console.log("Firmware: " + vehicle_state.car_version.green);

        str = vehicle_state.valet_mode ? "ON".bgGreen : "OFF".green;
        console.log("Valet mode: " + str + "\n");
    });
}
