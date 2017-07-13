var express = require("express");
var app = express();
var path = require("path");


var database = require('./database'); 
var books_ol = require('./database/books_ol');  


app.use(express.static(path.join(__dirname,"public_www/")));



 










// viewed at http://localhost:
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});




app.listen(3000);
