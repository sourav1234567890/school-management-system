const express=require('express');
const userModael=require('../models/user');
const router=express.Router();
router.post('/', async (req,res)=>{
    if(req.body.name && req.body.phoneno && req.body.username && req.body.password && req.body.email ){
        const userData={};
        userData.name=((req.body.name).trim());
        userData.phoneno=(req.body.phoneno);
        userData.username=((req.body.username).trim());
        userData.password=(req.body.password);
        userData.email=req.body.email;
        userData.created_time=new Date();
        userData.updated_time=new Date();
        const userSave=new userModael(userData);
        try{
            const userSaved=await userSave.save();
            res.json({success:'OK',message:'successfully registered'});
        }catch(err){
        }
    }else{
        res.json({success:'OK',message:'parameters missmatch',status:'FAILED'});
    }
    console.log(req.body);
//console.log(req);
})

    router.post('/login',async(req,res)=>{
     
    })
    module.exports=router;