var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');

/* GET home page. */
router.get('/admin/:page', function(req, res, next) {
  //if (req.session.isAdmin != true) res.redirect('/listings');

  postgresModel.getUserCount(function(data) {
    userCount = data[0].count;
    console.log(userCount)
  });

  res.render('admin/' + req.params.page, {
    title: 'Admin Dashboard',
    hideFooter: true,
    userCount: userCount,
    searchCount: 0,
  });
});

module.exports = router;
