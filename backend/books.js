var fs = require("fs");
var path = require('path');
var sql = require("./db.js");

exports.getBookById = function(req, res) {
  
  var db = sql.database_connect();
  var id = req.params.id;

  db.query('SELECT id, name, id_genre, big_pic, description FROM books WHERE id = ?',[id], function (err, rows) {
    var result;

    if (err) {
      result = {'data': 'SQL error'};
    }
    else {
      result = res.json(rows[0]);
    }
    db.end();
    return result;
 }); 
  
};

exports.getPageContent = function(req, res) {

  var db = sql.database_connect();
  var id = req.params.id;
  var pageNum = req.params.pageNum;
  var booksFolder = '/books';

  db.query('SELECT file FROM books WHERE id = ?',[id], function (err, rows) {
    var result;

    if (err) {
      result = {'data': 'SQL error'};
      db.end();
      return result;
    }
    else {
      var dirName = rows[0].file;
      db.end();

      return fs.readFile(path.join(__dirname, booksFolder, dirName, pageNum + '.txt'), 'utf8', (err, data) => {
        if (err) throw err;
        return res.json({'content': data});
      });
    }
  }); 
};
