// routes/course.routes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// 📌 Create a new course & Get all courses
router
  .route('/')
  .post(courseController.createCourse)
  .get(courseController.getAllCourses);

// 📌 Get, Update, Delete a course by ID
router
  .route('/:id')
  .get(courseController.getCourseById)
  .put(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
