/* eslint-disable */

let alertTimeout;

export const showAlert = (type, message, time = 5) => {
  hideAlert();

  const icon = type === 'success' ? '✓' : '✕';

  const markup = `
    <div class="alert alert--${type}">
      <div class="alert__icon">${icon}</div>
      <div class="alert__message">${message}</div>
      <button class="alert__close" aria-label="Close">&times;</button>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', markup);

  const alertEl = document.querySelector('.alert');
  const closeBtn = alertEl.querySelector('.alert__close');

  // Close button handler
  closeBtn.addEventListener('click', hideAlert);

  // Animate in
  setTimeout(() => {
    alertEl.classList.add('alert--visible');
  }, 10);

  // Auto remove
  alertTimeout = setTimeout(() => {
    hideAlert();
  }, time * 1000);
};

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.classList.remove('alert--visible');

    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, 300);
  }

  if (alertTimeout) clearTimeout(alertTimeout);
};

export const showConfirm = (message, onConfirm) => {
  const markup = `
    <div class="alert alert--confirm">
      <div class="alert__icon">⚠</div>
      <div class="alert__message">${message}</div>
      <div class="alert__buttons">
        <button class="btn btn--red confirm-yes">Delete</button>
        <button class="btn btn--white confirm-no">Cancel</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', markup);

  const alertEl = document.querySelector('.alert--confirm');
  const yesBtn = alertEl.querySelector('.confirm-yes');
  const noBtn = alertEl.querySelector('.confirm-no');

  setTimeout(() => {
    alertEl.classList.add('alert--visible');
  }, 10);

  const removeConfirm = () => {
    alertEl.classList.remove('alert--visible');
    setTimeout(() => {
      if (alertEl.parentElement) alertEl.parentElement.removeChild(alertEl);
    }, 300);
  };

  yesBtn.addEventListener('click', () => {
    removeConfirm();
    onConfirm();
  });

  noBtn.addEventListener('click', removeConfirm);
};
