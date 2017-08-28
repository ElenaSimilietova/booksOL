var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var config = require("./config");

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var books = require("./backend/books.js");
var genres = require("./backend/genres.js");
var authors = require("./backend/authors.js");
var users = require("./backend/users.js");
var search = require("./backend/search.js");

app.set('tokenString', config.tokenString);

app.get('/api/books/:id', books.getBookById);
app.get('/api/books/content/:id/:pageNum', books.getPageContent);
app.get('/api/books/info/:id', books.getBookInfo);
app.get('/api/books/popular/:num', books.getBooksMostPopular);
app.get('/api/books/genre/:id', books.getBooksByGenre);
app.get('/api/books/author/:id', books.getBooksByAuthor);
app.post('/api/books/page/save', books.savePageIntoReadingList);
app.delete('/api/books/page/delete', books.deletePagesFromReadingList);

app.get('/api/genres', genres.getGenres);

app.get('/api/authors/popular/:num', authors.getAuthorsMostPopular);

app.get('/api/users/payment/:email', users.getPaymentPeriod);
app.get('/api/users/email/check/:email', users.checkEmail);
app.post('/api/users/save', users.saveUser);
// <<<<<<< HEAD
// app.post('/api/users/sign-in', users.signIn);
// app.post('/api/users/log-out', users.logOut);
// app.post('/api/users/profile/', users.paymentPeriod);
// =======

app.post('/api/sign-in', users.signIn);
app.post('/api/log-out', users.logOut);
// >>>>>>> 8376985d50b43d515af5e83c729cc5887d1a3510

app.get('/api/search/:searchString', search.getSearchResults);
 
app.use(express.static(path.join(__dirname, 'app/')));

// viewed at http://localhost:
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('server started: localhost:3000');
app.listen(3000);