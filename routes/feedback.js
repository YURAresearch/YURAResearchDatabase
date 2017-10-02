var express = require('express');
var router = express.Router();
var config = require('../bin/config');

var Mailgun = require('mailgun').Mailgun;

var mg = new Mailgun(config.mailgun_key);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('feedback', {
    title: 'Feedback'
  });
});

router.post('/', function(req, res) {

  if(req.body.email){
    var sender = (req.body.name + ' <' + req.body.email + '>');
  } else{
    var sender = ('Anonymous User <yura.database@gmail.com>');
  }
  var subject = (req.body.subject || 'RDB Feedback');
  var message = (req.body.message);

  mg.sendText(sender, 'yura.database@gmail.com', subject, message,
    function(err) {
      if (err) {
        console.log(err);
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
