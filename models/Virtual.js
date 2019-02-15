"use strict";

const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
  createdAt    : { type: String, default: new Date() },
  createdBy    : { type: String, ref: "User", required: true },
  updatedAt    : { type: String, default: new Date() },
  updatedBy    : { type: String, ref: "User" },
  name: { type: String, unique: true, required: true },
  description: String,
  isAvailable: { type: Boolean, default: false },
  provenance: { type: String },
  genotype: { type: String },
  sequence: { type: String },
  fgSubmitted: { type: Boolean, default: false },
  fgStage: { type: Number, default: 0 },
  category: { type: String }
});

module.exports = mongoose.model("Virtual", modelSchema);
