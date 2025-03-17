import AdminSchema from "../Models/Admin.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import ParentProjectSchema from "../Models/ProjectParent.js";
import ProjectCategorySchema from "../Models/ProjectCategory.js";
import ProjectSchema from "../Models/Project.js";
import fs from 'fs';
import ProductSchema from "../Models/Product.js";
import ProductplanSchema from "../Models/Productplan.js";
import mongoose from "mongoose";
import { json } from "stream/consumers";
import BlogSchema from "../Models/Blog.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Password validation regex
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/;
dotenv.config();
const AddAdminManually = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            configpassword,
            role
        } = req.body;

        // Check if user already exists
        const exist = await AdminSchema.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: 'Super admin already exist' });
        }
        // Validate name
        if (!name) {
            return res.json({ success: false, Message: 'Name field is required' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be greater than 8' });
        }

        //Validate Password and Conform Password
        if (password !== configpassword) {
            return res.json({ success: false, message: 'Password and configpassword must be same' })
        }

        // Validate password against regex
        if (!passwordRegex.test(password)) {
            return res.json({ success: false, message: 'Password must include an uppercase letter, a lowercase letter, a number, and a special character' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const AddSuperAdmin = new AdminSchema({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save user to database
        const SuperAdmin = await AddSuperAdmin.save();
        if (!SuperAdmin) {
            return res.json({ success: false, message: 'Super admin is not added' })
        }

        return res.json({ success: true, SuperAdmin, message: 'Super Admin added successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Error occurred' });
    }
};

const GetAdminData = async (req, res) => {
    try {
        const Admin = await AdminSchema.find({})
        if (!Admin) {
            return res.json({ success: false, message: 'Admin not found' })
        }

        return res.json({ success: true, message: Admin })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

//Login Admin
// Function to create a token
const createToken = (id, Name, Role, AccountStatus) => {
    return jwt.sign({ id, Name, Role, AccountStatus }, process.env.JWT_SECRET);
}

const LoginUser = async (req, res) => {

    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await AdminSchema.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalide Email or Password' })
        }

        const Pass = await bcrypt.compare(password, user.password)
        if (!Pass) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        // Generate JWT Token
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     maxAge: 36000000,
        //     path: '/', // set path for cookie
        // })
        return res.json({ success: true, token: token })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}

//admin data
const AdminData = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from JWT

        // Fetch user from MongoDB
        const user = await AdminSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const adminData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            // dashboardStats: {
            //     users: 1200,
            //     sales: 50000,
            //     revenue: "$150K",
            // },
        };

        return res.json({ success: true, message: adminData });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};



const AdminAddParentProject = async (req, res) => {
    try {
        const { name, img, alt, description, status, metatitle, metadesc, addedby, } = req.body;
        // return res.json({success:true, message: req.body})
        const exist = await ParentProjectSchema.findOne({ name })
        if (exist) {
            return res.json({ success: false, message: 'Parent project already exist' })
        }
        if (!name) {
            return res.json({ success: false, message: 'name is required' })
        }
        // if (!description) {
        //     return res.json({ success: false, message: 'description is required' })
        // }
        if (status == null) {
            return res.json({ success: false, message: 'status is required' })
        }
        if (!addedby) {
            return res.json({ success: false, message: 'addedby is required' })
        }
        const data = await ParentProjectSchema({
            name,
            img,
            alt,
            description,
            status,
            metatitle,
            metadesc,
            addedby,
        })
        const parentproject = await data.save();
        if (!parentproject) {
            return res.json({ success: false, message: 'Parent project is not added' })
        }
        return res.json({ success: true, data: parentproject, message: 'Project parent added successfully' })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminGetParentProject = async (req, res) => {
    try {
        const ParentProject = await ParentProjectSchema.find({})
        if (!ParentProject || ParentProject.length == 0) {
            return res.json({ success: false, message: 'Parent project not found' })
        }

        return res.json({ success: true, message: ParentProject })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminUpdateParentProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, img, alt, description, status, metatitle, metadesc, addedby, lasteditby } = req.body;

        // Check if the category ID exists
        const existingParent = await ParentProjectSchema.findById(id);

        if (!existingParent) {
            return res.json({ success: false, message: "Category not found" });
        }
        if (!lasteditby) {
            return res.json({ success: false, message: 'lasteditby required' })
        }

        // Update the category fields
        existingParent.img = img || existingParent.img; // Keep the old image if no new one is provided
        existingParent.name = name || existingParent.name;
        existingParent.description = description || existingParent.description;
        existingParent.status = status !== null ? status : existingParent.status;
        existingParent.metatitle = metatitle || existingParent.metatitle;
        existingParent.metadesc = metadesc || existingParent.metadesc;
        existingParent.addedby = addedby || existingParent.addedby;
        existingParent.lasteditby = lasteditby;

        // Save the updated category
        const updatedCategory = await existingParent.save();

        if (!updatedCategory) {
            return res.json({ success: false, message: "Failed to update category" });
        }
        return res.json({ success: true, projectParent: updatedCategory, message: 'Project parent updated successfully' })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}
const AdminDltParentProject = async (req, res) => {
    try {
        const _id = req.params.id;

        // Find the ParentProject by ID
        const ParentProject = await ParentProjectSchema.findById(_id);

        if (!ParentProject) {
            return res.status(404).json({ success: false, message: 'ParentProject not found' });
        }

        // Find and update categories where parentid matches _id
        const category = await ProjectCategorySchema.updateMany(
            { parentid: _id }, // Find categories with this parentid
            { $set: { parentid: null } } // Set parentid to null
        );

        // Optionally delete the ParentProject if needed
        await ParentProjectSchema.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            category: category,
            message: 'ParentProject deleted and associated categories updated successfully.'
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const AdminAddProjectCategory = async (req, res) => {
    try {
        const { parentid, categoryimage, alt, name, description, status, metatitle, metadesc, addedby, } = req.body;
        // const imagee = JSON.parse(image)
        // console.log(imagee)
        //  return res.json({success:true, message:req.body})
        const exist = await ProjectCategorySchema.findOne({ name })
        if (exist) {
            return res.json({ success: false, message: 'Category already exist' })
        }
        if (!parentid) {
            return res.json({ success: false, message: 'parentid is required' })
        }
        if (!name) {
            return res.json({ success: false, message: 'Category is required' })
        }


        if (status == null) {
            return res.json({ success: false, message: 'status is required' })
        }
        if (!addedby) {
            return res.json({ success: false, message: 'addedby is required' })
        }

        const data = await ProjectCategorySchema({
            parentid,
            categoryimage: categoryimage ? categoryimage : null,
            alt,
            name,
            description,
            status,
            metatitle,
            metadesc,
            addedby
        })
        const parentproject = await data.save();
        if (!parentproject) {
            return res.json({ success: false, message: 'Category is not added' })
        }
        return res.json({ success: true, message: "Project category updated successfuly", parentproject: parentproject })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminUpdateProjectCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get the category ID from the URL
        const {
            parentid,
            categoryimage,
            alt,
            name,
            description,
            status,
            metatitle,
            metadesc,
            addedby,
            lasteditby,
        } = req.body;

        // Check if the category ID exists
        const existingCategory = await ProjectCategorySchema.findById(id);
        if (!existingCategory) {
            return res.json({ success: false, message: "Category not found" });
        }



        if (!lasteditby) {
            return res.json({ success: false, message: "lasteditby field is required" });
        }

        // Update the category fields
        existingCategory.parentid = parentid || existingCategory.parentid;
        existingCategory.categoryimage = categoryimage || existingCategory.categoryimage; // Keep the old image if no new one is provided
        existingCategory.alt = alt || existingCategory.alt;
        existingCategory.name = name || existingCategory.name;
        existingCategory.description = description || existingCategory.description;
        existingCategory.status = status !== null ? status : existingCategory.status;
        existingCategory.metatitle = metatitle || existingCategory.metatitle;
        existingCategory.metadesc = metadesc || existingCategory.metadesc;
        existingCategory.addedby = addedby || existingCategory.addedby;
        existingCategory.lasteditby = lasteditby;

        // Save the updated category
        const updatedCategory = await existingCategory.save();

        if (!updatedCategory) {
            return res.json({ success: false, message: "Failed to update category" });
        }

        return res.json({ success: true, message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



const AdminGetProjectCategory = async (req, res) => {
    try {
        const ProjectCategory = await ProjectCategorySchema.find({})
        if (!ProjectCategory || ProjectCategory.length == 0) {
            return res.json({ success: false, message: 'Category not found' })
        }

        return res.json({ success: true, message: ProjectCategory })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminDltCategory = async (req, res) => {
    try {
        const _id = req.params.id

        const Cotegory = await ProjectCategorySchema.findById(_id)

        if (!Cotegory) {
            return res.json({ success: false, message: 'Cotegory not found' })
        }
        const DltCategory = await ProjectCategorySchema.findByIdAndDelete(_id)
        if (!DltCategory) {
            return res.json({ success: true, message: "Category is not deleted" })
        }
        return res.json({ success: true, message: 'Cotegory deleted successfully' })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}
const AdminAddimage = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: 'no file uploaded' })
        }
        return res.json({ success: true, file: req.file.filename, message: 'Image upload successfully' })
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}

const AdminDltProjectimage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: true, message: 'url required' })
        }
        const imagePath = `Upload/project/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });


    } catch (error) {
        return res.json({ success: true, message: error })
    }
}


const AdminDltParentImage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: true, message: 'url required' })
        }
        const imagePath = `Upload/parent/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}


const AdminDltCategoryImage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: false, message: 'url required' })
        }
        const imagePath = `Upload/category/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminDltProductimage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: true, message: 'url required' })
        }
        const imagePath = `Upload/product/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });

    } catch (error) {
        return res.json({ success: true, message: error })
    }
}

