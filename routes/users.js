const { User } = require('../model/users');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const redis = require("redis");
const redisClient = require('../redis/client')

router.get('/', async (req, res) => {
  //TODO: Delete this endopoint as it is only for development
  let listOfUsers = await User.find()
  res.send(listOfUsers)
})

router.post('/register', async (req, res) => {

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
    await user.save((err, user) => {
      // Create a token with the user_ID
      let user_Id = user._id.toString()

      let token = jwt.sign( {user_Id} , process.env.TOKEN_SECRET, { expiresIn: '10h' })

      // And store the user in Redis under key 
      redisClient.set(user_Id, token, redis.print );

      //Send User Token (TODO: Save in localstorage vs sessions)
      res.send({ user, token });
    });

  }
});


router.post("/login", async (req, res, next) => {
  // When user logs in, there is no token pair in the browser
  // cookies. We need to issue both of them. Because you also
  // log user in in this step, 

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send('User does not exist')
  } else {

    let token = jwt.sign(user._id, process.env.TOKEN_SECRET, { expiresIn: '10h' })
    redisClient.set(user._id, token, redisClient.print);
  }

  res.send({ user, token });
});



module.exports = router;