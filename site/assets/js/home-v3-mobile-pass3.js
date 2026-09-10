(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  const mobile = window.matchMedia('(max-width: 47.99rem)');

  /* Persistent mobile quick actions. Kept in the existing deferred homepage
     bundle so it adds no extra network request. */
  if (!document.querySelector('.home-mobile-quickbar')) {
    const quickbar = document.createElement('nav');
    quickbar.className = 'home-mobile-quickbar';
    quickbar.setAttribute('aria-label', 'Быстрые действия');
    quickbar.innerHTML = `
      <a class="home-mobile-quickbar-item" href="tel:+77059608987" aria-label="Позвонить в BAS Agros">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Позвонить</span>
      </a>
      <a class="home-mobile-quickbar-item home-mobile-quickbar-item--accent" href="https://wa.me/77059608987?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20BAS%20Agros" target="_blank" rel="noopener" aria-label="Написать BAS Agros в WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.3 4.7A9.1 9.1 0 0 0 5 15.7L3.8 20l4.4-1.2A9.1 9.1 0 0 0 19.3 4.7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.7 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.7 1.3 1.8 2.4 3.2 3 .3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .5-.3 1.4-.8 1.9-.6.6-1.5.9-2.4.8-1.4-.2-3.1-.8-5-2.5-1.4-1.4-2.5-3-2.8-4.3-.3-1.1-.1-2 .5-2.8Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>WhatsApp</span>
      </a>
      <a class="home-mobile-quickbar-item" href="/catalog/" aria-label="Открыть каталог BAS Agros">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/></svg>
        <span>Каталог</span>
      </a>`;
    document.body.append(quickbar);
  }

  const button = document.querySelector('.home-back-to-top');

  if (button) {
    const sync = () => {
      if (!mobile.matches) return;
      const threshold = Math.max(1050, window.innerHeight * 1.45);
      if (window.scrollY < threshold) button.classList.remove('is-visible');
    };

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    mobile.addEventListener?.('change', sync);
    sync();
  }

  /* Mobile ecosystem showcase must always open on its first direction.
     Browsers may restore an inner horizontal scroll position on reload/back,
     which previously left card 01 fully outside the viewport while progress
     still showed step 01 as active. */
  const catalog = document.querySelector('.home-catalog.home-catalog-lux-ready');
  const rail = catalog?.querySelector('.home-category-grid');
  const cards = rail ? [...rail.querySelectorAll(':scope > .home-category')] : [];
  const steps = catalog ? [...catalog.querySelectorAll('[data-catalog-step]')] : [];
  if (!catalog || !rail || !cards.length) return;

  let userHasMovedRail = false;
  let resetTimerA = 0;
  let resetTimerB = 0;

  const markInteraction = () => { userHasMovedRail = true; };

  const showFirst = () => {
    if (!mobile.matches || userHasMovedRail) return;
    rail.scrollTo({ left: 0, behavior: 'auto' });
    rail.scrollLeft = 0;
    cards.forEach((card, index) => card.classList.toggle('is-active', index === 0));
    steps.forEach((step, index) => {
      const active = index === 0;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  ['pointerdown', 'touchstart', 'wheel'].forEach((type) => {
    rail.addEventListener(type, markInteraction, { passive: true, once: true });
  });
  rail.addEventListener('keydown', markInteraction, { once: true });

  const syncProgress = () => {
    if (!mobile.matches || !steps.length || !cards.length) return;
    const railBox = rail.getBoundingClientRect();
    const targetX = railBox.left + Math.min(rail.clientWidth * .18, 64);
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const current = Math.abs(box.left - targetX);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    steps.forEach((step, index) => {
      const active = index === nearest;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  rail.addEventListener('scroll', () => requestAnimationFrame(syncProgress), { passive: true });

  const scheduleReset = () => {
    window.clearTimeout(resetTimerA);
    window.clearTimeout(resetTimerB);
    requestAnimationFrame(showFirst);
    resetTimerA = window.setTimeout(showFirst, 120);
    resetTimerB = window.setTimeout(showFirst, 650);
  };

  window.addEventListener('pageshow', scheduleReset);
  window.addEventListener('load', scheduleReset, { once: true });
  mobile.addEventListener?.('change', (event) => {
    if (event.matches) {
      userHasMovedRail = false;
      scheduleReset();
    }
  });

  scheduleReset();
})();
