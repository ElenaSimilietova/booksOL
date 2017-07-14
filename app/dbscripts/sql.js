exports.getBooksbyId = function(req, res){

   //console.log("get id:"+req.params.id);
   var id = req.params.id;

  var db = database_connect();

  db.query('SELECT id, name, id_genre, big_pic, description FROM books WHERE id = ?',[id], function (err, rows) {
 

      if (err) throw err
        console.log('BOOKS_OL.JS');
        console.log(rows[0].name);
      console.log({rows});
      db.end(); 
      return res.json({ITEM : rows});
 }) 
  
};

exports.genres = function(req, res){

//console.log("books_ol.js");
var db = database_connect();

 db.query('SELECT id, name FROM genres', function (err, rows) {
  
      if (err) throw err
     console.log(rows[0].name);
     console.log({sample : rows});
     db.end();
      
     return res.json({GENRES: rows});
 }) 
  
};


var database_connect = function() {

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