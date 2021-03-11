const { text } = require('body-parser');
const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const mongooseSchema=new mongoose.Schema({
   name:{
       type:String,
       required:true
       },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    invite_code:{
        type:String,
        required:true,
        unique:true,
    },
    phoneno:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:false
    },
    created_time:{
        type:Date,
        required:true
    },
    updated_time:{
        type:Date,
        required:true,
    }
});
module.exports=mongoose.model('user',mongooseSchema);