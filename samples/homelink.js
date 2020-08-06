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
    tjs.vehicleData(options, function (err, data) {
        if (data.drive_state) {
            var latitude = data.drive_state.latitude || 0;
            var longitude = data.drive_state.longitude || 0;

            console.log("\nHomelink devices: " + data.vehicle_state.homelink_device_count);
            console.log("Homelink nearby: " + data.vehicle_state.homelink_nearby);

            tjs.homelink(options, latitude, longitude, function (err, result) {
                if (result.result) {
                    console.log("\nHomelink: " + "Door signaled!".bold.green);
                } else {
                    console.log("\nHomelink: " + result.reason.red);
                }
            });
        }
        else {
            console.log("Drive State: " + data.drive_state.reason.red);
        }
    });
}
