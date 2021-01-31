const { json } = require('body-parser');
const jwt=require('jsonwebtoken');
require ('dotenv').config();
function generateToken (data){
    return jwt.sign(data,process.env.JWT_SECRET)
}
module.exports={generateToken}
