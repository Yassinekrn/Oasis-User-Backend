let express = require("express");
let router = express.Router();

let scholarshipController = require("../controllers/scholarshipController");

router.get("/", scholarshipController.scholarship_list);
router.get("/locations", scholarshipController.scholarships_locations);
router.get(
    "/location/:location",
    scholarshipController.scholarship_by_location
);
router.get("/:name", scholarshipController.scholarship_by_name);

module.exports = router;
