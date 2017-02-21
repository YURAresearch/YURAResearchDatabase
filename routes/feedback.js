var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('feedback', {
        title: 'Feedback'
    });
    next();
});
module.exports = router;
