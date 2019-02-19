"use strict";

const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
  createdAt    : { type: String, default: new Date() },
  createdBy    : { type: String, ref: "User", required: true },
  updatedAt    : { type: String, default: new Date() },
  updatedBy    : { type: String, ref: "User" },
  lab: { type: String, ref: "Lab" },
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
  category: String,
  bgColor: { type: String, default: "#00D1FD" }
});

module.exports = mongoose.model("Container", modelSchema);

