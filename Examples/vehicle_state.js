//
//
//
var tms = require('../TeslaJS');

//
//
//
function login_cb(result) {
    console.log("Login Successfull.");
    console.log("OAuth token is: " + JSON.stringify(result.authToken));

    if (result.error)
        console.log(JSON.stringify(result.error));
    else
        vehicleState(result.authToken);
}

//
//
//
function vehicleState(token) {
    var options = { authToken: token, carIndex: 0 };

    tms.vehicles(options, function (vehicle) {
        console.log("Vehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state);
    });
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.login(options.email, options.password, login_cb);
