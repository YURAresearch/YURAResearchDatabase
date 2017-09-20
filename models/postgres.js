var config = require('../bin/config');
var localcn = require('../bin/localcn');

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
    var searchArray = searchString.split(' ');
    var searchQuery = "";
    for (var i = 0; i < searchArray.length; i++) {
        searchQuery = searchQuery + searchArray[i] + '&';
    }
    searchQuery = searchQuery.substring(0, searchQuery.length-1);
    return searchQuery;
}

function sortByParser(sortby){
    if (sortby == 'name') {
      return "name,";
    } else if (sortby == 'dept') {
      return "departments,";
    } else {
      return ""
    }
}

function saveSearch(searchQuery, deptFilter){
    db.query("INSERT INTO searches (search_query, department_filter, datetime) VALUES ('" + searchQuery + "', '" + deptFilter + "', CURRENT_TIMESTAMP);");
}

function getAllListings(netID, sortby, callback) {
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings ORDER BY " + sortByParser(sortby) + "(SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),name,departments", callback);
}

function searchListings(searchString, netID, sortby, callback) {
    saveSearch(searchString, "");
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE (to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.keywords) @@ to_tsquery('"+searchHandler(searchString)+"')) ORDER BY "+ sortByParser(sortby) + "(SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),(SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC, listings.custom_desc DESC,(SELECT ts_rank(to_tsvector(listings.name), to_tsquery('"+searchHandler(searchString)+"'))) DESC,(SELECT ts_rank(to_tsvector(listings.description), to_tsquery('"+searchHandler(searchString)+"'))) DESC, (SELECT ts_rank(to_tsvector(listings.keywords), to_tsquery('"+searchHandler(searchString)+"'))) DESC,name,departments", callback);
}

function filterDepts(deptString, netID, sortby, callback) {
    saveSearch("",deptString);
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%') ORDER BY  " + sortByParser(sortby) + "(SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),listings.custom_desc DESC,name,departments", callback);
}

function searchANDfilter(searchString, deptString, netID, sortby, callback) {
    saveSearch(searchString, deptString);
    callbackData("SELECT *, exists(SELECT 1 FROM favorites WHERE favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "') AS isFavorite FROM listings WHERE LOWER(departments) LIKE LOWER('%" + deptString + "%') AND (to_tsvector(listings.name) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.description) @@ to_tsquery('"+searchHandler(searchString)+"') OR to_tsvector(listings.keywords) @@ to_tsquery('"+searchHandler(searchString)+"')) ORDER BY "+ sortByParser(sortby) + "(SELECT favorites.listingid FROM favorites WHERE (favorites.listingid = listings.list_id AND favorites.netid = '" + netID + "')),(SELECT CASE WHEN (ts_rank(to_tsvector(listings.departments), to_tsquery('"+searchHandler(searchString)+"'))) > 0 THEN 1 ELSE 0 END) DESC, listings.custom_desc DESC,(SELECT ts_rank(to_tsvector(listings.name), to_tsquery('"+searchHandler(searchString)+"'))) DESC,(SELECT ts_rank(to_tsvector(listings.description), to_tsquery('"+searchHandler(searchString)+"'))) DESC, (SELECT ts_rank(to_tsvector(listings.keywords), to_tsquery('"+searchHandler(searchString)+"'))) DESC,name,departments", callback);
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

function getSearchCount(callback){
  callbackData("SELECT COUNT(*) FROM searches", callback)
}

module.exports = {
    callbackData: callbackData,
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
};
