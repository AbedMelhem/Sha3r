const express=require("express");
const router=express.Router();
const {body}=require('express-validator');
const cvController=require("../controllers/cvController");
const isAuth=require('../middleware/isAuth');
const Cv = require("../models/cv");
const jwt=require("jsonwebtoken");


//POST /cv/createCv
router.post('/',isAuth,[
    body('firstName').trim().not().isEmpty().isLength({min:3}),
    body('lastName').trim().not().isEmpty().isLength({min:3}),
    body('birthDate').trim().not().isEmpty().isLength({min:6}),
    body('mobileNumber').trim().not().isEmpty().isLength({min:10}),
    body('email').isEmail().trim().not().isEmpty().isLength({min:1}),
    body('country').trim().not().isEmpty().isLength({min:2}),
    body('city').trim().not().isEmpty().isLength({min:1}),
    body('education').trim().not().isEmpty().isLength({min:1}),
    body('experience').trim().not().isEmpty().isLength({min:1}),
    body('skills').trim().not().isEmpty().isLength({min:1}),
   
],cvController.createCv);

//GET /cv/getCv                                  //we don't need this 
router.get('/all',isAuth,cvController.getCvs);

//GET   //get single cv

router.get('/Get-My-Cv',isAuth,cvController.getCv);


//PUT  /cv/updateCv

router.put('/',isAuth,[
    body('firstName').trim().not().isEmpty().isLength({min:3}),
    body('lastName').trim().not().isEmpty().isLength({min:3}),
    body('birthDate').trim().not().isEmpty().isLength({min:6}),
    body('mobileNumber').trim().not().isEmpty().isLength({min:10}),
    body('email').isEmail().trim().not().isEmpty().isLength({min:1}),
    body('country').trim().not().isEmpty().isLength({min:2}),
    body('city').trim().not().isEmpty().isLength({min:1}),
    body('education').trim().not().isEmpty().isLength({min:1}),
    body('experience').trim().not().isEmpty().isLength({min:1}),
    body('skills').trim().not().isEmpty().isLength({min:1}),

    

  
],cvController.updateCv);

//DELETE  /cv
router.delete('/', isAuth, cvController.deleteCv);

module.exports=router;