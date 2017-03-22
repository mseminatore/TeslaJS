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

var tjs = require('../TeslaJS');
var fs = require('fs');

//
//
//
var tokenFound = false;

try {
    tokenFound = fs.statSync('.token').isFile();
} catch (e) {
}

if (tokenFound) {
    var token = JSON.parse(fs.readFileSync('.token', 'utf8'));

    // attempt to delete the locally cached Auth token
    try {
        fs.unlinkSync('.token');
        console.log("Token file successfully deleted.");
    } catch (e) {
    }

    tjs.logout(token, function (err, result) {
        console.log(result);
    });
}

