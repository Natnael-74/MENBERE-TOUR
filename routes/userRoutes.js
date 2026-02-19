import express from 'express';

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  findDeactivatedUsers,
  getAdmins,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController.js';
import {
  signup,
  login,
  protect,
  restrictTo,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.get('/logout', logout);
router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);

router.use(restrictTo('admin'));

router.get('/deactivateUsers', findDeactivatedUsers);

router.get('/admins', getAdmins);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
