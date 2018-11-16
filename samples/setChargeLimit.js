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
  .usage('[options] number|standard|storage|range')
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
    var amt = program.args[0];
    if (!amt) {
        program.help();
    }

    // handle named values
    if (amt.toLowerCase() == "standard") {
        amt = 90;
    } else if (amt.toLowerCase() == "range") {
        amt = 100;
    } else if (amt.toLowerCase() == "storage") {
        amt = 50;
    }

    tjs.setChargeLimit(options, amt, function (err, result) {
        if (result.result) {
            var str = (amt + "%").green;
            console.log("\nCharge limit successfully set to: " + str);
        } else {
            console.log(result.reason);
        }
    });
}

