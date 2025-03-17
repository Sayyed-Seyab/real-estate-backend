import mongoose from "mongoose";

const product = new mongoose.Schema({
    projectid:  {type: mongoose.Schema.Types.ObjectId},
    type:{type:String, required: true},
    name: {type: String, required: true},
    desc: {type: String, required: true},
    gallery:[{
        galleryimage:{type:String},
        alt:{type:String},
    }],
    video:{type:String},
    amenties:[{
        name:{type:String, required:true},
        amentiimage:{type:String, required:true},
        amentialt:{type:String}
    }],
    status: {type: Boolean, default:null},
    metatitle:{type:String},
    metadesc:{type:String},
    addedby: {type: String},
    lasteditby: {type: String, default: null},
    createdat: { type: Date, default: Date.now }
})

const ProductSchema = mongoose.model.product || mongoose.model('product', product);
export default ProductSchema;