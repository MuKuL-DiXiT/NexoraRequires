const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // nullable if Google login
    google_id: { type: String }, // for OAuth users
    profile: { type: String, default:"https://www.svgrepo.com/show/452030/avatar-default.svg" }, // profile picture path
    role: { type: String, enum: ["user", "admin"], default: "user", required: true }, // role as string
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
