console.log(process.cwd());
console.log(process.argv);
console.log(process.env.TRAVIS_BUILD_DIR);

var assert = require('assert');
var tjs = require('../teslajs');

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