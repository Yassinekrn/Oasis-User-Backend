let express = require("express");
let router = express.Router();
let userController = require("../controllers/userController");

router.get("/profile", userController.profile_get);

router.get("/id/:id", userController.getUserById_get);

router.post("/change-password", userController.changePassword_post);

router.post("/update-profile", userController.updateProfile_post);

router.post("/update-avatar", userController.updateAvatar_post);

router.post("/update-email", userController.updateEmail_post);

router.post("/delete", userController.deleteUser_post);

// add scholarship to favorites
router.post("/add-favorite", userController.addFavorite_post);

router.get("/favorites", userController.getFavorites_get);

router.post("/remove-favorite", userController.removeFavorite_post);

router.get(
    "/check-favorite-scholarships",
    userController.checkFavoriteScholarships_get
);

router.get("/notifications", userController.getNotifications_get);

router.get("/unread-notifications-count", userController.getUnreadNotificationsCount_get);

router.post(
    "/mark-notification-read/:id",
    userController.markNotificationAsRead_post
);

router.post(
    "/mark-all-notifications-read",
    userController.markAllNotificationsAsRead_post
);

router.get("/count", userController.user_count);

module.exports = router;
