var sql = require("./db.js");

exports.getBookById = function(req, res){
  
  var db = sql.database_connect();
  var id = req.params.id;

  db.query('SELECT id, name, id_genre, big_pic, description FROM books WHERE id = ?',[id], function (err, rows) {
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
