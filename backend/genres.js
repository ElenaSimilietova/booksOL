var pool = require('./db/db.js');

exports.getGenres = function(req, res) {
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT id, name FROM genres order by name", function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.json(rows);
      }
    }); 
  });
};
