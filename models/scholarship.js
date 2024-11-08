const mongoose = require("mongoose");

const statusEnum = ["Pending", "Approved", "Rejected"];
const aiEvaluationEnum = ["Accepted", "Rejected", "Non Evaluated"];

const Schema = mongoose.Schema;

const scholarshipSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "N/A" },
    benefits: { type: [String], default: ["N/A"] },
    // eligibility: { type: String, required: true }, changed to criteria
    criteria: { type: [String], default: ["N/A"] },
    deadline: { type: String, default: "N/A" },
    documents: { type: [String], default: ["N/A"] },
    location: { type: String, default: "N/A" },
    provider: { type: String, default: "N/A" },
    // startDate: { type: Date, required: true },
    url: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: statusEnum,
        default: statusEnum[0],
    },
    aiEvaluation: {
        type: String,
        enum: aiEvaluationEnum,
        default: aiEvaluationEnum[2],
    },
    rejectedAt: { type: Date, default: null },
});

// Bug: url attribute conflicting with the virtual below
// Virtual for scholarship's URL
// scholarshipSchema.virtual("url").get(function () {
//     // We don't use an arrow function as we'll need the this object
//     return `/scholarship/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Scholarship", scholarshipSchema);
