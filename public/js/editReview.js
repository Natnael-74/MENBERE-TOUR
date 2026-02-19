/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts.js';

const editReview = async (reviewId, review, rating) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: { review, rating },
    });

    if (response.data.status === 'success') {
      hideAlert();
      showAlert('success', 'Review updated successfully!');
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1500);
    }
  } catch (error) {
    hideAlert();
    showAlert('error', error.response.data.message);
  }
};

export default editReview;
