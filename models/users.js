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

var dbusers = pgp(process.env.DATABASE_URL || localcn);

function callbackData(query, callback) {
    dbusers.any(query, [true], callback)
        .then(function(data) {
            callback(data); // send data;
        })
        .catch(function(error) {
            console.log('ERROR:', error); // print the error;
            return res.status(500).send(err);
        });
}

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
    callbackData("SELECT list_id FROM favorites INNER JOIN listings ON favorites.listingid = listings.list_id INNER JOIN users ON favorites.userid = users.id WHERE NETID = '" + netID + "';", callback)
}

module.exports = {
    callbackData: callbackData,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    getFavorites: getFavorites,
};
