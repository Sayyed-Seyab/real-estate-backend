import mongoose from "mongoose";

const project = new mongoose.Schema({
    categories: [{
    id:  {type: mongoose.Schema.Types.ObjectId}
    }],
    type: {type:String,  enum: ["ongoing","completed", "villas", "mosque", "mall",'appartment', 'renovation']},
    name: {type: String, required: true},
    gallery:[{
        galleryimage:{type:String},
        alt:{type:String},
    }],
    video:{type:String},
    price:{type:Number, required:true},
    area:{type:String, required:true},
    address:{type:String, required:true},
    accomodation:{type:String, requird:true},
    producttitle:{type:String, required:true},
    amenitytitle:{type:String},
    amenitydesc:{type:String},
    productplantitle:{type:String},
    sections1:[{
        sectiontype:{type:String, required:true},
        title:{type:String},
        subtitle:{type:String},
        desc:{type:String},
        section1image:{type:String},
        section1alt:{type:String}
    }],
    section2title:{type:String},
    section2subtitle:{type:String},
    section2desc:{type:String},
    sections2:[{
        sectiontype:{type:String, required:true},
        name:{type:String},
        desc:{type:String},
        section2image:{type:String},
        section2alt:{type:String}
    }],
    status: {type: Boolean, required:true,  default:null},
    metatitle:{type:String},
    metadesc:{type:String},
    addedby: {type: String},
    lasteditby: {type: String},
    createdat: { type: Date, default: Date.now }
})

const ProjectSchema = mongoose.model.project || mongoose.model('project', project);
export default ProjectSchema;

// frontend
// add imag
// const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         // Step 1: Upload gallery images and assign URLs
//         const updatedGallery = await Promise.all(
//             gallery.map(async (item, index) => {
//                 if (item.galleryimage) {
//                     const imageFormData = new FormData();
//                     imageFormData.append("file", item.galleryimage);

//                     // Upload the image
//                     const uploadResponse = await axios.post(
//                         `${url}/api/upload`, // Replace with your upload API endpoint
//                         imageFormData,
//                         { headers: { "Content-Type": "multipart/form-data" } }
//                     );

//                     if (uploadResponse.data.success) {
//                         // Return the updated object with the uploaded URL
//                         return {
//                             ...item,
//                             galleryimage: uploadResponse.data.fileUrl, // Update the URL
//                         };
//                     } else {
//                         throw new Error(`Failed to upload image at index ${index}`);
//                     }
//                 } else {
//                     // If no image exists, return the object as is
//                     return item;
//                 }
//             })
//         );

//         // Step 2: Prepare the final form data
//         const formdata = new FormData();
//         formdata.append("agentid", formData.agentid);
//         formdata.append("bookingengineid", formData.bookingengineid);
//         formdata.append("name", formData.name);
//         formdata.append("city", formData.city);
//         formdata.append("description", formData.description);

//         // Add updated gallery data to FormData
//         updatedGallery.forEach((item, index) => {
//             formdata.append(`gallery[${index}][galleryimage]`, item.galleryimage);
//             formdata.append(`gallery[${index}][alt]`, item.alt);
//             formdata.append(`gallery[${index}][caption]`, item.caption || "");
//         });

//         // Step 3: Call the final API
//         const response = await axios.post(
//             `${url}/api/admin/addproject`, // Replace with your addProject API endpoint
//             formdata,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         // Step 4: Handle response
//         if (response.data.success) {
//             console.log(response.data.message);
//             navigate("/dashboard/projects");
//         } else {
//             console.error(response.data.message);
//         }
//     } catch (error) {
//         console.error("Error handling submission:", error);
//         alert("Error submitting data");
//     }
// };



//update image
// const handleReplaceImage = async (index, newFile) => {
//     try {
//         // Step 1: Upload the new file
//         const formData = new FormData();
//         formData.append("file", newFile);

//         const uploadResponse = await axios.post(
//             `${url}/api/upload`, // Replace with your upload endpoint
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         if (uploadResponse.data.success) {
//             const newUrl = uploadResponse.data.fileUrl;

//             // Step 2: Replace the URL at the specified index
//             const updatedGallery = gallery.map((item, idx) => {
//                 if (idx === index) {
//                     return { ...item, galleryimage: newUrl }; // Replace the URL
//                 }
//                 return item; // Keep other objects unchanged
//             });

//             // Step 3: Update the state or send it to the backend
//             setGallery(updatedGallery); // Update the state if needed

//             console.log("Gallery updated successfully:", updatedGallery);
//         } else {
//             console.error("Failed to upload the file:", uploadResponse.data.message);
//         }
//     } catch (error) {
//         console.error("Error replacing image:", error);
//     }
// };

