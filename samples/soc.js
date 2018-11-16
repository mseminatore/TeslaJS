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
  .option('-U, --uri [string]', 'URI of test server (e.g. http://127.0.0.1:3000)')
  .parse(process.argv);

//
var sample = new framework.SampleFramework(program, sampleMain);
sample.run();

//
//
//
function sampleMain(tjs, options) {
    tjs.vehicleData(options, function (err, vehicleData) {
        if (err) {
            console.log(err);
            return;
        }

        // get the charge state info from the vehicle data
        var chargeState = vehicleData.charge_state;

        var str = chargeState.charge_port_door_open === true ? "OPEN" : "CLOSED";
        console.log("\nCharge port: " + str.green);

        if (chargeState.charging_state == "Charging") {
            console.log("Charging state: " + "Charging".green);

            var hours = Math.floor(chargeState.time_to_full_charge);
            var mins = Math.round((chargeState.time_to_full_charge - hours) * 60);

            str = ""
            if (hours > 0) {
                str = hours.toString().green + " hours ";
            }

            console.log("Time remaining: " + str + mins.toString().green + " minutes");

            var mph = chargeState.charge_rate;

            console.log("Charge Rate: " + mph.toString().green + " mi/hr ");
            console.log("Power: " + chargeState.charger_voltage.toString().green + " V / " + chargeState.charger_actual_current.toString().green + " A");

        } else if (chargeState.charging_state == "Disconnected") {
            console.log("Charging State: " + "Unplugged".bold.red);
        } else {
            console.log("Charging State: " + "Plugged In".green);
        }

        if (chargeState.scheduled_charging_pending) {
            var scheduledChargeTime = new Date(chargeState.scheduled_charging_start_time * 1000);
            console.log("Charge scheduled for " + scheduledChargeTime.toLocaleTimeString().toString().green);
        }

        console.log("\nCurrent charge level: " + chargeState.battery_level.toString().green + '%'.green);
        console.log("Target charge level: " + chargeState.charge_limit_soc.toString().green + '%'.green);
        console.log("\nRated range: " + Math.round(chargeState.battery_range).toString().green + ' miles');
        console.log("Projected range: " + Math.round(chargeState.est_battery_range).toString().green + ' miles');
        console.log("Ideal range: " + Math.round(chargeState.ideal_battery_range).toString().green + ' miles');
    });
}
