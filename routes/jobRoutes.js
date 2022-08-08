const express=require("express");
const router=express.Router();
const {body}=require('express-validator');
const jobController=require("../controllers/jobController");
const job = require("../models/job");
const isAuth=require('../middleware/isAuth')
const jwt=require("jsonwebtoken");



//GET    /job/getjob
router.get('/My-Posts',isAuth,jobController.getJobs);

//POST   /job/createjob
router.post('/',isAuth,[
    body('title').trim().not().isEmpty().isLength({min:1}),
    body('requirements').trim().not().isEmpty().isLength({min:1}),
    body('rangeSalary').trim().not().isEmpty().isLength({min:1}),
    body('type').trim().not().isEmpty().isLength({min:1})
],jobController.createJob);


router.get('/Home-Page', jobController.getAllPosts); 
router.get("/training-feed", jobController.trainingFeed)  //show paid & unpaid training posts
router.get("/job-feed", jobController.jobFeed)  //show job posts


router.get('/:jobId',jobController.getJob);          //get job by ID (when user choose job)

router.get('/search/:keyWord',isAuth,jobController.searchJob);  //search by name for job



//PUT  /job/updatejob 

router.put('/:jobId/Update-post',isAuth,[            //update job by there id 
    body('title').trim().isLength({min:1}),
    body('requirements').trim().isLength({min:1}),
    body('rangeSalary').trim().isLength({min:1}),
    body('type').trim().isLength({min:1})
],jobController.updateJob
);

//rotes for applying
router.patch('/:jobId/apply', isAuth, jobController.apply)

//Delete job

router.delete('/:jobId',isAuth,jobController.DeleteJob);

module.exports=router;