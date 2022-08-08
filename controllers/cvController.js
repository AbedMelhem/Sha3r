const {validationResult}=require('express-validator');
const Cv =require('../models/cv');
const User = require('../models/user');


////////////////////////POST CV //////////////////////////////////////

exports.createCv=async (req,res,next)=>{
    let flag = false;
    await Cv.findOne({creator: req.userId}).then((cv) => {
        if(cv == null)
            flag = true;
    })
    if(flag){
        const errors=validationResult(req);
            if(!errors.isEmpty()){
                const error=new Error('entered data is incorrect!');
                error.statusCode = 422;
                throw error;
            }

        const firstName=req.body.firstName;
        const lastName=req.body.lastName;
        const birthDate=req.body.birthDate;
        const mobileNumber=req.body.mobileNumber;
        const email=req.body.email;
        const country=req.body.country;
        const city=req.body.city;
        // const specialty=req.body.specialty
        const experience=req.body.experience;
        const education=req.body.education;
        const skills=req.body.skills;
        let creator;

        const cv = new Cv({
            firstName:firstName,
            lastName:lastName,
            birthDate:birthDate,
            mobileNumber:mobileNumber,
            email:email,
            country:country,
            city:city,
            experience:experience,
            education:education,
            skills:skills,
            creator: req.userId
        });
        cv.save()

        .then(result=>{ 
           return User.findById(req.userId)
        })
        .then(user=>{
            creator=user;
            user.userCvs=cv; 
            return user.save();
           
        })
        .then(result=>{
            res.status(201).json({
            message:'cv create successfully!', 
            cv:cv,
            creator:{_id:creator._id,firstName:creator.firstName}
            });
        })

        .catch(err=>{
                if(!err.statusCode){
                    statusCode=500;
                }
                next(err);
            });
    } else {
         res.status(200).json({
            message:'You already created a CV!'
        });
    }

}


////////////////////////GET CV ///////////////////////////////////////

exports.getCvs=(req,res,next)=>{           //to get all available cv's (select all)
 Cv.find()
    .then(cvs=>{
        res.status(200).json({message:'Fetched cvs successfully.',cvs});
    })
    .catch(err=>{
         if(!error.statusCode){
            statusCode=500;
        }
        next(err);
    })
}

exports.getCv=(req,res,next)=>{            //to get cv by ID
    Cv.findOne({creator: req.userId})
    .then(cv=>{
        if(!cv){
            const error=new Error('Could not find this cv');
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({message:'cv fetched',cv});
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })

}


///////////////////////UPDATE CV////////////////////////////////////////
exports.updateCv=async (req,res,next)=>{     
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     res
     .status(422)
     .json({
         message:'entered data is incorrect!',
         errors:errors.array()
     });  
    }
    const checkAuth = await Cv.findOne({creator: req.userId})
    if(checkAuth.creator.toString()!==req.userId){
        const error = new Error('Not Authorized');
        error.statusCode=403;
        throw error;
    }
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const birthDate=req.body.birthDate;
    const mobileNumber=req.body.mobileNumber;
    const email=req.body.email;
    const country=req.body.country;
    const city=req.body.city;
//  const specialty=req.body.specialty
    const experience=req.body.experience;
    const education=req.body.education;
    const skills=req.body.skills;
    

    Cv.findOne({creator: req.userId})
    .then(cv=>{
        if(!cv){
            const error=new Error('Could not find this cv');
            error.statusCode=404;
            throw error;
        }
    cv.firstName=firstName;
    cv.lastName=lastName;
    cv.birthDate=birthDate;
    cv.mobileNumber=mobileNumber;
    cv.email=email;
    cv.country=country;
    cv.city=city;
    cv.experience=experience;
    cv.education=education;
    cv.skills=skills;
    

    return cv.save();

    })
    .then(result=>{
        res.status(200).json({message:'cv updated',cv: result});  
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })
}

///////////////////DELETE CV/////////////////////////////

exports.deleteCv = async (req, res, next) => {
    const cv =  await Cv.findOne({creator:req.userCvs})
    await Cv.findOneAndRemove({ creator: req.userId })
    const user = await User.findById(req.userId)
    const cvId = await user.userCvs
    
    await User.findOneAndUpdate(user, {
        $unset: {userCvs:cvId}
    })
    
    await  res.status(200).json({message:'Cv Deleted Successfully!'})
  
    
   
}
