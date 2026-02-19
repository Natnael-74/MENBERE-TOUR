/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const updateUserData = async (data) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Data updated successfully!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default updateUserData;
