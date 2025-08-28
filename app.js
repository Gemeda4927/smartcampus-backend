
const express = require("express");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user.routes"); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/v1/users", userRoutes); 

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
