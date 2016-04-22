var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var stateObj = req.app.locals.chargeState;
  res.render('chargeStatePage', stateObj);
});

module.exports = router;
