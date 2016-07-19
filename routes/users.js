var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

router.get('/controller', function(req, res) {
	res.render('controller', {});
});

router.get('/pongController', function(req, res) {
	res.render('pongController', {});
});


module.exports = router;