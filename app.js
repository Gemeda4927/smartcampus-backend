// ✅ Correct imports
const express = require("express");
const cors = require("cors");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/universities", universityRoutes);
// app.use("/api/v1/courses", courseRoutes);
// app.use("/api/v1", paymentRoutes);

module.exports = app;
