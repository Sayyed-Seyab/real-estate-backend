import express from 'express';
import { AddAdminManually, AdminAddBlog, AdminAddimage, AdminAddParentProject, AdminAddProduct, AdminAddProductPlan, AdminAddProject, AdminAddProjectCategory, AdminData, AdminDltBlog, AdminDltBlogImage, AdminDltCategory,  AdminDltCategoryImage,  AdminDltParentImage,  AdminDltParentProject,  AdminDltProduct,  AdminDltProductimage,  AdminDltProductPlan,  AdminDltProductPlanimage,  AdminDltProject, AdminDltProjectimage, AdminGetBlogs, AdminGetParentProject, AdminGetProductPlans, AdminGetProducts, AdminGetProject, AdminGetProjectCategory, AdminUpdateBlog, AdminUpdateParentProject, AdminUpdateProduct, AdminUpdateProductPlan, AdminUpdateProject, AdminUpdateProjectCategory, DownloadProductPlan, DownloadProject, GetAdminData, GetProjectdata, GetProjectDetails,  LoginUser } from '../Controllers/AdminController.js';
import multer from 'multer';
import { authMiddleware } from '../Middlewears/Auth.js';

// 📦 Reusable Storage Function
const createStorage = (folder) => multer.diskStorage({
    destination: `Upload/${folder}`,
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${sanitizedFileName}`);
    }
});

// 📦 Upload Function (Limit 10MB + optional file type validation)
const uploadOptions = (folder) => multer({
    storage: createStorage(folder),
    limits: { fileSize: 100 * 1024 * 1024 }, // 10MB limit
});
 

// Define Uploaders
const UploadParent = uploadOptions('parent');
const UploadProject = uploadOptions('project');
const UploadProduct = uploadOptions('product');
const UploadCategory = uploadOptions('category');
const UploadProductPlan = uploadOptions('productplan');
const UploadBlogImage = uploadOptions('blog');

//---------------------------- ROUTES -----------------------------------//





const AdminRouter = express.Router();
//admin data
//add admin manually
AdminRouter.post('/add', AddAdminManually);
//Login admin
AdminRouter.post('/login', LoginUser);

//get admin profile data
AdminRouter.get('/profile', GetAdminData);
//admin data
AdminRouter.get('/admin', authMiddleware, AdminData)

//parent project
//admin add project parent
AdminRouter.post('/projectparent', authMiddleware, AdminAddParentProject);
//get project parent
AdminRouter.get('/projectparent', authMiddleware, AdminGetParentProject);
//upload parent file
AdminRouter.post('/upload/parent',authMiddleware, UploadParent.single("file"), AdminAddimage);
//delete parent file
AdminRouter.delete('/upload/parent/:id',authMiddleware, AdminDltParentImage);
//update praent project
AdminRouter.put('/projectparent/:id',authMiddleware, AdminUpdateParentProject);
//dlt project parent
AdminRouter.delete('/projectparent/:id',authMiddleware, AdminDltParentProject);
//parent project

//project category
//add project category
AdminRouter.post('/projectcategory',authMiddleware, AdminAddProjectCategory);
AdminRouter.put('/projectcategory/:id',authMiddleware, AdminUpdateProjectCategory);
//admin get project category
AdminRouter.get('/projectcategories', authMiddleware, AdminGetProjectCategory);
//for frontend 
AdminRouter.get('/categories',  AdminGetProjectCategory);
//add category file
AdminRouter.post('/upload/category',authMiddleware, UploadCategory.single("file"), AdminAddimage);
AdminRouter.delete('/upload/category/:id',authMiddleware, AdminDltCategoryImage);
//project category


//project
//admin add project image
AdminRouter.post('/upload/project', authMiddleware, UploadProject.single("file"), AdminAddimage);
//admin dlt project image
AdminRouter.delete('/upload/project/:id',authMiddleware, AdminDltProjectimage);
//Download project
AdminRouter.get('/download/project/:id', DownloadProject)

//admin dlt category
AdminRouter.delete('/projectcategory/:id',authMiddleware, AdminDltCategory);
//admin add project
AdminRouter.post('/project',authMiddleware, AdminAddProject);
//admin get project
AdminRouter.get('/projects',authMiddleware, AdminGetProject);
//for frontend
AdminRouter.get('/allprojects', AdminGetProject);
//admin get project
AdminRouter.put('/project/:id',authMiddleware, AdminUpdateProject);
//admin get project
AdminRouter.delete('/project/:id',authMiddleware, AdminDltProject);
//admin get detail project data
AdminRouter.get('/detailproject',authMiddleware, GetProjectdata);
//for frontend
AdminRouter.get('/singleprojectdetails/:id', GetProjectDetails);
//project

//product
//admin add product image
AdminRouter.post('/upload/productplan',authMiddleware, UploadProductPlan.single("file"), AdminAddimage);
AdminRouter.get('/download/productplan/:id', DownloadProductPlan)
//admin dlt product image
AdminRouter.delete('/upload/product/:id',authMiddleware, AdminDltProductimage);
//admin add product
AdminRouter.post('/product',authMiddleware, AdminAddProduct);
//admin get product
AdminRouter.get('/products', authMiddleware, AdminGetProducts);
//admin get product
AdminRouter.delete('/product/:id',authMiddleware, AdminDltProduct);
//admin update product
AdminRouter.put('/product/:id',authMiddleware, AdminUpdateProduct);
//product

//product plan
//admin add product plan image
AdminRouter.post('/upload/product',authMiddleware, UploadProduct.single("file"), AdminAddimage);
//admin dlt product plan image
AdminRouter.delete('/upload/productplan/:id',authMiddleware, AdminDltProductPlanimage);
//admin add product plan
AdminRouter.post('/productplan',authMiddleware, AdminAddProductPlan);
//admin get product plan
AdminRouter.get('/productplans',authMiddleware, AdminGetProductPlans);
//admin update product plan
AdminRouter.put('/productplan/:id',authMiddleware, AdminUpdateProductPlan);
//admin get product
AdminRouter.delete('/productplan/:id',authMiddleware, AdminDltProductPlan);


//add blog
//admin add blog image
AdminRouter.post('/upload/blog',authMiddleware, UploadBlogImage.single("file"), AdminAddimage);
//admin dlt blog image
AdminRouter.delete('/upload/blog/:id',authMiddleware, AdminDltBlogImage);
//admin add blog
AdminRouter.post('/blog',authMiddleware, AdminAddBlog);
//admin get blog also user for frontend
AdminRouter.get('/blog',AdminGetBlogs);
//admin update blog
AdminRouter.put('/blog/:id',authMiddleware, AdminUpdateBlog);
//admin delete blog
AdminRouter.delete('/blog/:id',authMiddleware, AdminDltBlog);




export default AdminRouter