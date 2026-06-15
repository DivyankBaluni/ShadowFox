// filters.js — Filter + sort logic for PLP

let activeFilters = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 200000,
  rating: 0,
  availability: false
};
let activeSort = 'featured';
let activeView = 'grid';
let activeSearch = '';
let compareList = [];
const MAX_COMPARE = 3;

let currentPage = 1;
const ITEMS_PER_PAGE = 6;
let filteredProductsList = [];

function updateSearchFromNavbar(query) {
  activeSearch = query;
  applyFilters();
}

function initFilters() {
  const urlSearch = getParam('search') || '';
  const urlCategory = getParam('category') || '';
  if (urlSearch) { activeSearch = urlSearch; const si = document.getElementById('searchInput'); if(si) si.value = urlSearch; }
  if (urlCategory) activeFilters.categories = [urlCategory];

  buildFilterSidebar();
  initSortAndView();
  initPriceRange();
  applyFilters();
  initMobileFilterToggle();
  initInfiniteScroll();
}

function buildFilterSidebar() {
  // Category filters
  const catContainer = document.getElementById('filterCategories');
  if (catContainer) {
    catContainer.innerHTML = CATEGORIES.filter(c => c.id !== 'all').map(cat => `
      <label class="filter-option">
        <input type="checkbox" value="${cat.id}"
               ${activeFilters.categories.includes(cat.id) ? 'checked' : ''}
               onchange="toggleFilter('categories','${cat.id}',this.checked)">
        <span>${cat.name}</span>
        <span class="filter-option-count">${cat.count}</span>
      </label>
    `).join('');
  }

  // Brand filters
  const brandContainer = document.getElementById('filterBrands');
  if (brandContainer) {
    brandContainer.innerHTML = BRANDS.map(brand => {
      const count = PRODUCTS.filter(p => p.brand === brand).length;
      return `
        <label class="filter-option">
          <input type="checkbox" value="${brand}"
                 ${activeFilters.brands.includes(brand) ? 'checked' : ''}
                 onchange="toggleFilter('brands','${brand}',this.checked)">
          <span>${escapeHtml(brand)}</span>
          <span class="filter-option-count">${count}</span>
        </label>
      `;
    }).join('');
  }

  // Rating filter
  const ratingContainer = document.getElementById('filterRating');
  if (ratingContainer) {
    ratingContainer.innerHTML = [4, 3, 2].map(r => `
      <div class="rating-filter-option ${activeFilters.rating === r ? 'active' : ''}"
           onclick="setRatingFilter(${r})">
        <span style="color:var(--color-warning)">★★★★★</span>
        <span style="font-size:13px;margin-left:4px;">${r}+ Stars</span>
      </div>
    `).join('');
  }
}

function toggleFilter(type, value, checked) {
  if (checked) {
    if (!activeFilters[type].includes(value)) activeFilters[type].push(value);
  } else {
    activeFilters[type] = activeFilters[type].filter(v => v !== value);
  }
  applyFilters();
}

function setRatingFilter(rating) {
  activeFilters.rating = activeFilters.rating === rating ? 0 : rating;
  document.querySelectorAll('.rating-filter-option').forEach((el, i) => {
    el.classList.toggle('active', [4,3,2][i] === activeFilters.rating);
  });
  applyFilters();
}

