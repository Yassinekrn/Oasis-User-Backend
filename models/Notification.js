const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipientId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "recipientType",
  },
  recipientType: {
    type: String,
    required: true,
    enum: ["User", "Admin"], // Only allow 'User' or 'Admin'
  },
  scholarshipId: {
    type: Schema.Types.ObjectId,
    ref: "Scholarship",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
