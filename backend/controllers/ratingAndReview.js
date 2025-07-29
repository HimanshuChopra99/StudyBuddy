const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
require("dotenv").config();

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rating, review, courseId } = req.body;
    console.log(rating, review, courseId)

    //get course details
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        msg: "student is not enrolled in this course",
      });
    }

    //check student already reviewed course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    console.log(alreadyReviewed)
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        msg: "Student already reviewed in this course",
      });
    }

    //save data in db
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    //update course with rating
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingReview,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Rating and Review created successfully",
      data: ratingReview,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "failed to create rating",
      error: error.message,
    });
  }
};

//average rating
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    //get rating and calcualte aveage
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //response
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(400).json({
      success: true,
      msg: "Average Rating is 0, no rating given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "failed to get average rating",
      error: error.message,
    });
  }
};

//get all rating
exports.getAllRating = async (req, res) => {
  try {
    //get all ratings
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "decs" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exce();

    return res.status(200).json({
      success: true,
      msg: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to get all ratings",
      error: error.message,
    });
  }
};
