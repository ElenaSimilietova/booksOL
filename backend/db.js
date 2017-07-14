exports.database_connect = function() {

    var mysql = require('mysql');

    var connection = mysql.createConnection({

        host: 'booksol.ctx6ytn0upt5.eu-west-2.rds.amazonaws.com',
        user: 'books_ol_user',
        password: 'gcDHx5KRW2',
        database: 'books_ol'
    });

    connection.connect(function(error){
    if(!!error){
    console.log('Error');
    }
    else {
    console.log('Connected mysql');

    }
    })

    return connection;
};