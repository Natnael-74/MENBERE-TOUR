/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const forgotPassword = async (email) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Password reset link sent to your email!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 3000);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default forgotPassword;
