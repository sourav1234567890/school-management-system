const { text } = require('express');
const mongoose=require('mongoose');
const mongooseSchema=new mongoose.Schema({
    blogid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
    created_time:{
        type:Date,
        required:true
    },
    updated_time:{
        type:String,
        required:true,

    }
})
module.exports=mongoose.model('blogcomment',mongooseSchema);