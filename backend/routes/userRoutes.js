const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

// Example protecting all task routes
router.use(authMiddleware);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.getUsers);
router.put("/:id", authMiddleware, userController.editUser);
router.delete("/:id", authMiddleware, userController.terminateUser);
module.exports = router;
