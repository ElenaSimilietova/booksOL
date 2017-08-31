var fs = require("fs");
var path = require('path');
var pool = require('./db/db.js');
var jwt = require("jsonwebtoken");

exports.getBookById = function(req, res) {
  var id = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT a.name AS author, g.name AS genre, b.id, b.name, b.id_genre AS genreId, b.pages_number AS pagesNum, b.description, " + 
      " CASE WHEN SUM(r.points)/COUNT(r.points) is NULL THEN 0 ELSE SUM(r.points)/COUNT(r.points) END AS 'rating'" +
      " FROM books b LEFT JOIN books_ratings r ON b.id = r.id_book, authors a, genres g WHERE b.id = " + id + " AND b.id_author = a.id AND b.id_genre = g.id GROUP BY b.id", function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send({});
      }
      else {
        res.json(rows[0]);
      }
    }); 
  });
};

exports.getBooksMostPopular = function(req, res) {
  var num = req.params.num;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send({});
    }
    connection.query("SELECT b.id, b.name, b.id_author, a.name AS author, CASE WHEN SUM(r.points)/COUNT(r.points) is NULL THEN 0 ELSE SUM(r.points)/COUNT(r.points) END as 'rating' " + 
    " FROM authors a, books b LEFT JOIN books_ratings r ON b.id = r.id_book WHERE b.id_author = a.id GROUP BY b.id ORDER BY rating DESC LIMIT " + num, function (err, rows) {
    
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

exports.getBookInfo = function(req, res) {
  var id = req.params.id;
  var token = req.headers['access-token'];
  var result = {};

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send({});
        } else {

          connection.query("SELECT id, name, pages_number FROM books WHERE id = " + id, function (err, rows) {
            if (err) {
              res.status(500).send({});
              connection.release();
            }
            else {
              result = rows[0];
              connection.query("SELECT current_page FROM reading_lists WHERE id_user = " + user.userID + " AND id_book = " + id, function (err, rows2) {
                if (rows2.length > 0) {
                  result.currentPage = rows2[0].current_page;
                } 
                res.json(result);
                connection.release();
              });
            }
          }); 
        }
      });
    }
  });
};

exports.getPageContent = function(req, res) {
  var id = req.params.id;
  var pageNum = req.params.pageNum;
  var token = req.headers['access-token'];

  var booksFolder = '/books';

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          connection.release();
          res.status(500).send({});
        }
        connection.query("SELECT file FROM books WHERE id = " + [id], function (err, rows) {
          
          if (err) {
            connection.release();
            res.status(500).send({});
          }
          else {
            var dirName = rows[0].file;

            fs.readFile(path.join(__dirname, booksFolder, dirName, pageNum + '.txt'), 'utf8', (err, data) => {
              if (err) {
                res.status(500).send({});
              }
              // Check, if book is in the reading lists table, update there current page information
              connection.query("UPDATE reading_lists SET current_page = " + pageNum + " WHERE id_user = " + 
              user.userID + " AND id_book = " + id, function (err, rows) {
                res.json({'content': data});
                connection.release();
              });
    
            });
          }
        }); 
      });
    }
  });
};

exports.getBooksByGenre = function(req, res) {
  var genreID = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      res.status(500).send({});
    }
    connection.query("SELECT name FROM genres WHERE id = " + genreID, function (err, rows) {
      if (err) {
        res.status(500).send({});
        connection.release();
      } else {
        if (rows.length > 0) {
          var genre = rows[0];

          connection.query("SELECT b.id, b.name AS title, b.description, b.pages_number AS pagesNum, a.id AS authorID, a.name AS authorName  FROM books b, authors a  WHERE b.id_genre = " + genreID +
            " AND b.id_author = a.id", function (err, rows) {

              if (err) {
                res.status(500).send({});
              } else {
                res.json({ genre: genre, books: rows });
              }
              connection.release();
          });
        } 
      }
    }); 
  });
  /*
  var genreId = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      res.status(500).send(err);
    }
    connection.query("SELECT b.id, b.name, a.name AS author, g.name AS genre FROM books b, authors a, genres g WHERE b.id_author = a.id AND b.id_genre = g.id AND g.id = '" + [genreId] + "'" + " ORDER BY name;", function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send(err);
      }
      else {
        if (rows.length > 0){
          res.json(rows);
        }
        else{
          connection.query("SELECT g.name AS genre FROM genres g WHERE g.id = '" + [genreId] + "'", function (err, rows) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.json(rows);
          }
        });
        }
      }
    }); 
  });*/
};

