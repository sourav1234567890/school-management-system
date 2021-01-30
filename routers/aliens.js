const express=require('express');
const router=express.Router();
const Aliens=require('../models/alien');

router.get('/',async(req,res)=>{
    console.log("calling");
const alien=await Aliens.find()
console.log({alien});
res.json(alien)
})
router.post('/',async(req,res)=>{
    console.log("post method is calling");
const alien=new Aliens({
    name:'sourav',
    tech:'cse',
    sub:true
});
try{
const a1=await alien.save();
console.log({a1});
res.json(a1)
}catch{

}
});
module.exports=router;