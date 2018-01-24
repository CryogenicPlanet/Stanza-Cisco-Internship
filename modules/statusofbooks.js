const jwt = require('jsonwebtoken');
const nodemailer = require('./usermail.js');

var exports = module.exports = {};

exports.getLentBooks = async function(req, res, con, secret) {
    var lentbooks = [];
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
    console.log(uuid);
    var date = "`Date of Response`"
    var lent = await con.query(`SELECT * FROM Borrowed WHERE Lender= ${uuid} ORDER BY '${date}' DESC`);
    console.log("test");

    console.log(`SELECT * FROM Borrowed WHERE Lender= ${uuid} ORDER BY '${date}' DESC`);
    console.log(lent);

    function newLend(UBOID, Bookname, Borrower, Lender, BorrowerID, LenderID, Outstanding, ReturnRequest, borrowDate) {
        this.UBOID = UBOID;
        this.Bookname = Bookname;
        this.Borrower = Borrower;
        this.Lender = Lender;
        this.BorrowerID = BorrowerID;
        this.LenderID = LenderID;
        this.Outstanding = Outstanding;
        this.ReturnRequest = ReturnRequest;
        this.borrowDate = borrowDate;
    }

    for (let lend of lent) {
        var date = lend["Date of Response"];
        date = date.toString();
        var datestring = date.substring(4, 15);
        console.log(lend);
      //  console.log(datestring);
        let [borrowname] = await con.query(`SELECT Name FROM Users WHERE UUID="${lend.Borrower}"`);
        borrowname = borrowname.Name;
        let [lendname] = await con.query(`SELECT Name FROM Users WHERE UUID="${lend.Lender}"`);
        lendname = lendname.Name;
        let [bookname] = await con.query(`SELECT Name FROM Books WHERE UBID="${lend.Book}"`);
        bookname = bookname.Name;
        lentbooks.push(new newLend(lend.UBOID, bookname, borrowname, lendname, lend.Borrower, lend.Lender, lend.Outstanding, lend.ReturnRequest, datestring));
    }

    res.status(200).json({
        lentbooks: lentbooks
    });
}

exports.takeBackBook = async function(req, res, con, secret) {
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

    var book = req.body.lentbook;
    console.log(book);
    var UBOID = book.UBOID;
    let update = await con.query(`UPDATE Borrowed SET Outstanding = "0" WHERE UBOID=${UBOID}`);
    var lendname = book.Lender;
    var borrowname = book.Borrower;
    let [lendemail] = await con.query(`SELECT Email FROM Users WHERE UUID="${book.LenderID}"`);
    lendemail = lendemail.Email;
    let [borrowemail] = await con.query(`SELECT Email FROM Users WHERE UUID="${book.BorrowerID}"`);
    borrowemail = borrowemail.Email;
    var lendsubject = `Your response to one of the requests regarding your lent books`;
    var borrowsubject = `Your request to take back a borrowed book has a new response`;
    var lendmessage = `You have accepted ${borrowname}'s request to take back your book ${book.Bookname}`;
    var borrowmessage = `Your request to ${lendname} to take back the book ${book.Bookname} has been accepted`;

    nodemailer.sendMail(lendemail, lendmessage, lendsubject);
    nodemailer.sendMail(borrowemail, borrowmessage, borrowsubject);

    res.status(200).json({
        message: "Your request to take back the book has been successfully updated!!"
    });
}
