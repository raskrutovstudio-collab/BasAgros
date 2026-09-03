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

/* HOME V3 catalogue art direction. */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  if (document.querySelector('link[data-home-v3-catalog-sculpted]')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/assets/css/home-v3-catalog-sculpted.css?v=20260904-2';
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
