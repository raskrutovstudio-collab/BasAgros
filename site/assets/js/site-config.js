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
  The visual layout still comes from home-v3-audience.css; this only keeps
  grid tracks in explicit pixel values so interrupted 1 -> 2 -> 3 -> 4
  hover transitions continue from the current rendered width instead of
  snapping when :has() switches the active grid template.
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

    const target = targetTracks(index);
    list.style.transition = 'none';

    if (immediate || reducedMotion.matches) {
      writeTracks(target);
      return;
    }

    const from = readTracks();
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

/* HOME V3 catalogue art direction. Kept runtime-loaded so the experiment stays isolated to page-home-main. */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  if (document.querySelector('link[data-home-v3-catalog-sculpted]')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/assets/css/home-v3-catalog-sculpted.css?v=20260904-1';
  stylesheet.dataset.homeV3CatalogSculpted = '';
  document.head.append(stylesheet);
})();