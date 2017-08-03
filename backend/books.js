var fs = require("fs");
var path = require('path');
var pool = require('./db/db.js');

exports.getBookById = function(req, res) {
  var id = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT a.name as author, g.name as genre, b.id, b.name, b.id_genre, b.big_pic, b.description " + 
      " FROM books b, authors a, genres g WHERE b.id = " + id + " AND b.id_author = a.id AND b.id_genre = g.id", function (err, rows) {
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

exports.getBooksMostPopular = function(req, res) {
  var num = req.params.num;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT b.id, b.name, a.name AS author, b.id_author, b.small_pic, b.sum_points/b.votes_number as 'rating' FROM books b, authors a WHERE b.id_author = a.id ORDER BY rating DESC LIMIT " + [num], function (err, rows) {
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

exports.getBookInfo = function(req, res) {
  var id = req.params.id;
  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT id, name, pages_number FROM books WHERE id = " + id, function (err, rows) {
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

exports.getPageContent = function(req, res) {
  var id = req.params.id;
  var pageNum = req.params.pageNum;
  var booksFolder = '/books';

  pool.getConnection(function(err,connection) {
    if (err) {
      connection.release();
      res.status(500).send(err);
    }
    connection.query("SELECT file FROM books WHERE id = " + [id], function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).send(err);
      }
      else {
        var dirName = rows[0].file;

        fs.readFile(path.join(__dirname, booksFolder, dirName, pageNum + '.txt'), 'utf8', (err, data) => {
          if (err) {
            res.status(500).send(err);
          }
          res.json({'content': data});
        });
      }
    }); 
  });
};

