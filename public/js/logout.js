/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts.js';

const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Logged out successfully!', 2);

      // reload page after logout
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    hideAlert();
    showAlert('error', 'Error logging out! Please try again.');
  }
};

export default logout;
