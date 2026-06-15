// cart.js — Cart state management
const Cart = (() => {
  const KEY = 'technova_cart';

  function getCart() {
    return Storage.get(KEY, []);
  }

  function saveCart(cart) {
    Storage.set(KEY, cart);
    updateBadge();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

  function addToCart(product, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: qty,
        image: product.image
      });
    }
    saveCart(cart);
    Toast.show(`<strong>${truncate(product.name, 30)}</strong> added to cart!`, 'success');
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(i => i.productId !== productId);
    saveCart(cart);
    Toast.show('Item removed from cart', 'info');
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      if (qty <= 0) { removeFromCart(productId); return; }
      item.quantity = qty;
      saveCart(cart);
    }
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  function getCartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  function clearCart() {
    saveCart([]);
  }

  function updateBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    });
  }

  return { getCart, addToCart, removeFromCart, updateQty, getCartCount, getCartTotal, clearCart, updateBadge };
})();
