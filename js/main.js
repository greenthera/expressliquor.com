/* ============================================================
   Express Liquor & Wine — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     AGE GATE
     Stores consent in localStorage so it doesn't re-appear.
  ────────────────────────────────────────────────────────── */
  const AGE_KEY = 'elw_age_verified';

  function initAgeGate() {
    const overlay = document.getElementById('ageGate');
    if (!overlay) return;

    // If already verified, hide immediately
    if (localStorage.getItem(AGE_KEY) === '1') {
      overlay.classList.add('hidden');
      return;
    }

    // Show overlay
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const btnYes  = document.getElementById('ageYes');
    const btnNo   = document.getElementById('ageNo');
    const denied  = document.getElementById('ageDenied');

    if (btnYes) {
      btnYes.addEventListener('click', function () {
        localStorage.setItem(AGE_KEY, '1');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          overlay.classList.add('hidden');
          document.body.style.overflow = '';
        }, 400);
      });
    }

    if (btnNo) {
      btnNo.addEventListener('click', function () {
        if (denied) {
          denied.style.display = 'block';
        }
        // Redirect to a neutral page
        setTimeout(() => {
          window.location.href = 'https://www.responsibility.org/';
        }, 1800);
      });
    }
  }

  /* ──────────────────────────────────────────────────────────
     STICKY HEADER
  ────────────────────────────────────────────────────────── */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────────────────────
     MOBILE NAV TOGGLE
  ────────────────────────────────────────────────────────── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
      }
    });

    // Close on nav link click
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     ACTIVE NAV LINK
  ────────────────────────────────────────────────────────── */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ──────────────────────────────────────────────────────────
     GALLERY LIGHTBOX
  ────────────────────────────────────────────────────────── */
  function initLightbox() {
    const lightbox   = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn   = document.getElementById('lightboxClose');
    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        const img = item.querySelector('img');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ──────────────────────────────────────────────────────────
     PRODUCTS TABS
  ────────────────────────────────────────────────────────── */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        // Products filtering is visual-only for static site
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     HOURS — HIGHLIGHT TODAY
  ────────────────────────────────────────────────────────── */
  function initHoursHighlight() {
    const rows = document.querySelectorAll('.hours-table tr[data-day]');
    if (!rows.length) return;
    const today = new Date().getDay(); // 0 = Sun
    rows.forEach(function (row) {
      if (parseInt(row.dataset.day, 10) === today) {
        row.classList.add('hours-today');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const headerH = document.querySelector('.header')
            ? document.querySelector('.header').offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     COUNTER ANIMATION
  ────────────────────────────────────────────────────────── */
  function animateCounter(el, end, duration) {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(function () {
      start += step;
      if (start >= end) {
        el.textContent = end + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + (el.dataset.suffix || '');
      }
    }, 16);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const end = parseInt(el.dataset.count, 10);
          animateCounter(el, end, 1500);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ──────────────────────────────────────────────────────────
     BACK TO TOP FAB
  ────────────────────────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.getElementById('fabTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────────────────
     INIT ALL
  ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initAgeGate();
    initHeader();
    initMobileNav();
    initActiveNav();
    initReveal();
    initLightbox();
    initTabs();
    initHoursHighlight();
    initSmoothScroll();
    initCounters();
    initBackToTop();
  });

})();
