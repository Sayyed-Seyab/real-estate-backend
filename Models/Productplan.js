import mongoose from "mongoose";

const Productplan = new mongoose.Schema({
    productid:  {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    desc: {type: String, required: true},
    gallery:[{
        galleryimage:{type:String},
        alt:{type:String},
    }],
    video:{type:String},
    area:[{
        planareatype:{type:String},  
        value:{type:String},
    }],
    status: {type: Boolean, default:null},
    metatitle:{type:String},
    metadesc:{type:String},
    addedby: {type: String},
    lasteditby: {type: String, default:null},
    createdat: { type: Date, default: Date.now }
})

const ProductplanSchema = mongoose.model.Productplan || mongoose.model('Productplan', Productplan);
export default ProductplanSchema;