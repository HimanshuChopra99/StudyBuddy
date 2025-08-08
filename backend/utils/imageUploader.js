const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";

    let uploadSource = "";
    let tempFilePathToDelete = null;

    if (typeof file === "string") {
      // Case: file is a URL from AI thumbnail
      uploadSource = file;
    } else if (file?.tempFilePath) {
      // Case: file uploaded by user
      uploadSource = file.tempFilePath;
      tempFilePathToDelete = uploadSource;
    } else {
      throw new Error(
        "Unsupported file format: must be tempFilePath or string URL"
      );
    }

    const result = await cloudinary.uploader.upload(uploadSource, options);

    // Delete temp file if it exists
    if (tempFilePathToDelete) {
      fs.unlink(tempFilePathToDelete, (err) => {
        if (err) {
          console.error("Error deleting temp file:", err);
        } else {
          console.log("Temp file deleted:", tempFilePathToDelete);
        }
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};
