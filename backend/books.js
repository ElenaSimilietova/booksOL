var fs = require("fs");
var path = require('path');
var pool = require('./db/db.js');
var jwt = require("jsonwebtoken");
var formidable = require('formidable');
var PDFParser = require("./../node_modules/pdf2json/PDFParser");
var rimraf = require('rimraf');

exports.getBookById = function(req, res) {
  var id = req.params.id;

  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      console.log(err);
      res.status(500).send({});
    }
    connection.query("SELECT a.name AS author, g.name AS genre, b.id, b.name, b.id_author, b.id_genre, b.pages_number AS pagesNum, b.description, " + 
      " CASE WHEN SUM(r.points)/COUNT(r.points) is NULL THEN 0 ELSE SUM(r.points)/COUNT(r.points) END AS 'rating'" +
      " FROM books b LEFT JOIN books_ratings r ON b.id = r.id_book, authors a, genres g WHERE b.id = " + id + " AND b.id_author = a.id AND b.id_genre = g.id GROUP BY b.id", function (err, rows) {
      connection.release();
      if (err) {
        console.log(err);
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
        var dirName = id;

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

exports.getBooksByLetter = function(req, res) {
  var letter = req.params.letter; 
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err, connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("SELECT b.id, b.name AS title, b.id_author, a.name AS author" + 
          " FROM authors a, books b WHERE SUBSTRING(b.name, 1, 1) = '" + letter + 
          "' AND b.id_author = a.id ORDER BY b.name ASC ", function (err, rows) {
            connection.release();
            if (err) {
              res.status(500).send({});
            }
            else {
              res.json(rows);
            }  
          });
        }
      });
    }
  });
}

exports.getBooksMappingByLetter = function(req, res) {
  var token = req.headers['access-token'];
  
  var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err, connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          var promises = [];
          alphabet.forEach(function(letter, alphabet) {
            var p = new Promise((resolve, reject) => {
              connection.query("SELECT count(name) AS count" + 
              " FROM books WHERE SUBSTRING(name, 1, 1) = '" + letter + "'", function(err, rows) {

                if (err) {
                  res.status(500).send({});
                }
                else {
                  var obj = {};
                  obj[letter] = rows[0].count;
                  resolve(obj);
                }  
              });
            }); 
            promises.push(p);
          });

          Promise.all(promises).then(function(values) {
            connection.release();
            res.json(values);
          });
        }
      });
    }
  });
}

