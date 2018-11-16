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
    .usage('[options] [toggle | next | prev | next_fav | prev_fav | up | down]')
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
function cb(err, result) {
    if (err) {
        console.error("\nCommand: " + "Failed!".red);
    } else {
        if (result.result) {
            console.log("\nCommand: " + "Succeeded".green);
        } else {
            console.log("\nCommand: " + "Failed!".red);
            console.log("Reason: " + result.reason.red);
        }
    }
}

//
//
//
function sampleMain(tjs, options) {
    var cmd = program.args[0];

    if (!cmd) {
        console.log("\n");
        program.help();
    }
    
    switch(cmd) {
        case "toggle":
            tjs.mediaTogglePlayback(options, cb);
            break;

        case "next":
            tjs.mediaPlayNext(options, cb);
            break;

        case "prev":
            tjs.mediaPlayPrevious(options, cb);
            break;

        case "next_fav":
            tjs.mediaPlayNextFavorite(options, cb);
            break;

        case "prev_fav":
            tjs.mediaPlayPreviousFavorite(options, cb);
            break;
    
        case "up":
            tjs.mediaVolumeUp(options, cb);
            break;

        case "down":
            tjs.mediaVolumeDown(options, cb);
            break;

        default:
            console.error("\nUnrecognized command [" + cmd.yellow + "]: " + "Failed!".red);

    }
}
