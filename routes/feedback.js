var express = require('express');
var router = express.Router();
var Mailgun = require('mailgun').Mailgun;

var mg = new Mailgun('key-5232d6c7aa1fdebccd7e1b32cf328506');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('feedback', {
    title: 'Feedback'
  });
});

router.post('/', function(req, res) {
  mg.sendText(req.body.name + ' <' + req.body.email + '>', 'yura.database@gmail.com',
    req.body.subject,req.body.message,
    function(err) {
      if (err) {
        res.render('feedback', {
          title: 'Feedback',
          message: 'Error: Please try again, or email us at yura@yale.edu.',
        });
      } else {
        res.render('feedback', {
          title: 'Feedback',
          message: 'Your message has been sent! Thank you for your feedback.',
        });
      }
    });
});

module.exports = router;
