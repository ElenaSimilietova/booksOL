var express = require("express");
var app = express();
var path = require("path");

var dbscripts = require("./app/dbscripts/sql.js"); 

app.get('/api/books/:id', dbscripts.getBooksbyId); 
app.get('/genres', dbscripts.genres); 

app.use(express.static(path.join(__dirname, 'app/')));

// viewed at http://localhost:
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('server started: localhost:3000');
app.listen(3000);