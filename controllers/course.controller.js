// controllers/course.controller.js
const Course = require('../models/course.model');
const University = require('../models/university.model');

// 📌 Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, duration, credits, university, featured, imageUrl } = req.body;

    // check if university exists
    const uni = await University.findById(university);
    if (!uni) {
      return res.status(404).json({ message: 'University not found' });
    }

    const course = new Course({
      title,
      description,
      duration,
      credits,
      university,
      featured,
      imageUrl,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// 📌 Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('university', 'name location type');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// 📌 Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('university', 'name location type');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// 📌 Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, duration, credits, university, featured, imageUrl } = req.body;

    if (university) {
      const uni = await University.findById(university);
      if (!uni) {
        return res.status(404).json({ message: 'University not found' });
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, credits, university, featured, imageUrl },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// 📌 Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};
