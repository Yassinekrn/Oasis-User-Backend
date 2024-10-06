const asyncHandler = require("express-async-handler");
const Scholarship = require("../models/scholarship");

// Display list of all scholarships
exports.scholarship_list = asyncHandler(async (req, res) => {
    const scholarships = await Scholarship.find();
    if (!scholarships || scholarships.length === 0) {
        return res.status(404).json({ message: "No scholarships found" });
    }
    res.json(scholarships);
});

exports.scholarship_by_name = asyncHandler(async (req, res) => {
    const searchQuery = req.params.name;

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
    const locations = await Scholarship.distinct("location");

    if (!locations || locations.length === 0) {
        return res.status(404).json({ message: "No distinct locations found" });
    }

    // Sort the locations alphabetically
    res.json(locations.sort());
});
