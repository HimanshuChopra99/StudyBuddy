const mongoose = require("mongoose");

const subSectionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    timeDuration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("SubSection", subSectionSchema)