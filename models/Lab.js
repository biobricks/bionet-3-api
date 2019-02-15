'use strict'

const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
  createdAt    : { type: String, default: new Date() },
  createdBy    : { type: String, ref: "User", required: true },
  updatedAt    : { type: String, default: new Date() },
  updatedBy    : { type: String, ref: "User" },
  name         : { type: String, required: true },
  description  : String,
  rows         : { type: Number, default: 1, min: 1 },
  columns      : { type: Number, default: 1, min: 1 },
  children     : Object,
  users        : [{ type: String, ref: "User"}],
  joinRequests : [{ type: String, ref: "User"}]
});


module.exports = mongoose.model('Lab', modelSchema);