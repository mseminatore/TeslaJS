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

var tjs = require('../teslajs');
var fs = require('fs');
require('colors');
var program = require('commander');

program
  .usage('[options] username password [MFA code] [MFA device name]')
  .option('-U, --uri [string]', 'URI of test server (e.g. http://127.0.0.1:3000)')
  .parse(process.argv);

if (program.args.length < 2) {
    program.help();
}

var username = program.args[0];
var password = program.args[1];
var mfaPassCode = program.args[2];
var mfaDeviceName = program.args[3];

if (program.uri) {
    console.log("Setting portal URI to: " + program.uri);
    tjs.setPortalBaseURI(program.uri);
}

tjs.loginAsync({
    username: username,
    password: password,
    mfaPassCode: mfaPassCode,
    mfaDeviceName: mfaDeviceName
}).done(
    // success!
    function (result) {
        if (!result.authToken) {
            console.error("Login failed!".red);
            process.exit(1);
        }

        var token = JSON.stringify(result.body);

        if (token) {
            console.log("Login " + "Successfull.".green);
            //    console.log("OAuth token is: " + token.green);

            fs.writeFileSync('.token', token, 'utf8');
            console.log('Auth token saved!');
        }
    },
    // failure!
    function (error) {
        console.error(error);
    }
);
