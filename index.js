const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config()
const app = express();
const approute = require('@forkjs/group-router');
const mongoose = require('mongoose');
const generateaccessToken = require('./lib/generateAccessToken');
const mongoConnectionUrl = 'mongodb+srv://JR-Test:test@test.eviky.mongodb.net/test';
const mongooseurl = 'mongodb+srv://JR-Test:test@test.eviky.mongodb.net/souravdevelopment';
//app.use(bodyparser.raw(options));
app.use(bodyparser.json())
mongoose.connect(mongooseurl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const con = mongoose.connection;
con.on('open', function () {
  console.log("connected");
})
const alienRouters = require('./routers/aliens');
const users = require('./routers/user');
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})
app.use('/api', alienRouters)
app.use('/api/users', users);
// later 
// approute.group('/api/createtoken', function () {
//   console.log("free");
//   app.post('/user', users)
// });

var port = process.env.PORT;
console.log({ port });
app.listen(process.env.PORT, function () {
  console.log("server is running on  port" + process.env.PORT);
});





