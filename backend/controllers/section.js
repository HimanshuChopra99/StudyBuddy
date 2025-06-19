const Course = require("../models/Course");
const Section = require("../models/Section");

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
    const upldateCourse = await Course.findByIdAndUpdate(
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
      upldateCourse,
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
    const { sectionName, sectionId } = req.body;

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

    return res.status(500).json({
      success: true,
      msg: "Section update successfully",
      data: section,
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
    //get id from params
    const {sectionId} = req.params;
    const {courseId} = req.body

    //delete section
    await Section.findByIdAndDelete(sectionId);

    //delete section id from course
    await Course.findByIdAndUpdate(
        courseId,
        {
            $pull: {
                courseContent: sectionId
            }
        },
        {new: true}
    );

    //return response
    return res.status(200).json({
      success: true,
      msg: "Section delete successfully",
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete section",
      error: error.message,
    });
  }
};
