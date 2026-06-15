// gallery.js — Image gallery for PDP
function initGallery(images) {
  const mainImg = document.getElementById('galleryMain');
  const thumbsContainer = document.getElementById('galleryThumbs');
  if (!mainImg || !thumbsContainer || !images.length) return;

  let current = 0;

  function setImage(idx) {
    current = idx;
    mainImg.src = images[idx];
    mainImg.alt = `Product image ${idx + 1}`;
    thumbsContainer.querySelectorAll('.gallery-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  }

  // Build thumbnails
  thumbsContainer.innerHTML = images.map((src, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" role="button" tabindex="0"
         aria-label="View image ${i + 1}">
      <img src="${src}" alt="Product thumbnail ${i + 1}" loading="lazy">
    </div>
  `).join('');

  thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => setImage(+thumb.dataset.idx));
    thumb.addEventListener('keydown', e => { if (e.key === 'Enter') setImage(+thumb.dataset.idx); });
  });

  // Keyboard nav on main image
  mainImg.parentElement.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') setImage((current + 1) % images.length);
    if (e.key === 'ArrowLeft') setImage((current - 1 + images.length) % images.length);
  });

  setImage(0);
}
