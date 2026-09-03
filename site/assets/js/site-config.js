/*
  Публичная конфигурация.
  Здесь допустим URL публичного endpoint/Edge Function.

  НЕЛЬЗЯ размещать здесь:
  - Supabase service-role key;
  - Resend API key;
  - SMTP password;
  - CRM secret;
  - private key.
*/
window.SITE_CONFIG = Object.freeze({
  enabled: true,
  leadEndpoint: 'https://forms.basagros.kz/lead.php'
});

/*
  Desktop audience accordion smoothing.
  Keep the grid tracks in explicit pixel values so interrupted transitions
  continue from the exact rendered position instead of snapping between
  discrete :has() grid templates.
*/
(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const list = document.querySelector('[data-audience-list]');
  const scenes = list ? [...list.querySelectorAll('[data-audience-scene]')] : [];
  if (!list || scenes.length !== 4 || !('MutationObserver' in window)) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 1080;
  const baseWeights = [2.08, 1, 1, 1];
  let frame = 0;

  const activeSceneIndex = () => scenes.findIndex((scene) => scene.classList.contains('is-active'));

  const targetTracks = (index) => {
    const weights = index >= 0
      ? scenes.map((_, sceneIndex) => (sceneIndex === index ? 8.2 : 1))
      : baseWeights;
    const sum = weights.reduce((total, weight) => total + weight, 0);
    const width = list.clientWidth;
    return weights.map((weight) => width * weight / sum);
  };

  const readTracks = () => {
    const tracks = getComputedStyle(list).gridTemplateColumns
      .split(/\s+/)
      .map((value) => Number.parseFloat(value))
      .filter(Number.isFinite);
    return tracks.length === scenes.length ? tracks : targetTracks(activeSceneIndex());
  };

  const writeTracks = (tracks) => {
    list.style.gridTemplateColumns = tracks.map((value) => `${value.toFixed(3)}px`).join(' ');
  };

  const stopAnimation = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const easeOutQuart = (progress) => 1 - Math.pow(1 - progress, 4);

  const animateTracks = (index, immediate = false) => {
    stopAnimation();

    if (!desktop.matches) {
      list.style.removeProperty('grid-template-columns');
      list.style.removeProperty('transition');
      return;
    }

    const from = readTracks();
    const target = targetTracks(index);
    list.style.transition = 'none';

    if (immediate || reducedMotion.matches) {
      writeTracks(target);
      return;
    }

    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = easeOutQuart(progress);
      writeTracks(from.map((value, trackIndex) => value + (target[trackIndex] - value) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        writeTracks(target);
      }
    };

    frame = requestAnimationFrame(tick);
  };

  animateTracks(activeSceneIndex(), true);

  const observer = new MutationObserver(() => {
    animateTracks(activeSceneIndex());
  });
  scenes.forEach((scene) => observer.observe(scene, { attributes: true, attributeFilter: ['class'] }));

  desktop.addEventListener('change', () => {
    requestAnimationFrame(() => animateTracks(activeSceneIndex(), true));
  });

  reducedMotion.addEventListener('change', () => {
    animateTracks(activeSceneIndex(), true);
  });

  window.addEventListener('resize', () => {
    if (desktop.matches) animateTracks(activeSceneIndex(), true);
  }, { passive: true });
})();

/* HOME V3 catalogue art direction. Preview-safe relative asset URL. */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  if (document.querySelector('link[data-home-v3-catalog-sculpted]')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('assets/css/home-v3-catalog-sculpted.css?v=20260904-5', window.location.href).href;
  stylesheet.dataset.homeV3CatalogSculpted = '';
  document.head.append(stylesheet);
})();

/*
  Stable audience hover routing.
  home.js originally activates scenes on pointerenter. Because the cards move
  while expanding, moving geometry can fire fresh pointerenter events even when
  the user did not actually move into another card. Capture those scene-level
  pointerenter events and switch only from real pointermove events.
*/
(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const list = document.querySelector('[data-audience-list]');
  const scenes = list ? [...list.querySelectorAll('[data-audience-scene]')] : [];
  if (!list || scenes.length !== 4) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let queuedIndex = -1;
  let pointerFrame = 0;

  const currentIndex = () => scenes.findIndex((scene) => scene.classList.contains('is-active'));

  const activate = (nextIndex) => {
    if (nextIndex < 0 || nextIndex === currentIndex()) return;

    list.classList.add('is-exploring');
    scenes.forEach((scene, index) => {
      const active = index === nextIndex;
      const trigger = scene.querySelector('[data-audience-trigger]');
      const detail = scene.querySelector('[data-audience-detail]');
      scene.classList.toggle('is-active', active);
      trigger?.setAttribute('aria-expanded', String(active));
      if (detail) detail.hidden = !active;
    });
  };

  list.addEventListener('pointerenter', (event) => {
    if (!desktop.matches || !finePointer.matches) return;
    const scene = event.target.closest?.('[data-audience-scene]');
    if (scene && list.contains(scene)) event.stopPropagation();
  }, true);

  list.addEventListener('pointermove', (event) => {
    if (!desktop.matches || !finePointer.matches) return;
    const scene = event.target.closest?.('[data-audience-scene]');
    if (!scene || !list.contains(scene)) return;

    const nextIndex = scenes.indexOf(scene);
    if (nextIndex < 0 || nextIndex === currentIndex()) return;

    queuedIndex = nextIndex;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      activate(queuedIndex);
    });
  }, { passive: true });
})();

