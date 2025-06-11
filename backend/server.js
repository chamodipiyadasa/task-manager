// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");


const PORT = process.env.PORT || 5001;  // or any port you want

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

app.post("/test", (req, res) => {
  res.status(200).json({ message: "Test route working ✅" });
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected !!");

  // Force port 5001 in case .env is misconfigured
 app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

})
.catch((err) => console.error("MongoDB error ❌", err));


