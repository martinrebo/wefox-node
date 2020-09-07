
// Cache middleware
function cache(req, res, next) {
  

  client.get(userToken, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send({userToken, data});
    } else {
      next();
    }
  });
}

  module.exports = cache