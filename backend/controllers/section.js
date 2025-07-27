const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
require("dotenv").config();

//create section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        msg: "data missing",
      });
    }

    //save section in db
    const newSection = await Section.create({ sectionName });

    //save section id in course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      msg: "section create successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to create section",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        msg: "missing field",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      msg: "Section update successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to update section",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
