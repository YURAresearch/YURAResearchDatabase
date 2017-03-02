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

function searchArray(searchString) {
    var search = searchString.split(' ');
    var searchQuery = "";
    for (var i = 0; i < search.length; i++) {
        searchQuery = searchQuery + search[i] + '&';
    }
    searchQuery = searchQuery.substring(0, searchQuery.length-1);
    return searchQuery;
}

function getAllListings(callback) {
    callbackData("SELECT * FROM listings ORDER BY name", callback); // LIMIT " + 5 + " OFFSET " + (pageNumber*5 - 5), callback);
}

function searchListings(searchString, callback) {
    callbackData("SELECT * FROM listings WHERE to_tsvector(listings.name) @@ to_tsquery('"+searchArray(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchArray(searchString)+"')", callback);
}

function filterDepts(deptString, callback) {
    callbackData("SELECT * FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%')", callback);
}

function searchANDfilter(searchString, deptString, callback) {
    callbackData("SELECT * FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%') AND (to_tsvector(listings.name) @@ to_tsquery('"+searchArray(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchArray(searchString)+"'))", callback);
}

module.exports = {
    callbackData: callbackData,
    getAllListings: getAllListings,
    searchListings: searchListings,
    filterDepts: filterDepts,
    searchANDfilter: searchANDfilter,
    searchArray: searchArray
};
