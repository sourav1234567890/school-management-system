const { text } = require('express');
const mongoose=require('mongoose');
const {Schema} = require('mongoose')
const mongooseSchema=new Schema({
    name:{
        type:String,  
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    likecount:{
        type:Number,
        required:false,
        default:0
       
    },
    created_time:{
        type:Date,
        required:true,
    },
    userid:[{
        type:Schema.Types.ObjectId,  
        ref:'user',
    }],
    
    updated_time:{
        type:Date,
        required:true
    }
})
module.exports=mongoose.model('blogs',mongooseSchema)