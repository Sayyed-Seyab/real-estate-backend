import express from 'express'
// import Db from './Config.js/Config.js';
import cookieParser from 'cookie-parser';
import Db from './Config/Config.js';
import AdminRouter from './Routes/AdminRoute.js';
import cors from 'cors'




Db(); 

const app = express();
app.use(express.json({ limit: '500mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: '%00mb' })); // Parse URL-encoded form data

app.use(express.json());
app.use(cookieParser()); 
const port = process.env.PORT || 4000



// app.use(cors({
//     origin:'https://crm.jawartaibah.com',
//     credentials: true // Allow credentials (cookies) to be sent
// })) 


const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
   'https://seashell-app-yjxy7.ondigitalocean.app',
   "https://seashell-app-yjxy7.ondigitalocean.app",
    "https://hammerhead-app-r6bbp.ondigitalocean.app",
    "https://hammerhead-app-r6bbp.ondigitalocean.app",
  ];
  
  
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow credentials (cookies) to be sent
    })
  );
  
  app.use('/Images', express.static('Upload'));

// app.use(cors({
//     origin:'http://localhost:5173',
//     credentials: true // Allow credentials (cookies) to be sent
// })) 


app.use('/api/admin', AdminRouter)
// app.use('/api/user', UserRouter )
// app.use('/api/admin', AdminRouter )
// app.use('/api/retajadmin',RetajRouter)
// app.use('/api/retajuser', RetajUserRouter)
// app.use('/Images', express.static('Uploads'));
// app.use('/Images', express.static('Payments'));
// app.use('/images', (req, res, next) => {
//     // Remove 'Uploads/' from the path
//     if (req.url.startsWith('/Uploads/')) {
//         req.url = req.url.replace('/Uploads/', '/');
//     }
//     next();
// }, express.static('Uploads'));

app.listen(port,'0.0.0.0', ()=>{
    console.log(`Server is running on PORT http://localhost:${port}`)

}) 



// app.use((req, res, next) => {
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   next();
// });



























































// https://github.com/stashtechnologies/KSA_BACKEND.git
// echo "# KSA_BACKEND" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/stashtechnologies/KSA_BACKEND.git
// git push -u origin main
// �Kor push an existing repository from the command line
// git remote add origin https://github.com/stashtechnologies/KSA_BACKEND.git
// git branch -M main
// git push -u origin main
