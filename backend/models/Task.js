// models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  assignedTo: String,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Task", TaskSchema);
