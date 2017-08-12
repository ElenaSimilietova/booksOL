var mysql = require('mysql');
var config = require("./../../config");

var pool = mysql.createPool({
    connectionLimit: 100,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db_name,
    debug: false
});

module.exports = pool