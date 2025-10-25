const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/id')
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
