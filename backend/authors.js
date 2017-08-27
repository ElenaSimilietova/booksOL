var pool = require('./db/db.js');

exports.getAuthorsMostPopular = function(req, res){
  var num = req.params.num;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT id, name FROM authors ORDER BY rating DESC LIMIT " + [num], function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send({});
      }
      else {
        res.json(rows);
      }
    }); 
  });
};