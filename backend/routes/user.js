const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middlewares/auth")
//login
router.post("/login", login)

//signup
router.post("/signup", signup)

//sending OTP to the user's email
router.post("/sendotp", sendotp)

//Changing the password
router.post("/changepassword", auth, changePassword)

//generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

//resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router
module.exports = router