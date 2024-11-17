const asyncHandler = require("express-async-handler");
const Scholarship = require("../models/scholarship");
const { parse, format } = require("date-fns");
// const axios = require("axios");


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

    // Validate input
    if (!searchLocation || typeof searchLocation !== "string") {
        return res.status(400).json({ message: "Invalid location parameter" });
    }

    // Use regular expression for partial matching (case-insensitive)
    const scholarships = await Scholarship.find({
        location: { $regex: searchLocation, $options: "i" },
        status: "Approved",
    });

    if (!scholarships || scholarships.length === 0) {
        return res.status(404).json({
            message: `No approved scholarships found in ${searchLocation}`,
        });
    }

    res.json(scholarships);
});

exports.scholarships_locations = asyncHandler(async (req, res) => {
    const locations = await Scholarship.distinct("location", {
        status: "Approved",
    });

    if (!locations || locations.length === 0) {
        return res.status(404).json({
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
// exports.scholarship_by_deadline = asyncHandler(async (req, res) => {
//     const searchDeadline = req.params.deadline;

//     // Check if the format is YYYY-MM-DD
//     const regex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!regex.test(searchDeadline)) {
//         return res
//             .status(400)
//             .json({ message: "Invalid date format. Use YYYY-MM-DD." });
//     }

//     // Query scholarships directly by string comparison
//     const scholarships = await Scholarship.find({
//         deadline: searchDeadline,
//         status: "Approved",
//     }).sort({ deadline: 1 });

//     // if (!scholarships || scholarships.length === 0) {
//     //     return res.status(200).json({
//     //         message: "No approved scholarships found with the specified deadline.",
//     //     });
//     // }

//     // Return an empty array if no scholarships are found
//     res.json(scholarships || []);
// });

// exports.scholarship_by_deadline = asyncHandler(async (req, res) => {
//   const searchDeadline = req.params.deadline;

//   // Validate the format
//   const regex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!regex.test(searchDeadline)) {
//     return res
//       .status(400)
//       .json({ message: "Invalid date format. Use YYYY-MM-DD." });
//   }

//   // Fetch all approved scholarships
//   const scholarships = await Scholarship.find({ status: "Approved" });

//   // Send all scholarships to the LLM service
//   try {
//     const response = await axios.post(
//       "http://localhost:5000/filter_by_deadline",
//       {
//         date: searchDeadline,
//         scholarships: scholarships,
//       }
//     );
//     console.log(response);
    
//     res.json(response.data); // Return matched scholarships
//   } catch (error) {
//     console.error("Error filtering scholarships:", error.message);
//     res
//       .status(500)
//       .json({ message: "An error occurred while filtering scholarships." });
//   }
// });

exports.scholarship_by_deadline = asyncHandler(async (req, res) => {
  const searchDeadline = req.params.deadline;

  // Validate the input date format (YYYY-MM-DD)
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(searchDeadline)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    // Fetch all approved scholarships
    const scholarships = await Scholarship.find({ status: "Approved" });

    // Normalize deadlines and filter by the given date
    const matchingScholarships = scholarships.filter((scholarship) => {
      const normalizedDeadline = normalizeDate(scholarship.deadline);
      return normalizedDeadline === searchDeadline;
    });

    // Return the matching scholarships or an empty array
    res.json(matchingScholarships || []);
  } catch (error) {
    console.error("Error filtering scholarships by deadline:", error);
    res
      .status(500)
      .json({ message: "An error occurred while filtering scholarships." });
  }
});

function normalizeDate(deadline) {
  if (
    !deadline ||
    ["n/a", "no deadline", "varies"].includes(deadline.toLowerCase())
  ) {
    return null;
  }

  try {
    // Remove ordinal suffixes (st, nd, rd, th)
    deadline = deadline.replace(/(\d)(st|nd|rd|th)/g, "$1");

    // Attempt to parse common formats
    const formats = [
      "MMMM d, yyyy", // e.g., "December 12, 2024"
      "d MMMM, yyyy", // e.g., "15 December, 2024"
      "d MMMM yyyy", // e.g., "15 December 2024"
    ];

    for (const fmt of formats) {
      try {
        const parsedDate = parse(deadline.trim(), fmt, new Date());
        // Return formatted date as YYYY-MM-DD
        return format(parsedDate, "yyyy-MM-dd");
      } catch {
        continue; // Try the next format
      }
    }
  } catch (error) {
    console.error(`Error normalizing date: ${deadline}`, error);
  }

  return null; // Return null for unrecognized formats
}

exports.scholarship_count = asyncHandler(async (req, res) => {
    const count = await Scholarship.countDocuments({ status: "Approved" });

    res.json({ count });
});

// add a controller that based on some common fields in scholarship schema and user schema, it will suggest scholarships to the user
// button that searches all compatible scholarships
// button on each scholarship that checks the user's compatibility with the scholarship
