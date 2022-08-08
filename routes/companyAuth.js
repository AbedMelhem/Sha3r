const express=require("express");
const router=express.Router();
const {body}=require('express-validator');
const companyController=require("../controllers/companyController");
const Company=require('../models/company');
const jwt=require("jsonwebtoken");
const isAuth=require('../middleware/isAuth');

/////////////////////////////////////////////////////////////
/////////////////////////company /////////////////
//////////////////////////////////////////////////////////////

router.post('/company-SignUp',[
body('companyName').trim().isLength({min:3}),
body('password').trim().isLength({min:8}),
body('email').isEmail().trim().isLength({min:1}),
body('specialty').trim().isLength({min:1}),
body('country').trim().isLength({min:2}),
body('city').trim().isLength({min:1}),
body('enterpriseOwner').trim().isLength({min:1}),
body('commercialAddress').trim().isLength({min:1}),
body('status').trim().isLength({min:1}),
body('nationalInvestorNumber').trim().isLength({min:1}),
body('commercialNumber').trim().isLength({min:1}),
body('commercialName').trim().isLength({min:1})
],companyController.companySignUp);     

router.post('/company-LogIn',[
body('password').trim().isLength({min:8}),
body('email').isEmail().trim().isLength({min:1})
],companyController.companyLogIn);      

router.get('/companyProfile',isAuth,companyController.companyProfile);

router.put('/editCompanyProfile',isAuth,companyController.editCompanyProfile);


module.exports=router;
