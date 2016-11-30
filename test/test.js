var assert = require('assert');
var tjs = require('../TeslaJS');

// set these in your environment before testing
var user = process.env.TESLAJS_USER;
var pass = process.env.TESLAJS_PASS;

process.env.TESLAJS_SERVER || process.exit(1);

describe('TeslaJS', function () {
    var options = {authToken: "abc123"};
    this.timeout(3000);

	describe('#login()', function() {
		it('should succeed with valid user and pwd', function(done) {
			tjs.login(user, pass, function(result) {
				if (result.response.statusCode == 200) {
				    options.authToken = result.authToken;
                    done();
				} else {
				    done(result.response.statusMessage);
				}
			});
		});
//		it('should fail with invalid pwd', function(done) {
//			tjs.login(user, 'badpassword', function(result) {
//				if (result.response.statusCode == 200) {
//					done(result.response.statusMessage);
//				} else {
//					done();
//				}
//			});
	    //		});
	});

	describe('#vehicles()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.vehicles(options, function (result) {
	            if (result.vehicle_id) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#vehicleState()', function () {
	    it('should return vehicle state', function (done) {
	        tjs.vehicleState(options, function (result) {
	            if (result.car_version) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});
});
