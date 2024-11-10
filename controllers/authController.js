const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");

const crypto = require("crypto");
const Token = require("../models/token");
const { sendingMail } = require("../nodemailer/mailing");

const User = require("../models/user");
let verifyToken = require("../middlewares/verifyToken");

require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const salt = process.env.SALT;
const access_secret = process.env.ACCESS_JWT_SECRET;
const refresh_secret = process.env.REFRESH_JWT_SECRET;

exports.verifyToken_get = [
    verifyToken,
    asyncHandler(async (req, res, next) => {
        return res.status(200).json({ success: "token is valid" });
    }),
];

exports.refreshToken_get = [
    asyncHandler(async (req, res, next) => {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res
                .status(403)
                .json({ message: "No refresh token provided" });
        }

        try {
            const decoded = jwt.verify(refresh_token, refresh_secret);
            const new_access_token = jwt.sign(
                { user: decoded.user },
                access_secret,
                {
                    issuer: "localhost:3000",
                    audience: "localhost:5173",
                    expiresIn: "15m",
                }
            );
            return res.status(200).json({ access_token: new_access_token });
        } catch (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
    }),
];

exports.login_post = [
    body("email", "The email field is required.")
        .trim()
        .isEmail()
        .isLength({ min: 3 })
        .escape(),
    body("password", "The password field is required.")
        .trim()
        .isLength({ min: 8 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password." });
        }

        const match = await bcrypt.compare(
            req.body.password,
            user.passwordHash
        );
        if (!match) {
            return res
                .status(400)
                .json({ message: "Invalid email or password." });
        }

        const access_token = jwt.sign({ user: user._id }, access_secret, {
            issuer: "localhost:3000",
            audience: "localhost:5173",
            expiresIn: "15m",
        });

        const refresh_token = jwt.sign({ user: user._id }, refresh_secret, {
            issuer: "localhost:3000",
            audience: "localhost:5173",
            expiresIn: "1y",
        });

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            access_token: access_token,
            user_id: user._id,
        });
    }),
];

exports.signup_post = [
    body("firstName", "First name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("lastName", "Last name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("email", "Valid email is required")
        .trim()
        .isEmail()
        // .normalizeEmail() //Coz it fucks up the email
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value }).exec();
            if (existingUser) {
                throw new Error("Email is already in use.");
            }
            return true;
        }),
    body(
        "password",
        "Password must be 8+ characters long, contain an uppercase letter, lowercase letter, number, and special character"
    )
        .trim()
        .isLength({ min: 8 })
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        ),
    body("confirmPassword", "Confirm password is required")
        .trim()
        .isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match.");
        }
        return true;
    }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        try {
            const s = await bcrypt.genSalt(Number(salt));
            const hashedPassword = await bcrypt.hash(password, s);

            const user = new User({
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
            });
            await user.save();

            const emailVerificationToken = crypto
                .randomBytes(16)
                .toString("hex");
            await Token.create({
                userId: user.id,
                token: emailVerificationToken,
                expiresAt: Date.now() + 3600000,
                type: "email-verification",
            });

            sendingMail({
                to: user.email,
                subject: "Account Verification",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">Hello ${user.firstName},</h2>
                    <p>
                        Thank you for registering on our platform. To complete your registration and verify your account, please click the button below:
                    </p>
                    <a href="http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${emailVerificationToken}" 
                        style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                        Verify Email
                    </a>
                    <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                    <p>
                        <a href="http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${emailVerificationToken}">
                        http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${emailVerificationToken}
                        </a>
                    </p>
                    <p>
                        If you did not create an account, you can safely ignore this email.
                    </p>
                    <p style="font-size: 12px; color: #999;">
                        Best regards,<br>The Scholarship Oasis Team
                    </p>
                    </div>
                `,
            });

            const accessToken = jwt.sign(
                { user: user._id },
                process.env.ACCESS_JWT_SECRET,
                {
                    issuer: "localhost:3000",
                    audience: "localhost:5173",
                    expiresIn: "15m",
                }
            );

            const refreshToken = jwt.sign(
                { user: user._id },
                process.env.REFRESH_JWT_SECRET,
                {
                    issuer: "localhost:3000",
                    audience: "localhost:5173",
                    expiresIn: "1y",
                }
            );

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                access_token: accessToken,
                user_id: user._id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(
                "An unexpected error occurred. Please try again."
            );
        }
    }),
];

exports.resendVerificationEmail_post = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "No user found with this email. Please sign up.",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "This account is already verified. Please log in.",
            });
        }

        await Token.deleteMany({ userId: user._id });

        const newToken = crypto.randomBytes(16).toString("hex");
        const tokenExpiration = Date.now() + 3600000;

        await Token.create({
            userId: user._id,
            token: newToken,
            expiresAt: tokenExpiration,
            type: "email-verification",
        });

        sendingMail({
            to: user.email,
            subject: "Account Verification",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">Hello ${user.firstName},</h2>
                <p>
                    Thank you for registering on our platform. To complete your registration and verify your account, please click the button below:
                </p>
                <a href="http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${newToken}" 
                    style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                <p>
                    <a href="http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${newToken}">
                    http://localhost:${process.env.PORT}/auth/verify-email/${user._id}/${newToken}
                    </a>
                </p>
                <p>
                    If you did not create an account, you can safely ignore this email.
                </p>
                <p style="font-size: 12px; color: #999;">
                    Best regards,<br>The Scholarship Oasis Team
                </p>
                </div>
            `,
        });

        return res.status(200).json({
            message:
                "Verification email has been resent. Please check your inbox.",
        });
    } catch (error) {
        console.error("Error in resending verification email:", error);
        return res.status(500).json({
            message:
                "An error occurred while resending the verification email. Please try again.",
        });
    }
});

