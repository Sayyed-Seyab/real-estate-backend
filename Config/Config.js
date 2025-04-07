import mongoose from 'mongoose'
const Db = ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/HasooManagement").then(()=>{
        console.log('Database is connected')
        // generateSchema('agents');
    },
err =>{console.log('There is a problem while connecting Database' + err)});
console.log('db file')
// const dbURI = "mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HasooManagement";

// mongoose.connect(dbURI)
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.log("There is a problem while connecting database", err));
}

  
  
  
export default Db;
