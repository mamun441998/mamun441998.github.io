/* Portfolio JS — Mamunur Rashid
   Lean, conflict-free, performance-optimized.
   - Single rAF-batched scroll handler
   - IntersectionObserver for reveal animations
   - Stats counter that preserves + and % suffixes
   - Mobile menu without inline-style conflicts
   - All hover effects handled by CSS (no inline-style fights)
*/
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initRevealOnScroll();
    initSmoothAnchors();
    initScrollHandler();
    initMobileMenu();
    initStatsCounter();
    initFooterYear();
    initScrollProgressBar();
  });

  // -------- Reveal on scroll (IntersectionObserver) --------
  function initRevealOnScroll() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
    var targets = document.querySelectorAll(
      '.service-card, .portfolio-card, .reason-card, .about-text, .highlight-item, .contact-info-item, .stat-item'
    );
    if (!targets.length) return;
    targets.forEach(function (el) { el.classList.add('animate-on-scroll'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // -------- Smooth anchor scroll with header offset --------
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = this.getAttribute('href');
        if (!hash || hash === '#') return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  // -------- Single batched scroll handler --------
  function initScrollHandler() {
    var navbar = document.getElementById('navbar');
    var progress = document.querySelector('.scroll-progress');
    var ticking = false;

    function update() {
      var y = window.pageYOffset;
      if (navbar) navbar.classList.toggle('scrolled', y > 50);
      if (progress) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
        progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initScrollProgressBar() {
    if (document.querySelector('.scroll-progress')) return;
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
  }

  // -------- Mobile menu (single source of truth) --------
  function initMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    var toggle = document.querySelector('.mobile-toggle');
    if (!menu || !toggle) return;

    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.setAttribute('aria-expanded', 'false');

    // Replace any inline-onclick toggling by handling here
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!menu.classList.contains('open'));
    });

    // Close on link click inside menu
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    // Close when clicking outside menu
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // -------- Stats counter (preserves + and %) --------
  function initStatsCounter() {
    var grid = document.querySelector('.stats-grid');
    if (!grid || prefersReducedMotion) return;
    var stats = grid.querySelectorAll('.stat-value');
    if (!stats.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        stats.forEach(function (el) {
          var raw = el.textContent.trim();
          var match = raw.match(/(\d+)([^\d]*)/);
          if (!match) return;
          var target = parseInt(match[1], 10);
          var suffix = match[2] || '';
          animateNumber(el, target, suffix, 1600);
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    io.observe(grid);
  }

  function animateNumber(el, target, suffix, duration) {
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 4);
      var current = Math.floor(target * eased);
      el.textContent = current + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(frame);
  }

  // -------- Footer year --------
  function initFooterYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }
})();
