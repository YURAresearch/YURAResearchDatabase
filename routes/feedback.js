var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('feedback', {
        title: 'Feedback'
    });
});

router.post('/', function(req, res) {
    if (req.query.submit) {
        var transporter = nodemailer.createTransport('smtps://yura.database.feedback%40gmail.com:undergradresearch@smtp.gmail.com');

        // setup email data with unicode symbols
        var mailOptions = {
            from:'yura.database.feedback@gmail.com', // sender address
            to: 'yura.database@gmail.com', // list of receivers
            replyTo: req.body.email,
            subject: '[RDB Feedback] '+req.body.subject, // Subject line
            html: '<h3>Name</h3><p>' + req.body.name + '</p><h1>Message</h1><p>' + req.body.message + '</p>', // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
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
    } else {
        res.send('Error');
    }
});

module.exports = router;
