const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const { signUpSchema, loginSchema } = require("../validation/auth");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    //check user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({
        success: false,
        msg: "User already registred",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    //check unique otp
    let existingOtp = await OTP.findOne({ otp: otp });

    while (existingOtp) {
      otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      existingOtp = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload); //store otp in db
    console.log(otpBody);

    //response sucessful
    res.status(200).json({
      success: true,
      msg: "OTP sent sucessfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Failed to sent Otp",
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = signUpSchema.safeParse(body);

    if (!parsedBody.success) {
      return res.status(411).json({
        success: false,
        msg: "invalid data",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      otp,
    } = parsedBody.data;

    //user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        msg: "User already registred",
      });
    }

    //recent otp
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        msg: "OTP not Found",
      });
    }

    const profileDeatails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDeatails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firastName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      msg: "User is registred sucessfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "User not registred. Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const body = req.body;

    const parsedBody = loginSchema.safeParse(body);
    if (!parsedBody) {
      return res.status(400).json({
        success: false,
        msg: "Invalid login credentials",
      });
    }

    const { email, password } = parsedBody.data;

    //user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not exists. Please sign up first",
      });
    }

    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        msg: "Incorrect Password",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    //genearet token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    user.password = undefined;

    //save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      msg: "User Login sucessfully",
      user,
      token,
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Failed in login",
    });
  }
};

//change password
exports.changePassword = async (req, res) => {
  try{
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);

    if(!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        msg: "Incorrect old password"
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Password changed successfully"
    });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Failed to change password",
    });
  }
}