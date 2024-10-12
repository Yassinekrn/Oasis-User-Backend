const multer = require("multer");

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profile/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadProfileImage = multer({
    storage: profileImageStorage,
    fileFilter: imageFileFilter,
}).single("profileImage");

module.exports = {
    uploadProfileImage,
};
