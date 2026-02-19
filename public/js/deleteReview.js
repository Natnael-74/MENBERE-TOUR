/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts.js';

const deleteReview = async (reviewId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
    });

    if (response.status === 204) {
      hideAlert();
      showAlert('success', 'Review deleted successfully!');
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1500);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default deleteReview;
