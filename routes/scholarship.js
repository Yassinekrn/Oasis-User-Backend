let express = require("express");
let router = express.Router();
let asyncHandler = require("express-async-handler");
let Scholarship = require("../models/scholarship");

let scholarshipController = require("../controllers/scholarshipController");

// Get a list of all scholarships
router.get("/", scholarshipController.scholarship_list);

// Get a distinct list of scholarship locations
router.get("/locations", scholarshipController.scholarships_locations);

// Get scholarships by a specific location
router.get(
    "/location/:location",
    scholarshipController.scholarship_by_location
);

// Search scholarships by name
router.get("/search", scholarshipController.scholarship_by_name);

// Get details of a specific scholarship by ID
router.get("/id/:id", scholarshipController.scholarship_detail);

// Get scholarships by deadline (YYYY-MM-DD format)
router.get(
    "/deadline/:deadline",
    scholarshipController.scholarship_by_deadline
);

router.get("/count", scholarshipController.scholarship_count);

module.exports = router;
