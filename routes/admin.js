var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');
var asyncModule = require('async')

var userCount = 0
var searchCount = 0
var listingCount = 0
var DAUCount = 0

/* GET home page. */
router.get('/admin/:page', function(req, res, next) {

  if (req.session.isAdmin != true) res.redirect('/users');

  asyncModule.series([
      function(callback) {
        postgresModel.getUserCount(function(data) {
          userCount = data[0].count;
        });
        postgresModel.getSearchCount(function(data) {
          searchCount = data[0].count;
        });
        postgresModel.getListingCount(function(data) {
          listingCount = data[0].count;
        });
        postgresModel.getDAUCount(function(data) {
          DAUCount = data[0].count;
        });
        callback(null, 'one');
      },
      function(callback) {
        res.render('admin/' + req.params.page, {
          title: 'Admin Dashboard',
          hideFooter: true,
          hideArrow: true,
          userCount: userCount,
          searchCount: searchCount,
          listingCount: listingCount,
          DAUCount: DAUCount,
        });
        callback(null, 'two');
      }
    ],
    // optional callback
    function(err, results) {
      // results is now equal to ['one', 'two']
    });

});


module.exports = router;
