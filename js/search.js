// מ.ר.ל.מ - מרכז רפואי לחיות מחמד | חיפוש באתר

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('search-toggle');
  const panel = document.getElementById('site-search');
  const form = document.getElementById('site-search-form');
  const input = document.getElementById('site-search-input');
  const closeBtn = document.getElementById('site-search-close');
  const resultsEl = document.getElementById('site-search-results');
  const emptyEl = document.getElementById('site-search-empty');
  const index = window.SITE_SEARCH_INDEX || [];

  if (toggle && panel && input) {
    const openPanel = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      input.focus();
    };
    const closePanel = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      if (panel.hidden) openPanel(); else closePanel();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (form) form.addEventListener('submit', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) closePanel();
    });
    document.addEventListener('click', (e) => {
      if (panel.hidden) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closePanel();
    });

    const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const highlight = (text, query) => {
      const safe = escapeHtml(text);
      if (!query) return safe;
      const re = new RegExp('(' + escapeRegex(query) + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    };

    const render = (query) => {
      const q = query.trim();
      resultsEl.innerHTML = '';
      if (!q) {
        emptyEl.hidden = true;
        return;
      }
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = index.filter((item) => {
        const haystack = (item.title + ' ' + item.snippet + ' ' + (item.keywords || '')).toLowerCase();
        return terms.every((term) => haystack.includes(term));
      }).slice(0, 8);

      if (!matches.length) {
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;

      const firstTerm = terms[0];
      matches.forEach((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.innerHTML =
          '<span class="result-title">' + highlight(item.title, firstTerm) +
          '<span class="result-page">' + escapeHtml(item.page) + '</span></span>' +
          '<span class="result-snippet">' + highlight(item.snippet, firstTerm) + '</span>';
        li.appendChild(a);
        resultsEl.appendChild(li);
      });
    };

    input.addEventListener('input', () => render(input.value));
  }

  /* Arriving via a search result that points at an FAQ answer: open it and scroll to it */
  if (location.hash.indexOf('#faq-panel-') === 0) {
    const panelEl = document.getElementById(location.hash.slice(1));
    const item = panelEl ? panelEl.closest('.faq-item') : null;
    const q = item ? item.querySelector('.faq-q') : null;
    if (item && q && panelEl) {
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const a = openItem.querySelector('.faq-a');
          if (a) a.style.maxHeight = null;
        }
      });
      item.classList.add('open');
      panelEl.style.maxHeight = panelEl.scrollHeight + 'px';
      q.setAttribute('aria-expanded', 'true');
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }
});
