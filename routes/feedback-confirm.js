var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.post('/', function(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yura.database@gmail.com',
            pass: 'undergradresearch'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from:req.body.name + ' &lt;' + req.body.email + '&gt;', // sender address
        to: 'yura.database@gmail.com', // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.render('feedback', {
              title: 'Feedback',
              message: 'Error',
          });
        } else{
          res.render('feedback', {
              title: 'Feedback',
              message: 'Your message has been sent!',
          });
      }
    });
});

module.exports = router;
