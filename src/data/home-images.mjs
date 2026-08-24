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
    ...pair('hero-field', 920, 720, 720, 480),
    alt: 'Поле кормовых трав',
    sizes: '(min-width: 64rem) min(46vw, 920px), calc(100vw - 1.5rem)',
    priority: true
  },
  espartset: {
    ...pair('product-espartset', 640, 520, 480, 360),
    alt: 'Эспарцет',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  lyutserna: {
    ...pair('product-lyutserna', 640, 520, 480, 360),
    alt: 'Люцерна',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  'travosmes-kormovaya': {
    ...pair('product-kormovaya', 640, 520, 480, 360),
    alt: 'Кормовой травостой',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  'travosmes-universalnaya': {
    ...pair('product-universalnaya', 640, 520, 480, 360),
    alt: 'Травостой на поле',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  fatseliya: {
    ...pair('product-fatseliya', 640, 520, 480, 360),
    alt: 'Фацелия',
    sizes: '(min-width: 64rem) min(20vw, 280px), (min-width: 48rem) 28vw, 38vw'
  },
  representative: {
    ...pair('purpose-botanical', 720, 800, 640, 560),
    alt: 'Фацелия',
    sizes: '(min-width: 64rem) min(28vw, 420px), calc(100vw - 1.5rem)'
  },
  warehouse: {
    ...pair('about-field', 640, 480, 480, 360),
    alt: 'Поле кормовых культур',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  seeds: {
    ...pair('about-seeds', 640, 480, 480, 360),
    alt: 'Семена крупным планом',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  shipping: {
    ...pair('about-machinery', 640, 480, 480, 360),
    alt: 'Сельскохозяйственная техника в поле',
    sizes: '(min-width: 64rem) min(18vw, 300px), 44vw'
  },
  'article-1': {
    ...pair('product-kormovaya', 640, 520, 480, 360),
    alt: 'Кормовые культуры на поле',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  },
  'article-2': {
    ...pair('article-lyutserna', 960, 540, 720, 405),
    alt: 'Поле люцерны',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  },
  'article-3': {
    ...pair('article-travostoy', 960, 540, 720, 405),
    alt: 'Кормовой травостой',
    sizes: '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)'
  }
};
