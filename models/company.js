const { string } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const companySchema=new Schema({
companyName:{
    type:String,
    minLength:3,
    maxLength:50,
    required:true
},
password:{
    type:String,
    minLength:8,
    required:true
},
email:{
    type:String,
    lowercase:true,
    unique:true,
    required:true
},
specialty:{
    type:String,
    required:true
},
country:{
     type:String,
     minLength:2,
    maxLength:57,
    required:true
},
city:{
    type:String,
    required:true
},
enterpriseOwner:{
    type:String,
    required:true
},
commercialAddress:{
    type:String,
    required:true
},
status:{
    type:String,
    required:true
},
nationalInvestorNumber:{
    type:Number,
    required:true,
    unique:true
},
commercialNumber:{
    type:Number,
    required:true,
    unique:true
},
commercialName:{
    type:String,
    required:true,
    unique:true
},
posts:[{
    type:Schema.Types.ObjectId,
    ref:"Job"
    }]
    

},
{timestamps:true})
module.exports = mongoose.model("Company", companySchema);