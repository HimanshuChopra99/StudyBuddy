const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        exprires: 300
    }
});

//send email
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification email from StudyBuddy", otp);
        console.log("Email send successfully: ", mailResponse)
    }
    catch(error) {
        console.error("Failed to send email verification",error);
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp)
    next();
})

module.exports = mongoose.model("OTP", OtpSchema);