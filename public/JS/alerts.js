/* eslint-disable */
let alertTimeout;

export const showAlert = (type, message, time = 5) => {
  hideAlert();

  const markup = `
    <div class="alert alert--${type}">
      <div class="alert__icon">
        ${type === 'success' ? '✓' : '⚠'}
      </div>
      <div class="alert__message">
        ${message}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', markup);

  const alertEl = document.querySelector('.alert');

  setTimeout(() => {
    alertEl.classList.add('alert--visible');
  }, 10);

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
