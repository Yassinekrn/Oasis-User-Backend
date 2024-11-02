const asyncHandler = require("express-async-handler");
const Scholarship = require("../models/scholarship");

// Display list of all scholarships
exports.scholarship_list = asyncHandler(async (req, res) => {
    const scholarships = await Scholarship.find({ status: "Approved" });
    if (!scholarships || scholarships.length === 0) {
        return res
            .status(404)
            .json({ message: "No approved scholarships found" });
    }
    res.json(scholarships);
});

exports.scholarship_by_name = asyncHandler(async (req, res) => {
    // const searchQuery = req.params.name;
    const searchQuery = req.query.name;

    // Use regular expression for partial matching (case-insensitive)
    const scholarships = await Scholarship.find({
        title: { $regex: searchQuery, $options: "i" },
    });

    if (!scholarships || scholarships.length === 0) {
        return res
            .status(404)
            .json({ message: "No scholarships found matching the name" });
    }

    res.json(scholarships);
});

exports.scholarship_by_location = asyncHandler(async (req, res) => {
    const searchLocation = req.params.location;

    // Use regular expression for partial matching (case-insensitive)
    const scholarships = await Scholarship.find({
        location: { $regex: searchLocation, $options: "i" },
    });

    if (!scholarships || scholarships.length === 0) {
        return res.status(404).json({
            message: "No scholarships found in the specified location",
        });
    }

    res.json(scholarships);
});

exports.scholarships_locations = asyncHandler(async (req, res) => {
    const locations = await Scholarship.distinct("location", {
        status: "Approved",
    });

    if (!locations || locations.length === 0) {
        return res
            .status(404)
            .json({
                message:
                    "No distinct locations found for the approved scholarships",
            });
    }

    // Sort the locations alphabetically
    res.json(locations.sort());
});

exports.scholarship_detail = asyncHandler(async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
    }

    res.json(scholarship);
});

// change it if you want to change the scholarship schema ( also, maybe suggest a gte or lte for the deadline)
exports.scholarship_by_deadline = asyncHandler(async (req, res) => {
    const searchDeadline = req.params.deadline;

    // Check if the format is YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(searchDeadline)) {
        return res
            .status(400)
            .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // Query scholarships directly by string comparison
    const scholarships = await Scholarship.find({
        deadline: searchDeadline,
    });

    if (!scholarships || scholarships.length === 0) {
        return res.status(404).json({
            message: "No scholarships found with the specified deadline",
        });
    }

    res.json(scholarships);
});

// add a controller that based on some common fields in scholarship schema and user schema, it will suggest scholarships to the user
// button that searches all compatible scholarships
// button on each scholarship that checks the user's compatibility with the scholarship
