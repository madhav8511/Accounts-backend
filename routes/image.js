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

exports.router = router;