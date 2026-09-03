const PREFIX = '/assets/img/home';

function pair(id, wide, tall, mobileWide, mobileTall) {
  return {
    width: wide,
    height: tall,
    fallback: `${PREFIX}/${id}-${wide}.webp`,
    avif: [
      { src: `${PREFIX}/${id}-${mobileWide}.avif`, w: mobileWide },
      { src: `${PREFIX}/${id}-${wide}.avif`, w: wide }
    ],
    webp: [
      { src: `${PREFIX}/${id}-${mobileWide}.webp`, w: mobileWide },
      { src: `${PREFIX}/${id}-${wide}.webp`, w: wide }
    ]
  };
}

export const HOME_IMAGES = {
  hero: {
    ...pair('hero-v3-machinery', 1672, 941, 900, 506),
    alt: 'Сельскохозяйственная техника выполняет посев в поле на закате',
    sizes: '100vw',
    priority: true
  },
  espartset: {
    ...pair('product-espartset', 640, 520, 480, 360),
    alt: 'Эспарцет',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  lyutserna: {
    ...pair('article-lyutserna', 960, 540, 720, 405),
    alt: 'Поле люцерны',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  'travosmes-kormovaya': {
    ...pair('ref-pasture', 640, 520, 480, 360),
    alt: 'Коровы на зелёном пастбище',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  'travosmes-universalnaya': {
    ...pair('ref-forage', 640, 520, 480, 360),
    alt: 'Плотный травостой кормовых культур',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  fatseliya: {
    ...pair('ref-phacelia', 640, 520, 480, 360),
    alt: 'Цветущее поле фацелии',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  representative: {
    ...pair('purpose-botanical', 720, 800, 640, 560),
    alt: 'Фацелия',
    sizes: '(min-width: 64rem) min(28vw, 420px), calc(100vw - 1.5rem)'
  },
  warehouse: {
    ...pair('ref-hero-field', 920, 720, 720, 480),
    alt: 'Поля кормовых культур',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  seeds: {
    ...pair('ref-seeds', 640, 480, 480, 360),
    alt: 'Семена трав крупным планом',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  shipping: {
    ...pair('about-machinery', 640, 480, 480, 360),
    alt: 'Сельскохозяйственная техника в поле',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  'article-1': {
    ...pair('ref-hay', 640, 520, 480, 360),
    alt: 'Поле с заготовленным сеном',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  },
  'article-2': {
    ...pair('article-lyutserna', 960, 540, 720, 405),
    alt: 'Поле люцерны',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  },
  'article-3': {
    ...pair('ref-forage', 960, 540, 720, 405),
    alt: 'Густой посев кормовой культуры',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  },
  sorgo: {
    ...pair('ref-sorghum', 640, 520, 480, 360),
    alt: 'Поле сорго с созревшими метёлками',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  quality: {
    ...pair('ref-lab', 960, 540, 720, 405),
    alt: 'Работа с образцами семян и документами',
    sizes: '(min-width: 64rem) min(42vw, 560px), calc(100vw - 1.5rem)'
  }
};
