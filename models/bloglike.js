const { text } = require('express');
const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const blogs = require('./blogs');
const mongooseSchema=new mongoose.Schema({
    
    blogid:{
        type:String,
        required:true
    },
    likeby:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        required:true,
    },
    updated_time:{
        type:Date,
        required:true,
    },
   

})
module.exports=mongoose.model('bloglike',mongooseSchema);