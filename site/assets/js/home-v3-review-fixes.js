(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  /* Every neighbouring pair shares the exact same top and lower endpoint.
     With equal media geometry the four outlines read as one continuous wave. */
  const terrainPaths = [
    'M0 10 C14 7 28 6 42 9 C58 13 74 16 100 13 L100 82 C82 80 68 84 54 86 C38 89 19 82 0 79 Z',
    'M0 13 C16 10 31 12 48 8 C65 4 81 5 100 8 L100 78 C82 82 67 86 52 84 C35 82 18 78 0 82 Z',
    'M0 8 C15 5 31 6 47 10 C63 14 80 15 100 12 L100 84 C82 81 68 83 53 87 C36 90 18 84 0 78 Z',
    'M0 12 C16 9 32 10 48 7 C65 4 82 5 100 9 L100 80 C82 83 67 87 52 86 C35 85 18 81 0 84 Z'
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
