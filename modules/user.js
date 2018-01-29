//Libraries
var jwt = require('jsonwebtoken'); // Json Web Token Library; Used for authentication
var sha512 = require('sha512'); // Sha512 Library, Sha512 is a hash
var nodemailer = require('nodemailer'); // Nodemailer is an SMTP mailer for node
var randomstring = require("randomstring"); // Cmon What does this suggest?
var sanitizer = require('sanitizer');

var exports = module.exports = {}; //  This is exporting this variable, making it's scope public and accesable my any other file

exports.loginUser = async function(req, res, con, secret) { // Function to Login Users In, Asynchronously(Don't worry about this)
    var email = req.body.email; // Getting email from Post
    var password = req.body.pword; // Getting password from Post
    let [result] = await con.query(`SELECT * FROM Users WHERE Email ='${email}';`)
    if (result != "") { // Check if there is any User exsisting with that email or not
        if (result.Verified == 1) {
            if (password == result.Password) { // Checking if thet match
                console.log("Login Succesfull");
                var payload = {
                    uuid: result.UUID
                };
                var token = jwt.sign(payload, secret);
                res.status(201).json({ // Sending the Data back to Front-End
                    message: "Succesfull",
                    token: token
                });

            }
            else { // Doesn't Match
                res.status(400).json({
                    message: "Wrong Password"
                });
            }
        }
        else {
            res.status(400).json({
                message: "Account Not Verified, Please Check Your Email"
            });
        }
    }
    else { // No user Found
        res.status(400).json({
            message: "Email not Found"
        });
    }

};

exports.getSalt = async function(req, res, con) {
    var salt;
    var email = req.headers['x-login-email'];
    //  var test = sanitizer.escape("Hello World");
    //   console.log(test);
    if (email == "new") {
        salt = randomstring.generate(8);
    }
    else {
        var [query] = await con.query(`SELECT * FROM Users WHERE Email="${email}"`);
        salt = query.Salt;
    }
    res.status(200).json({
        salt: salt
    });
};

exports.followerBooks = async function(req, res, con, secret) { // Function to check Follower's Books, Again an Async Function
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var uuid = -1;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            // Everything is good
            uuid = decoded.uuid;
        }
    });

    function NewBook(newuuid, ubid, bookname, author, genre, year, description, username, image) {
        this.uuid = newuuid;
        this.ubid = ubid;
        this.username = username;
        this.bookname = bookname;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.image = image;
        this.description = description;
        //   this.image = image
    } // Class New Book will all Relevant Details about a Book
    var newbooks = []; // Array of Undefined Length
    var query = `SELECT * FROM ${"`User's Book`"} WHERE User IN (SELECT Following FROM Following WHERE User=${uuid}) ORDER BY Timestamp DESC LIMIT 10`;
    /*
    Objective of Query: Get All New Books From Followers.
    Process : Selecting everything (* means everything) From table User's Books Where User(Following), Is any of the followers of the logined User, Then Ordering by Timestamp and Limiting to only 10 books, this limit is temporary.
    */
    let result = await con.query(query); // Calls query here use await to wait for the promise to compelete
    for (var userBook of result) { // For Each loop for each value of result
        let [book] = await con.query(`SELECT * FROM Books WHERE UBID=${userBook.Book}`); // Getting the Details of the Book, like Name,Year,AuthorID,GenreID,Description,Image(To be done later) From BookID Gotten From the First Query
        let [author] = await con.query(`SELECT Name FROM Authors WHERE UAID=${book.Author}`); // Getting Author's Name From the AuthorID Gotten From the Second Query
        let [genre] = await con.query(`SELECT Name FROM Genres WHERE UGID=${book.Genre}`); // Getting Genre Name From GenreID Gotten From the Second Query
        let [user] = await con.query(`SELECT Name FROM Users WHERE UUID=${userBook.User}`);
        newbooks.push(new NewBook(userBook.User, userBook.Book, book.Name, author.Name, genre.Name, book.Year, userBook.Description, user.Name, userBook.Image));
        /*
        Objective : Must all details collected by the queries to an array to be passed to front-end
        Process : 1. Create an Object of type NewBook(Custom Defined Function Above) with the parameters {newuuid(UUID of the User Followed, Not the One Following Them), ubid, bookname, author, genre, year, description}
                  2. Push this Object to the end array newbooks[]
        */
    } // The Above Stated process is repeated for every followers new book.
    //  console.log(newbooks);
    res.status(200).json(newbooks); // The array of all these book objects is returned.
};

