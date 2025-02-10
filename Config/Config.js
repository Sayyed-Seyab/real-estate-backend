import mongoose from 'mongoose'
const Db = ()=>{
    mongoose.connect("mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HasooManagement?").then(()=>{
        console.log('Database is connected')
        // generateSchema('agents');
    },
err =>{console.log('There is a problem while connecting Database' + err)});
console.log('db file')
// const dbURI = "mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HotelManagement?retryWrites=true&w=majority";

// mongoose.connect(dbURI)
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.log("There is a problem while connecting database", err));
}



 
export default Db;