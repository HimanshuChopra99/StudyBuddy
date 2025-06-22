const Contact = require("../models/Contact");
const contactSchema = require("../validation/contact");

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

    const { firstName, lastName, email, phoneNo, message } = parsedData.data;

    // Save to DB
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
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
