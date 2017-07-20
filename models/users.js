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

function isUser(netID, callback) {
    callbackData("SELECT * FROM users WHERE netID = " + netID, callback);
}

function createUser(netID, callback) {
    callbackData("[Make New User with netID]",callback);
}

function makeAdmin(netID, callback){
  //do something
}

module.exports = {
    callbackData: callbackData,
    isUser: isUser,
    createUser: createUser,
};
