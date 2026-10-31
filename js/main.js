// מ.ר.ל.מ - מרכז רפואי לחיות מחמד | scripts

document.addEventListener('DOMContentLoaded', () => {
  /* Header scroll shadow */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('is-open'));
    });
  }

  /* Highlight current hours row */
  const hoursRows = document.querySelectorAll('.hours-table tr[data-day]');
  if (hoursRows.length) {
    const dayIndex = new Date().getDay(); // 0 = Sunday
    hoursRows.forEach(row => {
      if (Number(row.dataset.day) === dayIndex) row.classList.add('today');
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
      q.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  /* Hero video pause/play toggle (accessibility: let users stop auto-playing motion) */
  const heroVideo = document.querySelector('.hero-photo-band video');
  const videoToggle = document.querySelector('.video-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (heroVideo) {
    const setToggleLabel = (playing) => {
      if (!videoToggle) return;
      videoToggle.setAttribute('aria-label', playing ? 'השהה את הווידאו' : 'הפעל את הווידאו');
      videoToggle.innerHTML = playing
        ? '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>'
        : '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>';
    };
    if (reducedMotion.matches) {
      heroVideo.pause();
      setToggleLabel(false);
    } else {
      setToggleLabel(true);
    }
    if (videoToggle) {
      videoToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          setToggleLabel(true);
        } else {
          heroVideo.pause();
          setToggleLabel(false);
        }
      });
    }
  }

  /* Quick pill contact forms (header/footer bands) — client-side only for now */
  document.querySelectorAll('.quick-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'תודה, נחזור אליכם!';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 2500);
      // TODO: same backend hookup needed here as the full contact form below.
    });
  });

  /* Contact form (client-side only — no backend wired up yet) */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
      // TODO: חבר לשירות שליחה אמיתי (למשל EmailJS / Formspree / שרת משלכם)
      // לפני שהאתר עולה לאוויר, כדי שההודעות אכן יגיעו לקליניקה.
    });
  }

  /* Career form (client-side only — no backend wired up yet) */
  const careerForm = document.getElementById('career-form');
  if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = careerForm.querySelector('#form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      careerForm.reset();
      // TODO: חבר לשירות שליחה אמיתי (כולל העלאת קובץ קורות חיים) לפני עליית האתר לאוויר.
    });
  }

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
