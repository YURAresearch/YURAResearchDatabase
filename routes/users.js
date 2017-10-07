var express = require('express');
var router = express.Router();
var postgresModel = require('../models/postgres.js');
var asyncModule = require('async')

/* GET users listing. */
router.get('/users', function(req, res) {
  asyncModule.series([
      function(callback) {
        postgresModel.getUser(req.session.cas_user, function(data) {
          if (data.length == 0) { //user does not exist yet
            postgresModel.createUser(req.session.cas_user, function(log) {
            }); //create User
            req.session.loggedin = true;
            req.session.save();
            res.redirect('/listings')
          } else {
            postgresModel.isAdmin(req.session.cas_user, function(isAdminData) {
              req.session.isAdmin = isAdminData[0].admin;
              req.session.save();
            }); //add current time to last accessed
            postgresModel.updateUser(req.session.cas_user, 'SESSIONCOUNT', data[0].sessioncount + 1, function(log) {
            }); //add one to session count
            postgresModel.updateUser(req.session.cas_user, 'LASTACCESSED', 'CURRENT_TIMESTAMP', function(log) {
            }); //add current time to last accessed
            req.session.loggedin = true;
            req.session.save();
          }
        });
        callback();
      },
      function(callback) {
        if (req.session.isAdmin == true) {
          res.redirect('/listings');
        } else {
          res.redirect('/listings');
        }
        callback();
      }
  ],
  function(err) {
  });
});

module.exports = router;
