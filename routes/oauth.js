var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();


/* GET users listing. */
router.post('/createNewToken', function(req, res, next) {  
  const token = jwt.sign(req.body, process.env.TOKEN_SECRET, { expiresIn: '10h'})
  res.json(token);
});


module.exports = router;
