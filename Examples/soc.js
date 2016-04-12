//=====================================================================
// This sample demonstrates using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tjs = require('../TeslaJS');
var fs = require('fs');
var colors = require('colors');
var program = require('commander');

//
//
//
program
  .option('-u, --username [string]', 'username (needed only if token not cached)')
  .option('-p, --password [string]', 'password (needed only if token not cached)')
  .option('-i, --index <n>', 'vehicle index (first car by default)', parseInt)
  .option('-U, --uri [string]', 'URI of test server')
  .parse(process.argv);

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!".red);
        console.warn(JSON.stringify(result.error));
        return;
    }

    var options = { authToken: result.authToken, carIndex: program.index || 0 };
    tjs.vehicles(options, function (vehicle) {
        console.log("\nVehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state.toUpperCase().bold.green);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tjs.chargeState(options, function (chargeState) {

        var str = chargeState.charge_port_door_open == true ? "OPEN" : "CLOSED";
        console.log("\nCharge port: " + str.green);

        if (chargeState.charging_state == "Charging") {
            console.log("Charging state: " + "Charging".green);

            var hours = Math.floor(chargeState.time_to_full_charge);
            var mins = Math.round((chargeState.time_to_full_charge - hours) * 60);
            console.log("Time remaining: " + hours.toString().green + ":" + mins.toString().green);

            var mph = chargeState.charge_rate;

            console.log(mph + " mi/hr " + chargeState.charger_voltage + "V / " + chargeState.charger_actual_current + "A");

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
        console.log("\nIdeal range: " + Math.round(chargeState.ideal_battery_range).toString().green + ' miles');
        console.log("Rated range: " + Math.round(chargeState.battery_range).toString().green + ' miles');
        console.log("Projected range: " + Math.round(chargeState.est_battery_range).toString().green + ' miles');
    });
}

//
// Sample starts here
//
var tokenFound = false;

try {
    tokenFound = fs.statSync('.token').isFile();
} catch (e) {
}

if (program.uri) {
    console.log("Setting portal URI to: " + program.uri);
    tjs.setPortalBaseURI(program.uri);
}

if (tokenFound) {
    var token = JSON.parse(fs.readFileSync('.token', 'utf8'));
    login_cb({ error: false, authToken: token });
} else {
    var username = program.username;
    var password = program.password;

    if (!username || !password)
        program.help();

    tjs.login(username, password, login_cb);
}
