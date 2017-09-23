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
    tjs.vehicleConfigAsync(options).then( function (vehicle_config) {
        console.log("\nCar type: " + "Model ".green + vehicle_config.car_type.toUpperCase().green);
        console.log("Exterior color: " + vehicle_config.exterior_color.green);
        if (vehicle_config.eu_vehicle) {
            console.log("EU vehicle: " + "Yes".bgGreen);
        }
        
        console.log("Ludicrous mode: " + (vehicle_config.has_ludicrous_mode ? "YES".bgGreen : "No".green));
        console.log("Sunroof installed: " + (vehicle_config.sun_roof_installed ? "YES".bgGreen : "No".green));
        console.log("Motorized charge port: " + (vehicle_config.motorized_charge_port ? "YES".bgGreen : "No".green));
        console.log("Spoiler type: " + vehicle_config.spoiler_type.green);
        console.log("Trim badging: " + vehicle_config.trim_badging.toUpperCase().green);
        console.log("Wheel type: " + vehicle_config.wheel_type.green);
    });
}
