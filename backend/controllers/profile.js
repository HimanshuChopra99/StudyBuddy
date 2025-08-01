const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { profileSchema } = require("../validation/profile");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")
require("dotenv").config();

//update profile
exports.updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.id;

    //profile zod validation
    const parsedBody = profileSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        msg: "Incorrect profile data",
      });
    }

    //build update object
    const {
      gender,
      dateOfBirth,
      about,
      contactNumber,
      firstName,
      lastName
    } = parsedBody.data;


    // Get profile ID from user
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //Update profile
    if(gender) profileDetails.gender = gender;
    if(dateOfBirth) profileDetails.dateOfBirth = dateOfBirth;
    if(about) profileDetails.about = about;
    if(contactNumber) profileDetails.contactNumber = contactNumber;
    if(firstName) userDetails.firstName = firstName
    if(lastName) userDetails.lastName = lastName
    await profileDetails.save();
    await userDetails.save()

    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec()

    //response
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      updatedUserDetails: updatedUserDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to update profile",
      error: error.message
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    //get user ID
    const userId = req.user.id;
    //user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    res.clearCookie("token")

    //schedule user account delete
    user.isScheduledForDeletion = true;
    user.deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  //7 days
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Account is scheduled for deletion in 7 days.",
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to delete account",
    });
  }
};

//get all users
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//update picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update Profile Picture",
      error: error.message
    })
  }
}

//enrolled course
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//instructor dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}