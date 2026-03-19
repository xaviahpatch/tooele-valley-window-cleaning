/* ============================================
   TOOELE VALLEY WINDOW CLEANING - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Hamburger / Mobile Nav ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll Animations ----
  const fadeEls = document.querySelectorAll('.fade-up');

  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // ---- Contact Form (Web3Forms) ----
  const contactForm = document.getElementById('quoteForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = '⏳ Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (response.ok && data.success) {
          contactForm.style.display = 'none';
          const successMsg = document.getElementById('formSuccess');
          if (successMsg) successMsg.classList.add('show');
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        const errorMsg = document.getElementById('formError');
        if (errorMsg) errorMsg.classList.add('show');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // ---- Navbar shadow on scroll ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      }
    });
  }

  // ---- Smooth counter animation for trust numbers ----
  const counters = document.querySelectorAll('.trust-num, .hero-stat .num');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-target');
          if (!target) return;

          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1500;
          const start = performance.now();
          const from = 0;
          const to = parseFloat(target);

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(from + (to - from) * ease);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = to + suffix;
            }
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => {
      const text = c.textContent;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');
      if (!isNaN(num)) {
        c.setAttribute('data-target', num);
        c.setAttribute('data-suffix', suffix);
        c.textContent = '0' + suffix;
        counterObserver.observe(c);
      }
    });
  }

});
