const express=require("express");
const router=express.Router();
const {body}=require('express-validator');
const userController=require("../controllers/userController");
const User = require("../models/user");
const jwt=require("jsonwebtoken");
const isAuth=require('../middleware/isAuth');
const user = require("../models/user");

//////////////////////////////////////////////////////////////
/////////////////////////user /////////////////
//////////////////////////////////////////////////////////////
router.post('/user-SignUp',[
    body('firstName').trim().isLength({min:3}),
    body('lastName').trim().isLength({min:3}),
    body('password').trim().isLength({min:8}),
    body('email').isEmail().trim().isLength({min:1})
], userController.userSignUp);

//add validation
router.post('/user-LogIn',[
    body('password').trim().isLength({min:8}),
    body('email').isEmail().trim().isLength({min:1})
], userController.userLogIn);

router.post('/reset_password', [
    body('email').isEmail().trim().isLength({min:1})
], userController.resetPassword)

router.post('/check_token', [
    body('email').isEmail().trim().isLength({ min: 1 }),
    body('token').trim().isLength({min:6})
], userController.resetPassword)
//add validation
router.get('/userProfile', isAuth, userController.userProfile);

router.put('/editUserProfile',isAuth,userController.editUserProfile);
 

module.exports=router;








