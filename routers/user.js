const express = require('express');
const userModael = require('../models/user');
const bcrypt = require('bcrypt');
const generateaccessToken = require('../lib/generateAccessToken');
require('dotenv').config()
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const allUsers = await userModael.find()
        res.json({ users: allUsers });
    } catch (err) {

    }

})
// api for user registration
router.post('/', async (req, res) => {
    if (req.body.name && req.body.phoneno && req.body.username && req.body.password && req.body.email) {
        const emailExists = await userModael.find({ email: req.body.email }).count();
        if (emailExists >= 1) {
            res.json({ success: 'OK', status: 0, message: 'Email is already taken' });
        }
        const userData = {};
        userData.name = ((req.body.name).trim());
        userData.phoneno = (req.body.phoneno);
        userData.username = ((req.body.username).trim());
        userData.password = (req.body.password);
        userData.password = (userData.password).toString();
        userData.email = req.body.email;
        userData.created_time = new Date();
        userData.updated_time = new Date();
        const saltRounds = process.env.SALTROUNDS;
        bcrypt.hash(userData.password, 10, async function (err, passwordhash) {
            userData.password = passwordhash;
            const userSave = new userModael(userData);
            try {
                const userSaved = await userSave.save();
                res.json({ success: 'OK', status: 1, message: 'successfully registered' });
            } catch (err) {
                console.log({ err });
            }
        })

    } else {
        res.json({ success: 'OK', message: 'parameters missmatch', status: 'FAILED' });
    }
    console.log(req.body);
})
router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const password = req.body.password;
        try {
            const allUsers = await userModael.find({ email: req.body.email })
            if (allUsers.length >= 1) {
                const userDetails = {};
                userDetails.email = allUsers[0].email;
                userDetails.id = allUsers[0].id;
                bcrypt.compare(password.toString(), allUsers[0].password, function (err, result) {
                    const responseData = {};
                    responseData.success = 'OK';
                    responseData.status = 0;
                    responseData.message = 'Username Or password is Incorrect';
                    if (result) {
                        const jwtToken = generateaccessToken.generateToken(userDetails);
                        responseData.status = 1;
                        responseData.email = userDetails.email;
                        responseData.token = jwtToken;
                        responseData.name = allUsers[0].name;;
                        responseData.message = 'You Are Logged in';
                    }
                    res.json(responseData);
                });
            } else {
                res.json({ success: 'OK', status: 0, message: 'You Are Not Registered' });
            }
        } catch (err) {

        }

    } else {
        res.json({ success: 'OK', message: 'parameters missmatch' })
    }
})
router.get('/all-users', async (req, res) => {
    try {
        const allUsers = await userModael.find();
        res.json({ users: allUsers });
    } catch (err) {

    }
})

module.exports = router;