const express = require("express");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user.routes"); 
const universityRoutes = require("./routes//university.routes"); 

const app = express();


app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/v1/users", userRoutes); 
app.use("/api/v1/universities", universityRoutes); 


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
