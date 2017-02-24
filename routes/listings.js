var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');
var listingsModels = require('../models/listings.js');

function listAll(req, res) {
    var callback = function(listings) {
        res.render('listings', {
            title: 'Listings',
            depts: depts,
            listings: listings
        });
        console.log(listings);
    };
      listingsModels.getAllListings(callback);
}

//GET home page.
router.get('/listings', listAll);

module.exports = router;
