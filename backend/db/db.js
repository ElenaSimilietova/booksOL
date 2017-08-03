var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'booksol.ctx6ytn0upt5.eu-west-2.rds.amazonaws.com',
    user: 'books_ol_user',
    password: 'gcDHx5KRW2',
    database: 'books_ol',
    debug: false
});

module.exports = pool