exports.verifyEmail_get = asyncHandler(async (req, res) => {
    const { token, id } = req.params;

    try {
        const userToken = await Token.findOne({ token, userId: id });

        if (!userToken || Date.now() >= userToken.expiresAt) {
            return res.status(400).json({
                message:
                    "Your verification link may have expired. Please request a new one.",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "No user found for this verification. Please sign up.",
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                message: "This account is already verified. Please log in.",
            });
        }

        user.isVerified = true;
        await user.save();

        await userToken.deleteOne();

        return res.status(200).json({
            message: "Your account has been successfully verified.",
        });
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            message:
                "An error occurred while verifying your email. Please try again.",
        });
    }
});

exports.logout_get = [
    asyncHandler(async (req, res, next) => {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }),
];

exports.forgotPassword_post = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "No user found with this email. Please sign up.",
            });
        }

        const resetToken = crypto.randomBytes(16).toString("hex");
        const tokenExpiration = Date.now() + 3600000;

        await Token.create({
            userId: user._id,
            token: resetToken,
            expiresAt: tokenExpiration,
            type: "password-reset",
        });

        sendingMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #FF6F61;">Hello ${user.firstName},</h2>
                <p>
                  We received a request to reset your password. You can reset your password by clicking the button below:
                </p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}" 
                   style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #FF6F61; text-decoration: none; border-radius: 5px;">
                   Reset Password
                </a>
                <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                <p>
                  <a href="${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}">
                    ${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}
                  </a>
                </p>
                <p>
                  If you did not request a password reset, please ignore this email or contact support if you have any concerns.
                </p>
                <p style="font-size: 12px; color: #999;">
                  Best regards,<br>The Scholarship Oasis Team
                </p>
              </div>
            `,
        });

        return res.status(200).json({
            message:
                "Password reset email has been sent. Please check your inbox.",
        });
    } catch (error) {
        console.error("Error in sending password reset email:", error);
        return res.status(500).json({
            message:
                "An error occurred while sending the password reset email. Please try again.",
        });
    }
});

exports.resetPassword_post = [
    body(
        "password",
        "Password must be 8+ characters long, contain an uppercase letter, lowercase letter, number, and special character"
    )
        .trim()
        .isLength({ min: 8 })
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        ),
    body("confirmPassword", "Confirm password is required")
        .trim()
        .isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match.");
        }
        return true;
    }),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, id } = req.params;
        const { password } = req.body;

        try {
            const userToken = await Token.findOne({ token, userId: id });

            if (!userToken || Date.now() >= userToken.expiresAt) {
                return res.status(400).json({
                    message:
                        "Your password reset link may have expired. Please request a new one.",
                });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    message:
                        "No user found for this password reset. Please sign up.",
                });
            }

            const s = await bcrypt.genSalt(Number(salt));
            const hashedPassword = await bcrypt.hash(password, s);

            user.passwordHash = hashedPassword;
            await user.save();

            await Token.deleteMany({
                userId: user._id,
                type: "password-reset",
            });

            return res.status(200).json({
                message: "Your password has been successfully reset.",
            });
        } catch (error) {
            console.error("Password Reset Error:", error);
            return res.status(500).json({
                message:
                    "An error occurred while resetting your password. Please try again.",
            });
        }
    }),
];
