var sql = require("./db.js");

exports.getGenres = function(req, res) {

  var db = sql.database_connect();
  db.query('SELECT id, name FROM genres', function (err, rows) {

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
