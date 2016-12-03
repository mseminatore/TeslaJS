var assert = require('assert');
var tjs = require('../TeslaJS');

/*
var sepia = require('sepia');

sepia.configure({
    verbose: false,
    touchHits: true
});
*/

// set these in your environment before testing
var user = process.env.TESLAJS_USER;
var pass = process.env.TESLAJS_PASS;

process.env.TESLAJS_SERVER || process.exit(1);

describe('TeslaJS', function () {
    var options = {authToken: "abc123"};
    this.timeout(5000);

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
/*
		it('should fail with invalid pwd', function(done) {
			tjs.login(user, 'badpassword', function(result) {
				if (result.response.statusCode == 200) {
					done(result.response.statusMessage);
				} else {
					done();
				}
			});
		});
*/
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

	describe('#climateState()', function () {
	    it('should return climate state', function (done) {
	        tjs.climateState(options, function (result) {
	            if (result.inside_temp) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#driveState()', function () {
	    it('should return drive state', function (done) {
	        tjs.driveState(options, function (result) {
	            if (result.heading) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#chargeState()', function () {
	    it('should return charge state', function (done) {
	        tjs.chargeState(options, function (result) {
	            if (result.est_battery_range) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#guiSettings()', function () {
	    it('should return gui settings', function (done) {
	        tjs.guiSettings(options, function (result) {
	            if (result.gui_distance_units) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#mobileEnabled()', function () {
	    it('should return mobile enabled', function (done) {
	        tjs.mobileEnabled(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#honkHorn()', function () {
	    it('should return true', function (done) {
	        tjs.honkHorn(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#flashLights()', function () {
	    it('should return true', function (done) {
	        tjs.flashLights(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#startCharge()', function () {
	    it('should return true', function (done) {
	        tjs.startCharge(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#stopCharge()', function () {
	    it('should return true', function (done) {
	        tjs.stopCharge(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#openChargePort()', function () {
	    it('should return true', function (done) {
	        tjs.openChargePort(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

/*
	describe('#closeChargePort()', function () {
	    it('should return true', function (done) {
	        tjs.closeChargePort(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});
*/
	describe('#setChargeLimit()', function () {
	    it('CHARGE_STORAGE should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_STORAGE, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_DAILY should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_DAILY, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_STANDARD should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_STANDARD, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_RANGE should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_RANGE, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#chargeMaxRange()', function () {
	    it('should return true', function (done) {
	        tjs.chargeMaxRange(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#chargeStandard()', function () {
	    it('should return true', function (done) {
	        tjs.chargeStandard(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#doorUnlock()', function () {
	    it('should return true', function (done) {
	        tjs.doorUnlock(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#doorLock()', function () {
	    it('should return true', function (done) {
	        tjs.doorLock(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#wakeUp()', function () {
	    it('should return true', function (done) {
	        tjs.wakeUp(options, function (result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});
});
