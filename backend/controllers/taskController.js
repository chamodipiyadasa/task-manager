const Task = require("../models/Task");

// Get all tasks (with optional search)
exports.getTasks = async (req, res) => {
  const { search, sort } = req.query;
  try {
    let query = {};
    if (search) {
      query = { title: { $regex: search, $options: "i" } };
    }

    let tasks = await Task.find(query);

    // Simple sort by deadline or status
    if (sort === "deadline") tasks = tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    else if (sort === "status") tasks = tasks.sort((a, b) => a.status.localeCompare(b.status));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, deadline, assignedTo, status } = req.body;
  try {
    const newTask = new Task({ title, description, deadline, assignedTo, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const allTasks = await Task.find({ createdBy: userId });

    const totalTasks = allTasks.length;
    const pending = allTasks.filter((t) => t.status === "pending").length;
    const inProgress = allTasks.filter((t) => t.status === "in-progress").length;
    const completed = allTasks.filter((t) => t.status === "completed").length;

    res.json({ totalTasks, pending, inProgress, completed });
  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
};

