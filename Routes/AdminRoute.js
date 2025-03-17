import express from 'express';
import { AddAdminManually, AdminAddBlog, AdminAddimage, AdminAddParentProject, AdminAddProduct, AdminAddProductPlan, AdminAddProject, AdminAddProjectCategory, AdminData, AdminDltBlog, AdminDltBlogImage, AdminDltCategory,  AdminDltCategoryImage,  AdminDltParentImage,  AdminDltParentProject,  AdminDltProduct,  AdminDltProductimage,  AdminDltProductPlan,  AdminDltProductPlanimage,  AdminDltProject, AdminDltProjectimage, AdminGetBlogs, AdminGetParentProject, AdminGetProductPlans, AdminGetProducts, AdminGetProject, AdminGetProjectCategory, AdminUpdateBlog, AdminUpdateParentProject, AdminUpdateProduct, AdminUpdateProductPlan, AdminUpdateProject, AdminUpdateProjectCategory, DownloadProductPlan, DownloadProject, GetAdminData, GetProjectdata, LoginUser } from '../Controllers/AdminController.js';
import multer from 'multer';
import { authMiddleware } from '../Middlewears/Auth.js';

//parent
// Image storage engine
const ParentStorage = multer.diskStorage({
    destination: 'Upload/parent',
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with dashes
       return cb(null, `${Date.now()}-${sanitizedFileName}`);
    },
});
const UploadParent = multer({ storage: ParentStorage });



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
//add category file
AdminRouter.post('/upload/category',authMiddleware, UploadCategory.single("file"), AdminAddimage);
AdminRouter.delete('/upload/category/:id',authMiddleware, AdminDltCategoryImage);
//project category


//project
//admin add project image
AdminRouter.post('/upload/project', authMiddleware, Upload.single("file"), AdminAddimage);
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
//admin get project
AdminRouter.put('/project/:id',authMiddleware, AdminUpdateProject);
//admin get project
AdminRouter.delete('/project/:id',authMiddleware, AdminDltProject);
//admin get detail project data
AdminRouter.get('/detailproject',authMiddleware, GetProjectdata);
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
//admin get blog
AdminRouter.get('/blog', authMiddleware, AdminGetBlogs);
//admin update blog
AdminRouter.put('/blog/:id',authMiddleware, AdminUpdateBlog);
//admin delete blog
AdminRouter.delete('/blog/:id',authMiddleware, AdminDltBlog);




export default AdminRouter