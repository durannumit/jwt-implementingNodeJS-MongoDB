var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {

    let token = req.headers['authorization'];
    console.log(token);
    if (token) {
    console.log("token in if"+ token);

    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}
    else {
      res.status(401).send({
        error: `Invalid or missing token.`
      });
    }
});



module.exports = router;