function initPriceRange() {
  const minInput = document.getElementById('priceMin');
  const maxInput = document.getElementById('priceMax');
  const minSlider = document.getElementById('sliderMin');
  const maxSlider = document.getElementById('sliderMax');
  const rangeFill = document.getElementById('rangeFill');

  if (!minInput) return;

  const maxPrice = 200000;
  minInput.value = 0;
  maxInput.value = maxPrice;
  minSlider.max = maxPrice;
  maxSlider.max = maxPrice;
  maxSlider.value = maxPrice;

  function updateFill() {
    const minPct = (minSlider.value / maxPrice) * 100;
    const maxPct = (maxSlider.value / maxPrice) * 100;
    if (rangeFill) { rangeFill.style.left = minPct + '%'; rangeFill.style.width = (maxPct - minPct) + '%'; }
  }

  const update = debounce(() => {
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);
    if (min > max) [min, max] = [max, min];
    activeFilters.priceMin = min;
    activeFilters.priceMax = max;
    minInput.value = min;
    maxInput.value = max;
    updateFill();
    applyFilters();
  }, 150);

  minSlider.addEventListener('input', update);
  maxSlider.addEventListener('input', update);

  minInput.addEventListener('change', () => { minSlider.value = minInput.value; update(); });
  maxInput.addEventListener('change', () => { maxSlider.value = maxInput.value; update(); });

  updateFill();
}

function initSortAndView() {
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', e => { activeSort = e.target.value; applyFilters(); });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeView = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('productsGrid');
      if (grid) { grid.classList.toggle('list-view', activeView === 'list'); }
    });
  });
}

function initMobileFilterToggle() {
  const toggleBtn = document.getElementById('filterMobileToggle');
  const sidebar = document.querySelector('.filters-sidebar');
  const overlay = document.getElementById('filterOverlay');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
    overlay?.classList.toggle('show');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('mobile-open');
    overlay?.classList.remove('show');
  });
}

function clearAllFilters() {
  activeFilters = { categories: [], brands: [], priceMin: 0, priceMax: 200000, rating: 0, availability: false };
  activeSearch = '';
  const si = document.getElementById('searchInput');
  if (si) si.value = '';
  buildFilterSidebar();
  const minSlider = document.getElementById('sliderMin');
  const maxSlider = document.getElementById('sliderMax');
  if (minSlider) minSlider.value = 0;
  if (maxSlider) maxSlider.value = 200000;
  applyFilters();
}

function applyFilters() {
  let results = [...PRODUCTS];

  // Search
  const searchInput = document.getElementById('searchInput');
  const query = (searchInput?.value || activeSearch).toLowerCase().trim();
  if (query) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  // Categories
  if (activeFilters.categories.length > 0) {
    results = results.filter(p => activeFilters.categories.includes(p.category));
  }

  // Brands
  if (activeFilters.brands.length > 0) {
    results = results.filter(p => activeFilters.brands.includes(p.brand));
  }

  // Price
  results = results.filter(p => p.price >= activeFilters.priceMin && p.price <= activeFilters.priceMax);

  // Rating
  if (activeFilters.rating > 0) {
    results = results.filter(p => p.rating >= activeFilters.rating);
  }

  // Sort
  switch (activeSort) {
    case 'price-asc': results.sort((a, b) => a.price - b.price); break;
    case 'price-desc': results.sort((a, b) => b.price - a.price); break;
    case 'rating': results.sort((a, b) => b.rating - a.rating); break;
    case 'newest': results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'popular': results.sort((a, b) => b.reviewCount - a.reviewCount); break;
    default: results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  filteredProductsList = results;
  currentPage = 1;
  renderProductsPaged();
  renderActiveFilterTags();
  updateProductCount(results.length, PRODUCTS.length);
}

function renderProductsPaged() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (activeView === 'list') grid.classList.add('list-view');

  const pageProducts = filteredProductsList.slice(0, currentPage * ITEMS_PER_PAGE);

  if (!pageProducts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-text">Try adjusting your filters or search query</p>
        <button class="btn btn-primary" onclick="clearAllFilters()">Clear All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = pageProducts.map(p => buildProductCard(p)).join('');
  attachCardEvents(grid);
}

function initInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (currentPage * ITEMS_PER_PAGE >= filteredProductsList.length) return;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150) {
      currentPage++;
      renderProductsPaged();
    }
  });
}

