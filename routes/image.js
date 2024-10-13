const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
  });

const router = express.Router();

const uploadoncloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
        return null;
        }
        // Upload file on Cloudinary
        const result = await cloudinary.uploader.upload(localfilepath, {
        resource_type: "auto",
        folder: 'Bills'
        });
    
        console.log(result.url + " File uploaded");
        return result.url;
    } catch (error) {
        fs.unlinkSync(localfilepath); // Remove local saved temp file as upload failed...
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
    };

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, `./uploads`);
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
const upload = multer({ storage });

router.post("/images", upload.array("billimage", 3), async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const filePaths = req.files.map(file => file.path);

        const uploadPromises = filePaths.map(uploadoncloudinary);
        const uploadedUrls = await Promise.all(uploadPromises);

        // Filter out null results in case of upload failures
        const validUrls = uploadedUrls.filter(url => url !== null);

        if (validUrls.length > 0) {
            res.json(validUrls);
            console.log("All images uploaded and saved successfully");
        } 
        else {
            console.error("No valid images to save");
        }
        } 
    catch (error) {
            console.error("Error in uploading and saving images:", error);
    }
});

function getPublicIdFromUrl(imageUrl) {
  const parts = imageUrl.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  // Extract everything after the 'upload/' part, ignoring the version number (if any)
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/'); // Skip the 'upload' and the version part
  const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
  return publicId;
}

router.delete('/deleteimage', async (req, res) => {
    const {imageUrls} = req.body;
  
    try {
      // Step 1: Delete images from Cloudinary
      const deletePromises = imageUrls.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        return cloudinary.uploader.destroy(publicId);
      });
  
      // Wait for all the images to be deleted
      const deleteResults = await Promise.all(deletePromises);
      console.log('Images deleted:', deleteResults);
    }
    catch{
        console.log("Error in deleting file's");
    }
});

exports.router = router;