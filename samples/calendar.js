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
  .option('-n, --name [string]', 'phone name')
  .option('-U, --uri [string]', 'URI of test server (e.g. http://127.0.0.1:3000)')
  .parse(process.argv);

//
var sample = new framework.SampleFramework(program, sampleMain);
sample.run();

//
//
//
function sampleMain(tjs, options) {
    var entry = tjs.makeCalendarEntry(
        "Event name",
        "Home",
        new Date(2016, 4, 5, 12, 0).getTime(),
        new Date(2016, 4, 5, 1, 0).getTime(),
        "you@gmail.com",
        "Phone Bluetooth name"
        );

    console.log(JSON.stringify(entry));

    tjs.calendar(options, entry, function (err, result) {
        if (result.result) {
            console.log("\nCalendar updated! ".bold.green);
        } else {
            console.log(result.reason.red);
        }
    });
}
