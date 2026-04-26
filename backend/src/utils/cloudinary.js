import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;


    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });


    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "marshare_land",
    });


    fs.unlinkSync(localFilePath);
    console.log("File uploaded to Cloudinary:", response.secure_url);
    return response;
  } catch (error) {

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload failed:", JSON.stringify(error));
    return null;
  }
};

export { uploadOnCloudinary };
