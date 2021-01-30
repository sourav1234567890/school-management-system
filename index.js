const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const mongoose=require('mongoose');
const mongoConnectionUrl='mongodb+srv://JR-Test:test@test.eviky.mongodb.net/test';
const mongooseurl='mongodb+srv://JR-Test:test@test.eviky.mongodb.net/souravdevelopment';
//app.use(bodyparser.raw(options));
app.use(bodyparser.json())
mongoose.connect(mongooseurl,{useNewUrlParser:true,useUnifiedTopology:true})
const con=mongoose.connection;

con.on('open',function(){
  console.log("connected");
})
const alienRouters=require('./routers/aliens');
const users=require('./routers/user');
app.use('/api',alienRouters)
app.use('/api/users',users)
app.listen(5000,()=>{
  console.log(`server started `)
})



