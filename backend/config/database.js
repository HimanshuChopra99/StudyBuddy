const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true
    })
    .then(() => console.log("Database connected Successfully"))
    .catch((error) => {
        console.log("Database connection Failed");
        console.error(error);
        process.exit(1)
    })
}