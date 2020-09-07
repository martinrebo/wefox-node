const redis = require('redis')
const client = redis.createClient('6379', 'redisCache');

module.exports = client;