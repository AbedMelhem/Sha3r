const {validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const Company=require('../models/company');
const company = require('../models/company');

exports.companySignUp=(req,res,next)=>{

     const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('validation failed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }
    const companyName=req.body.companyName;
    const email=req.body.email;
    const password=req.body.password;
    const specialty=req.body.specialty;
    const country=req.body.country;
    const city =req.body.city;
    const enterpriseOwner=req.body.enterpriseOwner;
    const commercialAddress=req.body.commercialAddress;
    const status=req.body.status;
    const nationalInvestorNumber=req.body.nationalInvestorNumber;
    const commercialName=req.body.commercialName;
    const commercialNumber=req.body.commercialNumber;
    bcrypt.hash(password,12)
    .then(hashedPw=>{
        const company=new Company({
            companyName:companyName,
            email:email,
            password:hashedPw,
            specialty:specialty,
            country:country,
            city:city,
            enterpriseOwner:enterpriseOwner,
            commercialAddress:commercialAddress,
            status:status,
            nationalInvestorNumber:nationalInvestorNumber,
            commercialName:commercialName,
            commercialNumber:commercialNumber
        })
        return company.save()
    })
    .then(result=>{
        res.status(201).json({message:'Company Created!',companyId:result._id})
    })
    .catch(err=>{
         if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })
    



}




exports.companyLogIn=(req,res,next)=>{
    const {email, password} = req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('validation failed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }
    
    let loadedUser;
    try{
        Company.findOne({email:email})
        .then(company=>{
            if(!company){
            const error = new Error('A company with this email cannot be found.');
            error.statusCode=401;
            throw error;
            }
            loadedUser=company;
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
    }   catch(err){
         if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    }
    


}

exports.companyProfile =  (req, res, next) => {
    Company.findById(req.userId)
    .then((company) => {
        res.status(200).json({ company }); 
    }).catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })
}


exports.editCompanyProfile= async (req,res,next)=>{
    const companyId=req.userId;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     res
     .status(422)
     .json({
         message:'entered data is incorrect!',
         errors:errors.array()
     });  
    }
    const companyName=req.body.companyName;
    const email=req.body.email;
    const password=req.body.password;
    const specialty=req.body.specialty;
    const country=req.body.country;
    const city =req.body.city;
    const enterpriseOwner=req.body.enterpriseOwner;
    const commercialAddress=req.body.commercialAddress;
    const status=req.body.status;
    const nationalInvestorNumber=req.body.nationalInvestorNumber;
    const commercialName=req.body.commercialName;
    const commercialNumber=req.body.commercialNumber;
    const hashedPassword = await bcrypt.hash(password,12)

    
    const company = await Company.findById({_id:req.userId})
        company.companyName=companyName;
        company.email=email;
        company.password=password;
        company.specialty=specialty;
        company.country=country;
        company.city =city;
        company.enterpriseOwner=enterpriseOwner;
        company.commercialAddress=commercialAddress;
        company.status=status;
        company.nationalInvestorNumber=nationalInvestorNumber;
        company.commercialName=commercialName;
        company.commercialNumber=commercialNumber;
        await company.save();
    
   
        res.status(200).json({message:"Profile Updated!",company:company});
    

}