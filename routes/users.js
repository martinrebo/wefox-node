const { User } = require('../model/users');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

router.get('/', async (req, res) => {
  //TODO: Delete this endopoint as it is only for development
  let listOfUsers = await User.find()
  res.send(listOfUsers)
})

router.post('/newuser', async (req, res) => {

  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send('That user already exisits!');
  } else {
    // Insert the new user if they do not exist yet
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    // Create token
    const token = await jwt.sign(req.body, process.env.TOKEN_SECRET, { expiresIn: '10h'})
    //TODO: Add token to redis
    res.send({user, token});
  }
});

module.exports = router;