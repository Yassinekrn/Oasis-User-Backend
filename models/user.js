const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        // Core Authentication Attributes
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        isVerified: { type: Boolean, default: false },

        // Profile-Related Attributes
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        profilePicture: { type: String },
        dateOfBirth: { type: Date },
        gender: { type: String },
        country: { type: String },
        university: { type: String },
        courseOfStudy: { type: String },
        yearOfStudy: { type: Number },

        // Scholarship-Specific Attributes
        favoriteScholarships: [
            { type: Schema.Types.ObjectId, ref: "Scholarship" },
        ],
        levelOfStudy: {
            type: String,
            enum: ["undergraduate", "graduate", "postgraduate", "other"],
        },
        fieldOfStudy: { type: String },
        // isEligibleForNeedBasedScholarships: { type: Boolean, default: false },
        // preferredScholarshipType: {
        //     type: String,
        //     enum: ["need-based", "merit-based", "both"],
        //     default: "both",
        // },
        // countryOfScholarshipInterest: { type: String },

        // Additional Attributes
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
