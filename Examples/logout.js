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

// attempt to delete the locally cached Auth token
try {
    fs.unlinkSync('.token');
    console.log("Token file successfully deleted.");
} catch (e) {
}

tms.logout();