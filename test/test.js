var assert = require('assert');

console.log("Home: " + process.env.HOME);

var tjs = require('teslajs');

describe('TeslaJS', function() {
	describe('#login()', function() {
		it('should succeed with valid pwd', function() {
			assert(true);
		});
		it('should fail with invalid pwd', function() {
			assert(true);
		});
	});
});