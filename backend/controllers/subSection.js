const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { subSectionSchema } = require("../validation/subSection");
require("dotenv").config();

//create subSection
exports.createSubSection = async (req, res) => {
  try {
    const body = req.body;

    //validate with zod
    const parsedBody = subSectionSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        msg: "sub section data is required or incorrect",
      });
    }

    const { title, timeDuration, description, sectionId } = parsedBody.data;

    const video = req.files?.videoFile;
    if (!video) {
      return res.status(400).json({
        success: false,
        msg: "Video file is required",
      });
    }

    //upload to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    //save to db
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      msg: "Sub-section created successfully",
      data: updateSection,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to create sub-section",
      error: error.message,
    });
  }
};

//delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const subSectionId = req.params;
    const sectionId = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        msg: "sub section id required",
      });
    }

    //delete sub-section
    await SubSection.findByIdAndDelete(subSectionId);

    //delete sub-section id from section
    await Section.findByIdAndDelete(
      sectionId,
      {
        $pull: {
          subSection: subSectionId,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Sub-Section delete successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete sub-section",
      error: error.message,
    });
  }
};

//update sub-section
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.params;
    const { title, timeDuration, description, videoUrl } = req.body;

    // Build update object dynamically
    const updateFields = {};
    if (title) updateFields.title = title;
    if (timeDuration) updateFields.timeDuration = timeDuration;
    if (description) updateFields.description = description;
    if (videoUrl) updateFields.videoUrl = videoUrl;

    // If nothing to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No valid fields provided for update",
      });
    }

    // Update sub-section
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateFields,
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        msg: "Sub-section not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Sub-section updated successfully",
      data: updatedSubSection,
    });
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to update sub-section",
      error: error.message,
    });
  }
};
