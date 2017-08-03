var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');
var listingsModel = require('../models/listings.js');
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
/**
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
**/

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function listAll(req, res) {
  var callback = function(listings) {
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
      listingsModel.searchANDfilter(req.query.search, req.query.departments, callback);
    } else {
      listingsModel.searchListings(req.query.search, callback);
    }
  } else {
    if (req.query.departments && req.query.departments != "Departments") {
      listingsModel.filterDepts(req.query.departments, callback);
    } else {
      listingsModel.getAllListings(callback);
    }
  }
}

//GET home page.
router.get('/listings', listAll);

module.exports = router;
