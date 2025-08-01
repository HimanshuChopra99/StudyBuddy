const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { otpEmailTemplate } = require("../mail/templates/otp");

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
        const mailResponse = await mailSender(email, "Your One-Time Password (OTP) for StudyBuddy", otpEmailTemplate(email, otp));
        console.log("Email send successfully: ", mailResponse)
    }
    catch(error) {
        console.error("Failed to send email verification",error);
    }
}

OtpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp)
    next();
})

module.exports = mongoose.model("OTP", OtpSchema);