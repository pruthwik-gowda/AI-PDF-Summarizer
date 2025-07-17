const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  type: { type: String, enum: ["pdf", "text", "youtube"], required: true },
  content: { type: String, required: true },
  original: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  summaries: [summarySchema],
});

module.exports = mongoose.model("User", userSchema);
