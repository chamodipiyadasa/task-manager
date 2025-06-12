// models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  assignedTo: String,
 status: {
  type: String,
  default: "pending",
  lowercase: true,
  enum: ["pending", "in-progress", "completed"]
}

});

module.exports = mongoose.model("Task", TaskSchema);
