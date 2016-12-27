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
  .usage('[options] username')
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
    var streamingOptions = {
        username: program.args[0],
        password: options.tokens[0],
        vehicle_id: options.vehicle_id
    };

    console.log("\nNote: " + "Inactive vehicle streaming responses can take up to several minutes.".green);
    console.log("\nStreaming starting...".cyan);

    console.log("Columns: timestamp," + tjs.streamingColumns.toString());

    tjs.startStreaming(streamingOptions, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }

        // display the streaming results
        console.log(body);

        console.log("...Streaming ended.".cyan);
    });
}
