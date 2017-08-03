var express = require('express');
var router = express.Router();
var usersModel = require('../models/users.js');

/* GET users listing. */
router.get('/users', function(req, res) {
  console.log(req.session.cas_user);
  usersModel.getUser(req.session.cas_user, function(data) {
    if (data.length == 0) { //user does not exist yet
      usersModel.createUser(req.session.cas_user, function(log) {
        console.log(log);
      }); //create User
      res.redirect('/listings')
    } else {
      usersModel.updateUser(req.session.cas_user, 'SESSIONCOUNT', data[0].sessioncount + 1, function(log) {
        console.log('Session Count Updated');
      }); //add one to session count
      usersModel.updateUser(req.session.cas_user, 'LASTACCESSED', 'CURRENT_TIMESTAMP', function(log) {
        console.log('Last Accessed Time Updated');
      }) //add current time to last accessed
      usersModel.getFavorites(req.session.cas_user, function(favdata) {
        req.session.favdata = favdata;
        console.log(req.session.favdata);
      }); //get favorites listing
      res.redirect('/listings')
    }
  });
});

module.exports = router;