const AdminDltProductPlanimage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: true, message: 'url required' })
        }
        const imagePath = `Upload/productplan/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });

    } catch (error) {
        return res.json({ success: true, message: error })
    }
}

const DownloadProject = async (req, res) => {
    try {
        const fileName = req.params.id;
        if (!fileName) {
            return res.status(400).json({ success: false, message: "File name is required" });
        }

        const filePath = `Upload/project/${fileName}`

        // Check if file exists before downloading
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error("Download Error:", err);
                return res.status(500).json({ success: false, message: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error("Download Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const DownloadProductPlan = async (req, res) => {
    try {
        const fileName = req.params.id;
        if (!fileName) {
            return res.status(400).json({ success: false, message: "File name is required" });
        }

        const filePath = `Upload/productplan/${fileName}`

        // Check if file exists before downloading
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error("Download Error:", err);
                return res.status(500).json({ success: false, message: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error("Download Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//admin dlt blog image
const AdminDltBlogImage = async (req, res) => {
    try {
        const url = req.params.id
        if (!url) {
            return res.json({ success: true, message: 'url required' })
        }
        const imagePath = `Upload/blog/${url}`
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.json({ success: false, message: "No such file or directory found" })
            } else {
                return res.json({ success: true, message: `Image deleted ${imagePath}` })
            }
        });

    } catch (error) {
        return res.json({ success: true, message: error })
    }
}


const AdminAddProject = async (req, res) => {
    try {
        const {

            categories,
            name,
            gallery,
            video,
            price,
            area,
            address,
            accomodation,
            producttitle,
            amenitytitle,
            amenitydesc,
            nearby,
            productplantitle,
            sections1,
            section2title,
            section2subtitle,
            section2desc,
            sections2,
            status,
            metatitle,
            metadesc,
            addedby,
        } = req.body;

        // Log the received data for debugging
        console.log(req.body);


        // Check if project already exists by name
        const exist = await ProjectSchema.findOne({ name });
        if (exist) {
            return res.json({ success: false, message: 'Project already exists' });
        }

        if (status == null) {
            return res.json({ success: false, message: 'status required' })
        }

        // Ensure categories are saved as ObjectId references
        const categoryIds = categories.map(category => ({
            id: category.id
        }));


        // Assuming `gallery`, `sections1`, and `sections2` hold image filenames (e.g., 'image1.jpg')
        // Update these fields if necessary (e.g., if you're using URLs instead of file paths)
        const galleryWithUrls = gallery.map(item => ({
            galleryimage: item.galleryimage,  // Assuming this is the filename, or update it to a URL if needed
            alt: item.alt
        }));



        const sections1WithUrls = sections1.map(section => ({
            ...section,
            gallery: section.gallery,  // Assuming this is the filename, or update it to a URL if needed
        }));


        // const sections2WithUrls = sections2.map(section => ({
        //     ...section,
        //     section2image: section.section2image,  // Assuming this is the filename, or update it to a URL if needed
        // }));
        // return res.json({success:true, message: galleryWithUrls})
        // Create a new project entry in the database
        const Project = new ProjectSchema({
            categories: categoryIds,
            name,
            gallery: galleryWithUrls,
            video,
            price,
            area,
            address,
            accomodation,
            producttitle,
            amenitytitle,
            amenitydesc,
            productplantitle,
            nearby,
            sections1: sections1WithUrls,
            section2title,
            section2subtitle,
            section2desc,
            sections2,
            status,
            metatitle,
            metadesc,
            addedby,
        });

        // Save the project to the database
        const AddProject = await Project.save();
        if (!AddProject) {
            return res.json({ success: false, message: 'Project is not added' });
        }

        return res.json({ success: true, project: AddProject, message: 'Project is added successfully' });

    } catch (error) {
        console.error("Error adding project:", error);
        return res.json({ success: false, message: error.message });
    }
};


const AdminGetProject = async (req, res) => {
    try {
        const projects = await ProjectSchema.find({})
        if (!projects || projects.length == 0) {
            return res.json({ success: false, message: 'Projects not found' })
        }
        return res.json({ success: true, message: projects })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminDltProject = async (req, res) => {
    try {
        const _id = req.params.id

        const Project = await ProjectSchema.findById(_id)

        if (!Project) {
            return res.json({ success: false, message: 'Project not found' })
        }

        const DltProject = await ProjectSchema.findByIdAndDelete(_id)
        if (!DltProject) {
            return res.json({ success: true, message: "Project is not deleted" })
        }
        return res.json({ success: true, message: 'Project deleted successfully' })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}

const AdminUpdateProject = async (req, res) => {
    try {
        const {
            categories,
            name,
            gallery,
            video,
            price,
            area,
            address,
            accomodation,
            producttitle,
            amenitytitle,
            amenitydesc,
            productplantitle,
            nearby,
            sections1,
            section2title,
            section2subtitle,
            section2desc,
            sections2,
            status,
            metatitle,
            metadesc,
            addedby,
            lasteditby,

        } = req.body;

        const _id = req.params.id
        const project = await ProjectSchema.findById(_id);
        if (!project) {
            return res.json({ success: false, message: 'Project not found' })
        }

        // Ensure categories are saved as ObjectId references
        const categoryIds = categories.map(category => ({
            id: category.id
        }));


        // Assuming `gallery`, `sections1`, and `sections2` hold image filenames (e.g., 'image1.jpg')
        // Update these fields if necessary (e.g., if you're using URLs instead of file paths)
        const galleryWithUrls = gallery.map(item => ({
            galleryimage: item.galleryimage,  // Assuming this is the filename, or update it to a URL if needed
            alt: item.alt
        }));



        const sections1WithUrls = sections1.map(section => ({
            ...section,
            gallery: section.gallery,  // Assuming this is the filename, or update it to a URL if needed
        }));


        const sections2WithUrls = sections2.map(section => ({
            ...section,
            section2image: section.section2image,  // Assuming this is the filename, or update it to a URL if needed
        }));

        project.categories = categoryIds || project.categories
        project.name = name || project.name
        project.gallery = galleryWithUrls || project.gallery
        project.video = video || project.video
        project.price = price || project.price
        project.area = area || project.area
        project.address = address || project.address
        project.accomodation = accomodation || project.accomodation
        project.producttitle = producttitle || project.producttitle
        project.amenitytitle = amenitytitle || project.amenitytitle
        project.amenitydesc = amenitydesc || project.amenitydesc
        project.nearby = nearby || project.nearby
        project.productplantitle = productplantitle || project.productplantitle
        project.sections1 = sections1WithUrls || project.sections1
        project.section2title = section2title || project.section2title
        project.section2subtitle = section2subtitle || project.section2subtitle
        project.section2desc = section2desc || project.section2desc
        project.sections2 = sections2WithUrls || project.sections2
        project.status = status !== null ? status : project.status
        project.metatitle = metatitle || project.metatitle
        project.metadesc = metadesc || project.metadesc
        project.addedby = addedby || project.addedby
        project.lasteditby = lasteditby || project.lasteditby

        const updateProject = await project.save()
        if (!updateProject) {
            return res.json({ success: false, message: 'Project is not updated' })
        }
        return res.json({ success: true, updateProject: updateProject, message: 'Project updated successfully' })

    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

const AdminAddProduct = async (req, res) => {
    try {
        const {
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            amenties,
            status,
            metatitle,
            metadesc,
            addedby,


        } = req.body;
        const exist = await ProductSchema.findOne({ name })
        if (exist) {
            return res.json({ success: true, message: 'Product already exist' })
        }
        if (!projectid) {
            return res.json({ success: true, message: 'projectid required' })
        }
        if (!addedby) {
            return res.json({ success: true, message: 'addedby required' })
        }
        if (!name) {
            return res.json({ success: true, message: 'name required' })
        }
        if (!gallery) {
            return res.json({ success: true, message: 'gallery required' })
        }
        if (!amenties) {
            return res.json({ success: true, message: 'amenties required' })
        }
        if (!type) {
            return res.json({ success: true, message: 'type required' })
        }

        const newProduct = new ProductSchema({
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            amenties,
            status,
            metatitle,
            metadesc,
            addedby,

        })
        const addedProduct = await newProduct.save();
        if (!addedProduct) {
            return res.json({ success: true, message: 'Product no added' })
        }
        return res.json({ success: true, product: addedProduct, message: 'Product added successfully' })
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}

const AdminGetProducts = async (req, res) => {
    try {
        const Products = await ProductSchema.find({})
        if (!Products || Products.length == 0) {
            return res.json({ success: false, message: 'Product not found' })
        }
        return res.json({ success: true, message: Products });
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}


const AdminDltProduct = async (req, res) => {
    try {
        const _id = req.params.id

        const Product = await ProductSchema.findById(_id)

        if (!Product) {
            return res.json({ success: false, message: 'Product not found' })
        }
        const DltProduct = await ProductSchema.findByIdAndDelete(_id)
        if (!DltProduct) {
            return res.json({ success: true, message: "Product is not deleted" })
        }
        return res.json({ success: true, message: 'Product deleted successfully' })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}


const AdminUpdateProduct = async (req, res) => {
    try {
        const {
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            amenties,
            status,
            metatitle,
            metadesc,
            addedby,
            lasteditby,
        } = req.body;
        const _id = req.params.id

        const product = await ProductSchema.findById(_id)
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }
        if (!lasteditby) {
            return res.json({ success: false, message: 'lasteditby required' })
        }

        product.projectid = projectid || product.projectid
        product.type = type || product.type
        product.name = name || product.name
        product.desc = desc || product.desc
        product.gallery = gallery || product.gallery
        product.video = video || product.video
        product.amenties = amenties || product.amenties
        product.status = status || product.status
        product.metatitle = metatitle || product.metatitle
        product.metadesc = metadesc || product.metadesc
        product.addedby = addedby || product.addedby
        product.lasteditby = lasteditby || product.lasteditby

        const addedProduct = await product.save();
        if (!addedProduct) {
            return res.json({ success: false, message: 'Product no added' })
        }
        return res.json({ success: true, product: addedProduct, message: 'Product updated successfully' })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}


const AdminAddProductPlan = async (req, res) => {
    try {
        const {
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            plans,
            file,
            status,
            metatitle,
            metadesc,
            addedby,

        } = req.body;


        const exist = await ProductplanSchema.findOne({ name });
        if (exist) {
            return res.json({ success: false, message: 'product plan already exist' })
        }
        if (!projectid) {
            return res.json({ success: false, message: 'projectid required' })
        }
        if (!name) {
            return res.json({ success: false, message: 'name required' })
        }
        if (!desc) {
            return res.json({ success: false, message: 'desc required' })
        }
        if (!gallery) {
            return res.json({ success: false, message: 'gallery required' })
        }

        if (!plans) {
            return res.json({ success: false, message: 'area required' })
        }

        if (!type) {
            return res.json({ success: false, message: 'type is  required' })
        }

        const newProductPlan = new ProductplanSchema({
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            plans,
            file,
            status,
            metatitle,
            metadesc,
            addedby,
        })
        const addProduct = await newProductPlan.save();
        if (!addProduct) {
            return res.json({ success: true, message: 'Product not added' })
        }
        return res.json({ success: true, message: 'Product plan added successfully', productplan: addProduct })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}


const AdminGetProductPlans = async (req, res) => {
    try {
        const ProductPlan = await ProductplanSchema.find({})
        if (!ProductPlan || ProductPlan.length == 0) {
            return res.json({ success: false, message: 'Product not found' })
        }
        return res.json({ success: true, message: ProductPlan });
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}


const AdminUpdateProductPlan = async (req, res) => {
    try {
        const {
            projectid,
            type,
            name,
            desc,
            gallery,
            video,
            plan,
            file,
            status,
            metatitile,
            metadesc,
            addedby,
            lasteditby,

        } = req.body;
        const _id = req.params.id
        const productplan = await ProductplanSchema.findById(_id);
        if (!productplan) {
            return res.json({ success: true, message: 'product plan not found' })
        }

        productplan.projectid = projectid || productplan.projectid
        productplan.type = type || productplan.type
        productplan.name = name || productplan.name
        productplan.desc = desc || productplan.desc
        productplan.gallery = gallery || productplan.gallery
        productplan.video = video || productplan.video
        productplan.plan = plan || productplan.plan
        productplan.file = file || productplan.file
        productplan.status = status || productplan.status
        productplan.metatitile = metatitile || productplan.metatitile
        productplan.metadesc = metadesc || productplan.metadesc
        productplan.addedby = addedby || productplan.addedby
        productplan.lasteditby = lasteditby || productplan.lasteditby


        const addProductPlan = await productplan.save();
        if (!addProductPlan) {
            return res.json({ success: true, message: 'Product not added' })
        }
        return res.json({ success: true, message: 'Product plan updated successfully', productplan: addProductPlan })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}



const GetProjectdata = async (req, res) => {
    try {
        const projects = await ProjectSchema.find({});
        if (!projects || projects.length === 0) {
            return res.json({ success: true, message: 'Projects not found' });
        }

        const projectData = await Promise.all(
            projects.map(async (project) => {
                const categories = await Promise.all(
                    project.categories.map(async (category) => {
                        const projectCategory = await ProjectCategorySchema.find({ _id: category.id });
                        const parent = await Promise.all(
                            projectCategory.map(async (c) => {
                                const projectParent = await ParentProjectSchema.findById(c.parentid)
                                return {
                                    projectParent,
                                }
                            })

                        )

                        return {
                            parent,
                            projectCategory, // Merged the category with its resolved data
                        };
                    })
                );
                const product = await ProductSchema.find({ projectid: project._id })

                const productplan = await ProductplanSchema.find({ projectid: project._id })



                return {
                    ...project._doc,
                    categories, // Replacing the original `categories` with enriched data
                    product,
                    productplan,
                };
            })
        );

        return res.json({ success: true, message: projectData });
    } catch (error) {
        console.error('Error fetching project data:', error);
        return res.json({ success: false, message: error.message });
    }
};



const GetProjectDetails = async (req, res) => {
    try {
        const _id = req.params.id;

        // Get the main project
        const project = await ProjectSchema.findById(_id).lean();
        if (!project) {
            return res.json({ success: false, message: 'Project not found' });
        }

        // Get all categories linked to this project
          const categories = await Promise.all(
                    project.categories.map(async (category) => {
                        const projectCategory = await ProjectCategorySchema.find({ _id: category.id });
                        const parent = await Promise.all(
                            projectCategory.map(async (c) => {
                                const projectParent = await ParentProjectSchema.findById(c.parentid)
                                return {
                                    projectParent,
                                }
                            })

                        )

                        return {
                            parent,
                            projectCategory, // Merged the category with its resolved data
                        };
                    })
                );

        // Get product(s) linked to this project
        const products = await ProductSchema.find({ projectid: project._id }).lean();

        // Get product plans (master plans) linked to this project
        const productPlans = await ProductplanSchema.find({ projectid: project._id }).lean();

        // Return full project data
        return res.json({
            success: true,
            data: {
                ...project,
                categories,
                products,
                productPlans
            }
        });

    } catch (error) {
        console.error('Error fetching project data:', error);
        return res.json({ success: false, message: error.message });
    }
};



const AdminDltProductPlan = async (req, res) => {
    try {
        const _id = req.params.id

        const Product = await ProductplanSchema.findById(_id)

        if (!Product) {
            return res.json({ success: false, message: 'Product Plan not found' })
        }
        const DltProduct = await ProductplanSchema.findByIdAndDelete(_id)
        if (!DltProduct) {
            return res.json({ success: true, message: "Product Plan is not deleted" })
        }
        return res.json({ success: true, message: 'Product Plan deleted successfully' })
    } catch (error) {
        return res.status(404).json({ success: false, message: error })
    }
}


const AdminAddBlog = async (req, res) => {
    try {
        const {
            image,
            name,
            description,
            detaildesc,
            status,
            metatitle,
            metadesc,
            addedby,

        } = req.body;


        const exist = await BlogSchema.findOne({ name });
        if (exist) {
            return res.json({ success: false, message: 'Blog already exist' })
        }
        if (!name) {
            return res.json({ success: false, message: 'name required' })
        }
        if (status == null) {
            return res.json({ success: false, message: 'status required' })
        }
        if (!description) {
            return res.json({ success: false, message: 'description required' })
        }
        if (!addedby) {
            return res.json({ success: false, message: 'addedby required' })
        }


        const newBlog = new BlogSchema({
            image,
            name,
            description,
            detaildesc,
            status,
            metatitle,
            metadesc,
            addedby,
        })
        const addBlog = await newBlog.save();
        if (!addBlog) {
            return res.json({ success: true, message: 'blog not added' })
        }
        return res.json({ success: true, message: 'blog plan added successfully', blog: addBlog })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}


const AdminGetBlogs = async (req, res) => {
    try {
        const Blogs = await BlogSchema.find({})
        if (!Blogs || Blogs.length == 0) {
            return res.json({ success: false, message: 'Blogs not found' })
        }
        return res.json({ success: true, message: Blogs });
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}


const AdminUpdateBlog = async (req, res) => {
    try {
        const {
            image,
            name,
            description,
            detaildesc,
            status,
            metatitle,
            metadesc,
            addedby,
            lasteditby,

        } = req.body;
        const _id = req.params.id
        const Blog = await BlogSchema.findById(_id);
        if (!Blog) {
            return res.json({ success: true, message: 'blog  not found' })
        }

        Blog.name = name || Blog.name
        Blog.description = description || Blog.description
        Blog.detaildesc = detaildesc || Blog.detaildesc
        Blog.image = image || Blog.image
        Blog.status = status !== null ? status : Blog.status
        Blog.metatitle = metatitle || Blog.metatitle
        Blog.metadesc = metadesc || Blog.metadesc
        Blog.addedby = addedby || Blog.addedby
        Blog.lasteditby = lasteditby || Blog.lasteditby


        const addBlog = await Blog.save();
        if (!addBlog) {
            return res.json({ success: false, message: 'blog not added' })
        }
        return res.json({ success: true, message: 'blog  updated successfully', blog: addBlog })
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}


const AdminDltBlog = async (req, res) => {
    try {
        const _id = req.params.id
        const Blog = await BlogSchema.findById(_id)
        if (!Blog) {
            return res.json({ success: false, message: 'blog not found' })
        }
        const dltBlog = await BlogSchema.findByIdAndDelete(_id)
        if (!dltBlog) {
            return res.json({ success: false, message: 'blog not deleted' })
        }
        return res.json({ success: true, message: 'blog deleted successfully' })
    } catch (error) {
        return res.json({ success: true, message: error })
    }
}










export {
    AddAdminManually,
    GetAdminData,
    AdminAddParentProject,
    AdminGetParentProject,
    AdminUpdateParentProject,
    AdminDltParentProject,
    AdminDltParentImage,
    AdminAddProjectCategory,
    AdminGetProjectCategory,
    AdminUpdateProjectCategory,
    AdminAddimage,
    AdminDltProjectimage,
    AdminDltProductimage,
    AdminDltProductPlanimage,
    AdminDltCategory,
    AdminDltCategoryImage,
    AdminAddProject,
    AdminGetProject,
    AdminDltProject,
    DownloadProject,
    AdminUpdateProject,
    AdminAddProduct,
    AdminGetProducts,
    AdminDltProduct,
    AdminUpdateProduct,
    AdminAddProductPlan,
    AdminGetProductPlans,
    AdminUpdateProductPlan,
    GetProjectdata,
    AdminDltProductPlan,
    AdminDltBlogImage,
    AdminAddBlog,
    AdminGetBlogs,
    AdminUpdateBlog,
    AdminDltBlog,
    DownloadProductPlan,
    LoginUser,
    AdminData,
    GetProjectDetails,
}