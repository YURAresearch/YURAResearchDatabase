var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page.
router.get('/', function(req, res, next) {
    if (req.query.ticket) {
        request('https://secure.its.yale.edu/cas/validate?service=https://yura-rdb.herokuapp.com/listings&ticket=' + req.query.ticket, function(error, response, body) {
            if (!error && response.statusCode == 200 && body.indexOf('yes') !== -1) {
                res.render('listings', {
                    title: 'Listings'
                });
            } else {
                res.redirect('../');
            }
        });
    } else {
      res.redirect('../');
    }
});

*/

module.exports = router;
