//Imports
const fs = require('fs');
const Fuse = require("fuse.js");
var exports = module.exports = {};

exports.getSearch = async function(req, res, con) {
    var optionsBooks = {
        shouldSort: true,
        threshold: 0.35,
        includeScore: true,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
                name: 'title',
                weight: 0.4
            },
            {
                name: 'author',
                weight: 0.3
            },
            {
                name: 'genre',
                weight: 0.2
            },
            {
                name: 'year',
                weight: 0.1
            }
        ]
    };
    var books = JSON.parse(fs.readFileSync('./static/books.json', 'utf8'));
    //    var users = JSON.parse(fs.readFileSync('./static/users.json', 'utf8'));
    // var userFuse = new Fuse(users, optionsUsers)
    //console.log(book);
    var bookFuse = new Fuse(books, optionsBooks); // "list" is the item array
    console.log(req.query.search);
    var resultBooks = bookFuse.search(req.query.search);
 //   var resultUsers = userFuse.search(req.query.search);
    var resultUsers = await con.query(`SELECT * FROM Users WHERE Name LIKE "${req.query.search}%"`)
  //  console.log(`SELECT * FROM Users WHERE Name LIKE "${req.query.search}%"`);
  //  console.log(resultUsers);
    if (resultBooks != [] || resultUsers != []) {
        res.status(200).json({
            books: resultBooks,
            users: resultUsers
        });
    }
    else {
        res.status(400)
    }
}
exports.getBooks = function(req, res, con) {
    console.log(req.query.search)
    var options = {
        shouldSort: true,
        threshold: 0.2,
        includeScore: true,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
            name: 'title',
            weight: 1
        }]
    };
    var books = JSON.parse(fs.readFileSync('./static/books.json', 'utf8'));
    var fuse = new Fuse(books, options); // "list" is the item array
    var result = fuse.search(req.query.search);
    if (result) {
        console.log(result);
        res.status(200).json(result);
    }
    else {
        res.status(400)
    }

}
exports.getAuthor = async function(req, res, con) {
    var options = {
        shouldSort: true,
        threshold: 0.2,
        includeScore: true,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
            name: 'Name',
            weight: 1
        }]
    };
    let author = await con.query(`SELECT * FROM Authors`);
    var fuse = new Fuse(author, options); // "list" is the item array
    var result = fuse.search(req.query.search);
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(400)
    }
}
exports.getGenre = async function(req, res, con) {
    var options = {
        shouldSort: true,
        threshold: 0.2,
        includeScore: true,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
            name: 'Name',
            weight: 1
        }]
    };
    console.log(req.query.search);
    let genre = await con.query(`SELECT * FROM Genres`);
    var fuse = new Fuse(genre, options); // "list" is the item array
    var result = fuse.search(req.query.search);
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(400)
    }
}
