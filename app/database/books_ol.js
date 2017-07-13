exports.getBooksbyId = function(req, res){

   console.log("get id:"+req.params.id);
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

console.log("books_ol.js");
var db = database_connect();

 db.query('SELECT id, name FROM genres', function (err, rows) {
  
      if (err) throw err
     console.log(rows[0].name);
     console.log({sample : rows});
     db.end();
      
     return res.json({GENRES: rows});
 }) 
  
};