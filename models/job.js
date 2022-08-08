const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const jobSchema=new Schema({
title:{
    type:String,
    minLength:5,
    required: true,
    lowercase:true
    
},
requirements:[{
    type:String,     //array of string
    required:true
}],
rangeSalary:{
    type:String,
    required:true
},
type:{
    type:String,
    required:true
},
creator:{
    type:Schema.Types.ObjectId,
    ref: "Company"
    },
applicants: [{
    type: Schema.Types.ObjectId,
    ref:'User'
}]

},
{timestamps:true}
);
module.exports = mongoose.model("Job", jobSchema);