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

function ctof(degc) {
    return Math.round(degc * 9 / 5 + 32);
}

//
//
//
function sampleMain(tjs, options) {
    tjs.climateState(options, function (err, climate_state) {
        var str = climate_state.is_auto_conditioning_on ? "ON".red : "OFF".green;
        console.log("\nClimate is currently: " + str);

        if (climate_state.fan_status) {
            console.log("Fan Speed: " + climate_state.fan_status.toString().green);
        }

        if (climate_state.inside_temp && climate_state.inside_temp !== 0) {
            console.log("\nInterior: " + ctof(climate_state.inside_temp).toString().green + " Deg.F");
        }

        if (climate_state.outside_temp && climate_state.outside_temp !== 0) {
            console.log("Exterior: " + ctof(climate_state.outside_temp).toString().green + " Deg.F");
        }

        console.log("\nDriver setting: " + ctof(climate_state.driver_temp_setting).toString().green + " Deg.F");
        console.log("Passenger setting: " + ctof(climate_state.passenger_temp_setting).toString().green + " Deg.F\n");
        
        str = climate_state.is_front_defroster_on ? "ON".red : "OFF".green;
        console.log("Front defroster: " + str)
        
        str = climate_state.is_rear_defroster_on ? "ON".red : "OFF".green;
        console.log("Rear defroster: " + str)
    });
}
