const nodemailer = require("nodemailer");

const mailSender = async(email, title, body) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const info = await transporter.sendMail({
            from: "StudyBuddy",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;
    }
    catch(error){
        console.error("OTP error", error.message)
    }
}

module.exports = mailSender