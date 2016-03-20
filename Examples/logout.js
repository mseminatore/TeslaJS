//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tms = require('../TeslaJS');
var fs = require('fs');

//
//
//
function usage() {
    console.log("\nUsage: node logout <email> <password>\n");
}

// attempt to delete the locally cached Auth token
try {
    fs.unlinkSync('.token');
    console.log("Token file successfully deleted.");
} catch (e) {
}

// no parameters found, expect username and password on command line
if (process.argv.length < 3) {
    usage();
    process.exit(1);
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.logout(options);