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
    };
    if (req.query.search) {
        if (req.query.departments) {
            listingsModels.searchANDfilter(req.query.search, req.query.departments, callback);
        } else {
            listingsModels.searchListings(req.query.search, callback);
        }
    } else {
        if (req.query.departments) {
            listingsModels.filterDepts(req.query.departments, callback);
        } else {
            listingsModels.getAllListings(callback)
        }
    }
}

//GET home page.
router.get('/listings', listAll);

module.exports = router;
