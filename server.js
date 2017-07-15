var express = require("express");
var app = express();
var path = require("path");

var books = require("./backend/books.js");
var genres = require("./backend/genres.js");
var authors = require("./backend/authors.js");

app.get('/api/books/:id', books.getBookById);
app.get('/api/genres', genres.getGenres);
app.get('/api/äuthors/:num', authors.authorsNum);
app.get('/api/books/info/:id', books.booksPagesNumber);
app.get('/api/äuthors/popular/:num', authors.authorsPop);

app.use(express.static(path.join(__dirname, 'app/')));

// viewed at http://localhost:
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('server started: localhost:3000');
app.listen(3000);