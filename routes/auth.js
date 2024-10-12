let express = require("express");
let router = express.Router();
let authController = require("../controllers/authController");

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/verify-email/:id/:token", authController.verifyEmail_get);

router.get("/verify-token", authController.verifyToken_get);

router.post("/forgot-password", authController.forgotPassword_post);

router.post("/reset-password/:id/:token", authController.resetPassword_post);

router.get("/logout", authController.logout_get);

router.get("/refresh-token", authController.refreshToken_get);

// temp route to test sending emails
router.post("/send-email", authController.sendEmail_post);

module.exports = router;
