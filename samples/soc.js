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

function milesToKms(miles){
    return miles * 1.609344;
}

//
//
//
function sampleMain(tjs, options) {
    tjs.vehicleDataAsync(options, null, null).then( function(vehicleData) {        
        // get the charge state info from the vehicle data
        var chargeState = vehicleData.charge_state;
        
        var eu_vehicle = vehicleData.vehicle_config.eu_vehicle;
        var unitsInKms = vehicleData.gui_settings.gui_distance_units === "km/hr";

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

        console.log("\nCurrent charge level: " + chargeState.battery_level.toString().green + ' %'.green);
        console.log("Target charge level: " + chargeState.charge_limit_soc.toString().green + ' %'.green);
        
        console.log("\nRated range: " + (unitsInKms ? Math.round(milesToKms(chargeState.battery_range)).toString().green + ' km' : Math.round(chargeState.battery_range).toString().green + ' mi'));
        console.log((eu_vehicle?"Typical":"Ideal")+" range: " + (unitsInKms ? Math.round(milesToKms(chargeState.ideal_battery_range)).toString().green + ' km' : Math.round(chargeState.ideal_battery_range).toString().green + ' mi'));
        console.log("Projected range: " + (unitsInKms ? Math.round(milesToKms(chargeState.est_battery_range)).toString().green + ' km' : Math.round(chargeState.est_battery_range).toString().green + ' mi'));

        //console.log("\nRated - how far "+(eu_vehicle?"NEDC":"the EPA") + " says the car will go given their tests.");
        //console.log((eu_vehicle?"Typical":"Ideal")+" - how far the car will go if driven at a steady " + (unitsInKms? "88 km/h":"55 mph") + " on level ground at moderate temperatures.");
        //console.log("Projected - how far the car calculates you will go if you keep consuming power at the rate you are currently\n");
    });
}
