"use strict";

const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
  createdAt    : { type: String, default: new Date() },
  createdBy    : { type: String, ref: "User", required: true },
  updatedAt    : { type: String, default: new Date() },
  updatedBy    : { type: String, ref: "User" },
  virtual: { type: String, ref: "Virtual", required: true },
  lab: { type: String, ref: "Lab", required: true },
  parent: { type: String, ref: "Container" },
  row: { type: Number, default: 1 },
  column: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
  columnSpan: { type: Number, default: 1 },
  name: { type: String, unique: true, required: true },
  description: String
});

module.exports = mongoose.model("Physical", modelSchema);

