const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");

const { uploadProfileImage } = require("../multer");

const User = require("../models/user");
let verifyToken = require("../middlewares/verifyToken");

require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const salt = process.env.SALT;

const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
};

// Helper function to validate enums
const isEnumValid = (value, enumValues) => {
    return enumValues.includes(value);
};

exports.profile_get = [
    verifyToken,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.userId).select("-password");
        res.json(user);
    }),
];

exports.getUserById_get = [
    verifyToken,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id).select("-password");
        res.json(user);
    }),
];

exports.changePassword_post = [
    verifyToken,
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findById(req.userId);

        const isMatch = await bcrypt.compare(
            req.body.oldPassword,
            user.passwordHash
        );

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid password" }] });
        }

        const s = await bcrypt.genSalt(Number(salt));
        const hashedPassword = await bcrypt.hash(req.body.newPassword, s);

        user.passwordHash = hashedPassword;
        await user.save();

        res.json({ msg: "Password changed successfully" });
    }),
];

exports.updateProfile_post = [
    verifyToken, // Middleware to verify user identity from token
    asyncHandler(async (req, res) => {
        // Find user by ID (extracted from token in `verifyToken`)
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Fields that can be updated
        const allowedUpdates = [
            "firstName",
            "lastName",
            "dateOfBirth",
            "gender",
            "country",
            "university",
            "courseOfStudy",
            "yearOfStudy",
            "levelOfStudy",
            "fieldOfStudy",
            "isEligibleForNeedBasedScholarships",
            "preferredScholarshipType",
            "countryOfScholarshipInterest",
        ];

        const errors = [];

        // Dynamically update only the provided fields
        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                switch (field) {
                    case "dateOfBirth":
                        if (!isValidDate(req.body.dateOfBirth)) {
                            errors.push({ field, msg: "Invalid date format" });
                        } else {
                            user.dateOfBirth = new Date(req.body.dateOfBirth);
                        }
                        break;
                    case "yearOfStudy":
                        if (
                            isNaN(req.body.yearOfStudy) ||
                            req.body.yearOfStudy <= 0
                        ) {
                            errors.push({
                                field,
                                msg: "Year of study must be a positive number",
                            });
                        } else {
                            user.yearOfStudy = req.body.yearOfStudy;
                        }
                        break;
                    case "levelOfStudy":
                        if (
                            !isEnumValid(req.body.levelOfStudy, [
                                "undergraduate",
                                "graduate",
                                "postgraduate",
                                "other",
                            ])
                        ) {
                            errors.push({
                                field,
                                msg: "Invalid level of study",
                            });
                        } else {
                            user.levelOfStudy = req.body.levelOfStudy;
                        }
                        break;
                    case "preferredScholarshipType":
                        if (
                            !isEnumValid(req.body.preferredScholarshipType, [
                                "need-based",
                                "merit-based",
                                "both",
                            ])
                        ) {
                            errors.push({
                                field,
                                msg: "Invalid preferred scholarship type",
                            });
                        } else {
                            user.preferredScholarshipType =
                                req.body.preferredScholarshipType;
                        }
                        break;
                    default:
                        // For all other fields, directly update
                        user[field] = req.body[field];
                }
            }
        });

        // If there are validation errors, return them
        if (errors.length > 0) {
            return res.status(400).json({ msg: "Validation error", errors });
        }

        // Save updated user data
        await user.save();

        res.json({ msg: "Profile updated successfully" });
    }),
];

exports.updateAvatar_post = [
    verifyToken,
    asyncHandler(async (req, res) => {
        uploadProfileImage(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: "Error uploading profile image",
                    error: err,
                });
            }
            const filePath = req.file.path;
            try {
                let user = await User.findById(req.userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                user.profilePicture = filePath;
                await user.save();

                res.status(200).json({
                    message: "Profile image uploaded successfully",
                    filePath,
                });
            } catch (error) {
                console.error("Error saving profile image path:", error);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }
        });
    }),
];

exports.updateEmail_post = [
    verifyToken,
    body("email").isEmail().withMessage("Invalid email address"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified === false) {
            return res.status(400).json({
                message: "Please verify your account before updating email",
            });
        }

        user.email = req.body.email;
        user.isVerified = false;
        await user.save();

        res.json({
            message:
                "Email updated successfully, note that you have to reverify.",
        });
    }),
];

exports.deleteUser_post = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.userId);
        res.json({ message: "User deleted successfully" });
    }),
];
