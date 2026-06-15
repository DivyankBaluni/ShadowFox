// wishlist.js — Wishlist page rendering and management

function initWishlistPage() {
  renderWishlist();
  document.addEventListener('wishlistUpdated', renderWishlist);
}

function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const countLabel = document.getElementById('wishlistCountLabel');
  if (!grid) return;

  const wishlist = Storage.get('technova_wishlist', []);
  if (countLabel) {
    countLabel.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}`;
  }

  if (!wishlist.length) {
    grid.innerHTML = `
      <div class="wishlist-empty">
        <div style="font-size:64px;margin-bottom:16px">❤️</div>
        <h3 style="font-family:var(--font-heading);font-size:24px;font-weight:700;margin-bottom:8px">Your wishlist is empty</h3>
        <p style="color:var(--color-text-muted);margin-bottom:24px">Explore premium electronics and save your favorites here!</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>`;
    return;
  }

  const products = wishlist.map(getProductById).filter(Boolean);
  grid.innerHTML = products.map(p => buildProductCard(p)).join('');
  attachWishlistCardEvents(grid);
}

function attachWishlistCardEvents(container) {
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
      if (typeof openQuickView === 'function') {
        openQuickView(btn.dataset.id);
      }
    });
  });

  // Wishlist (Remove)
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const productId = btn.dataset.id;
      const wishlist = Storage.get('technova_wishlist', []);
      const idx = wishlist.indexOf(productId);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        Storage.set('technova_wishlist', wishlist);
        Toast.show('Removed from wishlist', 'info');
        document.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    });
  });

  // Compare
  container.querySelectorAll('.compare-btn-card').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (typeof toggleCompare === 'function') {
        toggleCompare(btn.dataset.id);
      }
    });
  });
}
