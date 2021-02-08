const { json } = require('body-parser');
const jwt=require('jsonwebtoken');
require ('dotenv').config();
function generateToken (data){
    return jwt.sign(data,process.env.JWT_SECRET)
}
function decodeToken (data){
    const decoded=jwt.verify(data,process.env.JWT_SECRET)
    return decoded;
}
module.exports={generateToken,decodeToken}
