var sql = require("./db.js");

exports.authorsNum = function(req, res){

  var num = req.params.num;

  var db = database_connect();

  db.query("SELECT id, name FROM authors order by rating asc limit " + [num], function (err, rows) {
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

exports.authorsPop = function(req, res){

  var num = req.params.num;

  var db = database_connect();

  db.query("SELECT id, name FROM authors order by rating desc limit " + [num], function (err, rows) {
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