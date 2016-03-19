//
//
//
var tms = require('../TeslaJS');
var fs = require('fs');

//
//
//
function login_cb(result) {
    if (result.error) {
        console.log(JSON.stringify(result.error));
        process.exit(1);
    }

    var token = JSON.stringify(result.authToken);

    console.log("Login Successfull.");
    console.log("OAuth token is: " + token);

    fs.writeFileSync('.token', token, 'utf8');
    console.log('Auth token saved!');
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.login(options.email, options.password, login_cb);
