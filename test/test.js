var assert = require('assert');
var tjs = require('../TeslaJS');

// set these in your environment before testing
var user = process.env.TESLAJS_USER;
var pass = process.env.TESLAJS_PASS;

describe('TeslaJS', function() {
	describe('#login()', function() {
		it('should succeed with valid user and pwd', function(done) {
			tjs.login(user, pass, function(result) {
				if (result.response.statusCode != 200) {
					done(result.response.statusMessage);
				} else {
					done();
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
});
