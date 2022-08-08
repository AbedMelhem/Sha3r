const {validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const User = require('../models/user');
const PasswordReset = require('../models/passwords_resets')
const nodemailer = require('nodemailer');

exports.userSignUp=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('validation failed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password,12)
    .then(hashedPw=>{
        const user=new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashedPw
        })
        return user.save();
    })
   
    .then(result=>{
        res.status(201).json({message:'User Created!',userId:result._id})
    })
    .catch(err=>{
         if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })

}
exports.userLogIn=(req,res,next)=>{
    const {email, password} = req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('validation failed!');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }

    let loadedUser;
    try{
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                const error = new Error('A user with this email could not be found.');
                error.statusCode=401;
                throw error;
            }
            loadedUser=user;
            if(bcrypt.compare(loadedUser.password, password)){
                const token=jwt.sign({
                email:loadedUser.email,
                userId:loadedUser._id.toString()
                },'sha3rSecretKey',{expiresIn:'1h'});
                res.status(200).json({token:token,userId:loadedUser._id.toString()});
            } else{
                const error=new Error('Incorrect Password');
                error.statusCode=401;
                throw error;
            }
        })
    } catch(err){
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    }
}

exports.userProfile = (req, res,next) => {// will display info about the user that visits his profile
    
    User.findById(req.userId)
        .then((user) => {
            res.status(200).json({ user }); // Username: user.username
        }).catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })
    

}
exports.editUserProfile= async (req,res,next)=>{

    const userId=req.userId;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     res
     .status(422)
     .json({
         message:'entered data is incorrect!',
         errors:errors.array()
     });  
    }
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const password=req.body.password;
    
 const hashedPassword = await bcrypt.hash(password,12)
    
  const user = await  User.findById({_id:req.userId})
    user.firstName=firstName;
    user.lastName=lastName;
    user.email=email;
    user.password=hashedPassword;
    await user.save();
    
    
    res.status(200).json({message:"Profile Updated!",user:user});
    

}

exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    const token = Math.floor(100000 + Math.random() * 900000);
    const password_reset = new PasswordReset({
        token: token,
        email: email
    })
    await password_reset.save();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sha3rapp@gmail.com',
            pass: 'luhqhsbgelklhysw'
        }
    });

    var mailOptions = {
        from: 'sha3rapp@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: 'Your password reset token is ' + token
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.checkToken = (req, res) => {
    const { email, token } = req.body;

    const password_reset = PasswordReset.findOne({ email: email, token: token })
        .then(reset => {
            if (!reset) {
                const error = new Error('Token not found');
                error.statusCode = 200;
                throw error;
            } else {
                res.status(200).json({message:'Successfull Request!',error: null});
            }
        })
}