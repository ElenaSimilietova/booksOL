var pool = require('./db/db.js');
var jwt = require("jsonwebtoken");

exports.getGenres = function(req, res) {
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT id, name FROM genres order by name", function (err, rows) {
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

exports.saveGenre = function(req, res) {
  var genre = decodeURIComponent(req.body.genre);
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    console.log(user);
    if (err || !user || user.role!='administrator') {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send({});
        } else {
          connection.query("INSERT INTO genres SET name = '" + genre + "'", function (err, result) {
            connection.release();
            if (err) {
              res.status(500).send({});
            }
            else {
              res.status(200).send({id: result.insertId});
            }
          }); 
        }
      });
    }
  });
}
