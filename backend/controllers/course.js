const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { courseSchema } = require("../validation/courses");
const Category = require("../models/Category");

exports.createCourse = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = courseSchema.safeParse(body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        msg: "Invalid course data",
      });
    }

    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag: _tag,
      status,
      instructions: _instructions,
    } = parsedBody.data;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        msg: "Thumbanil required",
      });
    }

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    if (!status || status === undefined) {
      status = "Draft";
    }

    //check instructor
    const userId = req.user.id;
    const instructor = await User.findOne({
      userId,
      accountType: "Instructor",
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        msg: "Instructor not found",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        msg: "category not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //save data in db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructor._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    //add new course in user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructor._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update tag schema
    await Category.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      msg: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "failed to create course",
    });
  }
};

//get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      msg: "Courses data fetch successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "failed to fetch courses",
      error: error.message,
    });
  }
};

//get course details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        msg: `could not find the course with ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "failed to fetch courses details",
      error: error.message,
    });
  }
};
