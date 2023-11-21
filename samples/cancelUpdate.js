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
    tjs.cancelSoftwareUpdate(options, null, function (err, result) {
        if (err) {
            console.error("\ncancelSoftwareUpdate command: " + "Failed!".red);
        } else {
            if (result.result) {
                console.log("\ncancelSoftwareUpdate command: " + "Succeeded".green);
            } else {
                console.log("\ncancelSoftwareUpdate command: " + "Failed!".red);
                console.log("Reason: " + result.reason.red);
            }
        }
    });
}
