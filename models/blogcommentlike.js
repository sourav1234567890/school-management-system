const mongoose=require('mongoose');
const mongooseSchema=new mongoose.Schema({
    commentid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    blogid:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        required:true
    },
    updated_time:{
        type:Date,
        required:true
    }

})
module.exports=mongoose.model('blogcommentlike',mongooseSchema);