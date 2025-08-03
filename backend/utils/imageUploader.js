const cloudinary = require("cloudinary").v2;

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

    if (typeof file === "string") {
      // Case: file is a URL from AI thumbnail
      uploadSource = file;
    } else if (file?.tempFilePath) {
      // Case: file uploaded by user
      uploadSource = file.tempFilePath;
    } else {
      throw new Error("Unsupported file format: must be tempFilePath or string URL");
    }

    return await cloudinary.uploader.upload(uploadSource, options);
  } catch (error) {
    throw error
  }
};
