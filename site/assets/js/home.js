(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;

  const label = toggle.querySelector('.visually-hidden');
  const focusable = () => [...nav.querySelectorAll('a[href], button:not([disabled])')];

  function setOpen(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (label) label.textContent = open ? 'Закрыть меню' : 'Открыть меню';
    if (open) focusable()[0]?.focus();
    if (!open && returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); return; }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
  });
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();

(() => {
  const faqGroups = document.querySelectorAll('.home-faq, .product-faq');
  if (!faqGroups.length) return;

  for (const faq of faqGroups) {
    const items = [...faq.querySelectorAll('details')];
    let firstOpenSeen = false;
    for (const item of items) {
      if (!item.open) continue;
      if (!firstOpenSeen) {
        firstOpenSeen = true;
      } else {
        item.open = false;
      }
    }

    for (const item of items) {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        for (const other of items) {
          if (other !== item && other.open) other.open = false;
        }
      });
    }
  }
})();

(() => {
  if (!document.body.classList.contains('page-home')) return;

  const style = document.createElement('style');
  style.textContent = `
    .home-back-to-top {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 40;
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      padding: 0;
      border: 1px solid #2f7d4a;
      border-radius: 50%;
      background: rgba(250, 251, 247, .96);
      color: #17452c;
      box-shadow: 0 8px 24px rgba(23, 69, 44, .14);
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity .2s ease, transform .2s ease, visibility .2s ease, background .2s ease, color .2s ease;
    }
    .home-back-to-top.is-visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .home-back-to-top:hover {
      background: #2f7d4a;
      color: #fff;
    }
    .home-back-to-top:focus-visible {
      outline: 3px solid rgba(47, 125, 74, .28);
      outline-offset: 3px;
    }
    .home-back-to-top svg {
      width: 21px;
      height: 21px;
    }
    @media (max-width: 47.99rem) {
      .home-back-to-top {
        right: 16px;
        bottom: 16px;
        width: 46px;
        height: 46px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .home-back-to-top { transition: none; }
    }
  `;
  document.head.append(style);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'home-back-to-top';
  button.setAttribute('aria-label', 'Наверх');
  button.title = 'Наверх';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 14.5 12 8l6 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.append(button);

  const syncVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > 600);
  };

  button.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', syncVisibility, { passive: true });
  syncVisibility();
})();
