var pool = require('./db/db.js');

exports.getSearchResults = function(req, res) {
  var searchString = decodeURIComponent(req.params.searchString);
  var response = {};
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT id, name FROM authors WHERE MATCH (name) " + 
        "AGAINST ('" + searchString + "' IN NATURAL LANGUAGE MODE)", function (err, authorsRows) { 
      if (err) {
        connection.release();
        res.status(500).send({});
      }
      else {
        if (authorsRows.length > 0) {
          response.authors = authorsRows;
        } else {
          response.authors = {};
        }
        connection.query("SELECT b.id, b.name AS title, a.name AS author, b.id_author " +
        "FROM books b, authors a WHERE b.id_author = a.id AND MATCH (b.name) " + 
        "AGAINST ('" + searchString + "' IN NATURAL LANGUAGE MODE)", function (err, booksRows) {
          connection.release();
          if (err) {
            res.status(500).send({});
          }
          else {
            if (booksRows.length > 0) {
              response.books = booksRows;
            } else {
              response.books = {};
            }
            res.json(response);
          }
        }); 
      }
    }); 
  });
};