function attachCardEvents(container) {
  // Add to cart
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const product = getProductById(btn.dataset.id);
      if (product) {
        Cart.addToCart(product, 1);
        btn.classList.add('added');
        btn.innerHTML = '<span>✓</span> Added!';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = '<span>🛒</span> Add to Cart';
        }, 1500);
      }
    });
  });

  // Quick view
  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openQuickView(btn.dataset.id);
    });
  });

  // Wishlist
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      toggleWishlist(btn.dataset.id, btn);
    });
  });

  // Compare
  container.querySelectorAll('.compare-btn-card').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      toggleCompare(btn.dataset.id);
    });
  });
}

function renderActiveFilterTags() {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  const tags = [];
  activeFilters.categories.forEach(c => tags.push({ label: c, remove: () => { toggleFilter('categories', c, false); rebuildCheckbox('categories', c, false); } }));
  activeFilters.brands.forEach(b => tags.push({ label: b, remove: () => { toggleFilter('brands', b, false); rebuildCheckbox('brands', b, false); } }));
  if (activeFilters.rating > 0) tags.push({ label: `${activeFilters.rating}+ Stars`, remove: () => setRatingFilter(activeFilters.rating) });
  if (activeFilters.priceMin > 0 || activeFilters.priceMax < 200000) tags.push({ label: `${formatPrice(activeFilters.priceMin)} – ${formatPrice(activeFilters.priceMax)}`, remove: () => { activeFilters.priceMin = 0; activeFilters.priceMax = 200000; applyFilters(); } });

  container.innerHTML = tags.map((t, i) => `
    <span class="filter-tag">${escapeHtml(t.label)}<span class="filter-tag-remove" data-idx="${i}">×</span></span>
  `).join('');

  container.querySelectorAll('.filter-tag-remove').forEach(el => {
    el.addEventListener('click', () => tags[+el.dataset.idx].remove());
  });
}

function rebuildCheckbox(type, value, checked) {
  const selector = type === 'categories' ? '#filterCategories' : '#filterBrands';
  const inputs = document.querySelectorAll(`${selector} input[value="${value}"]`);
  inputs.forEach(i => i.checked = checked);
}

function updateProductCount(shown, total) {
  const el = document.getElementById('productCount');
  if (el) el.innerHTML = `Showing <strong>${shown}</strong> of <strong>${total}</strong> products`;
}

