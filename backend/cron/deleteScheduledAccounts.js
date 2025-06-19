const cron = require("node-cron");
const Course = require("../models/Course");
const User = require("../models/User");

cron.schedule("0 0 * * *", async () => {
  try {
    const userToDelete = await User.find({
      isScheduledForDeletion: true,
      deletionDate: { $lte: new Date() },
    });

    //delete user profile
    for (const user of userToDelete) {
      if (user.additionalDetails) {
        await Profile.findByIdAndDelete(user.additionalDetails);
      }

      //delete from course enrolled
      if (user.courses.length > 0) {
        await Promise.all(
          user.courses.map((courseId) => {
            Course.findByIdAndUpdate(courseId, {
              $pull: { studentsEnrolled: user._id },
            });
          })
        );
      }

      //delete user
      await User.findByIdAndDelete(user._id);
      console.log(`Deleted user: ${user.email}`);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to Scheduled account deletion",
      error: error.message,
    });
  }
});
