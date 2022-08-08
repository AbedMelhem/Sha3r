const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const passwordResetsSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
},
{timestamps:true})
module.exports = mongoose.model("PasswordResets", passwordResetsSchema);