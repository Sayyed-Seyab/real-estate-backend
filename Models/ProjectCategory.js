import mongoose from "mongoose";

const ProjectCotegory = new mongoose.Schema({
    parentid: {type: mongoose.Schema.Types.ObjectId, default: null},
    categoryimage:{type:String},
    name: {type: String, required: true},
    description: {type: String},
    status: {type: Boolean, required:true, default:null},
    addedby: {type: String, required:true},
    lasteditby: {type: String},
    createdat: { type: Date, default: Date.now }
})

const ProjectCategorySchema = mongoose.model.ProjectCotegory || mongoose.model('ProjectCotegory', ProjectCotegory);
export default ProjectCategorySchema;