var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var stateObj = req.app.locals.driveState;
  res.render('driveStatePage', stateObj);
});

module.exports = router;
