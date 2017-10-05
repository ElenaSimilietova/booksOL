var pool = require('./db/db.js');
var jwt = require("jsonwebtoken");

exports.getRandom = function(req, res){
  var num = req.params.num;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT id, name FROM authors ORDER BY RAND() LIMIT " + num, function (err, rows) {
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

exports.getAuthors = function(req, res){
  var num = req.params.num;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT id, name FROM authors ORDER BY name ASC ", function (err, rows) {
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

exports.saveAuthor = function(req, res) {
  var author = decodeURIComponent(req.body.author);
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send({});
        } else {
          connection.query("INSERT INTO authors SET name = '" + author + "'", function (err, result) {
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