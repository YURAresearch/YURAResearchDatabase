var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
   request('https://secure.its.yale.edu/cas/validate?service=https://yura-rdb.herokuapp.com/cas&ticket='+req.query.ticket, function (error, response, body) {
   if (!error && response.statusCode == 200 && body.indexOf('yes')!== -1) {
     res.redirect('/listings');
   }
   else{
     res.redirect('../');
   }
 });
});

module.exports = router;