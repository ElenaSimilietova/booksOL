var sql = require("./db.js");

exports.getAuthorsMostPopular = function(req, res){

  var num = req.params.num;
  var db = sql.database_connect();
  
  db.query("SELECT id, name FROM authors order by rating desc limit " + [num], function (err, rows) {
   var result;
    if (err) {
      result = {'error': 'SQL error'};
    }
    else {
      result = res.json(rows);
    }
    db.end();
    
    return result;
 }); 
};