exports.newUser = async function(req, res, con, secret) {
    var Message;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pword;
    var salt = req.body.salt;
    var [user] = await con.query(`SELECT * FROM Users WHERE Email="${email}"`);
    if (user != null) {
        res.status(400).json({
            message: "Email address is taken"
        });
    }
    else {
        email = sanitizer.escape(email);
        name = sanitizer.escape(name);

        var insert = await con.query("INSERT INTO Users (Name, Email,Password,Salt) VALUES ('" + name + "','" + email + "','" + password + "','" + salt + "')");
        var payload = {
            email: email,
            password: password,
            message: "Verifing Email : 2a31c062184b593a485b79ff52803dee87bb59a4b02119163edae2fc1deb08d852e734743c2872967a3e07d1b730c87b61bb768e5921b67eb5cb4a8f45678174"
        };
        var token = jwt.sign(payload, secret);
        var message = `<b>Please enter the below token to verify your email address Or <a href="https://cisco-cryogenicplanet.c9users.io/verify?token=${token}">click here</a> to verify your email address :</b><br> ${token}<br>
                        `;
        sendMail(email, message)
        Message = "Succesfull User Creation";
    }
    res.status(200).json({
        message: Message
    });

};

exports.verify = async function(req, res, con, secret) {
    var token = req.body.token || req.query.token || req.headers['x-verify-token'];
    var source = req.body.src || req.query.src || req.headers['x-source'];

    var email, message, password;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            // Everything is good
            email = decoded.email;
            password = decoded.password;
            message = decoded.message;
        }
    });
    if (message == "Verifing Email : 2a31c062184b593a485b79ff52803dee87bb59a4b02119163edae2fc1deb08d852e734743c2872967a3e07d1b730c87b61bb768e5921b67eb5cb4a8f45678174") {
        let verify = await con.query("UPDATE Users SET Verified = 1 WHERE Email ='" + email + "';");
        if (source == "code") {
            let [result] = await con.query(`SELECT * FROM Users WHERE Email ="${email}";`)
            if (result != "") { // Check if there is any User exsisting with that email or not
                if (result.Verified == 1) {
                    if (password == result.Password) { // Checking if thet match
                        console.log("Login Succesfull");
                        var payload = {
                            uuid: result.UUID
                        };
                        var newToken = jwt.sign(payload, secret);
                        res.status(201).json({ // Sending the Data back to Front-End
                            message: "Succesfull",
                            token: newToken
                        });

                    }
                    else { // Doesn't Match
                        res.status(400).json({
                            message: "Wrong Password"
                        });
                    }
                }
                else {
                    res.status(400).json({
                        message: "Account Not Verified, Please Check Your Email"
                    });
                }
            }
            else { // No user Found
                res.status(400).json({
                    message: "Email not Found"
                });
            }
        }
        else {
            res.status(201).json({ // Sending the Data back to Front-End
                message: "Succesfull"
            });
        }
    }
};

