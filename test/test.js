var assert = require('assert');
var tjs = require('../TeslaJS');
require('sepia');

// be sure to set these to fake values in your environment before testing
var user = process.env.TESLAJS_USER || "elon@tesla.com";
var pass = process.env.TESLAJS_PASS || "password";

// Explicitly required to avoid accidentally hammering the Tesla production servers
process.env.TESLAJS_SERVER || failure("Missing TESLAJS_SERVER defn!\n");

function failure(msg) {
    console.log("Error: " + msg);
    process.exit(1);
}

describe('TeslaJS', function () {
    var options = {authToken: "abc123", vehicleID: "1234"};
    this.timeout(5000);

    describe('#getPortalBaseURI()', function () {
        it('should return current portal URI', function () {
            assert.equal(process.env.TESLAJS_SERVER, tjs.getPortalBaseURI());
        });
    });

    describe('#setPortalBaseURI()', function () {
        it('should reset to default portal value on empty parameter', function () {
            tjs.setPortalBaseURI();
            assert.equal(tjs.portal, tjs.getPortalBaseURI());
        });

        it('should change to value passed', function () {
            tjs.setPortalBaseURI(process.env.TESLAJS_SERVER);
            assert.equal(process.env.TESLAJS_SERVER, tjs.getPortalBaseURI());
        });
    });

    describe('#getLogLevel()', function () {
        it('should return default value', function () {
            assert.equal(process.env.TESLAJS_LOG || 0, tjs.getLogLevel());
        });
    });

    describe('#setLogLevel()', function () {
        it('should change the logging level to 255', function () {
            tjs.setLogLevel(255);
            assert.equal(255, tjs.getLogLevel());
        });
        it('should change the logging level to default value', function () {
            tjs.setLogLevel(process.env.TESLAJS_LOG || 0);
            assert.equal(process.env.TESLAJS_LOG || 0, tjs.getLogLevel());
        });
    });

	describe('#login()', function() {
	    it('should succeed with valid user and pwd', function (done) {
			tjs.login(user, pass, function(err, result) {
				if (result.response.statusCode == 200) {
				    options.authToken = result.authToken;
                    done();
				} else {
				    done(result.response.statusMessage);
				}
			});
		});

	    it('should succeed with valid user and pwd and no callback', function (done) {
	        tjs.login(user, pass);
	        done();
	    });
	});

	describe('#loginAsync()', function () {
	    it('should succeed with valid user and pwd', function () {
	        return tjs.loginAsync(user, pass).then(function (result) {
	            assert.equal(result.response.statusCode, 200);
	        });
	    });
	});

	describe('#logout()', function () {
	    it('should return not implemented', function (done) {
	        tjs.logout("token", function (err, result) {
	            assert.equal("Not implemented!", result.response);
	            done();
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.logout("token");
	        done();
	    });
	});

	describe('#logoutAsync()', function () {
	    it('should return not implemented', function () {
	        return tjs.logoutAsync("token").then(function (result) {
	            assert.equal("Not implemented!", result.response);
	        });
	    });
	});

	describe('#vehicles()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.vehicles(options, function (err, result) {
	            if (result.vehicle_id) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicles(options);
	        done();
	    });
	});

	describe('#vehiclesAsync()', function () {
	    it('should succeed enumerating vehicles', function () {
	        return tjs.vehiclesAsync(options).then(function (result) {
	            assert(result.vehicle_id);
	        });
	    });
	});

	describe('#vehicleState()', function () {
	    it('should return vehicle state', function (done) {
	        tjs.vehicleState(options, function (err, result) {
	            if (result.car_version) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicleState(options);
	        done();
	    });
	});

	describe('#climateState()', function () {
	    it('should return climate state', function (done) {
	        tjs.climateState(options, function (err, result) {
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
	        tjs.driveState(options, function (err, result) {
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
	        tjs.chargeState(options, function (err, result) {
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
	        tjs.guiSettings(options, function (err, result) {
	            if (result.gui_distance_units) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });
	});

	describe('#mobileEnabled()', function () {
	    it('should return true', function (done) {
	        tjs.mobileEnabled(options, function (err, result) {
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
	        tjs.honkHorn(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.honkHorn(options);
	        done();
	    });
	});

	describe('#flashLights()', function () {
	    it('should return true', function (done) {
	        tjs.flashLights(options, function (err, result) {
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
	        tjs.startCharge(options, function (err, result) {
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
	        tjs.stopCharge(options, function (err, result) {
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
	        tjs.openChargePort(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#closeChargePort()', function () {
	    it('should return true', function (done) {
	        tjs.closeChargePort(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#setChargeLimit()', function () {
	    it('CHARGE_STORAGE should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_STORAGE, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_DAILY should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_DAILY, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_STANDARD should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_STANDARD, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_RANGE should return true', function (done) {
	        tjs.setChargeLimit(options, tjs.CHARGE_RANGE, function (err, result) {
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
	        tjs.chargeMaxRange(options, function (err, result) {
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
	        tjs.chargeStandard(options, function (err, result) {
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
	        tjs.doorUnlock(options, function (err, result) {
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
	        tjs.doorLock(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#climateStart()', function () {
	    it('should return true', function (done) {
	        tjs.climateStart(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});
    
	describe('#climateStop()', function () {
	    it('should return true', function (done) {
	        tjs.climateStop(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#sunRoofControl()', function () {
	    it('SUNROOF_VENT should return true', function (done) {
	        tjs.sunRoofControl(options, tjs.SUNROOF_VENT, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_COMFORT should return true', function (done) {
	        tjs.sunRoofControl(options, tjs.SUNROOF_COMFORT, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_OPEN should return true', function (done) {
	        tjs.sunRoofControl(options, tjs.SUNROOF_OPEN, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_CLOSED should return true', function (done) {
	        tjs.sunRoofControl(options, tjs.SUNROOF_CLOSED, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#sunRoofMove()', function () {
	    it('move to 50% should return true', function (done) {
	        tjs.sunRoofMove(options, 50, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('move to 100% should return true', function (done) {
	        tjs.sunRoofMove(options, 100, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('move to 0% should return true', function (done) {
	        tjs.sunRoofMove(options, 0, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#setTemps()', function () {
	    it('should return true setting both driver and passenger', function (done) {
	        tjs.setTemps(options, 19, 21, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('should return true setting just driver', function (done) {
	        tjs.setTemps(options, 19, undefined, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#remoteStart()', function () {
	    it('should return true', function (done) {
	        tjs.remoteStart(options, "password", function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#openTrunk()', function () {
	    it('Frunk should return true', function (done) {
	        tjs.openTrunk(options, tjs.FRUNK, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('Trunk should return true', function (done) {
	        tjs.openTrunk(options, tjs.TRUNK, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#setValetMode()', function () {
	    it('ON should return true', function (done) {
	        tjs.setValetMode(options, true, '1234', function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('OFF should return true', function (done) {
	        tjs.setValetMode(options, false, '1234', function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#resetValetPin()', function () {
	    it('should return true', function (done) {
	        tjs.resetValetPin(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});
	
	describe('#makeCalendarEntry()', function () {
	    it('should return calendar entry', function () {
	        var entry = tjs.makeCalendarEntry("Event", "location", null, null, "accountName", "phoneName");
	        assert(entry);
	    });
	});

	describe('#homelink()', function () {
	    it('should return true', function (done) {
	        tjs.homelink(options, 75, 34, "token", function (err, result) {
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
	        tjs.wakeUp(options, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});
});
