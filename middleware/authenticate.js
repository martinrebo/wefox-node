const jwt = require("jsonwebtoken");


function authenticate(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      
      // retrieve userId and token from Redis
      
      // if the userId of the request is the same as the token 

      req.user = user
      
      next() // pass the execution off to whatever request the client intended
    })
  }

  module.exports = authenticate