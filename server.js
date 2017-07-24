var express = require("express");
var app = express();
var path = require("path");

var books = require("./backend/books.js");
var genres = require("./backend/genres.js");
var authors = require("./backend/authors.js");

app.get('/api/books/:id', books.getBookById);
app.get('/api/books/content/:id/:pageNum', books.getPageContent);
app.get('/api/books/info/:id', books.getBookInfo);
app.get('/api/books/popular/:num', books.getBooksMostPopular); 

app.get('/api/genres', genres.getGenres);

app.get('/api/authors/popular/:num', authors.getAuthorsMostPopular);
 
app.use(express.static(path.join(__dirname, 'app/')));

// viewed at http://localhost:
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('server started: localhost:3000');
app.listen(3000);