var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    console.log(req.body.password);
    console.log(user.password);
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    console.log(passwordIsValid);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid

    let expiration = new Date();
    expiration.setDate(expiration.getDate() + 7); // + 7 days
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
       expiresIn: expiration.getTime() // expires in 7 days
    });


    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token, expires: expiration});
  });

});


router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  }, 
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user`.");

    // if user is registered without errors
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/me', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

module.exports = router;