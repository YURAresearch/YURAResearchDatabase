var express = require('express');
var router = express.Router();
var depts = require('../bin/departments');
var postgresModel = require('../models/postgres.js');
var hbs = require('hbs');
var paginate = require('handlebars-paginate');
var ua = require('universal-analytics');
var queryString = require('querystring');
var shortHash = require('short-hash');

hbs.registerHelper('paginate', paginate);
hbs.registerHelper('paginate-link', function(url, pageNum) {
  //important - page number parameter must be last in url for this to work
  if (url.indexOf('?') > -1) { //contains params
    if (url.indexOf('?p=') > -1) { // already contains page number param
      return url.substring(0, url.indexOf('?p=')) + "?p=" + pageNum.toString();
    } else if (url.indexOf('&p=') > -1) { // already contains page number and other params
      return url.substring(0, url.indexOf('&p=')) + "&p=" + pageNum.toString();
    } else {
      return url + "&p=" + pageNum.toString();
    }
  } else {
    return url + "?p=" + pageNum.toString();
  }
});
var deptBreaker = '<span style="display:block;height:18px;width:0px;margin:0px;padding:0px;line-height:0px;"></span>';
hbs.registerHelper('split-depts', function(str) {
  str = hbs.Utils.escapeExpression(str);
  str = str.substring(0, str.length - 1)
  str = str.replace(/;/g, deptBreaker);
  return new hbs.SafeString(str);
});
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function listAll(req, res) {

  console.log(req.session);

  if (req.session.loggedin == false || !(req.session.loggedin)) res.redirect('/users'); //if user info not loaded, redirect to users route

  if (req.query) {
    req.session.lastquery = queryString.stringify(req.query);
    console.log(req.session.lastquery);
  }

  var callback = function(listings) {

    //save search if not admin
    if (!req.session.isAdmin){
      if (req.query.search) {
        if (req.query.departments && req.query.departments != "Departments") {
          postgresModel.saveSearch(req.query.search,req.query.departments, listings.length, shortHash(req.session.cas_user));
        } else {
          postgresModel.saveSearch(req.query.search,'', listings.length, shortHash(req.session.cas_user));
        }
      } else {
        if (req.query.departments && req.query.departments != "Departments") {
          postgresModel.saveSearch('',req.query.departments, listings.length, shortHash(req.session.cas_user));
        }
      }
    }


    res.render('listings', {
      isAdmin: req.session.isAdmin,
      userIDhash: shortHash(req.session.cas_user),
      title: 'Listings',
      searchPlaceholder: req.query.search || '',
      deptPlaceholder: req.query.departments || 'Departments',
      depts: depts,
      listings: listings.slice((req.query.p - 1) * resultsPerPage || 0, req.query.p * resultsPerPage || resultsPerPage), //gets entries for current page
      numberOfResults: listings.length,
      url: req.url,
      pagination: {
        page: req.query.p || 1,
        pageCount: Math.ceil(listings.length / resultsPerPage),
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
      postgresModel.searchANDfilter(req.query.search.trim(), req.query.departments, req.session.cas_user, callback);
    } else {
      postgresModel.searchListings(req.query.search.trim(), req.session.cas_user, callback);
    }
  } else {
    if (req.query.departments && req.query.departments != "Departments") {
      postgresModel.filterDepts(req.query.departments, req.session.cas_user, callback);
    } else {
      postgresModel.getAllListings(req.session.cas_user, callback);
    }
  }
}

//GET home page.
router.get('/listings', listAll);

router.post('/listings/addFavorite/:listingid/', function(req, res) {
  postgresModel.addFavorite(req.session.cas_user, req.params.listingid, function(log) {
    console.log('Entry  ' + req.params.listingid.toString() + ' Added To Favorites');
    if (req.session.lastquery) {
      res.redirect('/listings?' + req.session.lastquery);
    } else {
      res.redirect('/listings');
    }
  });
});

router.post('/listings/removeFavorite/:listingid', function(req, res) {
  console.log(req.params.listingid);
  postgresModel.removeFavorite(req.session.cas_user, req.params.listingid, function(log) {
    console.log('Entry ' + req.params.listingid.toString() + ' Removed From Favorites');
    if (req.session.lastquery) {
      res.redirect('/listings?' + req.session.lastquery);
    } else {
      res.redirect('/listings');
    }
  });
});

module.exports = router;
