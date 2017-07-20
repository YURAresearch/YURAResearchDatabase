var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');
var listingsModels = require('../models/listings.js');
var hbs = require('hbs');
var paginate = require('handlebars-paginate');

hbs.registerHelper('paginate', paginate);
hbs.registerHelper('split-depts', function(str) {
    str = hbs.Utils.escapeExpression(str);
    for (var i = 0; i < str.length; i++) {
        str = str.replace(';', "</br>");
    }
    return new hbs.SafeString(str)
});
hbs.registerHelper('truncate-desc', function(str, isTruncate) {
    var len = 600;
    if (str && isTruncate) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new hbs.SafeString(new_str + '...');
        }
    }
    return new hbs.SafeString(str);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

function listAll(req, res) {

    if (!req.session.untruncateList) {
        req.session.untruncateList = [];
    }


    var callback = function(listings) {
        //console.log(listings);
        console.log(req.session.untruncateList.length)
        console.log(listings.length);
        for (var i = 0; i < listings.length; i++) {
          listings[i].isTruncate = true;
          //console.log(listings[i].isTruncate);
            for (var j = 0; j < req.session.untruncateList.length; j++) {
              if (req.session.untruncateList[j] == listings[i].list_id){
                console.log('truncating...')
                listings[i].isTruncate = false;
                break;
              }
            }
        }

        res.render('listings', {
            title: 'Listings',
            searchPlaceholder: req.query.search || '',
            deptPlaceholder: req.query.departments || 'Departments',
            depts: depts,
            listings: listings.slice((req.query.p - 1) * resultsPerPage || 0, req.query.p * resultsPerPage || resultsPerPage), //gets entries for current page
            pagination: {
                page: req.query.p || 1,
                pageCount: Math.ceil(listings.length / resultsPerPage)
            }
        });
    };
    var resultsPerPage = req.query.limit || 10;
    var maxresultsPerPage = 50;
    //set max resultsPerPage to 50
    if (req.query.limit > maxresultsPerPage) {
        resultsPerPage = maxresultsPerPage;
    }
    if (req.query.search) {
        if (req.query.departments && req.query.departments != "Departments") {
            listingsModels.searchANDfilter(req.query.search, req.query.departments, callback);
        } else {
            listingsModels.searchListings(req.query.search, callback);
        }
    } else {
        if (req.query.departments && req.query.departments != "Departments") {
            listingsModels.filterDepts(req.query.departments, callback);
        } else {
            listingsModels.getAllListings(callback)
        }
    }
}

//GET home page.
router.get('/listings', listAll);
router.post('/listings/:listingid.:whichtruncate', function(req, res) {
    if (req.params.whichtruncate = 'untruncate'){
      req.session.untruncateList.push(req.params.listingid);
    }
    else if (req.params.whichtruncate = 'truncate') {
      //delete list item
    }
    res.redirect('/listings');
})
module.exports = router;
