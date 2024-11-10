const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");

const { uploadProfileImage } = require("../multer");

const User = require("../models/user");
const Scholarship = require("../models/scholarship");
const Notification = require("../models/notification");
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
        const user = await User.findById(req.userId).select("-passwordHash");
        res.json(user);
    }),
];

exports.getUserById_get = [
    verifyToken,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id).select("-passwordHash");
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
            // "isEligibleForNeedBasedScholarships",
            // "preferredScholarshipType",
            // "countryOfScholarshipInterest",
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
                    // case "preferredScholarshipType":
                    //     if (
                    //         !isEnumValid(req.body.preferredScholarshipType, [
                    //             "need-based",
                    //             "merit-based",
                    //             "both",
                    //         ])
                    //     ) {
                    //         errors.push({
                    //             field,
                    //             msg: "Invalid preferred scholarship type",
                    //         });
                    //     } else {
                    //         user.preferredScholarshipType =
                    //             req.body.preferredScholarshipType;
                    //     }
                    //     break;
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

        if (user.email === req.body.email) {
            return res.status(400).json({
                message: "New email is the same as the current email",
            });
        }

        user.email = req.body.email;
        user.isVerified = false;
        await user.save();

        res.json({
            message:
                "Email updated successfully, please makes sure to verify it.",
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

exports.addFavorite_post = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.favoriteScholarships.includes(req.body.scholarshipId)) {
            return res.status(400).json({
                message: "Scholarship already in favorites",
            });
        }

        user.favoriteScholarships.push(req.body.scholarshipId);
        await user.save();

        res.json({ message: "Scholarship added to favorites" });
    }),
];

exports.getFavorites_get = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.favoriteScholarships);
    }),
];

exports.removeFavorite_post = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.favoriteScholarships.includes(req.body.scholarshipId)) {
            return res.status(400).json({
                message: "Scholarship not in favorites",
            });
        }

        user.favoriteScholarships = user.favoriteScholarships.filter(
            (id) => id.toString() !== req.body.scholarshipId
        );
        await user.save();

        res.json({ message: "Scholarship removed from favorites" });
    }),
];

// controller that checks all the scholarships that the user has favorited, and create a notification for each one of them if the deadline is coming soon (1 month before)
exports.checkFavoriteScholarships_get = [
    verifyToken,
    asyncHandler(async (req, res) => {
        // get all the favorite scholarships of the user
        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let favoriteScholarships = user.favoriteScholarships;

        // check if the deadline of each scholarship is coming soon (1 month before)
        for (let i = 0; i < favoriteScholarships.length; i++) {
            let scholarship = await Scholarship.findById(
                favoriteScholarships[i]
            );

            if (scholarship && scholarship.deadline) {
                // if there is "th" in the deadline, remove it
                let cleanDeadline = scholarship.deadline.replace(/th/g, "");
                let deadline = new Date(cleanDeadline);
                // if deadline is invalidDate, skip it
                if (deadline.toString() === "Invalid Date") {
                    continue;
                }
                let today = new Date();
                let oneMonthBefore = new Date(
                    today.getTime() + 30 * 24 * 60 * 60 * 1000
                );
                if (deadline < oneMonthBefore) {
                    let existingNotification = await Notification.findOne({
                        recipientId: req.userId,
                        scholarshipId: favoriteScholarships[i],
                    });

                    // Only create a new notification if one doesn't already exist
                    if (!existingNotification) {
                        await Notification.create({
                            recipientId: req.userId,
                            scholarshipId: favoriteScholarships[i],
                            message: "The deadline of one of your favorite scholarships is coming soon",
                            status: "unread",
                        });
                    }
                }
            }
        }

        res.json({ message: "Notifications created successfully" });
    }),
];

//Get user notifications
exports.getNotifications_get = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let notifications = await Notification.find({
            recipientId: req.userId,
        });
        res.json(notifications);
    }),
];

// Mark notification as read
exports.markNotificationAsRead_post = [
    verifyToken,
    asyncHandler(async (req, res) => {
        let notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    }),
];