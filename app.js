const express = require("express");
const cors = require("cors");
const path = require("path"); 

// Routes
const userRoutes = require("./routes/user.routes"); 
const universityRoutes = require("./routes/university.routes"); 
const courseRoutes = require("./routes/course.routes");

const app = express();
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

// 📌 Mount routes
app.use("/api/v1/users", userRoutes); 
app.use("/api/v1/universities", universityRoutes); 
app.use("/api/v1/courses", courseRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
