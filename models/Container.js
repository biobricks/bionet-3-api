"use strict";

const mongoose = require("mongoose");

// Arbitrary container (rack, shelf, etc)
const modelSchema = mongoose.Schema({
  creator: { type: String, ref: "User", required: true },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  lab: { type: String, ref: "Lab", required: true },
  parent: { type: String, ref: "Container" },
  name: { type: String, unique: true, required: true },
  description: String,
  rows: { type: Number, min: 1, max: 200, required: true },
  columns: { type: Number, min: 1, max: 200, required: true },
  row: { type: Number, default: 1 },
  column: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
  columnSpan: { type: Number, default: 1 },
  children: Object,
  category: { type: String, required: true },
  datName: String,
  datHash: String,
  bgColor: { type: String, default: "#00D1FD" }
});

module.exports = mongoose.model("Container", modelSchema);

