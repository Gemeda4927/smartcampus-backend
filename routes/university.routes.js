const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');


router.route('/')
  .get(universityController.getAllUniversities)
  .post(universityController.createUniversity);

router.route('/:id')
  .get(universityController.getUniversityById)
  .put(universityController.updateUniversity)
  .delete(universityController.deleteUniversity);

module.exports = router;
