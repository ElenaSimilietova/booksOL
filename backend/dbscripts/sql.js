exports.getBooksbyId = function(req, res){

   //console.log("get id:"+req.params.id);
   var id = req.params.id;

  var db = database_connect();

  db.query('SELECT b.id, b.name, b.id_genre, b.big_pic, b.description FROM books b, authors a WHERE b.id_author = a.id and b.id = ?',[id], function (err, rows) {
 
q
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