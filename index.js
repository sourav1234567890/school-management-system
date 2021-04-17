const express = require('express');
require('express-group-routes');
const bodyparser = require('body-parser');
const path = require('path');
const router = express.Router();
require('dotenv').config()
const app = express();
const approute = require('@forkjs/group-router');
const mongoose = require('mongoose');
const generateaccessToken = require('./lib/generateAccessToken');
const adminauth = require('./api/admin/login')  
console.log({adminauth})
const mongoConnectionUrl = 'mongodb+srv://JR-Test:test@test.eviky.mongodb.net/test';
const mongooseurl = 'mongodb+srv://JR-Test:test@test.eviky.mongodb.net/souravdevelopment';
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json())
mongoose.connect(mongooseurl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const con = mongoose.connection;
con.on('open', function () {
})
const alienRouters = require('./routers/aliens');
const users = require('./routers/user');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true);
 
  next();
})
app.use('/api', alienRouters)
app.use('/api/users', users)
app.use('/admin', users)
app.use('/admin/login',adminauth)
// app.group('/admin', function () {
//   router.get("/login", adminauth.login);
//   // app.get("/get", postController.get);
// });
var port = process.env.PORT;
app.listen(process.env.PORT, function () {
  console.log("server is running on  port" + process.env.PORT);
});





