var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');
var listingsModels = require('../models/listings.js');
var hbs = require('hbs');
var paginate = require('handlebars-paginate');

hbs.registerHelper('paginate', paginate);

function listAll(req, res) {
    var callback = function(listings) {
        res.render('listings', {
            title: 'Listings',
            depts: depts,
            listings: listings.slice(req.query.p*5-5||0,req.query.p*5||5),
            pagination: {
                page: req.query.p || 1,
                pageCount: Math.ceil(listings.length/5)
            }
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
