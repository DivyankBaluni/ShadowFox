// main.js — Page router / initializer
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initNavbar();

  const path = window.location.pathname;

  if (path.endsWith('index.html') || path.endsWith('/') || path === '' || path.includes('index.html')) {
    initHomePage();
  } else if (path.includes('products.html')) {
    initPLP();
  } else if (path.includes('product-detail.html')) {
    initPDP();
  } else if (path.includes('cart.html')) {
    initCartPage();
  } else if (path.includes('wishlist.html')) {
    initWishlistPage();
  } else if (path.includes('checkout.html')) {
    initCheckoutPage();
  } else if (path.includes('order-confirmation.html')) {
    initConfirmationPage();
  }
});

// ═══ HOME PAGE ═══
function initHomePage() {
  initCountdown();
  renderFeaturedProducts();
  renderNewArrivals();
  renderRecentlyViewedSection();

  // Newsletter
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value;
    if (email) {
      Toast.show('Thanks for subscribing! 🎉', 'success');
      document.getElementById('newsletterEmail').value = '';
    }
  });
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  // Show skeletons first
  grid.innerHTML = Array(4).fill(buildSkeletonCard()).join('');

  setTimeout(() => {
    const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
    grid.innerHTML = featured.map(p => buildProductCard(p)).join('');
    attachHomeCardEvents(grid);
    grid.classList.add('fade-in');
  }, 600);
}

function renderNewArrivals() {
  const grid = document.getElementById('newArrivalsGrid');
  if (!grid) return;

  grid.innerHTML = Array(4).fill(buildSkeletonCard()).join('');

  setTimeout(() => {
    const newOnes = PRODUCTS.filter(p => p.isNew).slice(0, 4);
    const toShow = newOnes.length >= 2 ? newOnes : PRODUCTS.filter(p => p.discount >= 15).slice(0, 4);
    grid.innerHTML = toShow.map(p => buildProductCard(p)).join('');
    attachHomeCardEvents(grid);
  }, 900);
}

function renderRecentlyViewedSection() {
  const section = document.getElementById('recentlyViewedSection');
  const grid = document.getElementById('recentlyViewedGrid');
  if (!section || !grid) return;

  const rv = Storage.get('technova_recently_viewed', []);
  if (!rv.length) { section.style.display = 'none'; return; }

  const products = rv.map(getProductById).filter(Boolean);
  grid.innerHTML = products.map(p => buildProductCard(p)).join('');
  attachHomeCardEvents(grid);
  section.style.display = '';
}

function attachHomeCardEvents(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const product = getProductById(btn.dataset.id);
      if (product) {
        Cart.addToCart(product, 1);
        btn.classList.add('added');
        btn.innerHTML = '<span>✓</span> Added!';
        setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<span>🛒</span> Add to Cart'; }, 1500);
      }
    });
  });

  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      toggleWishlistSimple(btn.dataset.id, btn);
    });
  });
}

function toggleWishlistSimple(productId, btn) {
  const wishlist = Storage.get('technova_wishlist', []);
  const idx = wishlist.indexOf(productId);
  if (idx > -1) { wishlist.splice(idx, 1); btn.classList.remove('wishlisted'); btn.textContent = '🤍'; Toast.show('Removed from wishlist', 'info'); }
  else { wishlist.push(productId); btn.classList.add('wishlisted'); btn.textContent = '❤️'; Toast.show('Added to wishlist!', 'success'); }
  Storage.set('technova_wishlist', wishlist);
  document.dispatchEvent(new CustomEvent('wishlistUpdated'));
}

function initCountdown() {
  const target = new Date();
  target.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date();
    let diff = Math.max(0, Math.floor((target - now) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const pad = n => String(n).padStart(2, '0');
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
    set('cdHours', h); set('cdMinutes', m); set('cdSeconds', s);
  }

  update();
  setInterval(update, 1000);
}

// ═══ PLP ═══
function initPLP() {
  initFilters();

  // Modal close buttons
  document.getElementById('quickViewModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
  });
  document.getElementById('closeQuickView')?.addEventListener('click', () => {
    document.getElementById('quickViewModal')?.classList.remove('open');
  });

  document.getElementById('compareModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
  });
  document.getElementById('closeCompare')?.addEventListener('click', () => {
    document.getElementById('compareModal')?.classList.remove('open');
  });

  document.getElementById('compareNowBtn')?.addEventListener('click', openCompareModal);

  // ESC to close modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });
}

