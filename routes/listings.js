var express = require('express');
var router = express.Router();
var request = require('request');
var cas = require('./cas.js');
var session = require('client-sessions');

var port = process.env.PORT || '8000';
var host = process.env.HOST || 'localhost';
var sessionSecret = process.env.SESSION_SECRET || 'e70a1e1ee4b8f662f78'

var duration = 24 * 60 * 60 * 7 * 1000;

router.use( session({
    cookieName: 'session',
    secret: sessionSecret,
    duration: duration,
    activeDuration: duration
}));

var auth = cas(host, port);

router.get( '/logout', auth.logout );


// All other routes require CAS authorization
router.use(auth.bounce);

// Get the homepage
router.get('/', function (req, res) {
  res.render('listings', {
      title: 'Listings'
  });
});


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
