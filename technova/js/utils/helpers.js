// helpers.js — Utility functions

// Format price in Indian Rupees
function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}


// Generate star rating HTML element
function renderStars(rating, count) {
  const pct = (rating / 5) * 100;
  return `
    <div class="stars" aria-label="Rating: ${rating} out of 5">
      <span style="
        background: linear-gradient(90deg, var(--color-warning) ${pct}%, var(--color-surface-3) ${pct}%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: inherit;
        letter-spacing: 1px;
      ">★★★★★</span>
    </div>
    ${count !== undefined ? `<span class="stars-text">${rating} (${count.toLocaleString()})</span>` : ''}
  `;
}

// Debounce
function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// Generate unique order ID
function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TN-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// Get product by ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

// Truncate text
function truncate(text, len = 60) {
  return text.length > len ? text.slice(0, len) + '…' : text;
}

// Sanitize HTML (basic)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Get URL parameter
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Build product card HTML
function buildProductCard(product, options = {}) {
  const { showCompare = false } = options;
  const discountBadge = product.discount > 0 ? `<span class="badge badge-discount">-${product.discount}%</span>` : '';
  const newBadge = product.isNew ? `<span class="badge badge-new">New</span>` : '';
  const outBadge = product.stock === 0 ? `<span class="badge badge-out">Sold Out</span>` : '';

  const wishlist = Storage.get('technova_wishlist') || [];
  const isWished = wishlist.includes(product.id);

  return `
  <article class="product-card" data-id="${product.id}">
    <div class="product-card-image">
      <a href="product-detail.html?id=${product.id}" aria-label="${escapeHtml(product.name)}">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"
             onerror="this.style.display='none';this.parentElement.innerHTML+='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;font-size:48px;opacity:0.2;\'>📦</div>'">
      </a>
      <div class="product-card-badges">
        ${discountBadge}${newBadge}${outBadge}
      </div>
      <div class="product-card-actions">
        <button class="product-card-action-btn wishlist-btn ${isWished ? 'wishlisted' : ''}"
                data-id="${product.id}" aria-label="Add to wishlist"
                title="Add to wishlist">
          ${isWished ? '❤️' : '🤍'}
        </button>
        <button class="product-card-action-btn quick-view-btn"
                data-id="${product.id}" aria-label="Quick view"
                title="Quick view">
          👁
        </button>
        <button class="product-card-action-btn compare-btn-card"
                data-id="${product.id}" aria-label="Compare"
                title="Add to compare">
          ⚖️
        </button>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-card-brand">${escapeHtml(product.brand)}</div>
      <a href="product-detail.html?id=${product.id}" class="product-card-name">
        ${escapeHtml(product.name)}
      </a>
      <div>${renderStars(product.rating, product.reviewCount)}</div>
      <div class="product-card-prices">
        <span class="product-price">${formatPrice(product.price)}</span>
        ${product.originalPrice > product.price ? `<span class="product-price-original">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
    </div>
    <div class="product-card-footer">
      <button class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}"
              data-id="${product.id}"
              ${product.stock === 0 ? 'disabled' : ''}
              aria-label="Add ${escapeHtml(product.name)} to cart">
        <span>🛒</span>
        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  </article>
  `;
}

// Build skeleton card HTML
function buildSkeletonCard() {
  return `
  <div class="skeleton-card">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton-body">
      <div class="skeleton skeleton-line w-40"></div>
      <div class="skeleton skeleton-line w-80"></div>
      <div class="skeleton skeleton-line w-60"></div>
      <div class="skeleton skeleton-line w-40"></div>
    </div>
  </div>`;
}
