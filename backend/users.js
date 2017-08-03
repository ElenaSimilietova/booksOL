var pool = require('./db/db.js');
const bcrypt = require('bcrypt');

exports.checkEmail = function(req, res){

  var email = req.params.email;

  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT count(*) AS count FROM users WHERE email = '" + email + "'", function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.json(rows[0]);
      }
    }); 
  });
};

exports.saveUser = function(req, res){

  var firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      password = req.body.password;
      role = req.body.role;

  bcrypt.hash(password, 12, function(err, hash) {
    if (err) {
      res.status(500).send(err);
    } else {

      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send(err);
        }
        connection.query("INSERT INTO users (first_name, last_name, email, password, registration_date, id_role) VALUES ('" 
          + firstName + "', '" + lastName + "', '" + email + "', '" + hash 
          + "', NOW(), " + role + ")", function (err, rows) {

          connection.release();
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.status(200).send('{}');
          }
        }); 
      });
    }
  });
};