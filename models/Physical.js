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
  name: { type: String, unique: true, required: true },
  description: String,
  datName: String,
  datHash: String,

  row: Number,
  column: Number,
  rowSpan: Number,
  colSpan: Number
});

module.exports = mongoose.model("Physical", modelSchema);

