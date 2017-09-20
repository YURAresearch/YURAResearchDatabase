var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');

var userCount = 0
var searchCount = 0
var listingCount = 0
var DAUCount = 0

var getAnalytics  = function(req, res, next){
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
  next()
}


/* GET home page. */
router.get('/admin/:page', getAnalytics, function(req, res, next) {

  if (req.session.isAdmin != true) res.redirect('/users');

  res.render('admin/' + req.params.page, {
    title: 'Admin Dashboard',
    hideFooter: true,
    hideArrow: true,
    userCount: userCount,
    searchCount: searchCount,
    listingCount: listingCount,
    DAUCount: DAUCount,
  });
});


module.exports = router;
