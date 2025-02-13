const { MongoClient } = require('mongodb');
const Db = async  ()=>{

  const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/HasooManagement";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const databases = await client.db().admin().listDatabases();
        console.log("Connected successfully. Databases:");
        databases.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    } finally {
        await client.close();
    }

 
//     mongoose.connect("mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HasooManagement").then(()=>{
//         console.log('Database is connected')
//         // generateSchema('agents');
//     },
// err =>{console.log('There is a problem while connecting Database' + err)});
// console.log('db file')
// // const dbURI = "mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HasooManagement";

// // mongoose.connect(dbURI)
// //   .then(() => console.log("Database connected"))
// //   .catch((err) => console.log("There is a problem while connecting database", err));
// }








 
export default Db;
