/* eslint-disable */
import axios from 'axios';

import { showAlert, hideAlert } from './alerts.js';

const signup = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default signup;
