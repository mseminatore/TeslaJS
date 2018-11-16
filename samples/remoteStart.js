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
  .usage('[options] password')
  .option('-u, --username [string]', 'username (needed only if token not cached)')
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

    var password = program.args[0]

    if (!password) {
        program.help();
    }

    tjs.remoteStart(options, password, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (result) {
            console.log("\nCommand completed successfully!\n");
            console.log("You may now begin driving.\n");
            console.log("You must start driving within " + "2 minutes".bold.green + " or Remote Start will expire.");
        } else {
            console.log(result.reason.red);
        }
    });
}
