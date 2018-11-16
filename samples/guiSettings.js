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
    tjs.guiSettings(options, function (err, guiSettings) {
        if (!guiSettings) {
            console.error("\nError: " + "No response to guiSettings() query!".red);
            return;
        }

        console.log("\ngui_distance_units: " + guiSettings.gui_distance_units.green);
        console.log("gui_temperature_units: " + guiSettings.gui_temperature_units.green);
        console.log("gui_charge_rate_units: " + guiSettings.gui_charge_rate_units.green);

        var timeFormat = guiSettings.gui_24_hour_time ? "YES".green : "NO".green;
        console.log("gui_24_hour_time: " + timeFormat);
        console.log("gui_range_display: " + guiSettings.gui_range_display.green);
    });
}
