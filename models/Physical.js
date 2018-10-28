"use strict";

const mongoose = require("mongoose");

// Arbitrary physical
const modelSchema = mongoose.Schema({
  virtual: { type: String, ref: "Virtual", required: true },
  creator: { type: String, ref: "User", required: true },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  parent: { type: String, ref: "Container", required: true },
  parentRow: { type: Number, required: true },
  parentColumn: { type: Number, required: true },
  name: { type: String, unique: true, required: true },
  description: String,
  rowSpan: { type: Number, min: 1, max: 200, default: 1 },
  columnSpan: { type: Number, min: 1, max: 200, default: 1 },
  datName: String,
  datHash: String
});

module.exports = mongoose.model("Physical", modelSchema);

