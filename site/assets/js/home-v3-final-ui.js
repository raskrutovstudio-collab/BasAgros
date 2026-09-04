(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  /* Restore the missing Home item without touching other destinations. */
  const navList = document.querySelector('.home-header .home-nav > ul');
  if (navList && ![...navList.querySelectorAll(':scope > li > a')].some((a) => a.textContent.trim() === 'Главная')) {
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = '/';
    anchor.textContent = 'Главная';
    anchor.setAttribute('aria-current', 'page');
    item.append(anchor);
    navList.prepend(item);
  }

  /* Remove the legacy pictograms from every B2B scenario card. The imagery and
     typography are strong enough on their own and now carry the hierarchy. */
  document.querySelectorAll([
    '#audience .audience-scene-icon',
    '#audience .audience-scene-eyebrow .home-icon',
    '#audience .audience-scene-features .home-icon'
  ].join(',')).forEach((node) => node.remove());

  /* Remove the old circular arrow badges from catalogue cards. The text CTA is
     retained, matching the cleaner Popular crops interaction language. */
  document.querySelectorAll('.home-catalog .home-category-arrow').forEach((node) => node.remove());

  /* Bring catalogue silhouettes closer to Popular crops: the photo continues
     almost to the bottom and the copy floats over a dark readability gradient. */
  const terrainPaths = [
    'M0 10 C14 7 28 6 42 9 C58 13 74 16 100 13 L100 94 C82 92 68 95 54 97 C38 98 19 94 0 95 Z',
    'M0 13 C16 10 31 12 48 8 C65 4 81 5 100 8 L100 95 C82 97 67 98 52 96 C35 94 18 93 0 95 Z',
    'M0 8 C15 5 31 6 47 10 C63 14 80 15 100 12 L100 95 C82 93 68 95 53 97 C36 98 18 95 0 94 Z',
    'M0 12 C16 9 32 10 48 7 C65 4 82 5 100 9 L100 95 C82 97 67 98 52 97 C35 96 18 94 0 96 Z'
  ];
  const normalizedPath = (path) => path.replace(/-?\d*\.?\d+/g, (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? String(Number((number / 100).toFixed(4))) : value;
  });
  terrainPaths.forEach((path, index) => {
    document.querySelector(`#home-catalog-terrain-clip-${index} path`)?.setAttribute('d', normalizedPath(path));
    document.querySelector(`.home-category-${index + 1} .home-catalog-media-outline-line`)?.setAttribute('d', path);
  });
})();
