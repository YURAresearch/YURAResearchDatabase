var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise,
};

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_FILE || 'postgres://postgres:bulld0g27@localhost:5432/yurardb');

function getAllListings(callback) {
    db.any('SELECT * FROM listings', [true], callback)
        .then(function(data) {
            callback(data); // send data;
        })
        .catch(function(error) {
            console.log('ERROR:', error); // print the error;
            return res.status(500).send(err);
        });
}

/*
function searchByTitle(searchString, callback) {
    var query = "SELECT title FROM movies WHERE LOWER(title) LIKE LOWER('%" + searchString + "%')";
    db.any(query, [true], callback)
        .then(function(data) {
            callback(data); // send data;
        })
        .catch(function(error) {
            console.log('ERROR:', error); // print the error;
            return res.status(500).send(err);
        });
}
*/

module.exports = {
    getAllListings: getAllListings,
    //searchByTitle: searchByTitle,
};
