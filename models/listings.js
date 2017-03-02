var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise,
};

var pgp = require('pg-promise')();

var localcn = {
    host: 'localhost',
    port: 5432,
    database: 'yurardb',
    user: 'postgres',
    password: 'bulld0g27'
};

var db = pgp(process.env.DATABASE_URL || localcn);
var countPageItems = 5;

function callbackData(query, callback) {
    db.any(query, [true], callback)
        .then(function(data) {
            callback(data); // send data;
        })
        .catch(function(error) {
            console.log('ERROR:', error); // print the error;
            return res.status(500).send(err);
        });
}

function searchHandler(searchString) {
    var searchArray = searchString.split(' ');
    var searchQuery = "";
    for (var i = 0; i < searchArray.length; i++) {
        searchQuery = searchQuery + searchArray[i] + '&';
    }
    searchQuery = searchQuery.substring(0, searchQuery.length-1);
    return searchQuery;
}

function getAllListings(callback) {
    callbackData("SELECT * FROM listings", callback); // LIMIT " + 5 + " OFFSET " + (pageNumber*5 - 5), callback);
}

function searchListings(searchString, callback) {
    callbackData("SELECT * FROM listings WHERE to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"')", callback);
}

function filterDepts(deptString, callback) {
    callbackData("SELECT * FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%')", callback);
}

function searchANDfilter(searchString, deptString, callback) {
    callbackData("SELECT * FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%') AND (to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"'))", callback);
}

module.exports = {
    callbackData: callbackData,
    getAllListings: getAllListings,
    searchListings: searchListings,
    filterDepts: filterDepts,
    searchANDfilter: searchANDfilter,
    searchHandler: searchHandler
};
