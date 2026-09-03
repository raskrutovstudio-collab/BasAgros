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

  /*
    One closed terrain silhouette per photograph. These paths are used twice:
    1. as objectBoundingBox SVG clipPaths that physically crop the photograph;
    2. as visible gold strokes in the same 100x100 coordinate system.
    This guarantees that the image and its contour can never drift apart.
  */
  const terrainPaths = [
    'M0 11 C11 7 22 8 34 6 C48 3 62 4 75 7 C86 9 94 7 100 9 L100 81 C88 78 76 80 63 84 C49 88 34 86 21 82 C11 79 5 80 0 79 Z',
    'M0 14 C10 8 21 5 33 5 C46 5 59 7 71 10 C83 13 92 11 100 14 L100 78 C88 82 75 86 61 87 C47 87 35 82 23 77 C13 73 6 72 0 74 Z',
    'M0 10 C12 7 24 8 36 6 C49 4 62 5 74 8 C85 11 94 10 100 11 L100 80 C88 82 76 86 63 87 C49 88 36 85 23 81 C13 78 6 79 0 78 Z',
    'M0 13 C11 9 23 10 35 8 C48 6 61 7 74 6 C86 5 94 6 100 9 L100 81 C88 84 76 87 63 87 C49 87 36 84 23 81 C13 79 6 80 0 80 Z'
  ];

  const normalizedPath = (path) => path.replace(/-?\d*\.?\d+/g, (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? String(Number((number / 100).toFixed(4))) : value;
  });

  let defsSvg = section.querySelector('.home-catalog-terrain-defs');
  if (!defsSvg) {
    defsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    defsSvg.classList.add('home-catalog-terrain-defs');
    defsSvg.setAttribute('aria-hidden', 'true');
    defsSvg.setAttribute('focusable', 'false');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    terrainPaths.forEach((path, index) => {
      const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clip.id = `home-catalog-terrain-clip-${index}`;
      clip.setAttribute('clipPathUnits', 'objectBoundingBox');
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      clipPath.setAttribute('d', normalizedPath(path));
      clip.append(clipPath);
      defs.append(clip);
    });

    defsSvg.append(defs);
    section.prepend(defsSvg);
  }

  cards.forEach((card, index) => {
    const media = card.querySelector('.home-category-media');
    const imageLayer = media?.querySelector('.home-media');
    if (!media || !imageLayer) return;

    /* Remove the previous decorative-only curves. */
    media.querySelectorAll('.home-catalog-media-cap, .home-catalog-media-wave, .home-catalog-media-outline').forEach((element) => element.remove());

    const clipId = `home-catalog-terrain-clip-${index}`;
    const clipValue = `url(#${clipId})`;
    imageLayer.style.clipPath = clipValue;
    imageLayer.style.webkitClipPath = clipValue;
    media.style.setProperty('--catalog-terrain-clip', clipValue);

    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    outline.classList.add('home-catalog-media-outline');
    outline.setAttribute('viewBox', '0 0 100 100');
    outline.setAttribute('preserveAspectRatio', 'none');
    outline.setAttribute('aria-hidden', 'true');
    outline.setAttribute('focusable', 'false');
    const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outlinePath.classList.add('home-catalog-media-outline-line');
    outlinePath.setAttribute('d', terrainPaths[index]);
    outline.append(outlinePath);
    media.append(outline);
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

  /* Initial desktop state is neutral until the user actually interacts. */
  if (desktop.matches && finePointer.matches) clearActive();

  grid.addEventListener('pointerleave', () => {
    if (!desktop.matches || !finePointer.matches) return;
    clearActive();
  });

  /*
    site-config keeps its own active index. After a neutral reset that index can
    still point at the previous card, so re-entering the same card would be a
    no-op there. Clicking its progress control resynchronises that internal
    state without duplicating the catalogue animation logic.
  */
  grid.addEventListener('pointermove', (event) => {
    if (!desktop.matches || !finePointer.matches) return;
    const card = event.target.closest?.('[data-catalog-card]');
    if (!card || !grid.contains(card) || card.classList.contains('is-active')) return;
    const index = Number(card.dataset.catalogCard);
    if (!Number.isInteger(index)) return;
    steps[index]?.click();
  }, { passive: true });
})();