// ═══ PDP ═══
function initPDP() {
  const productId = getParam('id');
  if (!productId) { window.location.href = 'products.html'; return; }

  const product = getProductById(productId);
  if (!product) { window.location.href = 'products.html'; return; }

  // Track recently viewed
  addToRecentlyViewed(productId);

  // Populate page
  document.title = `${product.name} — TechNova`;

  // Meta
  document.getElementById('pdpBreadcrumbCategory')?.setAttribute('href', `products.html?category=${product.category}`);
  const bcCatEl = document.getElementById('pdpBreadcrumbCategoryName');
  if (bcCatEl) bcCatEl.textContent = product.category;
  const bcNameEl = document.getElementById('pdpBreadcrumbName');
  if (bcNameEl) bcNameEl.textContent = truncate(product.name, 40);

  const brandEl = document.getElementById('pdpBrand');
  if (brandEl) brandEl.textContent = product.brand;

  const titleEl = document.getElementById('pdpTitle');
  if (titleEl) titleEl.textContent = product.name;

  // Rating
  const ratingEl = document.getElementById('pdpRating');
  if (ratingEl) ratingEl.innerHTML = renderStars(product.rating, product.reviewCount);

  // Stock
  const stockEl = document.getElementById('pdpStock');
  if (stockEl) {
    if (product.stock === 0) {
      stockEl.innerHTML = '<span class="pdp-stock out-stock"><span class="pdp-stock-dot"></span>Out of Stock</span>';
    } else if (product.stock <= 5) {
      stockEl.innerHTML = `<span class="pdp-stock low-stock"><span class="pdp-stock-dot"></span>Only ${product.stock} left!</span>`;
    } else {
      stockEl.innerHTML = '<span class="pdp-stock in-stock"><span class="pdp-stock-dot"></span>In Stock</span>';
    }
  }

  // Price
  const priceEl = document.getElementById('pdpPrice');
  if (priceEl) priceEl.textContent = formatPrice(product.price);

  const origEl = document.getElementById('pdpOriginalPrice');
  if (origEl) {
    if (product.originalPrice > product.price) {
      origEl.innerHTML = `<span class="pdp-price-original">${formatPrice(product.originalPrice)}</span>
        <span class="badge badge-discount">-${product.discount}%</span>`;
    }
  }

  // Gallery
  initGallery(product.images);

  // Tabs
  const descEl = document.getElementById('tabDescription');
  if (descEl) descEl.textContent = product.description;

  const specsEl = document.getElementById('tabSpecs');
  if (specsEl) {
    specsEl.innerHTML = `
      <table class="specs-table">
        <tbody>
          ${Object.entries(product.specs).map(([k, v]) => `
            <tr>
              <th>${escapeHtml(k)}</th>
              <td>${escapeHtml(v)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  const reviewsEl = document.getElementById('tabReviews');
  if (reviewsEl) {
    reviewsEl.innerHTML = product.reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-user">${escapeHtml(r.user)}</span>
          <span class="review-date">${r.date}</span>
        </div>
        <div style="margin-bottom:6px">${renderStars(r.rating)}</div>
        <div class="review-comment">${escapeHtml(r.comment)}</div>
      </div>
    `).join('');
  }

  // Tabs nav
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Quantity selector
  let qty = 1;
  const qtyEl = document.getElementById('pdpQty');
  document.getElementById('pdpQtyMinus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; if (qtyEl) qtyEl.textContent = qty; }
  });
  document.getElementById('pdpQtyPlus')?.addEventListener('click', () => {
    if (qty < product.stock) { qty++; if (qtyEl) qtyEl.textContent = qty; }
  });

  // Add to cart
  const atcBtn = document.getElementById('pdpAddToCart');
  atcBtn?.addEventListener('click', () => {
    if (product.stock === 0) return;
    Cart.addToCart(product, qty);
    atcBtn.innerHTML = '✓ Added to Cart!';
    atcBtn.style.background = 'var(--color-success)';
    setTimeout(() => {
      atcBtn.innerHTML = '🛒 Add to Cart';
      atcBtn.style.background = '';
    }, 2000);
  });

  // Buy Now
  document.getElementById('pdpBuyNow')?.addEventListener('click', () => {
    if (product.stock === 0) return;
    Cart.addToCart(product, qty);
    window.location.href = 'checkout.html';
  });

  // Wishlist
  const wishBtn = document.getElementById('pdpWishlist');
  const wishlist = Storage.get('technova_wishlist', []);
  if (wishlist.includes(productId)) {
    wishBtn?.classList.add('wishlisted');
    if (wishBtn) wishBtn.innerHTML = '❤️ Wishlisted';
  }
  wishBtn?.addEventListener('click', () => {
    toggleWishlistSimple(productId, wishBtn);
    const wl = Storage.get('technova_wishlist', []);
    wishBtn.innerHTML = wl.includes(productId) ? '❤️ Wishlisted' : '🤍 Wishlist';
  });

  // Sticky ATC
  const stickyAtc = document.getElementById('stickyAtc');
  const stickyName = document.getElementById('stickyName');
  const stickyPrice = document.getElementById('stickyPrice');
  if (stickyAtc && stickyName && stickyPrice) {
    stickyName.textContent = truncate(product.name, 40);
    stickyPrice.textContent = formatPrice(product.price);

    const pdpActions = document.getElementById('pdpActionsAnchor');
    const observer = new IntersectionObserver(([entry]) => {
      stickyAtc.classList.toggle('show', !entry.isIntersecting);
    }, { threshold: 0 });
    if (pdpActions) observer.observe(pdpActions);
  }

  document.getElementById('stickyAtcBtn')?.addEventListener('click', () => {
    Cart.addToCart(product, 1);
  });

  // Related products
  renderRelated(product);
}

function renderRelated(product) {
  const grid = document.getElementById('relatedGrid');
  if (!grid) return;

  const related = PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  if (!related.length) { document.getElementById('relatedSection')?.style?.setProperty('display', 'none'); return; }

  grid.innerHTML = related.map(p => buildProductCard(p)).join('');
  attachHomeCardEvents(grid);
}

// ═══ CART PAGE ═══
function initCartPage() {
  renderCart();

  document.addEventListener('cartUpdated', () => renderCart());

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!Cart.getCart().length) { Toast.show('Your cart is empty!', 'warning'); return; }
    window.location.href = 'checkout.html';
  });
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');
  const countEl = document.getElementById('cartCountLabel');
  const cart = Cart.getCart();

  if (countEl) countEl.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;

  if (!cart.length) {
    if (itemsEl) itemsEl.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:64px;margin-bottom:16px">🛒</div>
        <h3 style="font-family:var(--font-heading);font-size:24px;font-weight:700;margin-bottom:8px">Your cart is empty</h3>
        <p style="color:var(--color-text-muted);margin-bottom:24px">Add some products to get started!</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>`;
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (summaryEl) summaryEl.style.display = '';

  if (itemsEl) {
    itemsEl.innerHTML = cart.map(item => {
      const product = getProductById(item.productId);
      return `
        <div class="cart-item" data-id="${item.productId}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${escapeHtml(item.name)}"
                 onerror="this.style.display='none'">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-brand">${escapeHtml(product?.brand || '')}</div>
            <div class="cart-item-name">
              <a href="product-detail.html?id=${item.productId}">${escapeHtml(item.name)}</a>
            </div>
            <div class="cart-item-price">${formatPrice(item.price)} each</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-selector">
              <button class="qty-btn cart-qty-minus" data-id="${item.productId}">−</button>
              <div class="qty-value">${item.quantity}</div>
              <button class="qty-btn cart-qty-plus" data-id="${item.productId}"
                      ${product && item.quantity >= product.stock ? 'disabled style="opacity:0.4"' : ''}>+</button>
            </div>
            <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
            <button class="cart-item-remove" data-id="${item.productId}" aria-label="Remove item">🗑</button>
          </div>
        </div>
      `;
    }).join('');

    itemsEl.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.productId === btn.dataset.id);
        if (item) Cart.updateQty(btn.dataset.id, item.quantity - 1);
      });
    });

    itemsEl.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.productId === btn.dataset.id);
        if (item) Cart.updateQty(btn.dataset.id, item.quantity + 1);
      });
    });

    itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => Cart.removeFromCart(btn.dataset.id));
    });
  }

  // Summary
  const subtotal = Cart.getCartTotal();
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  const summaryRows = document.getElementById('summaryRows');
  if (summaryRows) {
    summaryRows.innerHTML = `
      <div class="summary-row"><span class="label">Subtotal</span><span class="value">${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span class="label">GST (18%)</span><span class="value">${formatPrice(tax)}</span></div>
      <div class="summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? '<span style="color:var(--color-success)">FREE</span>' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span class="label">Total</span><span class="value">${formatPrice(total)}</span></div>
    `;
  }
}

// ═══ CHECKOUT PAGE ═══
function initCheckoutPage() {
  const cart = Cart.getCart();
  if (!cart.length) { window.location.href = 'cart.html'; return; }
  initCheckout();
}

// ═══ ORDER CONFIRMATION ═══
function initConfirmationPage() {
  const order = Storage.get('technova_last_order');
  if (!order) { window.location.href = 'index.html'; return; }

  const idEl = document.getElementById('orderId');
  if (idEl) idEl.textContent = order.id;

  const nameEl = document.getElementById('confName');
  if (nameEl) nameEl.textContent = order.name;

  const addrEl = document.getElementById('confAddress');
  if (addrEl) addrEl.textContent = order.address;

  const totalEl = document.getElementById('confTotal');
  if (totalEl) totalEl.textContent = formatPrice(order.total + Math.round(order.total * 0.18) + 99);

  const itemsEl = document.getElementById('confItems');
  if (itemsEl) {
    itemsEl.innerHTML = order.items.map(item => `
      <div class="order-item-row">
        <img class="order-item-img" src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'">
        <div class="order-item-details">
          <div class="order-item-name">${escapeHtml(item.name)}</div>
          <div class="order-item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }
}
