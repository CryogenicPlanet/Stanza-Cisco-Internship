var jwt = require('jsonwebtoken'); // Json Web Token Library; Used for authentication
var exports = module.exports = {};
exports.follow = async function(req, res, con, secret) {
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
    var following = req.body.user;
    let fol = await con.query(`INSERT INTO Following (User,Following) VALUES (${uuid},${following})`);
    res.status(200).json({
        message: "User Followed"
    });
}
exports.unfollow = async function(req, res, con, secret) {
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
    var following = req.body.user;
    let unfol = await con.query(`DELETE FROM Following WHERE User = ${uuid} AND Following = ${following}`);
    res.status(200).json({
        message: "User Unfollowed"
    });
}
exports.followed = async function(req, res, con, secret) {
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
    var status = false;
    var sndUser = req.body.user;
    console.log(uuid);
    let followed = await con.query(`SELECT * FROM Following WHERE User=${uuid} AND Following=${sndUser}`);
    console.log(followed);
    if (followed.length > 0) {
        status = true;
    }
    res.status(200).json({
        status: status
    });
}
