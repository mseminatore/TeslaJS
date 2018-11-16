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
  .option('-U, --uri [string]', 'URI of test server (e.g. http://127.0.0.1:3000)')
  .parse(process.argv);

//
var sample = new framework.SampleFramework(program, sampleMain);
sample.run();

//
//
//
function addCommas(str)
{
	str += '';
	var x = str.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}

	return x1 + x2;
}

//
//
//
function sampleMain(tjs, options) {
    tjs.vehicleState(options, function (err, vehicle_state) {
        console.log("\nOdometer");
		console.log("--------");
		
		var miles = addCommas(Math.round(vehicle_state.odometer).toString());
		console.log(miles.green + " miles");
		
		var km = addCommas(Math.round(vehicle_state.odometer * 1.61).toString());
		console.log(km.green + " KM");
    });
}
