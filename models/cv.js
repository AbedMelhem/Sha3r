const { date } = require("joi");
const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")
const cvSchema=new Schema({
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
birthDate:{
   type:Date,
   require:true
},

experience:[{
    type:String,    //array of string
    required:true
}],
skills:[{
    type:String,    //array of string
    required:true
}],
mobileNumber:{
    type:String,
    required:false,
    unique:true
},
email:{
    type:String,
    lowercase:true,
    unique:true,
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
creator:{
    type:Schema.Types.ObjectId,
    ref: "User"
}


},
    { timestamps: true })
    
// cvSchema.post("findOneAndDelete", async function (doc) {
    
//   if (doc) {
//     await User.deleteOne({
//       _id: {
//         $in: doc.userCv,
//       },
//     });
//   }
// });


module.exports = mongoose.model("Cv", cvSchema);