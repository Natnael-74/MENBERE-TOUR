/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const login = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data,
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default login;
