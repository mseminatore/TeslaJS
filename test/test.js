"use strict";

var assert = require('assert');
var tjs = require('../teslajs');
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
	var options = {authToken: "abc123", vehicleID: "1234567890", vehicle_id: "1", token: "1", username: user, password: pass};
    this.timeout(7500);

    describe('#getStreamingBaseURI()', function () {
        it('should return current streaming URI', function () {
            assert.strictEqual(process.env.TESLAJS_STREAMING, tjs.getStreamingBaseURI());
        });
    });

    describe('#setStreamingBaseURI()', function () {
        it('should reset to default portal value on empty parameter', function () {
            tjs.setStreamingBaseURI();
            assert.strictEqual(tjs.streamingPortal, tjs.getStreamingBaseURI());
        });

        it('should change to value passed', function () {
            tjs.setStreamingBaseURI(process.env.TESLAJS_STREAMING);
            assert.strictEqual(process.env.TESLAJS_STREAMING, tjs.getStreamingBaseURI());
        });
    });

    describe('#getPortalBaseURI()', function () {
        it('should return current portal URI', function () {
            assert.strictEqual(process.env.TESLAJS_SERVER, tjs.getPortalBaseURI());
        });
    });

    describe('#setPortalBaseURI()', function () {
        it('should reset to default portal value on empty parameter', function () {
            tjs.setPortalBaseURI();
            assert.strictEqual(tjs.portal, tjs.getPortalBaseURI());
        });

        it('should change to value passed', function () {
            tjs.setPortalBaseURI(process.env.TESLAJS_SERVER);
            assert.strictEqual(process.env.TESLAJS_SERVER, tjs.getPortalBaseURI());
        });
    });

    describe('#getLogLevel()', function () {
        it('should return default value', function () {
            assert.strictEqual(process.env.TESLAJS_LOG || 0, tjs.getLogLevel());
        });
    });

    describe('#setLogLevel()', function () {
        it('should change the logging level to 255', function () {
            tjs.setLogLevel(255);
            assert.strictEqual(255, tjs.getLogLevel());
        });
        it('should change the logging level to default value', function () {
            tjs.setLogLevel(process.env.TESLAJS_LOG || 0);
            assert.strictEqual(process.env.TESLAJS_LOG || 0, tjs.getLogLevel());
        });
    });

    describe('#getModel()', function () {
        it('should return Model S', function () {
            assert.strictEqual('Model S', tjs.getModel({"vin": "5YJSA1CP6DFP1"}));
        });
        it('should return Model X', function () {
            assert.strictEqual('Model X', tjs.getModel({"vin": "5YJXA1CP6DFP1"}));
        });
        it('should return Model 3', function () {
            assert.strictEqual('Model 3', tjs.getModel({"vin": "5YJ3A1CP6DFP1"}));
        });
        it('should return Model Y', function () {
            assert.strictEqual('Model Y', tjs.getModel({"vin": "5YJYA1CP6DFP1"}));
        });
        it('should return Roadster', function () {
            assert.strictEqual('Roadster', tjs.getModel({"vin": "5YJRA1CP6DFP1"}));
        });
    });

    describe('#vinDecode()', function () {
        it('should return Model S', function () {
            assert.strictEqual('Model S', tjs.vinDecode({"vin": "5YJSA1CP6DFP1"}).carType);
        });
        it('should return Model X', function () {
            assert.strictEqual('Model X', tjs.vinDecode({"vin": "5YJXA1CP6DFP1"}).carType);
        });
        it('should return Model 3', function () {
            assert.strictEqual('Model 3', tjs.vinDecode({"vin": "5YJ3A1CP6DFP1"}).carType);
        });
        it('should return Model Y', function () {
            assert.strictEqual('Model Y', tjs.vinDecode({"vin": "5YJYA1CP6DFP1"}).carType);
        });
        it('should return Roadster', function () {
            assert.strictEqual('Roadster', tjs.vinDecode({"vin": "5YJRA1CP6DFP1"}).carType);
        });
        it('should return 2013', function () {
            assert.strictEqual(2013, tjs.vinDecode({"vin": "5YJSA1CP6DFP1"}).year);
        });
        it('should return 2017', function () {
            assert.strictEqual(2017, tjs.vinDecode({"vin": "5YJYA1CP6HFP1"}).year);
        });
        it('should return 2018', function () {
            assert.strictEqual(2018, tjs.vinDecode({"vin": "5YJYA1CP6JFP1"}).year);
        });
        it('should return 2020', function () {
            assert.strictEqual(2020, tjs.vinDecode({"vin": "5YJYA1CP6LFP1"}).year);
        });
        it('should return no AWD', function () {
            assert.strictEqual(false, tjs.vinDecode({"vin": "5YJSA1CP6DFP1"}).awd);
        });
        it('should return AWD', function () {
            assert.strictEqual(true, tjs.vinDecode({"vin": "5YJSA1C26DFP1"}).awd);
        });
    });

    describe('#getPaintColor()', function () {
        it('should return white', function () {
            assert.strictEqual('white', tjs.getPaintColor({"option_codes": "PBCW"}));
        });
        it('should return black', function () {
            assert.strictEqual('black', tjs.getPaintColor({"option_codes": "PBSB"}));
        });
        it('should return metallic brown', function () {
            assert.strictEqual('metallic brown', tjs.getPaintColor({"option_codes": "PMAB"}));
        });
        it('should return metallic black', function () {
            assert.strictEqual('metallic black', tjs.getPaintColor({"option_codes": "PMBL"}));
        });
        it('should return metallic blue', function () {
            assert.strictEqual('metallic blue', tjs.getPaintColor({"option_codes": "PMMB"}));
        });
        it('should return multi-coat red', function () {
            assert.strictEqual('multi-coat red', tjs.getPaintColor({"option_codes": "PMMR"}));
        });
        it('should return multi-coat red', function () {
            assert.strictEqual('multi-coat red', tjs.getPaintColor({"option_codes": "PPMR"}));
        });
        it('should return steel grey', function () {
            assert.strictEqual('steel grey', tjs.getPaintColor({"option_codes": "PMNG"}));
        });
        it('should return metallic green', function () {
            assert.strictEqual('metallic green', tjs.getPaintColor({"option_codes": "PMSG"}));
        });
        it('should return metallic silver', function () {
            assert.strictEqual('metallic silver', tjs.getPaintColor({"option_codes": "PMSS"}));
        });
        it('should return ocean blue', function () {
            assert.strictEqual('ocean blue', tjs.getPaintColor({"option_codes": "PPSB"}));
        });
        it('should return signature red', function () {
            assert.strictEqual('signature red', tjs.getPaintColor({"option_codes": "PPSR"}));
        });
        it('should return pearl white', function () {
            assert.strictEqual('pearl white', tjs.getPaintColor({"option_codes": "PPSW"}));
        });
        it('should return titanium', function () {
            assert.strictEqual('titanium', tjs.getPaintColor({"option_codes": "PPTI"}));
        });
        it('should return metallic grey', function () {
            assert.strictEqual('metallic grey', tjs.getPaintColor({"option_codes": "PMTG"}));
        });
        it('should return black', function () {
            assert.strictEqual('black', tjs.getPaintColor({"option_codes": "PPPP"}));
        });
    });

    describe('#getVin()', function () {
        it('should return the VIN', function () {
            assert.strictEqual("5YJSA1H16EFP12345", tjs.getVin({"vin": "5YJSA1H16EFP12345"}));
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
            assert.strictEqual("P12345", tjs.getShortVin({"vin": "5YJSA1H16EFP12345"}));
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

	// describe('#login()', function() {
	//     it('should succeed with valid user and pwd', function (done) {
	// 		tjs.login(user, pass, function(err, result) {
	// 			if (result.response.statusCode == 200) {
	// 			    options.authToken = result.authToken;
    //                 done();
	// 			} else {
	// 			    done(result.response.statusMessage);
	// 			}
	// 		});
	// 	});

	//     it('should succeed with valid user and pwd and no callback', function (done) {
	//         tjs.login(user, pass);
	//         done();
	//     });

	//     it('should fail with invalid user or pwd', function (done) {
	//         tjs.login(null, null, function(err, result){
	// 			if (err) {
	// 		        done();
	// 			} else {
	// 				done(result);
	// 			}
	// 		});
	//     });
	// });

	// describe('#loginAsync()', function () {
	//     it('should succeed with valid user and pwd', function () {
	//         return tjs.loginAsync(user, pass).then(function (result) {
	//             assert.strictEqual(result.response.statusCode, 200);
	//         });
	//     });
	// });

	// describe('#refreshToken()', function() {
	//     it('should succeed with valid refresh token', function (done) {
	// 		tjs.refreshToken("faketoken", function(err, result) {
	// 			if (result.response.statusCode == 200) {
	// 			    options.authToken = result.authToken;
    //                 done();
	// 			} else {
	// 			    done(result.response.statusMessage);
	// 			}
	// 		});
	// 	});

	//     it('should succeed with valid refresh token and no callback', function (done) {
	//         tjs.refreshToken("faketoken");
	//         done();
	//     });

	//     it('should fail with missing refresh token', function (done) {
	//         tjs.refreshToken(null, function(err, result){
	// 			if (err) {
	// 		        done();
	// 			} else {
	// 				done(result);
	// 			}
	// 		});
	//     });
	// });

	// describe('#refreshTokenAsync()', function () {
	//     it('should succeed with valid user and pwd', function () {
	//         return tjs.refreshTokenAsync("faketoken").then(function (result) {
	//             assert.strictEqual(result.response.statusCode, 200);
	//         });
	//     });
	// });

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

	describe('#vehicleData()', function () {
	    it('should succeed returning vehicle data', function (done) {
	        tjs.vehicleData(options, null, function (err, vehicle) {
	            if (vehicle.vehicle_id) {
	                done();
	            } else {
	                done(vehicle.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicleData(options, null, null);
	        done();
	    });
	});

	describe('#vehicleDataAsync()', function () {
	    it('should succeed returning vehicle data', function () {
	        return tjs.vehicleDataAsync(options, null).then(function (result) {
	            assert(result.vehicle_id);
	        });
	    });
	});

	describe('#vehicle()', function () {
	    it('should succeed getting the vehicle', function (done) {
	        tjs.vehicle(options, null, function (err, vehicle) {
	            if (vehicle.vehicle_id) {
	                done();
	            } else {
	                done(vehicle.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicle(options, null);
	        done();
	    });
	});

	describe('#vehicleAsync()', function () {
	    it('should succeed getting the vehicle', function () {
	        return tjs.vehicleAsync(options, null).then(function (result) {
	            assert(result.vehicle_id);
	        });
	    });
	});

  describe('#vehicleById()', function () {
    it('should succeed getting the vehicle', function (done) {
        tjs.vehicleById(options, null, function (err, vehicle) {
            if (vehicle.vehicle_id) {
                done();
            } else {
                done(vehicle.response.statusMessage);
            }
        });
    });

    it('should succeed with no callback', function (done) {
        tjs.vehicleById(options, null);
        done();
    });
});

describe('#vehicleByIdAsync()', function () {
    it('should succeed getting the vehicle', function () {
        return tjs.vehicleByIdAsync(options, null).then(function (result) {
            assert(result.vehicle_id);
        });
    });
});

	describe('#vehicles()', function () {
	    it('should succeed enumerating vehicles', function (done) {
	        tjs.vehicles(options, null, function (err, vehicles) {
	            if (vehicles[0]) {
	                done();
	            } else {
	                done(vehicles.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicles(options, null);
	        done();
	    });
	});

	describe('#vehiclesAsync()', function () {
	    it('should succeed enumerating vehicles', function () {
	        return tjs.vehiclesAsync(options, null).then(function (result) {
	            assert(result[0]);
	        });
	    });
	});

    describe('#vehicleById()', function () {
        it('should succeed getting the vehicle', function (done) {
            tjs.vehicleById(options, null, function (err, vehicle) {
                if (vehicle.vehicle_id) {
                    done();
                } else {
                    done(vehicle.response.statusMessage);
                }
            });
        });

        it('should succeed with no callback', function (done) {
            tjs.vehicleById(options, null);
            done();
        });
    });

    describe('#vehicleByIdAsync()', function () {
        it('should succeed getting the vehicle', function () {
            return tjs.vehicleByIdAsync(options, null).then(function (result) {
                assert(result.vehicle_id);
            });
        });
    });

    describe('#vehicleConfig()', function () {
        it('should return vehicle config', function (done) {
            tjs.vehicleConfig(options, null, function (err, result) {
                if (result.exterior_color) {
                    done();
                } else {
                    done(result.response.statusMessage);
                }
            });
        });

        it('should succeed with no callback', function (done) {
            tjs.vehicleConfig(options, null);
            done();
        });
    });

    describe('#vehicleConfigAsync()', function () {
        it('should return vehicle config', function () {
            return tjs.vehicleConfigAsync(options, null).then(function (result) {
                assert(result.exterior_color);
            });
        });
    });

	describe('#vehicleState()', function () {
	    it('should return vehicle state', function (done) {
	        tjs.vehicleState(options, null, function (err, result) {
	            if (result.car_version) {
	                done();
	            } else {
	                done(result.response.statusMessage);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.vehicleState(options, null);
	        done();
	    });
	});

	describe('#vehicleStateAsync()', function () {
	    it('should return vehicle state', function () {
	        return tjs.vehicleStateAsync(options, null).then(function (result) {
	            assert(result.car_version);
	        });
	    });
	});

	describe('#climateState()', function () {
	    it('should return climate state', function (done) {
	        tjs.climateState(options, null, function (err, result) {
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
	        return tjs.climateStateAsync(options, null).then(function (result) {
	            assert(result.inside_temp);
	        });
	    });
	});

	describe('#driveState()', function () {
	    it('should return drive state', function (done) {
	        tjs.driveState(options, null, function (err, result) {
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
	        return tjs.driveStateAsync(options, null).then(function (result) {
	            assert(result.heading);
	        });
	    });
	});

	describe('#chargeState()', function () {
	    it('should return charge state', function (done) {
	        tjs.chargeState(options, null, function (err, result) {
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
	        return tjs.chargeStateAsync(options, null).then(function (result) {
	            assert(result.est_battery_range);
	        });
	    });
	});

	describe('#guiSettings()', function () {
	    it('should return gui settings', function (done) {
	        tjs.guiSettings(options, null, function (err, result) {
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
	        return tjs.guiSettingsAsync(options, null).then(function (result) {
	            assert(result.gui_distance_units);
	        });
	    });
	});

	describe('#mobileEnabled()', function () {
	    it('should return true', function (done) {
	        tjs.mobileEnabled(options, null, function (err, result) {
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
	        return tjs.mobileEnabledAsync(options, null).then(function (result) {
	            assert(result);
	        });
	    });
	});

	describe('#honkHorn()', function () {
	    it('should return true', function (done) {
	        tjs.honkHorn(options, null, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.honkHorn(options, null);
	        done();
	    });
	});

	describe('#honkHornAsync()', function () {
	    it('should return true', function () {
	        return tjs.honkHornAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#flashLights()', function () {
	    it('should return true', function (done) {
	        tjs.flashLights(options, null, function (err, result) {
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
	        return tjs.flashLightsAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#startCharge()', function () {
	    it('should return true', function (done) {
	        tjs.startCharge(options, null, function (err, result) {
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
	        return tjs.startChargeAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#stopCharge()', function () {
	    it('should return true', function (done) {
	        tjs.stopCharge(options, null, function (err, result) {
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
	        return tjs.stopChargeAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#openChargePort()', function () {
	    it('should return true', function (done) {
	        tjs.openChargePort(options, null, function (err, result) {
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
	        return tjs.openChargePortAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#closeChargePort()', function () {
	    it('should return true', function (done) {
	        tjs.closeChargePort(options, null, function (err, result) {
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
	        return tjs.closeChargePortAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#setChargeLimit()', function () {
	    it('CHARGE_STORAGE should return true', function (done) {
	        tjs.setChargeLimit(options, { amt: tjs.CHARGE_STORAGE }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_DAILY should return true', function (done) {
	        tjs.setChargeLimit(options, { amt: tjs.CHARGE_DAILY }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_STANDARD should return true', function (done) {
	        tjs.setChargeLimit(options, { amt: tjs.CHARGE_STANDARD }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('CHARGE_RANGE should return true', function (done) {
	        tjs.setChargeLimit(options, { amt: tjs.CHARGE_RANGE }, function (err, result) {
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
	        return tjs.setChargeLimitAsync(options, { amt: tjs.CHARGE_STANDARD }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#chargeMaxRange()', function () {
	    it('should return true', function (done) {
	        tjs.chargeMaxRange(options, null, function (err, result) {
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
	        return tjs.chargeMaxRangeAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#chargeStandard()', function () {
	    it('should return true', function (done) {
	        tjs.chargeStandard(options, null, function (err, result) {
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
	        return tjs.chargeStandardAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#doorUnlock()', function () {
	    it('should return true', function (done) {
	        tjs.doorUnlock(options, null, function (err, result) {
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
	        return tjs.doorUnlockAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#doorLock()', function () {
	    it('should return true', function (done) {
	        tjs.doorLock(options, null, function (err, result) {
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
	        return tjs.doorLockAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#climateStart()', function () {
	    it('should return true', function (done) {
	        tjs.climateStart(options, null, function (err, result) {
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
	        return tjs.climateStartAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#climateStop()', function () {
	    it('should return true', function (done) {
	        tjs.climateStop(options, null, function (err, result) {
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
	        return tjs.climateStopAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#sunRoofControl()', function () {
	    it('SUNROOF_VENT should return true', function (done) {
	        tjs.sunRoofControl(options, { state: tjs.SUNROOF_VENT }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_COMFORT should return true', function (done) {
	        tjs.sunRoofControl(options, { state: tjs.SUNROOF_COMFORT }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_OPEN should return true', function (done) {
	        tjs.sunRoofControl(options, { state: tjs.SUNROOF_OPEN }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('SUNROOF_CLOSED should return true', function (done) {
	        tjs.sunRoofControl(options, { state: tjs.SUNROOF_CLOSED }, function (err, result) {
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
	        return tjs.sunRoofControlAsync(options, { state: tjs.SUNROOF_CLOSED }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#sunRoofMove()', function () {
	    it('move to 50% should return true', function (done) {
	        tjs.sunRoofMove(options, { percent: 50 }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('move to 100% should return true', function (done) {
	        tjs.sunRoofMove(options, { percent: 100 }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('move to 0% should return true', function (done) {
	        tjs.sunRoofMove(options, { percent: 0 }, function (err, result) {
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
	        return tjs.sunRoofMoveAsync(options, { percent: 0 }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#setTemps()', function () {
	    it('should return true setting both driver and passenger', function (done) {
	        tjs.setTemps(options, { driver: 0, pass: 100 }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('should return true setting just driver', function (done) {
	        tjs.setTemps(options, { driver: 19 }, function (err, result) {
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
	        return tjs.setTempsAsync(options, { driver: 19, pass: 21 }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#remoteStart()', function () {
	    it('should return true', function (done) {
	        tjs.remoteStart(options, null, function (err, result) {
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
	        return tjs.remoteStartAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#openTrunk()', function () {
	    it('Frunk should return true', function (done) {
	        tjs.openTrunk(options, { which: tjs.FRUNK }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('Trunk should return true', function (done) {
	        tjs.openTrunk(options, { which: tjs.TRUNK }, function (err, result) {
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
	        return tjs.openTrunkAsync(options, { which: tjs.FRUNK }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#setValetMode()', function () {
	    it('ON should return true', function (done) {
	        tjs.setValetMode(options, { onoff: true, pin: '1234' }, function (err, result) {
	            if (result.result) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });

	    it('OFF should return true', function (done) {
	        tjs.setValetMode(options, {onoff: false, pin: '1234' }, function (err, result) {
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
	        return tjs.setValetModeAsync(options, { onoff: false, pin: '1234' }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#resetValetPin()', function () {
	    it('should return true', function (done) {
	        tjs.resetValetPin(options, null, function (err, result) {
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
	        return tjs.resetValetPinAsync(options, null).then(function (result) {
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
	        tjs.calendar(options, { entry: tjs.makeCalendarEntry("Event", "location", null, null, "accountName", "phoneName") }, function(err, result) {
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
	        tjs.homelink(options, { lat: 75, long: 34 }, function (err, result) {
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
	        return tjs.homelinkAsync(options, { lat: 75, long: 34 }).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#wakeUp()', function () {
	    it('should return true', function (done) {
	        tjs.wakeUp(options, null, function (err, result) {
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
	        return tjs.wakeUpAsync(options, null).then(function (result) {
	            assert(result.result);
	        });
	    });
	});

	describe('#get_command(err_get)', function () {
	    it('should fail', function (done) {
	        tjs.get_command(options, "data_request/err_get", null, function (err, result) {
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
	        tjs.post_command(options, "command/err_post", null, null, function (err, result) {
	            if (err) {
	                done();
	            } else {
	                done(result.reason);
	            }
	        });
	    });
	});

	// describe('#startStreaming()', function () {
	//     it('should succeed', function (done) {
	// 		tjs.startStreaming(options, 
	// 			function (err, response, body) {
	// 				if (response) {
	// 					done();
	// 				} else {
	// 					done(err);
	// 				}
	// 			},
	// 			function(data) {
	// 				// do nothing!
	// 			}
	// 		);
	//     });

	//     it('should succeed with no callback', function (done) {
	//         tjs.startStreaming(options);
	// 		done();
	//     });
	// });

	describe('#scheduleSoftwareUpdate()', function () {
	    it('should succeed', function (done) {
	        tjs.scheduleSoftwareUpdate(options, { offset: 0 }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.scheduleSoftwareUpdate(options, { offset: 0 });
	        done();
	    });
	});

	describe('#scheduleSoftwareUpdateAsync()', function () {
	    it('should succeed', function () {
	        return tjs.scheduleSoftwareUpdateAsync(options, { offset: 0 }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#cancelSoftwareUpdate()', function () {
	    it('should succeed', function (done) {
	        tjs.cancelSoftwareUpdate(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.cancelSoftwareUpdate(options, null);
	        done();
	    });
	});

	describe('#cancelSoftwareUpdateAsync()', function () {
	    it('should succeed', function () {
	        return tjs.cancelSoftwareUpdateAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaTogglePlayback()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaTogglePlayback(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaTogglePlayback(options, null);
	        done();
	    });
	});

	describe('#mediaTogglePlaybackAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaTogglePlaybackAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaPlayNext()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaPlayNext(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaPlayNext(options, null);
	        done();
	    });
	});

	describe('#mediaPlayNextAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaPlayNextAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaPlayPrevious()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaPlayPrevious(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaPlayPrevious(options, null);
	        done();
	    });
	});

	describe('#mediaPlayPreviousAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaPlayPreviousAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaPlayNextFavorite()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaPlayNextFavorite(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaPlayNextFavorite(options, null);
	        done();
	    });
	});

	describe('#mediaPlayNextFavoriteAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaPlayNextFavoriteAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaPlayPreviousFavorite()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaPlayPreviousFavorite(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaPlayPreviousFavorite(options), null;
	        done();
	    });
	});

	describe('#mediaPlayPreviousFavoriteAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaPlayPreviousFavoriteAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaVolumeUp()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaVolumeUp(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaVolumeUp(options, null);
	        done();
	    });
	});

	describe('#mediaVolumeUpAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaVolumeUpAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#mediaVolumeDown()', function () {
	    it('should succeed', function (done) {
	        tjs.mediaVolumeDown(options, null, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.mediaVolumeDown(options, null);
	        done();
	    });
	});

	describe('#mediaVolumeDownAsync()', function () {
	    it('should succeed', function () {
	        return tjs.mediaVolumeDownAsync(options, null).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#speedLimitActivate()', function () {
	    it('should succeed', function (done) {
	        tjs.speedLimitActivate(options, { pin: "1234" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.speedLimitActivate(options, { pin: "1234" });
	        done();
	    });
	});

	describe('#speedLimitActivateAsync()', function () {
	    it('should succeed', function () {
	        return tjs.speedLimitActivateAsync(options, { pin: "1234" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#speedLimitDeactivate()', function () {
	    it('should succeed', function (done) {
	        tjs.speedLimitDeactivate(options, { pin: "1234" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.speedLimitDeactivate(options, { pin: "1234" });
	        done();
	    });
	});

	describe('#speedLimitDeactivateAsync()', function () {
	    it('should succeed', function () {
	        return tjs.speedLimitDeactivateAsync(options, { pin: "1234" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#speedLimitClearPin()', function () {
	    it('should succeed', function (done) {
	        tjs.speedLimitClearPin(options, { pin: "1234" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.speedLimitClearPin(options, { pin: "1234" });
	        done();
	    });
	});

	describe('#speedLimitClearPinAsync()', function () {
	    it('should succeed', function () {
	        return tjs.speedLimitClearPinAsync(options, { pin: "1234" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#speedLimitSetLimit()', function () {
	    it('should succeed', function (done) {
	        tjs.speedLimitSetLimit(options, { limit: "80.0" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.speedLimitSetLimit(options, { limit: "80.0" });
	        done();
	    });
	});

	describe('#speedLimitSetLimitAsync()', function () {
	    it('should succeed', function () {
	        return tjs.speedLimitSetLimitAsync(options, { limit: "80.0" }).then(function (result) {
				  assert(result.result, true);
			    });
	    });
	});

	describe('#setSentryMode()', function () {
	    it('should succeed', function (done) {
	        tjs.setSentryMode(options, { onoff: true }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.setSentryMode(options, { onoff: true });
	        done();
	    });
	});

	describe('#setSentryModeAsync()', function () {
	    it('should succeed', function () {
	        return tjs.setSentryModeAsync(options, { onoff: true }).then(function (result) {
				assert(result.result, { onoff: true });
			});
	    });
	});

	describe('#nearbyChargers()', function () {
	    it('should succeed', function (done) {
	        tjs.nearbyChargers(options, null, function (err, result) {
				if (result.congestion_sync_time_utc_secs == 1547415712) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.nearbyChargers(options, null);
	        done();
	    });
	});

	describe('#nearbyChargersAsync()', function () {
	    it('should succeed', function () {
	        return tjs.nearbyChargersAsync(options, null).then(function (result) {
				assert(result.congestion_sync_time_utc_secs, 1547415712);
			});
	    });
	});

	describe('#seatHeater()', function () {
	    it('should succeed', function (done) {
        tjs.seatHeater(options, { heater: "0", level: "1" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.seatHeater(options, { heater: "0", level: "1" });
	        done();
	    });
	});

	describe('#seatHeaterAsync()', function () {
	    it('should succeed', function () {
	        return tjs.seatHeaterAsync(options, { heater: "0", level: "1" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#steeringHeater()', function () {
	    it('should succeed', function (done) {
	        tjs.steeringHeater(options, { level: "1" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.steeringHeater(options, { level: "1" });
	        done();
	    });
	});

	describe('#steeringHeaterAsync()', function () {
	    it('should succeed', function () {
	        return tjs.steeringHeaterAsync(options, { level: "1" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#windowControl()', function () {
	    it('should succeed with "vent"', function (done) {
	        tjs.windowControl(options, { command: "vent", lat: 0, lon: 0 }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
		});
		
	    it('should succeed with "close"', function (done) {
	        tjs.windowControl(options, { command: "close", lat: 0, lon: 0 }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with "vent" and no callback', function (done) {
	        tjs.windowControl(options, { command: "vent", lat: 0, lon: 0 });
	        done();
	    });

	    it('should succeed with "close" and no callback', function (done) {
	        tjs.windowControl(options, { command: "close", lat: 0, lon: 0 });
	        done();
	    });
	});

	describe('#windowControlAsync()', function () {
	    it('should succeed with "vent"', function () {
	        return tjs.windowControlAsync(options, { command: "vent", lat: 0, lon: 0 }).then(function (result) {
				assert(result.result, true);
			});
	    });

		it('should succeed with "close"', function () {
	        return tjs.windowControlAsync(options, { command: "close", lat: 0, lon: 0 }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#navigationRequest()', function () {
	    it('should succeed', function (done) {
	        tjs.navigationRequest(options, { subject: "subject", text: "text", locale: "locale" }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.navigationRequest(options, { subject: "subject", text: "text", locale: "locale" });
	        done();
	    });
	});

	describe('#navigationRequestAsync()', function () {
	    it('should succeed', function () {
	        return tjs.navigationRequestAsync(options, { subject: "subject", text: "text", locale: "locale" }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});

	describe('#maxDefrost()', function () {
	    it('should succeed', function (done) {
	        tjs.maxDefrost(options, { onoff: true }, function (err, result) {
				if (result.result) {
					done();
				} else {
					done(err);
				}
	        });
	    });

	    it('should succeed with no callback', function (done) {
	        tjs.maxDefrost(options, { onoff: true });
	        done();
	    });
	});

	describe('#maxDefrostAsync()', function () {
	    it('should succeed', function () {
	        return tjs.maxDefrostAsync(options, { onoff: true }).then(function (result) {
				assert(result.result, true);
			});
	    });
	});	

	describe("#products()", function () {
		it("should succeed", function(done) {
			tjs.products(options, function(err, result) {
				if (Array.isArray(result)) {
					done();
				} else {
					done(err);
				}
			});
		});
	});

	describe("#productsAsync()", function () {
		it("should succeed", function() {
			return tjs.productsAsync(options).then( function(result) {
				assert(Array.isArray(result), true);
			});
		});
	});

	describe("#solarStatus()", function() {
		it("should return the current solar production", function(done) {
			tjs.solarStatus({ siteId: 1 }, function(err, result) {
				assert.strictEqual(1000, result.solar_power);
				done();
			});
		});

		it("should return the current power consumption", function(done) {
			tjs.solarStatus({ siteId: 1 }, function(err, result) {
				assert.strictEqual(750, result.load_power);
				done();
			});
		});

		it("should return the current net grid power", function(done) {
			tjs.solarStatus({ siteId: 1 }, function(err, result) {
				assert.strictEqual(250, result.grid_power);
				done();
			});
		});
	}); 

	describe("#solarStatusAsync()", function() {
		it("should return the current solar production", function() {
			return tjs.solarStatusAsync({ siteId: 1 }).then(function(result) {
				assert.strictEqual(1000, result.solar_power);
			});
		});

		it("should return the current power consumption", function() {
			return tjs.solarStatusAsync({ siteId: 1 }).then(function(result) {
				assert.strictEqual(750, result.load_power);
			});
		});

		it("should return the current net grid power", function() {
			return tjs.solarStatusAsync({ siteId: 1 }).then(function(result) {
				assert.strictEqual(250, result.grid_power);
			});
		});
	}); 

});
