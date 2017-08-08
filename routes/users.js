var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');

/* GET users listing. */
router.get('/users', function(req, res) {
  console.log(req.session);
  postgresModel.getUser(req.session.cas_user, function(data) {
    if (data.length == 0) { //user does not exist yet
      postgresModel.createUser(req.session.cas_user, function(log) {
        console.log('User Created');
      }); //create User
      req.session.loggedin = true;
      req.session.save();
      res.redirect('/listings')
    } else {
      postgresModel.updateUser(req.session.cas_user, 'SESSIONCOUNT', data[0].sessioncount + 1, function(log) {
        console.log('Session Count Updated');
      }); //add one to session count
      postgresModel.updateUser(req.session.cas_user, 'LASTACCESSED', 'CURRENT_TIMESTAMP', function(log) {
        console.log('Last Accessed Time Updated');
      }) //add current time to last accessed
      req.session.loggedin = true;
      req.session.save();
      res.redirect('/listings')
    }
  });
});

module.exports = router;
