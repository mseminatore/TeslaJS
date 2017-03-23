var assert = require('assert');
var tjs = require('../TeslaJS');
require('sepia');

// be sure to set these to fake values in your environment before testing
var user = process.env.TESLAJS_USER || "elon@tesla.com";
var pass = process.env.TESLAJS_PASS || "password";

// Explicitly required to avoid accidentally hammering the Tesla production servers
process.env.TESLAJS_SERVER || failure("Missing TESLAJS_SERVER defn!\n");
process.env.TESLAJS_STREAMING || failure("Missing TESLAJS_STREAMING defn!\n");

function failure(msg) {
    console.log("Error: " + msg);
    process.exit(1);
}

describe('TeslaJS', function () {
	var options = {authToken: "abc123", vehicleID: "1234", vehicle_id: "1", token: "1", username: user, password: pass};
    this.timeout(7500);

    describe('#getStreamingBaseURI()', function () {
        it('should return current streaming URI', function () {
            assert.equal(process.env.TESLAJS_STREAMING, tjs.getStreamingBaseURI());
        });
    });

    describe('#setStreamingBaseURI()', function () {
        it('should reset to default portal value on empty parameter', function () {
            tjs.setStreamingBaseURI();
            assert.equal(tjs.streamingPortal, tjs.getStreamingBaseURI());
        });

        it('should change to value passed', function () {
            tjs.setStreamingBaseURI(process.env.TESLAJS_STREAMING);
            assert.equal(process.env.TESLAJS_STREAMING, tjs.getStreamingBaseURI());
        });
    });

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

    describe('#getModel()', function () {
        it('should return Model S', function () {
            assert.equal('Model S', tjs.getModel({"option_codes": ""}));
        });
        it('should return Model X', function () {
            assert.equal('Model X', tjs.getModel({"option_codes": "MDLX"}));
        });
    });

    describe('#getPaintColor()', function () {
        it('should return white', function () {
            assert.equal('white', tjs.getPaintColor({"option_codes": "PBCW"}));
        });
        it('should return black', function () {
            assert.equal('black', tjs.getPaintColor({"option_codes": "PBSB"}));
        });
        it('should return metallic brown', function () {
            assert.equal('metallic brown', tjs.getPaintColor({"option_codes": "PMAB"}));
        });
        it('should return metallic black', function () {
            assert.equal('metallic black', tjs.getPaintColor({"option_codes": "PMBL"}));
        });
        it('should return metallic blue', function () {
            assert.equal('metallic blue', tjs.getPaintColor({"option_codes": "PMMB"}));
        });
        it('should return multi-coat red', function () {
            assert.equal('multi-coat red', tjs.getPaintColor({"option_codes": "PMMR"}));
        });
        it('should return multi-coat red', function () {
            assert.equal('multi-coat red', tjs.getPaintColor({"option_codes": "PPMR"}));
        });
        it('should return steel grey', function () {
            assert.equal('steel grey', tjs.getPaintColor({"option_codes": "PMNG"}));
        });
        it('should return metallic green', function () {
            assert.equal('metallic green', tjs.getPaintColor({"option_codes": "PMSG"}));
        });
        it('should return metallic silver', function () {
            assert.equal('metallic silver', tjs.getPaintColor({"option_codes": "PMSS"}));
        });
        it('should return ocean blue', function () {
            assert.equal('ocean blue', tjs.getPaintColor({"option_codes": "PPSB"}));
        });
        it('should return signature red', function () {
            assert.equal('signature red', tjs.getPaintColor({"option_codes": "PPSR"}));
        });
        it('should return pearl white', function () {
            assert.equal('pearl white', tjs.getPaintColor({"option_codes": "PPSW"}));
        });
        it('should return titanium', function () {
            assert.equal('titanium', tjs.getPaintColor({"option_codes": "PPTI"}));
        });
        it('should return metallic grey', function () {
            assert.equal('metallic grey', tjs.getPaintColor({"option_codes": "PMTG"}));
        });
        it('should return black', function () {
            assert.equal('black', tjs.getPaintColor({"option_codes": "PPPP"}));
        });
    });

    describe('#getVin()', function () {
        it('should return the VIN', function () {
            assert.equal("5YJSA1H16EFP12345", tjs.getVin({"vin": "5YJSA1H16EFP12345"}));
        });
        
		it('should throw with no input', function () {
            assert.throws( function() {
				tjs.getVin();
			});
        });
        
		it('should throw with no vin', function () {
            assert.throws( function() {
				tjs.getVin( {} );
			});
        });
    });

    describe('#getShortVin()', function () {
        it('should return the short VIN', function () {
            assert.equal("P12345", tjs.getShortVin({"vin": "5YJSA1H16EFP12345"}));
        });
        
		it('should throw with no input', function () {
            assert.throws( function() {
				tjs.getShortVin();
			});
        });
        
		it('should throw with no vin', function () {
            assert.throws( function() {
				tjs.getShortVin( {} );
			});
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

	    it('should fail with invalid user or pwd', function (done) {
	        tjs.login(null, null, function(err, result){
				if (err) {
			        done();
				} else {
					done(result);
				}
			});
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
	    it('should succeed', function (done) {
	        tjs.logout("token", function (err, result) {
				if (result.response.statusCode == 200) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.logout("token");
	        done();
	    });
	});

	describe('#logoutAsync()', function () {
	    it('should succeed', function () {
	        return tjs.logoutAsync("token").then(function (result) {
				assert(result.response.statusCode, 200);
			});
	    });
	});

	describe('#vehicle()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.vehicle(options, function (err, vehicle) {
	            if (vehicle.vehicle_id) {
	                done();
	            } else {
	                done(vehicle.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicle(options);
	        done();
	    });
	});

	describe('#vehicles()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.vehicles(options, function (err, vehicle) {
	            if (vehicle.vehicle_id) {
	                done();
	            } else {
	                done(vehicle.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicles(options);
	        done();
	    });
	});

	describe('#allVehicles()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.allVehicles(options, function (err, vehicles) {
	            if (vehicles[0]) {
	                done();
	            } else {
	                done(vehicles.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.allVehicles(options);
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

	describe('#vehicleStateAsync()', function () {
	    it('should return vehicle state', function () {
	        return tjs.vehicleStateAsync(options).then(function (result) {
	            assert(result.car_version);
	        });
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

	describe('#climateStateAsync()', function () {
	    it('should return climate state', function () {
	        return tjs.climateStateAsync(options).then(function (result) {
	            assert(result.inside_temp);
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

	describe('#driveStateAsync()', function () {
	    it('should return drive state', function () {
	        return tjs.driveStateAsync(options).then(function (result) {
	            assert(result.heading);
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

	describe('#chargeStateAsync()', function () {
	    it('should return charge state', function () {
	        return tjs.chargeStateAsync(options).then(function (result) {
	            assert(result.est_battery_range);
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

	describe('#guiSettingsAsync()', function () {
	    it('should return gui settings', function () {
	        return tjs.guiSettingsAsync(options).then(function (result) {
	            assert(result.gui_distance_units);
	        });
	    });
	});

	describe('#mobileEnabled()', function () {
	    it('should return true', function (done) {
	        tjs.mobileEnabled(options, function (err, result) {
	            if (result) {
	                done();
	            } else {
	                done(result);
	            }
	        });
	    });
	});

	describe('#mobileEnabledAsync()', function () {
	    it('should return true', function () {
	        return tjs.mobileEnabledAsync(options).then(function (result) {
	            assert(result);
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

	describe('#honkHornAsync()', function () {
	    it('should return true', function () {
	        return tjs.honkHornAsync(options).then(function (result) {
	            assert(result.result);
	        });
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

	describe('#flashLightsAsync()', function () {
	    it('should return true', function () {
	        return tjs.flashLightsAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#startChargeAsync()', function () {
	    it('should return true', function () {
	        return tjs.startChargeAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#stopChargeAsync()', function () {
	    it('should return true', function () {
	        return tjs.stopChargeAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#openChargePortAsync()', function () {
	    it('should return true', function () {
	        return tjs.openChargePortAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#closeChargePortAsync()', function () {
	    it('should return true', function () {
	        return tjs.closeChargePortAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#setChargeLimitAsync()', function () {
	    it('should return true', function () {
	        return tjs.setChargeLimitAsync(options, tjs.CHARGE_STANDARD).then(function (result) {
	            assert(result.result);
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

	describe('#chargeMaxRangeAsync()', function () {
	    it('should return true', function () {
	        return tjs.chargeMaxRangeAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#chargeStandardAsync()', function () {
	    it('should return true', function () {
	        return tjs.chargeStandardAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#doorUnlockAsync()', function () {
	    it('should return true', function () {
	        return tjs.doorUnlockAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#doorLockAsync()', function () {
	    it('should return true', function () {
	        return tjs.doorLockAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#climateStartAsync()', function () {
	    it('should return true', function () {
	        return tjs.climateStartAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#climateStopAsync()', function () {
	    it('should return true', function () {
	        return tjs.climateStopAsync(options).then(function (result) {
	            assert(result.result);
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

	describe('#sunRoofControlAsync()', function () {
	    it('should return true', function () {
	        return tjs.sunRoofControlAsync(options, tjs.SUNROOF_CLOSED).then(function (result) {
	            assert(result.result);
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

	describe('#sunRoofMoveAsync()', function () {
	    it('should return true', function () {
	        return tjs.sunRoofMoveAsync(options, 0).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#setTemps()', function () {
	    it('should return true setting both driver and passenger', function (done) {
	        tjs.setTemps(options, 0, 100, function (err, result) {
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

	describe('#setTempsAsync()', function () {
	    it('should return true', function () {
	        return tjs.setTempsAsync(options, 19, 21).then(function (result) {
	            assert(result.result);
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

	describe('#remoteStartAsync()', function () {
	    it('should return true', function () {
	        return tjs.remoteStartAsync(options, "password").then(function (result) {
	            assert(result.result);
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

	describe('#openTrunkAsync()', function () {
	    it('should return true', function () {
	        return tjs.openTrunkAsync(options, tjs.FRUNK).then(function (result) {
	            assert(result.result);
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

	describe('#setValetModeAsync()', function () {
	    it('should return true', function () {
	        return tjs.setValetModeAsync(options, false, '1234').then(function (result) {
	            assert(result.result);
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

	describe('#resetValetPinAsync()', function () {
	    it('should return true', function () {
	        return tjs.resetValetPinAsync(options).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#makeCalendarEntry()', function () {
	    it('should return calendar entry', function () {
	        var entry = tjs.makeCalendarEntry("Event", "location", null, null, "accountName", "phoneName");
	        assert(entry);
	    });
	});

	describe('#calendar()', function () {
	    it('should return true', function (done) {
	        tjs.calendar(options, tjs.makeCalendarEntry("Event", "location", null, null, "accountName", "phoneName"), function(err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
			});
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

	describe('#homelinkAsync()', function () {
	    it('should return true', function () {
	        return tjs.homelinkAsync(options, 75, 34, "token").then(function (result) {
	            assert(result.result);
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

	describe('#wakeUpAsync()', function () {
	    it('should return true', function () {
	        return tjs.wakeUpAsync(options).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#get_command(err_get)', function () {
	    it('should fail', function (done) {
	        tjs.get_command(options, "data_request/err_get", function (err, result) {
	            if (err) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#post_command(err_post)', function () {
	    it('should fail', function (done) {
	        tjs.post_command(options, "command/err_post", null, function (err, result) {
	            if (err) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	describe('#startStreaming()', function () {
	    it('should succeed', function (done) {
	        tjs.startStreaming(options, function (err, response, body) {
	            if (response) {
	                done();
	            } else {
	                done(err);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.startStreaming(options);
			done();
	    });
	});
});
