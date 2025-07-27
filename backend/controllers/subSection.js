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

    const { title, description, sectionId } = parsedBody.data;

    const video = req.files?.video;
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
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        msg: "Sub-section ID and Section ID are required",
      });
    }

    // Delete the sub-section
    await SubSection.findByIdAndDelete(subSectionId);

    // Pull sub-section reference from the section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    ).populate("subSection"); // Populate after update

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        msg: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Sub-section deleted successfully",
      data: updatedSection
    });
  } catch (error) {
    console.error("DELETE SUBSECTION ERROR:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete sub-section",
      error: error.message,
    });
  }
};


//update sub-section
// exports.updateSubSection = async (req, res) => {
//   try {
//     const { subSectionId } = req.body;
//     const { title, description, videoUrl } = req.body;

//     // Build update object dynamically
//     const updateFields = {};
//     if (title) updateFields.title = title;
//     if (description) updateFields.description = description;
//     if (videoUrl) updateFields.videoUrl = videoUrl;

//     // If nothing to update
//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({
//         success: false,
//         msg: "No valid fields provided for update",
//       });
//     }

//     // Update sub-section
//     const updatedSubSection = await SubSection.findByIdAndUpdate(
//       subSectionId,
//       updateFields,
//       { new: true }
//     );

//     if (!updatedSubSection) {
//       return res.status(404).json({
//         success: false,
//         msg: "Sub-section not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       msg: "Sub-section updated successfully",
//       data: updatedSubSection,
//     });

//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({
//       success: false,
//       msg: "Failed to update sub-section",
//       error: error.message,
//     });
//   }
// };

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};
