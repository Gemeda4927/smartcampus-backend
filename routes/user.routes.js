
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router
  .route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/payment/update')
  .put(userController.updatePayment);

module.exports = router;
