/* ═══════════════════════════════════════
   DEVU PORTFOLIO — MAIN.JS
═══════════════════════════════════════ */

'use strict';

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 80, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Skill Bar Animation ──
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const width = el.dataset.width || '0';
      setTimeout(() => {
        el.style.width = width + '%';
      }, 200);
      barObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

barFills.forEach(bar => barObserver.observe(bar));

// ── Active Nav Highlight ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact Form ──
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formNote  = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formNote.style.color = '#f87171';
      formNote.textContent = 'Please fill in all fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNote.style.color = '#f87171';
      formNote.textContent = 'Please enter a valid email.';
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate send
    setTimeout(() => {
      formNote.style.color = '#22c55e';
      formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 1500);
  });
}

// ── Smooth cursor glow on hero ──
const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty('--mouse-x', x + 'px');
    hero.style.setProperty('--mouse-y', y + 'px');
  });
}

// ── Parallax orbs on scroll ──
const orb1 = document.querySelector('.hero-orb--1');
const orb2 = document.querySelector('.hero-orb--2');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (orb1) orb1.style.transform = `translate(0, ${sy * 0.15}px)`;
  if (orb2) orb2.style.transform = `translate(0, ${sy * -0.10}px)`;
}, { passive: true });

// ── Active nav link style injection ──
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: #fff; }
.nav-link.active::after { width: 100%; }`;
document.head.appendChild(style);
