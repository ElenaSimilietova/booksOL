var sql = require("./db.js");
const bcrypt = require('bcrypt');

exports.checkEmail = function(req, res){

  var email = req.params.email;
  var db = sql.database_connect();
  
  db.query("SELECT count(*) AS count FROM users WHERE email = '" + [email] + "'", function (err, rows) {
   var result;
    if (err) {
      result = {'error': 'SQL error'};
    }
    else {
      result = res.json(rows[0]);
    }
    db.end();
    
    return result;
 }); 
};

exports.saveUser = function(req, res){

  var firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      password = req.body.password;
      role = req.body.role;

  var db = sql.database_connect();

   bcrypt.hash(password, 12, function(err, hash) {
     if (err) {
       res.status(500).send(err);
     } else {
       db.query("INSERT INTO users (first_name, last_name, email, password, registration_date, id_role) VALUES ('" 
        + firstName + "', '" + lastName + "', '" + email + "', '" + hash 
        + "', NOW(), " + role + ")", function (err, rows) {
          
          db.end();
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.status(200).send('{}');
          }
      }); 
     }
   });
};