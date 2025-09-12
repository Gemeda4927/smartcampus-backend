const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller'); // auth

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// User management routes
router
  .route('/')
  .post(authController.restrictTo('admin'), userController.createUser)
  .get(authController.restrictTo('admin'), userController.getAllUsers);

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'user'), userController.getUserById)
  .put(authController.restrictTo('admin', 'user'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

// Payment update route
router
  .route('/payment/update')
  .put(authController.restrictTo('admin'), userController.updatePayment);

// Access control route
router
  .route('/:userId/access')
  .get(authController.restrictTo('user', 'admin'), userController.canAccessQuestions);

module.exports = router;