exports.getBooksByAuthor = function(req, res) {
  var authorID = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      res.status(500).send({});
    }
    connection.query("SELECT name FROM authors WHERE id = " + authorID, function (err, rows) {
      if (err) {
        res.status(500).send({});
        connection.release();
      } else {
        if (rows.length > 0) {
          var author = rows[0];

          connection.query("SELECT b.id, b.name AS title, b.description, b.pages_number AS pagesNum, g.id AS genreID, g.name AS genreName  FROM books b, genres g  WHERE b.id_author = " + authorID +
            " AND b.id_genre = g.id", function (err, rows) {

              if (err) {
                res.status(500).send({});
              } else {
                res.json({ author: author, books: rows });
              }
              connection.release();
          });
        } 
      }
    }); 
  });
  
};

exports.savePageIntoReadingList = function(req, res) {
  var bookID = req.body.bookID,
      page = req.body.page;
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({ message: 'Token error' });
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("SELECT * FROM reading_lists WHERE id_user = " + user.userID + " AND id_book = " + bookID, function (err, rows) {
            if (err) {
              res.status(500).send(err);
              connection.release();
            } else {
              if (rows.length > 0) {
                connection.query("UPDATE reading_lists SET current_page = " + page + " WHERE id_user = " + user.userID +
                " AND id_book = " + bookID, function (err, result) {
                  if (err) {
                    connection.release();
                    res.status(500).send({});
                  } else {
                    res.status(200).send({});
                  }
                });
              } else {
                connection.query("INSERT INTO reading_lists (id_user, id_book, current_page) VALUES (" + user.userID + ", " + 
                bookID + ", " + page + ") ", function (err, result) {
                  if (err) {
                    connection.release();
                    res.status(500).send({});
                  } else {
                    res.status(200).send({});
                  }

                });
              }
            }
          });   
        }
      });
    }
  });

}

exports.deletePagesFromReadingList = function(req, res) {
  var bookID = req.body.bookID;
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({ message: 'Token error' });
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("DELETE FROM reading_lists WHERE id_user = " + user.userID + " AND id_book = " + bookID, function (err, rows) {
            if (err) {
              res.status(500).send({});
              connection.release();
            } else {
              res.status(200).send({});
            }
          });   
        }
      });
    }
  });
}

exports.saveRating = function(req, res) {
  var bookID = req.body.bookID,
      points = req.body.rating;
    
  var token = req.headers['access-token'];
  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err,connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("UPDATE books_ratings SET points = " + points + " WHERE id_user = " + user.userID +
          " AND id_book = " + bookID , function (err, rows) {
            if (err) {
              res.status(500).send({});
              connection.release();
            } else {
              if (rows.affectedRows == 0) {
                connection.query("INSERT INTO books_ratings (id_book, id_user, points) VALUES (" + bookID + ", " + user.userID +
                ", " + points + " )" , function (err, rows2) {
                  if (err) {
                    res.status(500).send({});
                    connection.release();
                  } 
                });
              }

              connection.query("SELECT CASE WHEN SUM(r.points)/COUNT(r.points) is NULL THEN 0 ELSE SUM(r.points)/COUNT(r.points) END AS 'rating' " + 
              " FROM books_ratings r WHERE r.id_book = " + bookID + " GROUP BY r.id_book", function (err, rows) {
              
                connection.release();
                if (err) {
                  res.status(500).send({});
                }
                else {
                  res.json(rows[0]);
                }
              }); 
            }
          });   
        }
      });
    }
  });

}