exports.uploadBook = function(req, res) {
  var token = req.headers['access-token'];

  var form = new formidable.IncomingForm();
  var newBook = {};

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {

      form.parse(req, function(err, fields, files) {
        if (err) {
          // Check for and handle any errors here.
           res.status(500).send({});
           return;
        }
      });

      // TODO: move path settings into config file
      form.on('fileBegin', function (name, file){
          
          switch(name) {
            case 'bigImage':
              file.path = path.join(__dirname, '/temp_uploads/', file.name);
              newBook.bigImage = file.name;
              break;
            case 'smallImage':
              file.path = path.join(__dirname, '/temp_uploads/', file.name);
              newBook.smallImage = file.name;
              break;
            case 'pdf':
              file.path = path.join(__dirname, '/books/_pdf/', file.name);
              newBook.pdf = file.name;
              break;
            
          }
          
      });

      form.on('file', function (name, file) {
          console.log('Uploaded ' + file.name);
      });

      form.on('field', function(name, value) {
        switch(name) {
          case 'title':
            newBook.title = value;
            break;
          case 'author':
            newBook.author = value;
            break;
          case 'genre':
            newBook.genre = value;
            break;
          case 'description':
            newBook.description = value;
            break;
        }
      });

      form.on('end', function() {

        pool.getConnection(function(err, connection) {
          if (err) {
            res.status(500).send({});
            connection.release();
          } else {
            connection.query("INSERT INTO books SET name = '" + newBook.title + "', id_author = " + newBook.author + 
            ", id_genre = " + newBook.genre + ", description = '" + newBook.description + "'", function (err, result) {
              if (err) {
                res.status(500).send({});
              }
              else {
                var bookID = result.insertId;
                var error = false;

                //Moving images into right folders and parsing pdf

                var bigImageFileOld = path.join(__dirname, '/temp_uploads/', newBook.bigImage);
                var smallImageFileOld = path.join(__dirname, '/temp_uploads/', newBook.smallImage);
                var bigImageDir = path.join(__dirname, '/../app/images/books/big/');
                var smallImageDir = path.join(__dirname, '/../app/images/books/small/');
                var pdfFile =  path.join(__dirname, '/books/_pdf/', newBook.pdf);
                
                var promises = []; 
                
                // Moving big image into right folder
                var promiseBigImage = new Promise((resolve, reject) => {
                  fs.rename(bigImageFileOld, path.join(bigImageDir, bookID + '.jpg'), function (err) {
                    if (err) {
                      reject();
                    }
                    else {
                      resolve();
                    }
                  });
                });
                promises.push(promiseBigImage);

                // Moving small image into right folder
                var promiseSmallImage = new Promise((resolve, reject) => {
                  fs.rename(smallImageFileOld, path.join(smallImageDir, bookID + '.jpg'), function (err) {
                    if (err) {
                      reject();
                    }
                    else {
                      resolve();
                    }
                  });
                });
                promises.push(promiseSmallImage);
                
                // Parsing a book
                var promiseParseBook = new Promise((resolve, reject) => {

                  var pdfParser = new PDFParser(this, 1);
                  var destinationPath = 'books';
                  var dirName = bookID;
                  var txtFileName;

                  pdfParser.on("pdfParser_dataError", errData => {
                      console.log(errData.parserError);
                  });
                  pdfParser.on("pdfParser_dataReady", pdfData => {

                    var dir = path.join(__dirname, destinationPath, dirName + '\\');
                    var pagesNumber = pdfParser.data.Pages.length;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, 0744);
                    }
                    
                    for (page in pdfParser.data.Pages) {

                        var result = '';
                        y = 0;
                        
                        for (textBlock in pdfParser.data.Pages[page].Texts) {
                            
                            for(r in pdfParser.data.Pages[page].Texts[textBlock].R) {
                                if (y < pdfParser.data.Pages[page].Texts[textBlock].y) {
                                        result += '<br>';
                                        y = pdfParser.data.Pages[page].Texts[textBlock].y;
                                }
                                result += decodeURIComponent(pdfParser.data.Pages[page].Texts[textBlock].R[r].T); 
                            }
                        }

                        txtFileName = (parseInt(page) + 1) + '.txt';
                        
                        fs.writeFile(path.join(dir, txtFileName), result, 'utf8', (err) => {                     
                            if (err) {
                              reject();
                            }
                        });
                      };

                      connection.query("UPDATE books SET pages_number = " + pagesNumber + " WHERE id =" + bookID, function (err, result) {
                        if (err) {
                          reject();
                        }
                        else {
                          resolve();   
                        }
                      });
                  });

                  pdfParser.loadPDF(pdfFile);
                  
                });

                promises.push(promiseParseBook); 

                Promise.all(promises).then(function() {
                  res.status(200).send({});
                }, function() {
                  res.status(500).send({});
                });

              }
            });
          }
        });

      });
    }
  });

  return;
}

exports.deleteBook = function(req, res) {
  var bookID = req.body.id;
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err, connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("DELETE FROM books WHERE id = " + bookID, function(err, result) {
            if (err) {
                res.status(500).send({});
              }
              else {
                rimraf(path.join(__dirname, '\\books\\', bookID + '\\'), function () { 
                  console.log('done'); 
                  res.status(200).send({});
                });
              }

          });
        }
      });
    }
  });

}

exports.getData = function(req, res) {
  var token = req.headers['access-token'];

  jwt.verify(token, req.app.get('tokenString'), function(err, user) {
    if (err || !user) {
      res.status(401).send({});
    } else {
      pool.getConnection(function(err, connection) {
        if (err) {
          res.status(500).send(err);
          connection.release();
        } else {
          connection.query("SELECT b.name as title, b.id, b.id_author, a.name as author, r.current_page FROM books b, authors a, reading_lists r " + 
            "WHERE b.id_author = a.id AND b.id = r.id_book AND r.id_user = " + user.userID, function(err, rows) {
            if (err) {
                res.status(500).send({});
              }
              else {
                res.json(rows);
              }

          });
        }
      });
    }
  });

}

