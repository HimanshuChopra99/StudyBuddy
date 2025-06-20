const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    ket_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});