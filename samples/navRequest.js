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
  .usage('[options] subject text [locale]')
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
    var subject = program.args[0];
    var text = program.args[1];
    var locale = program.args[1] || "en-US";

    if (!subject || !text) {
        console.log("\n");
        program.help();
    }

    tjs.navigationRequest(options, { subject, text, locale }, function (err, result) {
        if (err) {
            console.error("\nnavigationRequest command: " + "Failed!".red + "\n");
        } else {
            if (result.result) {
                console.log("\nnavigationRequest command: " + "Succeeded".green + "\n");
            } else {
                console.log("\nnavigationRequest command: " + "Failed!".red + "\n");
                console.log("Reason: " + result.reason.red + "\n");
            }
        }
    });
}
