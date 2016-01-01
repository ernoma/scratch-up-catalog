var express = require('express');
//var fs = require('fs');
//var process = require('process');
var router = express.Router();


/* GET earth globe page. */
router.get('/', function(req, res, next) {
  res.render('skills', { title: 'Scratch Up Catalog' });
});

module.exports = router;
