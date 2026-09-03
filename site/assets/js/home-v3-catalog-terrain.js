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

  if (desktop.matches && finePointer.matches) clearActive();

  grid.addEventListener('pointerleave', () => {
    if (!desktop.matches || !finePointer.matches) return;
    clearActive();
  });

  grid.addEventListener('pointermove', (event) => {
    if (!desktop.matches || !finePointer.matches) return;
    const card = event.target.closest?.('[data-catalog-card]');
    if (!card || !grid.contains(card) || card.classList.contains('is-active')) return;
    const index = Number(card.dataset.catalogCard);
    if (!Number.isInteger(index)) return;
    steps[index]?.click();
  }, { passive: true });
})();

/* Popular crops — reference-driven sculpted showcase. */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  if (!document.querySelector('link[data-home-v3-crops-lux]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('assets/css/home-v3-crops-lux.css?v=20260904-1', window.location.href).href;
    stylesheet.dataset.homeV3CropsLux = '';
    document.head.append(stylesheet);
  }

  const section = document.querySelector('.home-crops');
  const rail = section?.querySelector('[data-crop-rail]');
  const items = rail ? [...rail.querySelectorAll(':scope > li')] : [];
  const previous = section?.querySelector('[data-crop-prev]');
  const next = section?.querySelector('[data-crop-next]');
  const heading = section?.querySelector('.home-crops-side h2');
  if (!section || !rail || items.length !== 6 || section.classList.contains('home-crops-lux-ready')) return;

  section.classList.add('home-crops-lux-ready');
  if (heading) heading.innerHTML = 'Популярные <em>культуры</em>';

  const descriptions = [
    'Высокая питательность и стабильная урожайность',
    'Устойчивость к засухе и обогащение почвы',
    'Быстрый рост и высокая урожайность зелёной массы',
    'Холодостойкость и отличное качество корма',
    'Улучшение структуры почвы и привлечение опылителей',
    'Сбалансированный состав для продуктивной кормовой базы'
  ];

  const shapes = [
    'M0 8 C14 4 27 5 39 9 C52 14 64 15 75 10 C84 6 92 5 100 7 L100 91 C89 88 78 89 67 93 C54 98 43 97 31 93 C19 89 9 89 0 91 Z',
    'M0 7 C12 3 24 4 36 8 C50 13 62 15 74 11 C84 7 92 6 100 8 L100 90 C88 87 77 89 66 94 C53 99 41 98 29 94 C18 90 9 90 0 92 Z',
    'M0 8 C13 5 25 5 37 9 C50 13 63 14 75 10 C85 7 93 6 100 8 L100 91 C89 88 78 89 66 93 C54 97 42 97 30 94 C18 90 9 90 0 91 Z',
    'M0 9 C13 5 26 6 38 10 C51 14 63 14 75 10 C85 6 93 6 100 8 L100 90 C89 87 78 89 67 93 C55 97 43 96 31 93 C19 89 9 90 0 92 Z',
    'M0 8 C13 4 27 5 40 9 C54 13 66 14 78 10 C87 7 94 7 100 9 L100 91 C89 87 77 88 65 92 C52 96 40 96 28 93 C17 90 8 90 0 91 Z',
    'M0 7 C14 4 28 5 41 9 C54 13 67 14 78 10 C87 7 94 6 100 8 L100 90 C88 87 76 88 64 92 C52 96 40 96 28 93 C17 89 8 90 0 92 Z'
  ];

  const normalizedPath = (path) => path.replace(/-?\d*\.?\d+/g, (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? String(Number((number / 100).toFixed(4))) : value;
  });

  const defsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defsSvg.classList.add('home-crops-lux-defs');
  defsSvg.setAttribute('aria-hidden', 'true');
  defsSvg.setAttribute('focusable', 'false');
  defsSvg.style.position = 'absolute';
  defsSvg.style.width = '0';
  defsSvg.style.height = '0';
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  shapes.forEach((shape, index) => {
    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clip.id = `home-crop-lux-clip-${index}`;
    clip.setAttribute('clipPathUnits', 'objectBoundingBox');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', normalizedPath(shape));
    clip.append(path);
    defs.append(clip);
  });
  defsSvg.append(defs);
  section.prepend(defsSvg);

  items.forEach((item, index) => {
    const anchor = item.querySelector(':scope > a');
    const media = anchor?.querySelector('.home-media');
    const titleNode = anchor?.querySelector(':scope > span');
    const legacyArrow = anchor?.querySelector(':scope > b');
    if (!anchor || !media || !titleNode) return;

    const title = titleNode.textContent.trim();
    const clipValue = `url(#home-crop-lux-clip-${index})`;
    media.style.clipPath = clipValue;
    media.style.webkitClipPath = clipValue;

    titleNode.remove();
    legacyArrow?.remove();

    const copy = document.createElement('span');
    copy.className = 'home-crop-lux-copy';
    copy.innerHTML = `<strong class="home-crop-lux-title">${title}</strong><small class="home-crop-lux-desc">${descriptions[index]}</small><span class="home-crop-lux-arrow" aria-hidden="true">↗</span>`;
    anchor.append(copy);

    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    outline.classList.add('home-crop-lux-outline');
    outline.setAttribute('viewBox', '0 0 100 100');
    outline.setAttribute('preserveAspectRatio', 'none');
    outline.setAttribute('aria-hidden', 'true');
    outline.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', shapes[index]);
    outline.append(path);
    anchor.append(outline);

    anchor.addEventListener('pointermove', (event) => {
      const rect = anchor.getBoundingClientRect();
      anchor.style.setProperty('--crop-mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      anchor.style.setProperty('--crop-my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    }, { passive: true });
  });

  let activeIndex = -1;
  let clearTimer = 0;

  const setActive = (index, temporary = false) => {
    window.clearTimeout(clearTimer);
    activeIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === activeIndex));
    if (temporary) clearTimer = window.setTimeout(() => {
      items.forEach((item) => item.classList.remove('is-active'));
      activeIndex = -1;
    }, 1500);
  };

  items.forEach((item, index) => {
    item.addEventListener('pointerenter', () => setActive(index));
    item.addEventListener('pointerleave', () => {
      item.classList.remove('is-active');
      if (activeIndex === index) activeIndex = -1;
    });
    item.querySelector('a')?.addEventListener('focus', () => setActive(index));
    item.querySelector('a')?.addEventListener('blur', () => {
      item.classList.remove('is-active');
      if (activeIndex === index) activeIndex = -1;
    });
  });

  previous?.addEventListener('click', () => setActive(activeIndex < 0 ? items.length - 1 : activeIndex - 1, true));
  next?.addEventListener('click', () => setActive(activeIndex < 0 ? 0 : activeIndex + 1, true));
})();