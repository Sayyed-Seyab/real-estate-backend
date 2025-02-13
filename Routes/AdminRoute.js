import express from 'express';
import { AddAdminManually, AdminAddBlog, AdminAddimage, AdminAddParentProject, AdminAddProduct, AdminAddProductPlan, AdminAddProject, AdminAddProjectCategory, AdminDltBlog, AdminDltBlogImage, AdminDltCategory,  AdminDltCategoryImage,  AdminDltParentProject,  AdminDltProduct,  AdminDltProductimage,  AdminDltProductPlan,  AdminDltProductPlanimage,  AdminDltProject, AdminDltProjectimage, AdminGetBlogs, AdminGetParentProject, AdminGetProductPlans, AdminGetProducts, AdminGetProject, AdminGetProjectCategory, AdminUpdateBlog, AdminUpdateProduct, AdminUpdateProductPlan, AdminUpdateProject, AdminUpdateProjectCategory, GetAdminData, GetProjectdata } from '../Controllers/AdminController.js';
import multer from 'multer';
// Image storage engine
const Storage = multer.diskStorage({
    destination: 'Upload/project',
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with dashes
       return cb(null, `${Date.now()}-${sanitizedFileName}`);
    },
});
const Upload = multer({ storage: Storage });

const productStorage = multer.diskStorage({
    destination: 'Upload/product',
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with dashes
       return cb(null, `${Date.now()}-${sanitizedFileName}`);
    },
});
const UploadProduct = multer({ storage: productStorage });

const CategoryStorage = multer.diskStorage({
    destination: 'Upload/category',
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with dashes
       return cb(null, `${Date.now()}-${sanitizedFileName}`);
    },
});
const UploadCategory = multer({ storage: CategoryStorage });


const ProdutPlan = multer.diskStorage({
    destination: 'Upload/productplan',
    filename: (req, file, cb)=>{
        const Renamefile = file.originalname.replace(/\s+/g, '-');
        return cb(null, `${Date.now()}-${Renamefile}`);
    }

})
const UploadProductPlan = multer({storage: ProdutPlan})


//upload blog image
const Blog = multer.diskStorage({
    destination: 'Upload/blog',
    filename: (req, file, cb)=>{
        const Renamefile = file.originalname.replace(/\s+/g, '-');
        return cb(null, `${Date.now()}-${Renamefile}`);
    }

})
const UploadBlogImage = multer({storage: Blog})





const AdminRouter = express.Router();
//admin data
//add admin manually
AdminRouter.post('/add', AddAdminManually);
//get admin profile data
AdminRouter.get('/profile', GetAdminData);
//admin data

//parent project
//admin add project parent
AdminRouter.post('/projectparent', AdminAddParentProject);
//get project parent
AdminRouter.get('/projectparent', AdminGetParentProject);
//dlt project parent
AdminRouter.delete('/projectparent/:id', AdminDltParentProject);
//parent project

//project category
//add project category
AdminRouter.post('/projectcategory', AdminAddProjectCategory);
AdminRouter.put('/projectcategory/:id', AdminUpdateProjectCategory);
//admin get project category
AdminRouter.get('/projectcategories', AdminGetProjectCategory);
//add category file
AdminRouter.post('/upload/category', UploadCategory.single("file"), AdminAddimage);
AdminRouter.delete('/upload/category/:id', AdminDltCategoryImage);
//project category


//project
//admin add project image
AdminRouter.post('/upload/project', Upload.single("file"), AdminAddimage);
//admin dlt project image
AdminRouter.delete('/upload/project/:id', AdminDltProjectimage);

//admin dlt category
AdminRouter.delete('/projectcategory/:id', AdminDltCategory);
//admin add project
AdminRouter.post('/project', AdminAddProject);
//admin get project
AdminRouter.get('/projects', AdminGetProject);
//admin get project
AdminRouter.put('/project/:id', AdminUpdateProject);
//admin get project
AdminRouter.delete('/project/:id', AdminDltProject);
//admin get detail project data
AdminRouter.get('/detailproject', GetProjectdata);
//project

//product
//admin add product image
AdminRouter.post('/upload/productplan', UploadProductPlan.single("file"), AdminAddimage);
//admin dlt product image
AdminRouter.delete('/upload/product/:id', AdminDltProductimage);
//admin add product
AdminRouter.post('/product', AdminAddProduct);
//admin get product
AdminRouter.get('/products', AdminGetProducts);
//admin get product
AdminRouter.delete('/product/:id', AdminDltProduct);
//admin update product
AdminRouter.put('/product/:id', AdminUpdateProduct);
//product

//product plan
//admin add product plan image
AdminRouter.post('/upload/product', UploadProduct.single("file"), AdminAddimage);
//admin dlt product plan image
AdminRouter.delete('/upload/productplan/:id', AdminDltProductPlanimage);
//admin add product plan
AdminRouter.post('/productplan', AdminAddProductPlan);
//admin get product plan
AdminRouter.get('/productplans', AdminGetProductPlans);
//admin update product plan
AdminRouter.put('/productplan/:id', AdminUpdateProductPlan);
//admin get product
AdminRouter.delete('/productplan/:id', AdminDltProductPlan);


//add blog
//admin add blog image
AdminRouter.post('/upload/blog', UploadBlogImage.single("file"), AdminAddimage);
//admin dlt blog image
AdminRouter.delete('/upload/blog/:id', AdminDltBlogImage);
//admin add blog
AdminRouter.post('/blog', AdminAddBlog);
//admin get blog
AdminRouter.get('/blog', AdminGetBlogs);
//admin update blog
AdminRouter.put('/blog/:id', AdminUpdateBlog);
//admin delete blog
AdminRouter.delete('/blog/:id', AdminDltBlog);




export default AdminRouter