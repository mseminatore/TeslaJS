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
  .usage('[options] close|vent')
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
    var state = program.args[0];

    if (!state) {
        program.help();
    }

    if (state.toLowerCase() == "closed") {
        state = "close";
    }
    
    if (state.toLowerCase() != "close" && state.toLowerCase() != "vent") {
        program.help();
    }

    tjs.sunRoofControl(options, { state }, function (err, result) {
        if (result && result.result) {
            console.log("\nSunroof successfully moved to : " + state.bgGreen);
        } else {
            console.log(err);
            console.log("Invalid option".red);
        }
    });
}
