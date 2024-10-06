const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scholarshipSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    deadline: { type: Date, required: true },
    location: { type: String, required: true },
    provider: { type: String, required: true },
    startDate: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
});

// Virtual for scholarship's URL
scholarshipSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/scholarship/${this._id}`;
});

// Export model
module.exports = mongoose.model("Scholarship", scholarshipSchema);
