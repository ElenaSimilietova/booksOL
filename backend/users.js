var pool = require('./db/db.js');
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");

exports.checkEmail = function(req, res) {

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

exports.saveUser = function(req, res) {

  var firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      password = req.body.password,
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

exports.signIn = function(req, res) {
  var email = req.body.email,
      password = req.body.password;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT id, password FROM users WHERE email = '" + email  + "'", function (err, rows) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (rows.length > 0) {
          var passhwordHash = rows[0].password;
          bcrypt.compare(password, passhwordHash, function(err, result) {
            if(err) {
              connection.release();
              res.status(500).send(err);
            } else {
              if(result) {
                  // Passwords match
                  var token = jwt.sign({userID : rows[0].id}, req.app.get('tokenString'), { expiresIn: 3600 }, function(err, token) {
                  if(err) {
                    connection.release();
                    res.status(500).send(err);
                  } else {
                    res.json({token: token, expiresIn: (Date.now() + 3600 * 1000)});
                  }
                });
              } else {
                // Passwords don't match
                connection.release();
                res.status(401).send(err);
              }
            }
          });
        } else {
          res.status(401).send(err);
        }
      }
    }); 
  });

};

exports.logOut = function(req, res) {
  var token = req.headers['access-token'];
  
  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(500).send({ message: 'Token error' });
    } else {

      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send({message: 'DB connection error'});
        }

        connection.query("INSERT INTO invalid_tokens (id_user, token) VALUES ("
          + user.userID + ", '" + token + "')", function (err, rows) {

          connection.release();
          if (err) {
            res.status(500).send({ message: 'Logout error'});
          }
          else {
            res.status(200).send('{}');
          }
        });
      });
    }
  });
};
