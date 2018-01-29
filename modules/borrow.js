var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken'); // Json Web Token Library; Used for authentication
var exports = module.exports = {};

exports.borrowBooks = async function(req, res, con, secret) {
    var isAvailable = false;
    var status, resMessage = "Too many outstanding books";
    var lender = {
        Id: req.body.lender
    }
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var uuid = -1;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
            process.exit(0);
        }
        else {
            // Everything is good
            uuid = decoded.uuid;
        }
    });
    var borrower = {
        Id: uuid
    }
    var ubid = req.body.ubid;
    let isOutstanding = await checkoutstanding(borrower.Id, con);
    if (isOutstanding < 4) {
        //console.log(`SELECT * FROM Borrowed WHERE Book=${ubid} AND Lender=${lender.Id}`);
        let [available] = await con.query(`SELECT * FROM Borrowed WHERE Book=${ubid} AND Lender=${lender.Id}`)
        try {
            if (available) {
                if (available.Outstanding == 1) {
                    console.log("Book already Taken"); // sent to post
                    status = false;
                    resMessage = "Book already Taken";
                }
                else {
                    isAvailable = true;
                }

            }
            else {
                console.log("No results");
                isAvailable = true;
            }
            if (isAvailable) {
                let [books] = await con.query(`SELECT Name,Year FROM Books WHERE UBID=${ubid}`);
                let users = await con.query(`SELECT UUID,Email,Name FROM Users WHERE UUID=${lender.Id} OR UUID=${borrower.Id}`);
                for (var user of users) {
                    if (user.UUID == lender.Id) {
                        lender["Name"] = user.Name;
                        lender["Email"] = user.Email;
                    }
                    else {
                        borrower["Name"] = user.Name;
                        borrower["Email"] = user.Email;
                    }
                }
                var query = `INSERT INTO ${"`Requested Book`"} (Borrower,Lender,Book,Status) VALUES (${borrower.Id},${lender.Id},${ubid},0)`;
                //  console.log(query);
                let addRequest = await con.query(query);
                var selectquery = `SELECT URID FROM ${"`Requested Book`"} WHERE Borrower=${borrower.Id} AND Lender=${lender.Id} AND Book=${ubid}`;
                // console.log(selectquery);
                let [request] = await con.query(selectquery);
                // var acceptUrl = `https://cisco-backend-cryogenicplanet.c9users.io/request?request=${request.URID}&status=1`;
                //var declineUrl = `https://cisco-backend-cryogenicplanet.c9users.io/request?request=${request.URID}&status=-1`;
                var message = `<!DOCTYPE html>
<html>

<head>
    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>
    <!--Import jQuery before materialize.js-->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>
    
      <div class="row">
        <div class="col s6 offset-s3">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
				<div class="row"><span class="card-title center">Book Requested</span></div>
              <p class="flow-text center">Your Book ${books.Name}(${books.Year}) has been requested by ${borrower.Name}</p>
            </div>
            <div class="card-action">
				<div class="row">
					<div class="col s4 offset-2"></div>
				<a href="https://cisco-backend-cryogenicplanet.c9users.io/request?request=${request.URID}&status=1" class="btn-large green">Accept</a>
              <a href="https://cisco-backend-cryogenicplanet.c9users.io/request?request=${request.URID}&status=-1" class="btn-large red">Decline</a>
				</div
				>
              
            </div>
          </div>
        </div>
      </div>
            
</body>

</html>
 `; //html goes here
                sendMail(lender.Email, message, res);

            }
            else {
                res.status(400).json({
                    message: resMessage
                });
            }

        }
        catch (error) {
            console.log("Error :" + error.toString());
            res.status(400).json({
                message: resMessage
            });
        }

    }
    else {
        res.status(400).json({
            message: resMessage
        });
    }
}
var checkoutstanding = async function(borrower, con) {
    var isOutstanding = 0;
    let outstanding = await con.query(`SELECT Outstanding FROM Borrowed WHERE Borrower=${borrower}`);
    for (var outstander of outstanding) {
        if (outstander.Outstanding == 1) {
            isOutstanding += 1;
        }
    }
    return isOutstanding;
}

function sendMail(email, message, res) {
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
            subject: 'Borrow Book', // Subject line
            html: message // Fancy Shit here
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log("Email alert sent");
            res.status(200).json({
                message: "Your Request has been sent"
            });
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}
exports.updateStatus = async function(req, res, con) {

}
