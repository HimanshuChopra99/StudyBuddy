const mongoose = require("mongoose");

const ratingAndReviews = mongoose.Schema({
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
    },
    rating: {
        type: Number
    },
    review: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model("RatingAndReview", ratingAndReviews);