const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const userSchema=new Schema({
firstName:{
    type:String,
    minLength:3,
    maxLength:50,
    required:true
},
lastName:{
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
userCvs:{
    type:Schema.Types.ObjectId,
    ref:'Cv'
}
},
{timestamps:true})
module.exports = mongoose.model("User", userSchema);