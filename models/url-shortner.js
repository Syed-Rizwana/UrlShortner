const mongoose =require("mongoose")
const urlSchema= new mongoose.Schema({
    originalurl:String,
    shorturl:String
})
const insight=mongoose.model('data',urlSchema);
module.exports=insight;