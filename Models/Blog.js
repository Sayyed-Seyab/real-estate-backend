import mongoose from "mongoose";
const blog = new mongoose.Schema({
    image: {type:String, required:true},
     categories: [{
        id:  {type: mongoose.Schema.Types.ObjectId}
        }],
    name:{type:String, required:true},
    description:{type:String, required: true},
    detaildesc:{type:String, required: true},
    status: {type: Boolean, default:null},
    addedby: {type: String},
    lasteditby: {type: String, default: null},
    createdat: { type: Date, default: Date.now }
})

const BlogSchema = mongoose.model.blog || mongoose.model('blog', blog)
export default BlogSchema