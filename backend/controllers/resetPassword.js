const User = require("../models/User");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const { passwordResetEmail } = require("../mail/templates/resetPassword");
require("dotenv").config();

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    //generate token
    const token = crypto.randomBytes(32).toString("hex");

    const updateDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 1000 * 60 * 5, // valid for 5 minutes
      },
      { new: true }
    );

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    //send reset mail
    await mailSender(email, "Password Reset Link", passwordResetEmail(updateDetails.email, updateDetails.firstName, resetLink));

    res.status(200).json({
      success: true,
      msg: "Reset link sent to email successfully",
      updateDetails
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "error in reset password token",
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "Passord not match",
      });
    }

    const userDetails = await User.findOne({ token: token });

    if (!userDetails || userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        msg: "Token is Invalid or Token Expire",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Password reset sucessfull",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "reset password failed",
    });
  }
};
