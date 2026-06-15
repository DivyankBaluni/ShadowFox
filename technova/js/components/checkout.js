// checkout.js — Multi-step form logic + validation

let currentStep = 1;
const TOTAL_STEPS = 3;

function initCheckout() {
  renderOrderSidebar();
  showStep(1);
  initStepEvents();
}

function showStep(step) {
  currentStep = step;

  // Update step indicator
  document.querySelectorAll('.step').forEach((el, i) => {
    const s = i + 1;
    el.classList.remove('active', 'done');
    if (s < step) el.classList.add('done');
    else if (s === step) el.classList.add('active');
  });

  // Show correct form section
  document.querySelectorAll('.checkout-form-section').forEach(el => el.classList.remove('active'));
  const section = document.getElementById(`step${step}`);
  if (section) section.classList.add('active');

  // Update step dots text
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.textContent = i + 1 < step ? '✓' : i + 1;
  });
}

function initStepEvents() {
  // Step 1 → 2
  document.getElementById('toStep2')?.addEventListener('click', () => {
    if (validateStep1()) showStep(2);
  });

  // Step 2 → 3
  document.getElementById('toStep3')?.addEventListener('click', () => {
    if (validateStep2()) {
      populateOrderReview();
      showStep(3);
    }
  });

  // Back buttons
  document.getElementById('backToStep1')?.addEventListener('click', () => showStep(1));
  document.getElementById('backToStep2')?.addEventListener('click', () => showStep(2));

  // Place order
  document.getElementById('placeOrder')?.addEventListener('click', placeOrder);

  // Input formatting
  const cardInput = document.getElementById('cardNumber');
  cardInput?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  const expiryInput = document.getElementById('expiry');
  expiryInput?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  const cvvInput = document.getElementById('cvv');
  cvvInput?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  });
}

function validateStep1() {
  const fields = [
    { id: 'firstName', label: 'First name', rule: v => v.trim().length >= 2 },
    { id: 'lastName', label: 'Last name', rule: v => v.trim().length >= 2 },
    { id: 'email', label: 'Email', rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'phone', label: 'Phone', rule: v => /^[6-9]\d{9}$/.test(v.replace(/\s/g, '')) },
    { id: 'address', label: 'Address', rule: v => v.trim().length >= 5 },
    { id: 'city', label: 'City', rule: v => v.trim().length >= 2 },
    { id: 'pincode', label: 'PIN code', rule: v => /^\d{6}$/.test(v.trim()) }
  ];
  return validateFields(fields);
}

function validateStep2() {
  const fields = [
    { id: 'cardNumber', label: 'Card number', rule: v => v.replace(/\s/g, '').length === 16 },
    { id: 'cardName', label: 'Name on card', rule: v => v.trim().length >= 3 },
    { id: 'expiry', label: 'Expiry date', rule: v => /^\d{2}\/\d{2}$/.test(v) },
    { id: 'cvv', label: 'CVV', rule: v => /^\d{3,4}$/.test(v) }
  ];
  return validateFields(fields);
}

function validateFields(fields) {
  let valid = true;
  fields.forEach(({ id, label, rule }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`${id}Error`);
    if (!input) return;
    const ok = rule(input.value);
    input.classList.toggle('error', !ok);
    if (errorEl) {
      errorEl.textContent = ok ? '' : `Please enter a valid ${label}`;
      errorEl.classList.toggle('show', !ok);
    }
    if (!ok) valid = false;
  });
  return valid;
}

function populateOrderReview() {
  const cart = Cart.getCart();
  const reviewItems = document.getElementById('reviewItems');
  if (!reviewItems) return;

  const subtotal = Cart.getCartTotal();
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  reviewItems.innerHTML = cart.map(item => `
    <div class="order-item-row">
      <img class="order-item-img" src="${item.image}" alt="${escapeHtml(item.name)}"
           onerror="this.style.display='none'">
      <div class="order-item-details">
        <div class="order-item-name">${escapeHtml(item.name)}</div>
        <div class="order-item-qty">Qty: ${item.quantity}</div>
      </div>
      <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  // Delivery info
  const fname = document.getElementById('firstName')?.value || '';
  const lname = document.getElementById('lastName')?.value || '';
  const address = document.getElementById('address')?.value || '';
  const city = document.getElementById('city')?.value || '';
  const state = document.getElementById('state')?.value || '';
  const pin = document.getElementById('pincode')?.value || '';

  const deliveryEl = document.getElementById('reviewDelivery');
  if (deliveryEl) {
    deliveryEl.innerHTML = `<strong>${escapeHtml(fname)} ${escapeHtml(lname)}</strong><br>
      ${escapeHtml(address)}, ${escapeHtml(city)}, ${escapeHtml(state)} - ${escapeHtml(pin)}`;
  }

  // Summary totals
  const el = document.getElementById('reviewSummary');
  if (el) {
    el.innerHTML = `
      <div class="summary-row"><span class="label">Subtotal</span><span class="value">${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span class="label">GST (18%)</span><span class="value">${formatPrice(tax)}</span></div>
      <div class="summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? '<span style="color:var(--color-success)">FREE</span>' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span class="label">Total</span><span class="value">${formatPrice(total)}</span></div>
    `;
  }
}

function placeOrder() {
  const btn = document.getElementById('placeOrder');
  if (btn) { btn.textContent = 'Processing…'; btn.disabled = true; }

  setTimeout(() => {
    const orderId = generateOrderId();
    const cart = Cart.getCart();
    const total = Cart.getCartTotal();

    // Save order
    Storage.set('technova_last_order', {
      id: orderId,
      items: cart,
      total,
      date: new Date().toISOString(),
      name: `${document.getElementById('firstName')?.value} ${document.getElementById('lastName')?.value}`,
      address: `${document.getElementById('address')?.value}, ${document.getElementById('city')?.value}`
    });

    Cart.clearCart();
    window.location.href = 'order-confirmation.html';
  }, 1800);
}

function renderOrderSidebar() {
  const container = document.getElementById('orderSidebarItems');
  const summaryEl = document.getElementById('orderSidebarSummary');
  if (!container) return;

  const cart = Cart.getCart();
  const subtotal = Cart.getCartTotal();
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  if (!cart.length) {
    container.innerHTML = '<p style="color:var(--color-text-muted);font-size:14px">Your cart is empty.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="order-sidebar-item">
      <img src="${item.image}" alt="${escapeHtml(item.name)}"
           onerror="this.style.background='var(--color-surface-3)'">
      <div class="order-sidebar-name">${escapeHtml(truncate(item.name, 28))} ×${item.quantity}</div>
      <div class="order-sidebar-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="summary-row"><span class="label">Subtotal</span><span class="value">${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span class="label">GST (18%)</span><span class="value">${formatPrice(tax)}</span></div>
      <div class="summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? '<span style="color:var(--color-success)">FREE</span>' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span class="label">Total</span><span class="value">${formatPrice(total)}</span></div>
    `;
  }
}
