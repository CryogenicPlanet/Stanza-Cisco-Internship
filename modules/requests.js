const jwt = require('jsonwebtoken');
const nodemailer = require('./usermail.js');

var exports = module.exports = {};

exports.getRequests = async function(req, res, con, secret) { // all requests you have received
    var arr_requests = [];
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var lender;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            // Everything is good
            lender = decoded.uuid;
        }
    });

    let requests = await con.query(`SELECT * FROM ${"`Requested Book`"} WHERE Lender="${lender}" AND Status="0" ORDER BY ${"`Date of Request`"} DESC LIMIT 10`); // Replace ${response} with any other user's UUID if you want other people's notifications.

    function newRequest(URID, Borrower, Lender, Book, Status, Date) {
        this.URID = URID;
        this.Borrower = Borrower;
        this.Lender = Lender;
        this.Book = Book;
        this.Status = Status;
        this.Date = Date;
    }

    for (let request of requests) {
        var Borrower = "";
        if (request.Borrower > 0) {
            let [borrowname] = await con.query(`SELECT Name FROM Users WHERE UUID="${request.Borrower}"`);
            Borrower = borrowname.Name;
        }
        else {
            Borrower = request.Borrower;
        }
        let [bookname] = await con.query(`SELECT Name FROM Books WHERE UBID="${request.Book}"`);
        var Book = bookname.Name;
        arr_requests.push(new newRequest(request.URID, Borrower, request.Lender, Book, request.Status, request.Date));
    }
    console.log(arr_requests);
    res.status(200).json({
        arr_requests: arr_requests
    });
}

exports.getUserRequests = async function(req, res, con, secret) { // all requests you have sent
    var usr_arr = [];

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
    let requests = await con.query(`SELECT * FROM ${"`Requested Book`"} WHERE Borrower="${uuid}" ORDER BY ${"`Date of Request`"} DESC LIMIT 10`); // Replace ${UUID} with any other user's UUID if you want other people's notifications.

    function newUserRequest(URID, Borrower, Lender, Book, Status, getDate) {
        this.URID = URID;
        this.Borrower = Borrower;
        this.Lender = Lender;
        this.Book = Book;
        this.Status = Status;
        this.Date = getDate;
    }

    for (let request of requests) {
        let Lender = "";
        if (request.Lender > 0) {
            let [lendname] = await con.query(`SELECT Name FROM Users WHERE UUID="${request.Lender}"`);
            Lender = lendname.Name;
        }
        else {
            Lender = request.Lender;
        }
        let [bookname] = await con.query(`SELECT Name FROM Books WHERE UBID="${request.Book}"`);
        let Book = bookname.Name;
        usr_arr.push(new newUserRequest(request.URID, request.Borrower, Lender, Book, request.Status, request.Date));
    }
    console.log(usr_arr);
    res.status(200).json({
        usr_arr: usr_arr
    });

}

exports.postResponse = async function(req, res, con, secret) {
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
    var response = req.body.response; //1 or 2
    var request = req.body.request; // 
    console.log(request);
    var URID = request.URID;
    console.log(URID);
    let update = await con.query(`UPDATE ${"`Requested Book`"} SET Status = ${response} WHERE URID = ${URID}`);
    let [lendname] = await con.query(`SELECT Name FROM Users WHERE UUID="${request.Lender}"`);
    let [borrowID] = await con.query(`SELECT UUID FROM Users WHERE Name="${request.Borrower}"`);
    borrowID = borrowID.UUID;
    lendname = lendname.Name;
    let [lendemail] = await con.query(`SELECT Email FROM Users WHERE Name="${lendname}"`);
    let [borrowemail] = await con.query(`SELECT Email FROM Users WHERE Name="${request.Borrower}"`);
    lendemail = lendemail.Email;
    borrowemail = borrowemail.Email;
    let lendmessage = ``;
    let borrowmessage = ``;
    var lendsubject = `Your response to ${request.Borrower}'s request for ${request.Book}`;
    var borrowsubject = `Your request for ${request.Book} has a new response`;
    if (response == 1) {
        let [bookId] = await con.query(`SELECT UBID FROM Books WHERE Name="${request.Book}"`)
        bookId = bookId.UBID;
        let querystring = `INSERT INTO ${"`Borrowed`"} (Lender,Borrower,Book,Outstanding,ReturnRequest) VALUES ("${request.Lender}","${borrowID}","${bookId}","1", "0")`;
        console.log(querystring);
        let addToBorrowed = await con.query(querystring);
        lendmessage = `You have accepted ${request.Borrower}'s request to borrow your book ${request.Book}. For further details, ${request.Borrower}'s email id is ${borrowemail}`;
        borrowmessage = `${lendname} has accepted your request to borrow the book ${request.Book}. For further details, ${lendname}'s email id is ${lendemail}`;
    }
    else if (response == 2) {
        lendmessage = `You have declined ${request.Borrower}'s request to borrow your book ${request.Book}`;
        borrowmessage = `${lendname} has declined your request to borrow the book ${request.Book}`;
    }
    nodemailer.sendMail(lendemail, lendmessage, lendsubject);
    nodemailer.sendMail(borrowemail, borrowmessage, borrowsubject);
    res.status(200).json({
        message: "Response sent!!"
    });
}
