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
  .usage('[options] percentage|open|close|vent|comfort')
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

    if (amt.toLowerCase() == "open") {
        amt = 100;
    } else if (amt.toLowerCase() == "close") {
        amt = 0;
    } else if (amt.toLowerCase() == "vent") {
        amt = 15;
    } else if (amt.toLowerCase() == "comfort") {
        amt = 80;
    }

    tjs.sunRoofMove(options, amt, function (err, result) {
        if (result.result) {
            var str = (amt + "%").green;
            console.log("\nSunroof successfully moved to : " + str);
        } else {
            console.log(result.reason.red);
        }
    });
}
