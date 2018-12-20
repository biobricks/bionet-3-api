'use strict'

const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
  createdAt    : { type: String, default: new Date() },
  updatedAt    : { type: String, default: new Date() },
  name         : { type: String, required: true },
  rows         : { type: Number, default: 1, min: 1 },
  columns      : { type: Number, default: 1, min: 1 },
  description  : String,
  children     : Object,
  users        : [{ type: String, ref: "User"}],
  joinRequests : [{ type: String, ref: "User"}],
  datName      : { type: String, default: "" },
  datKey       : { type: String, default: "" }
});


module.exports = mongoose.model('Lab', modelSchema);