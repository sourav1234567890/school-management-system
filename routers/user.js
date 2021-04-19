const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const moment=require('moment');
const { ObjectId } = require('mongoose');
const userModael = require('../models/user');
const blogModel = require('../models/blogs')
const blogLikeModel = require('../models/bloglike')
const blogCommentModel = require('../models/blogcomment')
const blogCommentLikeModel = require('../models/blogcommentlike')
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const generateaccessToken = require('../lib/generateAccessToken');
const ContantFile = require('../config/constant');
const { Console } = require('console');
require('dotenv').config()
const router = express.Router();
const storagenn = multer.diskStorage({
    destination: (req, file, cb3) => {
        cb3(null, 'public/uploads')
    },
    filename: (req, file, cb4) => {
        cb4(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storagenn })
const storageedit = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})
const uploads = multer({ storage: storageedit });
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
});
router.post('/blog-post', upload.single('blogimage'), async (req, res, err) => {
    console.log(req.body);
    if (req.body.name && req.body.description) {
        const blogData = {};
        const token = req.headers.authorization;
        const userDetails = await generateaccessToken.decodeToken(token);
        blogData.userid = userDetails.id
        blogData.name = req.body.name
        blogData.description = req.body.description
        blogData.created_time = new Date();
        blogData.updated_time = new Date();
        blogData.image = req.file.filename;
        const blogSave = new blogModel(blogData);
        try {
            const blogInsert = blogSave.save();
            res.json({
                success: 'OK',
                STATUS: 1,
                message: 'Blog Is added'
            })
        } catch (err) {
            console.log(err);
        }

        console.log(req.file);
    } else {
        res.json({
            success: 'OK',
            STATUS: 1,
            message: 'Parameters Missmatch'
        })
    }
})
router.post('/blog-delete', async (req, res) => {
    const blogId = req.body.blog_id;
    console.log({ blogId });
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    console.log({ userDetails });
    try {
        const blogFetch = await blogModel.find({ _id: blogId })
        console.log(blogFetch.length);
        if (blogFetch.length > 0) {
            if (blogFetch[0].userid[0] == userDetails.id) {
                try {
                    const blogDelete = await blogModel.deleteOne({ _id: blogId })
                    console.log({ blogDelete });
                    if (blogDelete.ok == 1) {
                        fs.unlink(`./public/uploads/${blogFetch[0].image}`, async function (err) {
                            if (err) {
                                res.json({
                                    success: 'OK',
                                    message: 'Please wait network issue..'
                                })
                            } else {
                                res.json({
                                    success: 'OK',
                                    status: 0,
                                    message: ' deleted'
                                })
                            }
                        });

                    } else {
                        res.json({
                            success: 'OK',
                            status: 0,
                            message: ' already deleted'
                        })
                    }
                } catch (err) {
                    res.json({
                        err: err
                    })
                }





            } else {
                res.json({
                    success: 'OK',
                    status: 0,
                    message: "You don't have permitted for delete this blog"
                })
            }
        } else {
            console.log("hhg");
            res.json({
                success: 'OK',
                status: 0,
                message: 'Blog Not Found.'
            })
        }

    } catch (err) {
        res.json({
            success: 'FAILED',
            status: 0
        })
        console.log({ err });
    }

    // try {
    //     const allUsers = await blogModel.deleteOne({ _id: "602580c436bd2610ec58d688" });
    //     res.send("blog is deleted");
    // } catch (e) {
    //     console.log(e);
    // }
})
router.post('/blog-update', async function (req, res) {
    console.log(req.body)
    const blogId = req.body.blog_id;
    console.log({ blogId });
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    if (userDetails) {
        const blogDetails = await blogModel.find({ _id: blogId })
        if (blogDetails.length > 0) {
            console.log("bloglentgh");
            const uploads = await upload.single('blogeditimage')
            console.log(req.file);
            console.log({ uploads });
            // upload.single('blogeditimage')()
        } else {
            res.json({
                success: 'OK',
                status: 404,
                message: 'Blohg Not Found'
            })
        }
    } else {
        res.json({
            success: 'OK',
            message: 'You Are Not Authenticate'
        })
    }
});
router.post('/blog-like', async (req, res) => {
    if(!req.body.blog_id){
        res.json({
            success: 'OK',
            message: 'Parameters Missmatch',
            status:'FAILED'
        })
    }
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    const blogid = req.body.blog_id;
    console.log({blogid});
    const bloglike = await blogLikeModel.find({ likeby: userDetails.id, blogid: blogid })
    if (bloglike.length > 0) {
        const blogDelete = await blogLikeModel.deleteOne({ likeby: userDetails.id, blogid: blogid })
        res.json({
            success: 'OK',
            message: 'dislike'
        })
    } else {
        console.log("blog like already");
        const blogLikes = {};
        blogLikes.likeby = userDetails.id;
        blogLikes.blogid = blogid;
        blogLikes.created_time = new Date();
        blogLikes.updated_time = new Date();
        const blogLikeSave = new blogLikeModel(blogLikes);
        try {
            const blogLikeInsert = blogLikeSave.save();
            res.json({
                success: 'OK',
                message: 'Like'
            })
        } catch (err) {

        }

    }
});
router.post('/blog-comment', async (req, res) => {
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    const blogid = req.body.blog_id;
    const blogComment = await blogModel.find({ _id: blogid })
    if (blogComment.length > 0) {
        const blogComments = {};
        blogComments.userid = userDetails.id;
        blogComments.blogid = blogid;
        blogComments.comment = req.body.comment;
        blogComments.created_time = new Date();
        blogComments.updated_time = new Date();
        const blogCommentSave = new blogCommentModel(blogComments)
        try {
            const insertComment = await blogCommentSave.save();
            res.json({
                success: 'OK',
                message: 'Blog Commentg is added.'
            })
        }
        catch (err) {
        }
    }
    else {
        res.json({
            success: 'OK',
            message: 'Blog Not Found'
        })
    }

})
router.post('/blog-comment-like', async (req, res, next) => {
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    const blogid = req.body.blog_id;
    const blogComment = await blogModel.find({ _id: blogid })
    if (blogComment.length > 0) {
        const blogComments = {};
        blogComments.userid = userDetails.id;
        blogComments.blogid = blogid;
        blogComments.commentid = req.body.commentid;
        blogComments.created_time = new Date();
        blogComments.updated_time = new Date();
        const blogCommentLikeSave = new blogCommentLikeModel(blogComments)
        try {
            const insertComment = await blogCommentLikeSave.save();
            res.json({
                success: 'OK',
                message: 'Blog Commentg like is added.'
            })
        }
        catch (err) {
        }
    }
    else {
        res.json({
            success: 'OK',
            message: 'Blog Not Found'
        })
    }
})
router.post('/imageupload', upload.single('userimage'), async (req, res, next) => {
});
router.post('/blog-list', async (req, res) => {
    const blogs=[];
    await blogModel.find().
        populate({ path: 'userid', select: ['email', 'name'] }).
        exec(function (err, blogsdata) {
            if (err) return handleError(err);
            if (blogsdata.length > 0) {
                blogsdata.map((item,key)=>{
                    const firstLetter=item.userid[0].name.charAt(0).toUpperCase()
                    const blogCreatedDate=moment(item.created_time).format("MMMM Do YY"); 
                    blogs.push({
                        id:item._id,
                        name:item.name,
                        firstletter:firstLetter,
                        description:item.description,
                        image:'http://localhost:4000/uploads/'+item.image,
                        blogcreateddate:blogCreatedDate
                    })
                })
                res.json({
                    success: 'OK',
                    status: 200,
                    blogs: blogs,
                })
            } else {
                res.json({
                    success: 'OK',
                    status: 404,
                    blogs: blogs,
                })
            }
        });
})
router.post('/blog-details', async (req, res) => {
    const token = req.headers.authorization;
    const userDetails = await generateaccessToken.decodeToken(token);
    if (userDetails) {
        const blogId = req.body.blog_id;
        const blogDetails = await blogModel.find({ _id: blogId }).
            populate({ path: 'userid', select: ['email', 'name'] }).exec( async function (err, blogsVal) {
                console.log(blogsVal.name);
                if (blogsVal.length > 0) {
                    var blogLikeStatus=false;
                    const bloglike = await blogLikeModel.find({ likeby: userDetails.id, blogid: blogId })
                    if(bloglike.length>0){
                        var blogLikeStatus=true; //
                    }
                    const blogDetails={};
                    blogDetails.blogname=blogsVal[0].name
                    blogDetails.blogimage=`http://localhost:4000/uploads/${blogsVal[0].image}`
                    blogDetails.blogdescription=blogsVal[0].description
                    blogDetails.blogcreateddate=moment(blogsVal[0].created_time).format("MMMM Do YY"); 
                    const firstLetter=blogsVal[0].name.charAt(0).toUpperCase()
                    blogDetails.firstletter=firstLetter
                    blogDetails.blogstatus=blogLikeStatus
                    console.log({blogDetails});
                    res.json({
                        success: 'OK',
                        status: 200,
                        message: 'Blog Found',
                        blogs: blogDetails,
                    })
                } else {
                    res.json({
                        success: 'OK',
                        status: 404,
                        message: 'Blog Not Found',
                        blogs: [],
                    })

                }
            });
    } else {
        res.json({
            success: 'OK',
            status: 401,
        })
    }
});

module.exports = router;