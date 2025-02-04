import mongoose from 'mongoose'
const Db = ()=>{
    mongoose.connect("mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HasooManagement?").then(()=>{
        console.log('Database is connected')
        // generateSchema('agents');
    },
err =>{console.log('There is problem while connecting database' + err)});

// const dbURI = "mongodb+srv://admin2:admin2@Cluster0.uaxmezr.mongodb.net/HotelManagement?retryWrites=true&w=majority";

// mongoose.connect(dbURI)
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.log("There is a problem while connecting database", err));
}


// Generate Schema from Sample Document
const generateSchema = async (collectionName) => {
    try {
      const collection = mongoose.connection.db.collection(collectionName);
  
      // Fetch a sample document from the collection
      const sampleDocument = await collection.findOne();
      if (!sampleDocument) {
        console.log(`No documents found in collection "${collectionName}".`);
        return;
      }
  
      console.log(`${collectionName}`, sampleDocument);
      const inferredSchema = inferSchema(sampleDocument);
  
      console.log("Generated Mongoose Schema:");
      console.log(JSON.stringify(inferredSchema, null, 2));
    } catch (error) {
      console.error("Error generating schema:", error);
    }
  };
  
  // Helper functions to infer schema
  function inferSchema(document) {
    const schema = {};
    for (const [key, value] of Object.entries(document)) {
      schema[key] = inferType(value);
    }
    return schema;
  }
  
  function inferType(value) {
    if (value === null || value === undefined) return "Mixed"; // Handle null or undefined values
    if (Array.isArray(value)) return [inferType(value[0])];
    if (value instanceof Date) return "Date";
    if (typeof value === "string") return "String";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";
    if (typeof value === "object") return inferSchema(value);
    return "Mixed"; // Default type if the type is unknown
  }
 
export default Db;