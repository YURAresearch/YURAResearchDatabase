var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');

/* GET users listing. */
router.get('/users', function(req, res) {
  postgresModel.getUser(req.session.cas_user, function(data) {
    if (data.length == 0) { //user does not exist yet
      postgresModel.createUser(req.session.cas_user, function(log) {
        console.log('User Created');
      }); //create User
      req.session.loggedin = true;
      req.session.save();
      console.log(req.session);
      res.redirect('/listings')
    } else {
      postgresModel.isAdmin(req.session.cas_user, function(isAdminData) {
        req.session.isAdmin = isAdminData[0].admin;
        req.session.save();
      }); //add current time to last accessed
      postgresModel.updateUser(req.session.cas_user, 'SESSIONCOUNT', data[0].sessioncount + 1, function(log) {
        console.log('Session Count Updated');
      }); //add one to session count
      postgresModel.updateUser(req.session.cas_user, 'LASTACCESSED', 'CURRENT_TIMESTAMP', function(log) {
        console.log('Last Accessed Time Updated');
      }); //add current time to last accessed
      req.session.loggedin = true;
      req.session.save();
      console.log('hi');
      console.log(req.session.isAdmin);
      if (req.session.isAdmin == true) {
        res.redirect('/admin');
      } else {
        res.redirect('/listings');
      }
    }
  });
});

module.exports = router;
