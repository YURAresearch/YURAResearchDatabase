var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');

//GET home page.
router.get('/listings', function(req, res, next) {
    res.render('listings', {
        title: 'Listings',
        depts: depts,
    });
});

module.exports = router;
