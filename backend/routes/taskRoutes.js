const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const Task = require("../models/Task");  // Import Task model

router.use(authMiddleware);

router.get("/", taskController.getTasks);

// Move this route *before* /:id
router.get("/stats", async (req, res) => {
  try {
    const tasks = await Task.find();
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const completed = tasks.filter(t => t.status === "completed").length;
    res.json({ total, pending, completed });
  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
});

router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
