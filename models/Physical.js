"use strict";

const mongoose = require("mongoose");

// Arbitrary physical
const modelSchema = mongoose.Schema({
  virtual: { type: String, ref: "Virtual", required: true },
  creator: { type: String, ref: "User", required: true },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  lab: { type: String, ref: "Lab", required: true },
  parent: { type: String, ref: "Container" },
  row: { type: Number, default: 1 },
  column: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
  columnSpan: { type: Number, default: 1 },
  name: { type: String, unique: true, required: true },
  description: String,
  datName: String,
  datHash: String
});

module.exports = mongoose.model("Physical", modelSchema);

