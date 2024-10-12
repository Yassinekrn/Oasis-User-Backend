let express = require("express");
let router = express.Router();
let userController = require("../controllers/userController");

router.post("/change-password", userController.changePassword_post);

module.exports = router;
