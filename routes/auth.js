let express = require("express");
let router = express.Router();
let authController = require("../controllers/authController");

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/verify-email/:id/:token", authController.verifyEmail_get);

router.get("/verify-token", authController.verifyToken_get);

// for next user case (foreshadowing)
// router.post("/forgot-password", authController.forgotPassword_post);

// router.post('/reset-password/:id/:token', authController.resetPassword_post)

// router.post('/change-password', authController.changePassword_post)

router.get("/logout", authController.logout_get);

router.get("/refresh-token", authController.refreshToken_get);

module.exports = router;