/* Reference-driven catalogue component. Enhances the existing semantic markup. */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const section = document.querySelector('.home-catalog');
  const head = section?.querySelector('.home-section-head');
  const grid = section?.querySelector('.home-category-grid');
  const cards = grid ? [...grid.querySelectorAll('.home-category')] : [];
  if (!section || !head || !grid || cards.length !== 4 || section.classList.contains('home-catalog-lux-ready')) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 1;
  let switchTimer = 0;
  let pointerFrame = 0;
  let queuedIndex = 1;

  section.classList.add('home-catalog-lux-ready');

  const intro = head.firstElementChild;
  intro?.classList.add('home-catalog-lux-intro');
  const heading = head.querySelector('h2');
  if (heading) heading.innerHTML = '<span>Каталог семян.</span><em>Четыре направления</em>';

  const catalogLink = head.querySelector('.home-text-link');
  if (intro && catalogLink) intro.append(catalogLink);

  const tools = document.createElement('div');
  tools.className = 'home-catalog-lux-tools';
  tools.innerHTML = `
    <div class="home-catalog-lux-hint" aria-hidden="true">
      <span class="home-catalog-lux-mouse"></span>
      <span>Наводите курсор на карточки<br>или используйте стрелки<br>для просмотра направлений</span>
    </div>
    <div class="home-catalog-lux-arrows">
      <button class="home-catalog-lux-arrow" type="button" data-catalog-prev aria-label="Предыдущее направление">←</button>
      <button class="home-catalog-lux-arrow" type="button" data-catalog-next aria-label="Следующее направление">→</button>
    </div>`;
  head.append(tools);

  const wavePaths = [
    'M0 30 C18 24 33 26 47 35 C63 45 80 46 100 33',
    'M0 38 C15 29 28 28 42 36 C58 47 72 50 100 31',
    'M0 32 C18 25 34 27 49 36 C65 46 82 47 100 35',
    'M0 35 C17 27 31 29 46 37 C62 46 79 48 100 34'
  ];

  cards.forEach((card, index) => {
    card.dataset.catalogCard = String(index);
    const media = card.querySelector('.home-category-media');
    if (media && !media.querySelector('.home-catalog-card-number')) {
      const number = document.createElement('span');
      number.className = 'home-catalog-card-number';
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');
      media.prepend(number);
    }
    if (media && !media.querySelector('.home-catalog-media-wave')) {
      const path = wavePaths[index] || wavePaths[0];
      media.insertAdjacentHTML('beforeend', `
        <svg class="home-catalog-media-wave" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="home-catalog-media-wave-fill" d="${path} L100 60 L0 60 Z"></path>
          <path class="home-catalog-media-wave-line" d="${path}"></path>
        </svg>`);
    }
  });

  const progress = document.createElement('div');
  progress.className = 'home-catalog-lux-progress';
  progress.setAttribute('aria-label', 'Навигация по направлениям каталога');
  progress.innerHTML = cards.map((_, index) => `<button class="home-catalog-lux-step" type="button" data-catalog-step="${index}" aria-label="Показать направление ${index + 1}">${String(index + 1).padStart(2, '0')}</button>`).join('');
  grid.after(progress);

  const steps = [...progress.querySelectorAll('[data-catalog-step]')];

  const setActive = (nextIndex, { scroll = false } = {}) => {
    const normalized = (nextIndex + cards.length) % cards.length;
    if (normalized === activeIndex && cards[normalized].classList.contains('is-active')) {
      if (scroll && !desktop.matches) cards[normalized].scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      return;
    }

    activeIndex = normalized;
    grid.classList.add('is-switching');
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(() => grid.classList.remove('is-switching'), 760);

    cards.forEach((card, index) => {
      const active = index === normalized;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-current', active ? 'true' : 'false');
    });
    steps.forEach((step, index) => {
      const active = index === normalized;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'true');
      else step.removeAttribute('aria-current');
    });

    if (scroll && !desktop.matches) {
      cards[normalized].scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  setActive(1);

  tools.querySelector('[data-catalog-prev]')?.addEventListener('click', () => setActive(activeIndex - 1, { scroll: true }));
  tools.querySelector('[data-catalog-next]')?.addEventListener('click', () => setActive(activeIndex + 1, { scroll: true }));

  steps.forEach((step, index) => step.addEventListener('click', () => setActive(index, { scroll: true })));

  grid.addEventListener('pointermove', (event) => {
    if (!desktop.matches || !finePointer.matches) return;
    const card = event.target.closest?.('[data-catalog-card]');
    if (!card || !grid.contains(card)) return;
    const nextIndex = Number(card.dataset.catalogCard);
    if (!Number.isInteger(nextIndex) || nextIndex === activeIndex) return;
    queuedIndex = nextIndex;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      setActive(queuedIndex);
    });
  }, { passive: true });

  grid.addEventListener('focusin', (event) => {
    const card = event.target.closest?.('[data-catalog-card]');
    if (!card) return;
    const nextIndex = Number(card.dataset.catalogCard);
    if (Number.isInteger(nextIndex)) setActive(nextIndex, { scroll: !desktop.matches });
  });

  section.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.target.matches('input,textarea,select')) return;
    event.preventDefault();
    setActive(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), { scroll: true });
  });
})();
