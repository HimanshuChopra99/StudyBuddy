const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { profileSchema } = require("../validation/profile");

//update profile
exports.updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.id;

    //profile zod validation
    const parsedBody = profileSchema.safeParse(body);
    if (!parsedBody) {
      return res.status(400).json({
        success: false,
        msg: "Incorrect profile data",
      });
    }

    //build update object
    const {
      gender,
      dateOfBirth = "",
      about = "",
      contactNumber,
    } = parsedBody.data;

    if (!contactNumber || !about || !userId) {
      return res.status(200).json({
        success: true,
        msg: "All fields are required",
        data: updateProfile,
      });
    }

    // Get profile ID from user
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //Update profile
    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await Profile.save();

    //response
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to update profile",
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
