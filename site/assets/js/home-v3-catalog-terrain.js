(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const section = document.querySelector('.home-catalog.home-catalog-lux-ready');
  const grid = section?.querySelector('.home-category-grid');
  const cards = grid ? [...grid.querySelectorAll('[data-catalog-card]')] : [];
  const progress = section?.querySelector('.home-catalog-lux-progress');
  const steps = progress ? [...progress.querySelectorAll('[data-catalog-step]')] : [];
  if (!section || !grid || cards.length !== 4) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const capPaths = [
    'M0 18 C10 12 21 13 31 10 C43 6 55 7 66 10 C78 13 88 10 100 12',
    'M0 20 C11 12 22 8 34 7 C47 6 59 8 70 11 C82 14 91 12 100 16',
    'M0 15 C13 12 24 13 36 10 C49 7 61 8 73 11 C84 14 92 13 100 14',
    'M0 18 C12 14 24 15 36 13 C48 11 62 12 74 10 C85 8 93 9 100 12'
  ];

  cards.forEach((card, index) => {
    const media = card.querySelector('.home-category-media');
    if (!media || media.querySelector('.home-catalog-media-cap')) return;
    const path = capPaths[index] || capPaths[0];
    media.insertAdjacentHTML('beforeend', `
      <svg class="home-catalog-media-cap" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="home-catalog-media-cap-fill" d="M0 0 H100 V30 L100 12 ${path.replace(/^M0 \d+ /, '')} L0 18 Z"></path>
        <path class="home-catalog-media-cap-line" d="${path}"></path>
      </svg>`);
  });

  const clearActive = () => {
    cards.forEach((card) => {
      card.classList.remove('is-active');
      card.removeAttribute('aria-current');
    });
    steps.forEach((step) => {
      step.classList.remove('is-active');
      step.removeAttribute('aria-current');
    });
    grid.classList.remove('is-switching');
  };

  grid.addEventListener('pointerleave', () => {
    if (!desktop.matches || !finePointer.matches) return;
    clearActive();
  });
})();