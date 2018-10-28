"use strict";

const mongoose = require("mongoose");

// Arbitrary virtual
const modelSchema = mongoose.Schema({
  creator: { type: String, ref: "User", required: true },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  name: { type: String, unique: true, required: true },
  description: String,
  isAvailable: { type: Boolean, default: false },
  provenance: { type: String, required: true },
  genotype: { type: String, required: true },
  sequence: { type: String, required: true },
  fgSubmitted: { type: Boolean, default: false },
  fgStage: { type: Number, default: 0 },
  category: { type: String, required: true },
  datName: String,
  datHash: String
});

module.exports = mongoose.model("Virtual", modelSchema);
