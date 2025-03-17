import mongoose from "mongoose";

const Parentproject = new mongoose.Schema({
    name: {type: String, required: true},
    img:{type: String},
    alt:{type: String},
    description: {type: String, required: true},
    status: {type: Boolean, required:true, default:null},
    addedby: {type: String},
    lasteditby: {type: String},
    createdat: { type: Date, default: Date.now }
}) 

const ParentProjectSchema = mongoose.model.Parentproject || mongoose.model('Parentproject', Parentproject);
export default ParentProjectSchema;