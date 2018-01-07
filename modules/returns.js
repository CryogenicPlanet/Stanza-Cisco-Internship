const jwt = require('jsonwebtoken');
const nodemailer = require('./usermail.js');

var exports = module.exports = {};

exports.getBorrowedBooks = async function(req, res, con,secret) { // whatever books you have borrowed
    var borrowbooks = [];
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var uuid;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            // Everything is good
            uuid = decoded.uuid;
        }
    });
    var borrows = await con.query(`SELECT * FROM Borrowed WHERE Borrower="${uuid}" ORDER BY "${"Date of Response"}"`);

    function newBorrow(UBOID, Bookname, Lender, Borrower, LenderID, BorrowerID, Outstanding, ReturnRequest, borrowDate) {
        this.UBOID = UBOID;
        this.Bookname = Bookname;
        this.Lender = Lender;
        this.Borrower = Borrower;
        this.LenderID = LenderID;
        this.BorrowerID = BorrowerID;
        this.Outstanding = Outstanding;
        this.ReturnRequest = ReturnRequest;
        this.borrowDate = borrowDate;
    }

    for (let borrow of borrows) {
      
        let [lendername] = await con.query(`SELECT Name FROM Users WHERE UUID="${borrow.Lender}"`);
        lendername = lendername.Name;
        let [borrowername] = await con.query(`SELECT Name FROM Users WHERE UUID="${borrow.Borrower}"`);
        borrowername = borrowername.Name;
        let bookname = await con.query(`SELECT Name FROM Books WHERE UBID="${borrow.Book}"`);
        bookname = bookname.Name;
        var date = borrow["Date of Response"];
        date = date.toString();
        var datestring = date.substring(4, 15);
        console.log(datestring);
        borrowbooks.push(new newBorrow(borrow.UBOID, bookname, lendername, borrowername, borrow.Lender, borrow.Borrower, borrow.Outstanding, borrow.ReturnRequest, datestring));
    }

    res.status(200).json({
        borrowbooks: borrowbooks
    });
}

exports.returnBook = async function(req, res, con, secret) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var uuid;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            // Everything is good
            uuid = decoded.uuid;
        }
    });

    var book = req.body.borrowedBook;
    console.log(book);
    var UBOID = book.UBOID;
    let update = await con.query(`UPDATE Borrowed SET ReturnRequest = "1" WHERE UBOID = ${UBOID}`);
    var lendname = book.Lender;
    var borrowname = book.Borrower;
    let [lendemail] = await con.query(`SELECT Email FROM Users WHERE UUID="${book.LenderID}"`);
    lendemail = lendemail.Email;
    let [borrowemail] = await con.query(`SELECT Email FROM Users WHERE UUID="${book.BorrowerID}"`);
    borrowemail = borrowemail.Email;
    var lendsubject = `You have a new request regarding one of your lent books`;
    var borrowsubject = `Your request to take back a borrowed book`;
    var lendmessage = `${borrowname} has requested you to take back your book ${book.Bookname}. For further actions visit your Stanza`;
    var borrowmessage = `You have requested ${lendname} to take back the book ${book.Bookname}. For further details visit your Stanza`;
    nodemailer.sendMail(lendemail, lendmessage, lendsubject);
    nodemailer.sendMail(borrowemail, borrowmessage, borrowsubject);

    res.status(200).json({
        message: "Your request to return the book has been successfully sent!!"
    });
}
