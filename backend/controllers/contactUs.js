const contactSchema = require("../validation/contactUs");
const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.contactUs = async (req, res) => {
  try {
    // Zod validation
    const parsedData = contactSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: errorMessages,
      });
    }

    const { firstName, lastName, email, phoneNumber, message } = parsedData.data;

    // Save to DB
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message, phoneNumber)
    );
    console.log("Email Res ", emailRes);
    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    console.error("Contact Us Error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again later.",
    });
  }
};