exports.userDetails = async function(req, res, con, secret) {
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
    console.log("UUID IS :" + uuid);
    var userId = req.body.userId || req.query.userId || req.headers['x-user-id']; // Copy
    console.log(userId);
    if (userId != -1) {
        uuid = userId;
    }
    console.log("Final UUID is" + uuid);
    var newbooks = [];

    function NewBook(ubid, bookname, author, genre, year, description, image) {
        this.ubid = ubid;
        this.bookname = bookname;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.image = image;
        this.description = description;
        //   this.image = image
    }

    function users(uuid, username) {
        this.uuid = uuid;
        this.name = username
    }
    //  console.log(uuid);
    // Get Basic User Details
    let [user] = await con.query(`SELECT * FROM Users WHERE UUID=${uuid}`);
    let userbooks = await con.query(`SELECT * FROM ${"`User's Book`"} A WHERE A.User=${uuid} AND A.Book NOT IN (SELECT B.User_Book FROM ${"`Featured Books`"} B WHERE B.User=${uuid})`);
  //  console.log(`SELECT * FROM ${"`User's Book`"} A WHERE A.User=${uuid} AND A.UTID NOT IN (SELECT B.User_Book FROM ${"`Featured Books`"} B WHERE B.User=${uuid})`);
  //  console.log(userbooks);
    //   console.log(`SELECT * FROM Following WHERE Following=${uuid}`);
    let followersTable = await con.query(`SELECT * FROM Users WHERE UUID IN (SELECT A.User FROM Following A WHERE A.Following=${uuid})`);
    let followingTable = await con.query(`SELECT * FROM Users WHERE UUID IN (SELECT A.Following FROM Following A WHERE A.User=${uuid})`);
    // console.log(followingTable);
    for (var userBook of userbooks) {
        let [book] = await con.query(`SELECT * FROM Books WHERE UBID=${userBook.Book}`);
        let [author] = await con.query(`SELECT Name FROM Authors WHERE UAID=${book.Author}`); // Getting Author's Name From the AuthorID Gotten From the Second Query
        let [genre] = await con.query(`SELECT Name FROM Genres WHERE UGID=${book.Genre}`);
        newbooks.push(new NewBook(userBook.Book, book.Name, author.Name, genre.Name, book.Year, userBook.Description, userBook.Image));
    }


    var followers = [],
        following = [];
    for (var follower of followersTable) {
        followers.push(new users(follower.UUID, follower.Name));
    }
    for (var follow of followingTable) {
        //    console.log(follow.Following);
        following.push(new users(follow.UUID, follow.Name));
    }
    //console.log(newbooks)
    var response = {
        uuid: uuid,
        user: user,
        books: newbooks,
        followers: followers,
        following: following
    }
    res.status(200).json({
        response
    })
};
exports.userBooks = async function(req, res, con, secret) {
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
    var newbooks = [];
    function NewBook(ubid, bookname, author, genre, year, description, image) {
        this.ubid = ubid;
        this.bookname = bookname;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.image = image;
        this.description = description;
        //   this.image = image
    }
    let userbooks = await con.query(`SELECT * FROM ${"`User's Book`"} WHERE User=${uuid} AND Book NOT IN (SELECT User_Book FROM  ${"`Featured Books`"} WHERE User=${uuid})`);
    for (var userBook of userbooks) {
        let [book] = await con.query(`SELECT * FROM Books WHERE UBID=${userBook.Book}`);
        let [author] = await con.query(`SELECT Name FROM Authors WHERE UAID=${book.Author}`); // Getting Author's Name From the AuthorID Gotten From the Second Query
        let [genre] = await con.query(`SELECT Name FROM Genres WHERE UGID=${book.Genre}`);
        newbooks.push(new NewBook(userBook.Book, book.Name, author.Name, genre.Name, book.Year, userBook.Description, userBook.Image));
    }
   // console.log(newbooks);
    res.status(200).json(newbooks);
};
exports.forgotPassword = async function(req, res, con) {
    var email = req.body.email;
    let [user] = await con.query(`SELECT * From Users WHERE Email=${email}`);
    if (user) {
        let emailMessage = `<a href="">Click here to change password</a>`;
        sendMail(email)
    }
    else {
        res.status(400).json({
            message: "User Not Found"
        });
    }
};

function sendMail(email, message) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: "ssl", // true for 465, false for other ports
            auth: {
                user: 'no.reply.dev.smtp@gmail.com', // generated ethereal user
                pass: 'nooberest' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Verify Email"<no.reply.dev.smtp@gmail.com>', // sender address
            to: email, // list of receivers
            bcc: 'rahultarak12345@gmail.com', // Me!
            subject: 'Verify Account', // Subject line
            html: message // Fancy Shit here
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            //    console.log('Message sent: %s', info.messageId);
            console.log("Email alert sent");
            // Preview only available when sending through an Ethereal account
            //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}
