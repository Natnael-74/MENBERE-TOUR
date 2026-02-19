/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: { password, passwordConfirm },
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Password reset successful! Logging you in...');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default resetPassword;
