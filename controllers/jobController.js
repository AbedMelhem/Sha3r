const {validationResult}=require('express-validator');
const Job = require('../models/job');
const Company=require('../models/company');
const company = require('../models/company');




///////////////////////Post job/////////////////////////////////////// 

exports.createJob=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('entered data is incorrect!');
        error.statusCode = 422;
        throw error;
    }
    const title=req.body.title;
    const requirements=req.body.requirements;
    const rangeSalary=req.body.rangeSalary;
    const type=req.body.type;
    let creator; 

    const job=new Job({       
       title:title,
       requirements:requirements,
       rangeSalary:rangeSalary,
       type:type,
       creator:req.userId
    });
    job.save()
    .then(result=>{
        return Company.findById(req.userId)
    })
    .then(company=>{
        creator=company;
        company.posts.push(job);
        company.save();
    })
    .then(result=>{
        res.status(201).json({
        message:'job create successfully!', 
        job:job,
        creator:{_id:creator._id,name:creator.companyName}
        
        });
 
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    });
    
};

///////////////////////Home Page of JobSeekers/////////////////////////////////

exports.getAllPosts= async (req,res,next)=>{    //to get all available jobs (select all)
    const currentPage= await req.query.page || 1;
    const perPage=7;
    let totalItems;
    const AllPosts = await Job.find()
    .countDocuments()
    .then(count=>{   
        totalItems=count;
        return Job.find()
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
    
    await res.status(200).json({message:'Fetched jobs successfully.',AllPosts:AllPosts});

   
    
    
};

///////////////////////Get My Posts/////////////////////////////////////// 

exports.getJobs= async (req,res,next)=>{    //to get all available jobs (select all)
    const currentPage= await req.query.page || 1;
    const perPage=7;
    let totalItems;
    const MyPosts = await Job.find({creator:req.userId})
    .countDocuments()
    .then(count=>{   
        totalItems=count;
        return Job.find({creator:req.userId})
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
    
    await res.status(200).json({message:'Fetched jobs successfully.',MyPosts:MyPosts,});

   
    
    
};

exports.getJob=(req,res,next)=>{    //to get job by ID
    const jobId=req.params.jobId;
    const currentPage=req.query.page || 1;
    const perPage=1;
    let totalItems;
    Job.findOne({_id: jobId})
    .countDocuments()
    .then(count=>{
        totalItems=count;
        return Job.findOne({_id: jobId})
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
    .then(job=>{
        if(!job){
            const error=new Error('Could not find this job');
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({message:'Job fetched',job:job,totalItems:totalItems});
    })
    .catch(err=>{
         if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    });

   


};

exports.searchJob = async (req, res, next) => {       //Need Pagination
    const Key = await req.params.keyWord.trim();
    const currentPage=req.query.page || 1;
    const perPage=3;
    let totalItems;
    const posts = await Job.find({
        title: { $regex: '^string$', $options : 'i' }
    })
    .countDocuments()
    .then(count=>{
        totalItems=count;
        return Job.find()
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
    await res.status(200).json({message:'post fetched',posts:posts});
    //test
 }

exports.trainingFeed = async (req, res, next) => {
    const currentPage=req.query.page || 1;
    const perPage=5;
    let totalItems;
    const trainings = await Job.find({ $or: [{ type: "Paid Training" }, { type: "Un-Paid Training" }] })
    .countDocuments()
    .then(count=>{
        totalItems=count;
        return Job.find({ $or: [{ type: "Paid Training" }, { type: "Un-Paid Training" }] })
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
    await res.status(200).json({message:'Paid and Unpaid posts fetched',trainings:trainings});
 
}

exports.jobFeed = async (req, res, next) => {
    const currentPage=req.query.page || 1;
    const perPage=5;
    let totalItems;
    const jobPosts = await Job.find({ $or: [ { type:  "Job" } ] })
    .countDocuments()
    .then(count=>{
        totalItems=count;
        return Job.find({ $or: [ { type:  "Job" } ] })
         .populate('creator')
         .skip((currentPage-1) * perPage)
         .limit(perPage);
    })
   
   
   await res.status(200).json({message:'job posts fetched',jobPosts:jobPosts});

}



///////////////////////Update job/////////////////////////////////////// 

exports.updateJob=(req,res,next)=>{
    jobId=req.params.jobId;
     
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     res
     .status(422)
     .json({
         message:'entered data is incorrect!',
         errors:errors.array()
     });  
    }
    const title=req.body.title;
    const requirements=req.body.requirements;
    const rangeSalary=req.body.rangeSalary;
    const type=req.body.type;
    

    Job.findById({_id: jobId})
    .then(job=>{
        if(!job){
            const error=new Error('Could not find this job');
            error.statusCode=404;
            throw error;
        }
        
    job.title=req.body.title;
    job.requirements=req.body.requirements;
    job.rangeSalary=req.body.rangeSalary;
    job.type=req.body.type;

    return job.save();

    })
    .then(result=>{
        res.status(200).json({message:'job updated',job: result});  
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })
}
/////////////////////////////Apply///////////////////////

exports.apply = async (req, res, next) => {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId)
    job.applicants.push(req.userId)
    await job.save()
    
    await res.status(201).json({message: "applied"})
}


////////////////////Show Applicants////////////////////////
exports.getApplications = async (req, res) => {
    const { job_id } = req.body;
    const job = await Job.find({
        _id: job_id
    }, {
        fields: {applicants: 1},
    }).fetch()
    await res.status(201).json({message: "Successfull Request!", data: job})

};



///////////////////////Delete job/////////////////////////////////////// 

exports.DeleteJob=(req,res,next)=>{
    const jobId=req.params.jobId;
    Job.findById({_id: jobId})
    .then(job=>{
        if(!job){
           const error=new Error('Could not find this job');
           error.statusCode=404;
           throw error;  
        }
        if(job.creator.toString()!==req.userId){
        const error = new Error('Not Authorized');
        error.statusCode=403;
        throw error;
        } 

        return Job.findByIdAndRemove(jobId)
    })
    .then(result=>{
        return Company.findById(req.userId)
        
    })
    .then(company=>{
        company.posts.pull(jobId);
        return company.save(); 
    })
    .then(result=>{
        res.status(200).json({message:'deleted Post Successfully!'})
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode=500;
        }
        next(err);
    })

   
}


