const Course = require("../models/Course");
const User = require("../models/User");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

exports.caputurPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    //user exists
    if (!userId) {
      return res.status(500).json({
        success: false,
        msg: "Failed to capture payment",
      });
    }

    //check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        msg: "Course not found",
      });
    }

    //check student already enrolled
    isEnrolled = course.studentsEnrolled.some((studentId) =>
      studentId.equals(userId)
    );
    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        msg: "Student already enrolled in this course",
      });
    }

    //create order
    const amount = course.price;
    const currency = "INR";

    const option = {
      amount: amount * 100,
      currency,
      recipt: `rcpt-${Math.random().toString(32).substr(2, 6)}-${Date.now()}`,
      note: {
        courseId,
        userId,
      },
    };

    try {
      //initiate the payment
      const order = await instance.orders.create(option);
      console.log(order);
      return res.status(200).json({
        success: true,
        data: {
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          thumbnail: course.thumbnail,
          orderId: order.id,
          currency: order.currency,
          amount: order.amount,
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        msg: "Failed to initiate order",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to capture payment",
      error: error.message,
    });
  }
};

//verify payment signature
exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = req.body;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      console.log("Payment is Authorised");

      //get userId and courseId from razorpay response
      const data = JSON.parse(body.toString());
      const { courseId, userId } = data.payload.payment.entity.notes;

      //find course and enroll student
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(400).json({
          success: false,
          msg: "Course not found",
        });
      }

      //find student and enroll course
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
          },
        },
        { new: true }
      );
      if (!enrolledStudent) {
        return res.status(400).json({
          success: false,
          msg: "Student not found",
        });
      }

      //send conformation mail
      const studentName = `${enrolledStudent.firstName} ${enrolledStudent.lastName}`;
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Your Course Enrollment Is Confirmed - Let's Get Started!",
        courseEnrollmentEmail(enrolledCourse.courseName, studentName)
      );
      console.log("Confirmation email sent to", enrolledStudent.email);

      //send response
      res.status(200).json({
        success: true,
        msg: "Signature verified and Student enroll in course successfully",
        enrolledCourse,
        enrolledStudent,
        emailResponse,
      });
    } else {
      return res.status(500).json({
        success: false,
        msg: "Failed to verify signature",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to verify signature",
    });
  }
};
