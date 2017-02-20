var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
   request('https://secure.its.yale.edu/cas/validate?service=https://yura-rdb.herokuapp.com/cas&ticket='+req.query.ticket, function (error, response, body) {
   if (!error && response.statusCode == 200) {
     console.log(body)
   }
 });
 res.send('hi');
});

module.exports = router;