// Quick View Modal
function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');
  if (!modal || !body) return;

  const specRows = Object.entries(product.specs).slice(0, 4).map(([k, v]) => `
    <div class="quick-view-spec-row">
      <span class="quick-view-spec-key">${escapeHtml(k)}</span>
      <span class="quick-view-spec-val">${escapeHtml(v)}</span>
    </div>
  `).join('');

  body.innerHTML = `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
      </div>
      <div class="quick-view-info">
        <div class="quick-view-brand">${escapeHtml(product.brand)}</div>
        <div class="quick-view-name">${escapeHtml(product.name)}</div>
        ${renderStars(product.rating, product.reviewCount)}
        <div class="quick-view-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="product-price-original">${formatPrice(product.originalPrice)}</span><span class="badge badge-discount">-${product.discount}%</span>` : ''}
        </div>
        <div class="quick-view-specs">${specRows}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="qty-selector">
            <button class="qty-btn" id="qvMinus">−</button>
            <div class="qty-value" id="qvQty">1</div>
            <button class="qty-btn" id="qvPlus">+</button>
          </div>
          <button class="btn btn-primary" style="flex:1" id="qvAddToCart">
            🛒 Add to Cart
          </button>
        </div>
        <a href="product-detail.html?id=${product.id}" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:-4px;">
          View Full Details →
        </a>
      </div>
    </div>
  `;

  let qty = 1;
  document.getElementById('qvMinus')?.addEventListener('click', () => { if (qty > 1) { qty--; document.getElementById('qvQty').textContent = qty; } });
  document.getElementById('qvPlus')?.addEventListener('click', () => { if (qty < product.stock) { qty++; document.getElementById('qvQty').textContent = qty; } });
  document.getElementById('qvAddToCart')?.addEventListener('click', () => {
    Cart.addToCart(product, qty);
    modal.classList.remove('open');
  });

  modal.classList.add('open');

  // Track recently viewed
  addToRecentlyViewed(product.id);
}

// Compare
function toggleCompare(productId) {
  const idx = compareList.indexOf(productId);
  if (idx > -1) {
    compareList.splice(idx, 1);
  } else {
    if (compareList.length >= MAX_COMPARE) {
      Toast.show(`Max ${MAX_COMPARE} products for comparison`, 'warning');
      return;
    }
    compareList.push(productId);
  }
  updateCompareBar();
}

function updateCompareBar() {
  const bar = document.getElementById('compareBar');
  if (!bar) return;
  bar.classList.toggle('show', compareList.length > 0);

  const slotsEl = document.getElementById('compareSlots');
  if (slotsEl) {
    slotsEl.innerHTML = compareList.map(id => {
      const p = getProductById(id);
      return `<div class="compare-slot">
        <img src="${p?.image || ''}" alt="${escapeHtml(p?.name || '')}">
        <span class="compare-slot-remove" onclick="toggleCompare('${id}')">×</span>
      </div>`;
    }).join('') + Array(MAX_COMPARE - compareList.length).fill('<div class="compare-slot"><span style="font-size:20px;opacity:0.3">+</span></div>').join('');
  }
}

function openCompareModal() {
  if (compareList.length < 2) { Toast.show('Add at least 2 products to compare', 'warning'); return; }
  const products = compareList.map(getProductById).filter(Boolean);
  const modal = document.getElementById('compareModal');
  const body = document.getElementById('compareBody');
  if (!modal || !body) return;

  const allSpecKeys = [...new Set(products.flatMap(p => Object.keys(p.specs)))];

  body.innerHTML = `
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="padding:12px;text-align:left;color:var(--color-text-muted);border-bottom:1px solid var(--color-border)">Feature</th>
            ${products.map(p => `<th style="padding:12px;text-align:center;border-bottom:1px solid var(--color-border)">
              <img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-bottom:6px;display:block;margin-left:auto;margin-right:auto">
              <div style="font-weight:700;font-size:13px">${escapeHtml(truncate(p.name, 30))}</div>
              <div style="color:var(--color-primary);font-family:var(--font-mono)">${formatPrice(p.price)}</div>
            </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--color-border)">
            <td style="padding:12px;font-weight:600;color:var(--color-text-muted)">Rating</td>
            ${products.map(p => `<td style="padding:12px;text-align:center;color:var(--color-warning)">${p.rating} ★</td>`).join('')}
          </tr>
          <tr style="border-bottom:1px solid var(--color-border)">
            <td style="padding:12px;font-weight:600;color:var(--color-text-muted)">Brand</td>
            ${products.map(p => `<td style="padding:12px;text-align:center;">${escapeHtml(p.brand)}</td>`).join('')}
          </tr>
          ${allSpecKeys.map(key => `
            <tr style="border-bottom:1px solid var(--color-border)">
              <td style="padding:12px;font-weight:600;color:var(--color-text-muted)">${escapeHtml(key)}</td>
              ${products.map(p => `<td style="padding:12px;text-align:center;font-family:var(--font-mono);font-size:12px">${escapeHtml(p.specs[key] || '—')}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add('open');
}

// Wishlist
function toggleWishlist(productId, btn) {
  const wishlist = Storage.get('technova_wishlist', []);
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('wishlisted');
    btn.textContent = '🤍';
    Toast.show('Removed from wishlist', 'info');
  } else {
    wishlist.push(productId);
    btn.classList.add('wishlisted');
    btn.textContent = '❤️';
    Toast.show('Added to wishlist!', 'success');
  }
  Storage.set('technova_wishlist', wishlist);
  document.dispatchEvent(new CustomEvent('wishlistUpdated'));
}

// Recently Viewed
function addToRecentlyViewed(productId) {
  let rv = Storage.get('technova_recently_viewed', []);
  rv = [productId, ...rv.filter(id => id !== productId)].slice(0, 4);
  Storage.set('technova_recently_viewed', rv);
}
