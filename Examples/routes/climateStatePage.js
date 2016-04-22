var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var stateObj = req.app.locals.climateState;
  res.render('climateStatePage', stateObj);
});

module.exports = router;
