const mongoose = require("mongoose");
const SubSection = require("./SubSection");

const sectionSchema = mongoose.Schema({
    sectionName: {
        type: String
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
            required: true
        }
    ]
});

module.exports = mongoose.model("Section", sectionSchema)