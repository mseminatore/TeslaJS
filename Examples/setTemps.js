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
  .usage('[options] temperature')
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
function f2c(degf) {
    return (degf - 32) * 5 / 9;
}

//
//
//
function sampleMain(tjs, options) {
    var temp = program.args[0];

    tjs.setTemps(options, f2c(temp), null, function (err, result) {
        if (result.result) {
            var str = (temp + " Deg.F").green;
            console.log("\nTemperature successfully set to: " + str);
        } else {
            console.log(result.reason.red);
        }
    });
}
