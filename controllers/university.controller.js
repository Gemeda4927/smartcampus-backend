const University = require('../models/university.model');

exports.getAllUniversities = async (req, res) => {
  try {
    const filter = req.query.featured ? { featured: true } : {};
    const universities = await University.find(filter);
    res.status(200).json(universities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    res.status(200).json(university);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const { name, location, type, featured, imageUrl } = req.body;

    if (type && !['Public', 'Private'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either Public or Private' });
    }

    const newUniversity = new University({ name, location, type, featured, imageUrl });
    await newUniversity.save();
    res.status(201).json(newUniversity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateUniversity = async (req, res) => {
  try {
    const { name, location, type, featured, imageUrl } = req.body;

    if (type && !['Public', 'Private'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either Public or Private' });
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      { name, location, type, featured, imageUrl, updatedAt: Date.now() },
      { new: true }
    );

    if (!university) return res.status(404).json({ message: 'University not found' });
    res.status(200).json(university);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) return res.status(404).json({ message: 'University not found' });
    res.status(200).json({ message: 'University deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
