const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const oauthRouter = require('./routes/oauth');
const addressRouter = require('./routes/address')

const authenticate = require('./middleware/authenticate')
const client = require('./redis/client')


mongoose.connect('mongodb://mongo:27017/wefox-node', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('MongoDB: Something went wrong', err));


client.on('connect', ()=>{
    console.log("Now connected to Redis")
})
client.on('error', (err)=>{
    console.log("Redis: Something went wrong", err)
})



const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);

/* 
Private routes 
*/

app.use('/oauth', oauthRouter);

app.use('/users', usersRouter);

app.use('/address', addressRouter);


module.exports = app;
