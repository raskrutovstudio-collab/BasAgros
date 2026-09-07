(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  const mobile = window.matchMedia('(max-width: 47.99rem)');
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

  /* Mobile catalogue must always open on 01 / Травосмеси.
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
