import mongoose from "mongoose";

const Admin = new mongoose.Schema({
    adminimage: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required:true},
    createdat: { type: Date, default: Date.now }
})

const AdminSchema = mongoose.model.Admin || mongoose.model('Admin', Admin);
export default AdminSchema;