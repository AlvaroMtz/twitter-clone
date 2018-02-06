var express = require('express');
var router = express.Router();

/* PETICIÓN GET DE LA HOME. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

module.exports = router;
