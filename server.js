//Environment Variables
var port = process.env.PORT; // Port of server

//Libraries
var getenv = require('getenv'); // Library for Enviroment Variables, Used for Db Conn
var mysql = require('promise-mysql'); // Mysql Library, With Node Promises
var sha512 = require('sha512'); // Sha512 Library, Sha512 is a hash
var bodyParser = require('body-parser'); // Library for parsing data
var jsonParser = bodyParser.json(); // Using Data type Json
var cors = require("cors"); // Library for handling access headers
//Modules
var user = require("./modules/user.js"); // Object of our module User.js
var borrow = require("./modules/borrow.js"); // Object of our module Borrow.js
var search = require("./modules/search.js");
var books = require("./modules/books.js");
var requests = require("./modules/requests.js");
var returns = require("./modules/returns.js");
var statusofbooks = require("./modules/statusofbooks.js");
//Server Don't worry about this
var express = require('express'); // Framework for Node
var app = express(); // Establishing Express App
app.use(express.logger());
app.use(cors()); // Cors to Handle Url Authentication 
app.use(bodyParser.json()); // Using Body Parser
app.set('jwtTokenSecret', 'D2A8EC7BF22AECBEB745FDAAA892CDCD8A678D4E94C6452D58AD92C4D861A0C0839DEA1057CA539810FADF9806090D9EB6F610FE1AF6BC2A0DEA3D69455116AE'); // JWT Secret
var server = app.listen(port); // Set Port


//DataBase connection using promises
var con = null; 
mysql.createConnection({
    host: getenv('IP'),
    user: getenv('C9_USER'),
    password: "",
    database: "c9"
}).then(function(connection) { con = connection });
app.use("/", express.static("./client/")); // HERE
/*app.get('/js/main.js',function(req, res) {
   res.sendfile("./client/js/main.js") 
});
app.get('/js/Service/addBookService.js',function(req, res) {
   res.sendfile("./client/js/Service/addBookService.js");
});
app.get('/js/Service/newBooksService.js',function(req, res) {
    res.sendfile("./client/js/Service/newBooksService.js");
});
app.get("/js/Service/showPagesService.js",function(req, res) {
   res.sendfile("./client/js/Service/showPagesService.js"); 
});
app.get('/css/materialize.min.css',function(req, res) {
   res.sendfile("./client/css/materialize.min.css"); 
});
app.get('/js/materialize.min.js',function(req, res) {
   res.sendfile("./client/js/materialize.min.js"); 
});
app.get('/js/Service/borrowedBooksService.js',function(req, res) {
   res.sendfile("./client/js/Service/borrowedBooksService.js"); 
});
app.get('/js/Service/requests.js',function(req, res) {
    res.sendfile("./client/js/Service/requests.js");
});
app.get('/js/Service/borrowedBooksService.js',function(req, res) {
   res.sendfile('./client/js/Service/borrowedBooksService.js'); 
});
app.get('/js/Service/searchService.js',function(req, res) {
   res.sendfile('./client/js/Service/searchService.js'); 
});
app.get('/js/Service/userService.js',function(req, res) {
   res.sendfile('./client/js/Service/userService.js'); 
});
app.get('/js/Service/borrowService.js',function(req, res) {
   res.sendfile('./client/js/Service/borrowService.js'); 
});
app.get('/fonts/roboto/Roboto-Regular.woff2',function(req, res) {
   res.sendfile('./client/fonts/roboto/Roboto-Regular.woff2'); 
});
app.get('/homepage.html',function(req, res) {
   res.sendfile('./client/homepage.html'); 
});
app.get('/login.html',function(req, res) {
   res.sendfile('./client/login.html'); 
}); */ // NEVER TO BE SEEN OR SPOKEN OFF
//Handling Requests of type POST, used to send Data to the server or database
app.post('/login', function(req, res) { // Request to Log User IN
    user.loginUser(req, res, con,app.get('jwtTokenSecret')); // Calling function .loginUser() of Object User passing the input, output and database connection
});
app.post('/Signup', function(req, res) {// Request to Sign User Up
    user.newUser(req, res, con,app.get('jwtTokenSecret')); // Calling function .newUser() of Object User passing the input, output and database connection
});
app.post('/borrow',function(req, res) {// Request to Borrow a Book
    borrow.borrowBooks(req,res,con,app.get('jwtTokenSecret')); // Calling function .borrowBooks() of Object borrow passing the input, output and database connection
});
app.post('/addBook',function(req, res) {
    books.addBook(req,res,con,app.get('jwtTokenSecret'));
});
//New 
app.post('/postresponse', function(req, res) {
    requests.postResponse(req,res,con,app.get('jwtTokenSecret'));
});
app.post('/returnbook', function(req, res) {
    returns.returnBook(req,res,con,app.get('jwtTokenSecret'));
});
app.post('/takeBackBook', function(req, res) {
    statusofbooks.takeBackBook(req,res,con,app.get('jwtTokenSecret'));
});
app.post('/addFeaturedBooks', function(req, res) {
    books.addFeaturedBook(req,res,con,app.get('jwtTokenSecret'));
});
app.post('/removeFeaturedBooks', function(req, res) {
    books.removeFeaturedBook(req,res,con,app.get('jwtTokenSecret'));
});
app.post('/getBookDetails', function(req, res) {
   books.getBookDetails(req, res, con);
});

// Handling Requests of type GET, used to get Data from the server or databae
app.get("/getSalt",function(req, res) {
   user.getSalt(req,res,con); 
});
app.get('/verify', function(req, res) { // Request to verify email after signup, This request is from the browser after email link is clicked
    user.verify(req, res, con,app.get('jwtTokenSecret')); // Calling function .verify() of Object User passing the input, output and database connection
});
app.get('/newbooks', function(req, res) { // Request to get a User's follower's New Books to be displayed on the timeline. This request is ajax call from front-end made after succesful login
    user.followerBooks(req, res, con,app.get('jwtTokenSecret')); // Calling function .followerBooks() of Object User passing the uuid(unique user id), output and database connection
});
app.get('/search',function(req, res) {
    search.getSearch(req,res,con);
});
app.get('/userDetails', function(req, res) {
    user.userDetails(req,res,con,app.get('jwtTokenSecret'));
});
app.get('/searchBooks', function(req, res) {
   search.getBooks(req,res,con); 
});
app.get('/searchAuthor',function(req, res) {
   search.getAuthor(req,res,con); 
});
app.get('/searchGenre', function(req, res) {
   search.getGenre(req,res,con); 
});
app.get('/showAuthor',function(req, res) {
    books.getAuthor(req,res,con);
});
app.get('/showGenre',function(req, res) {
    books.getGenre(req,res,con);
});
// New Stuff
app.get('/requests', function(req, res) {
    requests.getRequests(req, res, con,app.get('jwtTokenSecret'));
});
app.get('/userrequests', function(req, res) {
    requests.getUserRequests(req, res, con,app.get('jwtTokenSecret'));
});
app.get('/borrowedBooks', function(req, res) {
    returns.getBorrowedBooks(req, res, con,app.get('jwtTokenSecret'));
});
app.get('/lentBooks', function(req, res) {
    statusofbooks.getLentBooks(req, res, con,app.get('jwtTokenSecret'));
});
app.get('/featuredBooks', function(req, res) {
    books.getFeaturedBooks(req, res, con,app.get('jwtTokenSecret'));
});