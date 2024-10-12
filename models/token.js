let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    type: {
        type: String,
        required: true,
        enum: ["password-reset", "email-verification"],
    },
});

module.exports = mongoose.model("Token", tokenSchema);
