var config = require('../bin/config');

try {
  var localcn = require('../bin/localcn');
    // do stuff
} catch (ex) {
    console.log('no local config specified');
}

var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise,
};

var pgp = require('pg-promise')();

var db = pgp(process.env.DATABASE_URL || localcn.postgres);
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

//listing functions

function searchHandler(searchString) {
    searchString = searchString.replace(/[^a-zA-Z0-9 ]/g, '');
    var searchArray = searchString.split(' ');
    var searchQuery = "";
    for (var i = 0; i < searchArray.length; i++) {
        searchQuery = searchQuery + searchArray[i].replace(/'/g, '"') + '&';
    }
    searchQuery = searchQuery.substring(0, searchQuery.length-1);
    return searchQuery;
}

function escapeRegExpDept(str) {
  return str = str.replace(/\(/g, "\\\\(").replace(/\)/g, "\\\\)");
}

function saveSearch(searchQuery, deptFilter, countListings, netIDhash){
    db.query("INSERT INTO searches (search_query, department_filter, datetime, listing_count, netid_hash) VALUES ('" + searchQuery + "', '" + deptFilter + "', CURRENT_TIMESTAMP, "+countListings+",'"+netIDhash+"');");
}

//(to_tsvector(coalesce(listings.name, '')) || to_tsvector(coalesce(listings.description, '')) || to_tsvector(coalesce(listings.keywords, '')) || to_tsvector(coalesce(listings.departments, '')))

function getAllListings(netID, callback) {
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings ORDER BY (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),name,departments", callback);
}

function searchListings(searchString, netID, callback) {
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE ((to_tsvector(coalesce(listings.name, '')) || to_tsvector(coalesce(listings.description, '')) || to_tsvector(coalesce(listings.keywords, '')) || to_tsvector(coalesce(listings.departments, ''))) @@ to_tsquery('"+searchHandler(searchString)+"')) ORDER BY (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),(SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC, listings.custom_desc DESC,(SELECT ts_rank(to_tsvector(listings.name), to_tsquery('"+searchHandler(searchString)+"'))) DESC,(SELECT ts_rank(to_tsvector(listings.description), to_tsquery('"+searchHandler(searchString)+"'))) DESC, (SELECT ts_rank(to_tsvector(listings.keywords), to_tsquery('"+searchHandler(searchString)+"'))) DESC,name,departments", callback);
}

function filterDepts(deptString, netID, callback) {
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE departments ~* E'" + escapeRegExpDept(deptString) + ";' ORDER BY (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),listings.custom_desc DESC,name,departments", callback);
}

function searchANDfilter(searchString, deptString, netID, callback) {
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE departments ~* E'" + escapeRegExpDept(deptString) + ";' AND ((to_tsvector(coalesce(listings.name, '')) || to_tsvector(coalesce(listings.description, '')) || to_tsvector(coalesce(listings.keywords, '')) || to_tsvector(coalesce(listings.departments, ''))) @@ to_tsquery('"+searchHandler(searchString)+"')) ORDER BY (SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),(SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC, listings.custom_desc DESC,(SELECT ts_rank(to_tsvector(listings.name), to_tsquery('"+searchHandler(searchString)+"'))) DESC,(SELECT ts_rank(to_tsvector(listings.description), to_tsquery('"+searchHandler(searchString)+"'))) DESC, (SELECT ts_rank(to_tsvector(listings.keywords), to_tsquery('"+searchHandler(searchString)+"'))) DESC,name,departments", callback);
}

//user functions

function getUser(netID, callback) {
    callbackData("SELECT * FROM users WHERE NETID = '" + netID + "';", callback);
}

function createUser(netID, callback) {
    callbackData("INSERT INTO USERS(NETID, FIRSTACCESSED, LASTACCESSED, SESSIONCOUNT, ADMIN) VALUES ('" + netID + "',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1,false);", callback);
}

function updateUser(netID, field, newValue, callback){
    callbackData("UPDATE users SET " + field + " = "  + newValue + " WHERE NETID = '" + netID + "';", callback);
}

function getFavorites(netID, callback){
    callbackData("SELECT list_id FROM favorites INNER JOIN listings ON favorites.listingid = listings.list_id INNER JOIN users ON favorites.netid = users.netid WHERE users.netid = '" + netID + "';", callback)
}

function addFavorite(netID, listingid, callback){
    callbackData("INSERT INTO favorites (netid, listingid) VALUES ('"+netID+"',"+listingid+");", callback);
}

function removeFavorite(netID, listingid, callback){
    callbackData("DELETE FROM favorites WHERE netID = '" + netID + "' AND listingid = '"+ listingid +"';", callback);
}

function isAdmin(netID, callback){
  callbackData("SELECT admin FROM users WHERE netID = '" + netID + "'", callback);
}

function getUserCount(callback){
  callbackData("SELECT COUNT(*) FROM users", callback)
}

function getDAUCount(callback){
  callbackData("SELECT COUNT(*) FROM users WHERE users.lastaccessed >= now()::date", callback)
}

function getSearchCount(callback){
  callbackData("SELECT COUNT(*) FROM searches", callback)
}

function getListingCount(callback){
  callbackData("SELECT COUNT(*) FROM listings", callback)
}

module.exports = {
    callbackData: callbackData,
    saveSearch: saveSearch,
    getAllListings: getAllListings,
    searchListings: searchListings,
    filterDepts: filterDepts,
    searchANDfilter: searchANDfilter,
    searchHandler: searchHandler,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    getFavorites: getFavorites,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    isAdmin: isAdmin,
    getUserCount: getUserCount,
    getDAUCount: getDAUCount,
    getSearchCount: getSearchCount,
    getListingCount: getListingCount,
};
