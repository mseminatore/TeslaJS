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
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.login(options.email, options.password, login_cb);
