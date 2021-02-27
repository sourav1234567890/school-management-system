const express = require('express');
const userModael = require('../models/user');
const blogModel = require('../models/blogs')
const bcrypt = require('bcrypt');
const multer = require('multer');
const generateaccessToken = require('../lib/generateAccessToken');
const ContantFile = require('../config/constant');
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
router.post('/', async (req, res, next) => {
    console.log("incoming data", JSON.stringify(req.body));
    if (req.body.name && req.body.phoneno && req.body.username && req.body.password && req.body.email) {
        const code = ContantFile.generateCode(6);
        console.log({ code });
        const emailExists = await userModael.find({ email: req.body.email }).countDocuments();
        if (emailExists >= 1) {
            res.send({ success: 'OK', status: 0, message: 'Email is already taken' });
        } else {
            const userData = {};
            userData.name = ((req.body.name).trim());
            userData.phoneno = (req.body.phoneno);
            userData.username = ((req.body.username).trim());
            userData.password = (req.body.password);
            userData.password = (userData.password).toString();
            userData.email = req.body.email;
            userData.created_time = new Date();
            userData.updated_time = new Date();
            userData.invite_code = code;
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
        }


    } else {
        console.log("required");
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
                        responseData.name = allUsers[0].name;
                        responseData.invite_code = allUsers[0].invite_code;
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
router.post('/blog-post', async (req, res) => {
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    if (userDetails) {
        const blogData = {}
        blogData.userid = userDetails.id
        blogData.name = 'first'
        blogData.description = 'ggggggggggggggggggggggggggggg'
        blogData.created_time = new Date();
        blogData.updated_time = new Date()
        blogData.image = 'test.jpg'
        console.log({ blogData });
        const blogSave = new blogModel(blogData);
        try {
            const blogInsert = await blogSave.save();
            res.json({ success: 'OK' })
        }
        catch (err) {
            console.log(err);
        }

    } else {
        res.send("failure");
    }
})

// block delte 
router.post('/blog-delete', async (req, res) => {
    const id = req.body.blog_id;
    try {
        const allUsers = await blogModel.deleteOne({ _id: "602580c436bd2610ec58d688" });
        res.send("blog is deleted");
    } catch (e) {
        console.log(e);
    }
})

router.post('/blog-update', async (req, res) => {
    console.log("blog updating");
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }

})
const upload = multer({ storage: storage })
// image upload
router.post('/imageupload', upload.single('userimage'), async (req, res, next) => {

});
router.post('/blog-list', async (req, res) => {
    // blogModel.find().populate('userModael').exec(function(err, docs){
    //     if (err) throw err;
    //     console.log(docs);  
    //     res.send(docs);
       
    // });
    await blogModel.find().
   
    populate( { path: 'userid', select: ['email','name'] }).
    
    exec(function (err, blogsdata) {
        if (err) return handleError(err);
        res.send(blogsdata);
        console.log('Here is the populated user blogs: ', blogsdata[0].id);
    });

    // await blogModel.find()
    // .populate([{
    //     model: 'user'
    // }]).exec((err, posts) => {
    //   console.log("Populated User " + posts);
    // })
//     blogModel.
//   findOne({ userid:'6020b292b9de281f70086cc4'}).
//   populate('author', 'name').
//   exec(function (err, story) {
//     if (err) return handleError(err);
    
//     console.log('The author is %s', story.author.name);
   
    
//     console.log('The authors age is %s', story.author.age);
   
//   })
})

module.exports = router;  