/* eslint-disable no-undef */
/* global Stripe */
import axios from 'axios';
import { showAlert } from './alerts';

// @ts-ignore - Stripe is loaded from CDN script
const stripe = Stripe(
  'pk_test_51T29uiBiJh8cJpkkSw6Cg7BltLaHH3JKN0WKCrzTld3u6QcPeOZlex2Gf1rTxAEXOru57Css1WJAne3hcTm7vHzb00rTY40PML',
);

const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    // Check if there was an error with the redirect
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (err) {
    console.log('Booking error:', err);
    showAlert('error', err.response?.data?.message || err.message);
  }
};

export default bookTour;
