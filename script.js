// script.js — handling navigation, reveal animations, skills animation, contact form simulation

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        closeMobileNav();
      }
    });
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  function openMobileNav() {
    mainNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMobileNav(); else openMobileNav();
  });

  // IntersectionObserver for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // once visible, unobserve to save performance
        revealObserver.unobserve(entry.target);

        // If element has progress bars inside, animate them
        entry.target.querySelectorAll && entry.target.querySelectorAll('.progress').forEach(el => animateProgress(el));
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Animate progress bar
  function animateProgress(progressEl) {
    const bar = progressEl.querySelector('span');
    const value = parseInt(progressEl.getAttribute('data-progress') || '0', 10);
    // slight timeout for nicer stagger
    setTimeout(() => {
      bar.style.width = Math.max(0, Math.min(100, value)) + '%';
    }, 120);
  }

  // Also observe skills section to animate all progress bars at once
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.progress').forEach(el => animateProgress(el));
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    skillsObserver.observe(skillsSection);
  }

  // Active nav link on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // Contact form simulation + validation
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // simple front-end validation
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        status.textContent = 'Mohon lengkapi semua bidang.';
        status.style.color = 'crimson';
        return;
      }
      status.textContent = 'Mengirim...';
      status.style.color = 'var(--muted)';
      // simulate network delay
      setTimeout(() => {
        status.textContent = 'Pesan berhasil dikirim! Terima kasih 😊';
        status.style.color = 'green';
        form.reset();
      }, 900);
    });
  }

  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Accessibility: close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMobileNav();
  }, { passive: true });

  // Small perf: reduce motion for users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('visible');
    });
    document.querySelectorAll('.progress span').forEach(span => {
      const parent = span.closest('.progress');
      if (parent) span.style.width = parent.getAttribute('data-progress') + '%';
    });
  }
});