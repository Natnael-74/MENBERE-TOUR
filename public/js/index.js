/* eslint-disable  */
import login from './login.js';
import signup from './signup.js';
import logout from './logout.js';
import updateUserData from './updateUserData.js';
import updateUserPassword from './updatePassword.js';
import forgotPassword from './forgotPassword.js';
import resetPassword from './resetPassword.js';
import editReview from './editReview.js';
import deleteReview from './deleteReview.js';
import { showConfirm } from './alerts.js';
import bookTour from './stripe.js';

//DOM Elements
const signupForm = document.querySelector('#signup');
const loginForm = document.querySelector('#login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const forgotPasswordForm = document.querySelector('#forgot-password');
const resetPasswordForm = document.querySelector('#reset-password');
const editReviewForm = document.querySelector('#edit-review-form');
const deleteReviewBtn = document.querySelector('#delete-review-btn');
const bookBtn = document.getElementById('book-tour');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    signup({ name, email, password, passwordConfirm });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login({ email, password });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    updateUserData(form);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    await updateUserPassword({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = window.location.pathname.split('/').pop();
    resetPassword(password, passwordConfirm, token);
  });
}

if (editReviewForm) {
  editReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reviewId = window.location.pathname.split('/').pop();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    editReview(reviewId, review, rating);
  });
}

if (deleteReviewBtn) {
  deleteReviewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const reviewId = window.location.pathname.split('/').pop();
    showConfirm('Are you sure you want to delete this review?', () => {
      deleteReview(reviewId);
    });
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
