// navbar.js — Navbar behavior
function initNavbar() {
  // Mark active nav link
  // const path = window.location.pathname;
  // document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
  //   const href = a.getAttribute("href") || "";
  //   if (
  //     (href.includes("products.html") && path.includes("products")) ||
  //     (href === "index.html" &&
  //       (path.endsWith("/") || path.endsWith("index.html"))) ||
  //     (href.includes("cart.html") && path.includes("cart"))
  //   ) {
  //     a.classList.add("active");
  //   }
  // });
  const currentPath = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (currentPath.endsWith("index.html") && href === "index.html") {
      link.classList.add("active");
    } else if (
      currentPath.includes("products.html") &&
      !category &&
      href === "products.html"
    ) {
      link.classList.add("active");
    } else if (category === "Laptops" && href.includes("category=Laptops")) {
      link.classList.add("active");
    } else if (
      category === "Smartphones" &&
      href.includes("category=Smartphones")
    ) {
      link.classList.add("active");
    } else if (category === "Audio" && href.includes("category=Audio")) {
      link.classList.add("active");
    }
  });

  // Hamburger / mobile menu
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav?.classList.toggle("open");
  });

  // Close mobile menu on link click
  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger?.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });

  // Dark/light mode toggle
  const themeBtn = document.getElementById("themeToggle");
  const saved = Storage.get("technova_theme", "dark");
  document.documentElement.setAttribute(
    "data-theme",
    saved === "light" ? "light" : "",
  );
  updateThemeIcon(themeBtn, saved);

  themeBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "" : "light";
    document.documentElement.setAttribute("data-theme", next);
    Storage.set("technova_theme", next === "light" ? "light" : "dark");
    updateThemeIcon(themeBtn, next === "light" ? "light" : "dark");
  });

  // Search
  initSearch();

  // Cart badge
  Cart.updateBadge();

  // Wishlist badge
  updateWishlistBadge();
  document.addEventListener("wishlistUpdated", () => updateWishlistBadge());

  // Back to top
  const btt = document.querySelector(".back-to-top");
  if (btt) {
    window.addEventListener(
      "scroll",
      () => {
        btt.classList.toggle("show", window.scrollY > 400);
      },
      { passive: true },
    );
    btt.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
}

function updateWishlistBadge() {
  const wishlist = Storage.get("technova_wishlist", []);
  const count = wishlist.length;
  document.querySelectorAll(".wishlist-badge").forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  });
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  btn.setAttribute(
    "title",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode",
  );
}

function initSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  if (!input || !dropdown) return;

  const handleSearch = debounce((query) => {
    if (!query.trim()) {
      dropdown.classList.remove("open");
      return;
    }

    const results = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
    ).slice(0, 6);

    if (!results.length) {
      dropdown.innerHTML = `<div class="search-no-results">No products found for "<strong>${escapeHtml(query)}</strong>"</div>`;
    } else {
      dropdown.innerHTML = results
        .map(
          (p) => `
        <a href="product-detail.html?id=${p.id}" class="search-result-item">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"
               onerror="this.style.display='none'">
          <div class="search-result-info">
            <div class="search-result-name">${escapeHtml(p.name)}</div>
            <div class="search-result-price">${formatPrice(p.price)}</div>
          </div>
        </a>
      `,
        )
        .join("");
    }
    dropdown.classList.add("open");
  }, 200);

  input.addEventListener("input", (e) => handleSearch(e.target.value));
  input.addEventListener("focus", (e) => {
    if (e.target.value) handleSearch(e.target.value);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar")) dropdown.classList.remove("open");
  });

  // If on PLP, search button
  const searchForm = document.getElementById("searchForm");
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (window.location.pathname.includes("products.html")) {
      dropdown.classList.remove("open");
      if (typeof updateSearchFromNavbar === "function") {
        updateSearchFromNavbar(q);
      }
      const newUrl = q
        ? `products.html?search=${encodeURIComponent(q)}`
        : "products.html";
      window.history.pushState({ path: newUrl }, "", newUrl);
    } else {
      if (q)
        window.location.href = `products.html?search=${encodeURIComponent(q)}`;
    }
  });
}
