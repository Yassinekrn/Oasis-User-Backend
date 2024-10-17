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

module.exports = router;
