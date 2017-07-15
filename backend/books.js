var sql = require("./db.js");

exports.getBookById = function(req, res){
  
  var db = sql.database_connect();
  var id = req.params.id;

  db.query('SELECT a.name, g.name, b.id, b.name, b.id_genre, b.big_pic, b.description FROM books b, authors a, genres g WHERE b.id_author = a.id and b.id_genre = g.id and b.id = ?',[id], function (err, rows) {
    var result;
    if (err) {
      result = {'data': 'SQL error'};
    }
    else {
      result = res.json(rows[0]);
    }
    db.end();
    return result;
 }) 
  
};

exports.getBooksMostPopular = function(req, res){

  var db = database_connect();
  var num = req.params.num;  

  db.query("SELECT id, name, id_author, small_pic, sum_points/votes_number as 'rating' FROM books order by rating desc limit " + [num], function (err, rows) {
    var result;
    if (err) {
      result = {'data': 'SQL error'};
    }
    else {
      result = res.json(rows[0]);
    }
    db.end();
    return result;
 }) 

};
exports.getBooksPagesNumber = function(req, res){

  var db = database_connect();
  var num = req.params.id;  

  db.query('SELECT id, name, pages_number FROM books where id = ?',[id], function (err, rows) {
    var result;
    if (err) {
      result = {'data': 'SQL error'};
    }
    else {
      result = res.json(rows[0]);
    }
    db.end();
    return result;
 }) 

};