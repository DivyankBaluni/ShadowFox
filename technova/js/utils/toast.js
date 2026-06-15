// toast.js — Toast notification system
const Toast = (() => {
  let container;

  function init() {
    container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function show(message, type = 'info', duration = 3000) {
    if (!container) init();

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    const timer = setTimeout(() => dismiss(toast), duration);
    toast.addEventListener('click', () => { clearTimeout(timer); dismiss(toast); });
  }

  function dismiss(toast) {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  return { show, init };
})();
