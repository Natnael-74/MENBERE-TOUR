/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const updateUserPassword = async (data) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data,
    });

    if (response.data.status === 'success') {
      hideAlert();

      showAlert('success', 'Password updated successfully!');
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default updateUserPassword;
