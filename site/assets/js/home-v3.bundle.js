/* site-config.js */
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
  const duration = 2160;
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
  if (heading) heading.innerHTML = '<span>Единая экосистема.</span><em>Для агробизнеса</em>';

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
    switchTimer = window.setTimeout(() => grid.classList.remove('is-switching'), 1520);

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

;

/* home.js */
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!toggle || !nav) return;

  const label = toggle.querySelector('.visually-hidden');
  const focusable = () => [...nav.querySelectorAll('a[href], button:not([disabled])')];

  function setOpen(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (label) label.textContent = open ? 'Закрыть меню' : 'Открыть меню';
    if (open) focusable()[0]?.focus();
    if (!open && returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); return; }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
  });
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();

(() => {
  const faqGroups = document.querySelectorAll('.home-faq, .product-faq');
  if (!faqGroups.length) return;

  for (const faq of faqGroups) {
    const items = [...faq.querySelectorAll('details')];
    let firstOpenSeen = false;
    for (const item of items) {
      if (!item.open) continue;
      if (!firstOpenSeen) {
        firstOpenSeen = true;
      } else {
        item.open = false;
      }
    }

    for (const item of items) {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        for (const other of items) {
          if (other !== item && other.open) other.open = false;
        }
      });
    }
  }
})();

(() => {
  if (!document.body.classList.contains('page-home')) return;

  const style = document.createElement('style');
  style.textContent = `
    .home-back-to-top {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10000;
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      padding: 0;
      border: 1px solid #2f7d4a;
      border-radius: 50%;
      background: rgba(250, 251, 247, .96);
      color: #17452c;
      box-shadow: 0 8px 24px rgba(23, 69, 44, .14);
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity .2s ease, transform .2s ease, visibility .2s ease, background .2s ease, color .2s ease;
    }
    .home-back-to-top.is-visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .home-back-to-top:hover {
      background: #2f7d4a;
      color: #fff;
    }
    .home-back-to-top:focus-visible {
      outline: 3px solid rgba(47, 125, 74, .28);
      outline-offset: 3px;
    }
    .home-back-to-top svg {
      width: 21px;
      height: 21px;
    }
    @media (max-width: 47.99rem) {
      .home-back-to-top {
        right: 16px;
        bottom: calc(5.75rem + env(safe-area-inset-bottom) + 12px);
        width: 46px;
        height: 46px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .home-back-to-top { transition: none; }
    }
  `;
  document.head.append(style);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'home-back-to-top';
  button.setAttribute('aria-label', 'Наверх');
  button.title = 'Наверх';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 14.5 12 8l6 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.append(button);

  const syncVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > 600);
  };

  button.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', syncVisibility, { passive: true });
  syncVisibility();
})();

(() => {
  if (!document.body.classList.contains('page-home') || document.body.classList.contains('page-product')) return;

  const modal = document.querySelector('[data-home-modal]');
  const form = modal?.querySelector('[data-lead-form]');
  const title = modal?.querySelector('[data-home-modal-title]');
  const description = modal?.querySelector('[data-home-modal-description]');
  const categoryLabel = modal?.querySelector('[data-home-modal-category-label]');
  const category = modal?.querySelector('[data-home-modal-category]');
  const messageLabel = modal?.querySelector('[data-home-modal-message-label]');
  const message = modal?.querySelector('[data-home-modal-message]');
  const submit = modal?.querySelector('[data-home-modal-submit]');
  const closeButton = modal?.querySelector('[data-home-modal-close]');

  if (!modal || !form || !title || !description || !categoryLabel || !category || !messageLabel || !message || !submit || !closeButton) return;

  const variants = {
    commercial_offer: {
      title: 'Получить коммерческое предложение',
      description: 'Укажите направление и параметры задачи. Менеджер уточнит детали и подготовит коммерческое предложение.',
      categoryLabel: 'Направление или категория',
      categoryPlaceholder: 'Например, автопилот или семена зерновых',
      messageLabel: 'Задача и место поставки',
      messagePlaceholder: 'Опишите задачу и укажите населённый пункт',
      submit: 'Получить коммерческое предложение',
      formName: 'Главная — модальное окно — коммерческое предложение',
      intent: 'commercial_offer'
    },
    request: {
      title: 'Получить коммерческое предложение',
      description: 'Укажите направление и параметры задачи. Менеджер уточнит детали и подготовит коммерческое предложение.',
      categoryLabel: 'Направление или категория',
      categoryPlaceholder: 'Например, автопилот или семена зерновых',
      messageLabel: 'Задача и место поставки',
      messagePlaceholder: 'Опишите задачу и укажите населённый пункт',
      submit: 'Получить коммерческое предложение',
      formName: 'Главная — модальное окно — коммерческое предложение',
      intent: 'commercial_offer'
    },
    selection: {
      title: 'Подобрать решение под задачу',
      description: 'Выберите одно из шести направлений и кратко опишите задачу хозяйства.',
      categoryLabel: 'Что нужно подобрать',
      categoryPlaceholder: 'Например, система навигации или газонные травы',
      messageLabel: 'Задача хозяйства и регион',
      messagePlaceholder: 'Опишите задачу, масштаб и населённый пункт',
      submit: 'Подобрать решение',
      formName: 'Главная — модальное окно — подбор решения',
      intent: 'solution_selection'
    }
  };

  let returnFocus = null;

  function applyVariant(intent) {
    const variant = variants[intent] || variants.request;
    title.textContent = variant.title;
    description.textContent = variant.description;
    categoryLabel.textContent = variant.categoryLabel;
    category.placeholder = variant.categoryPlaceholder;
    messageLabel.textContent = variant.messageLabel;
    message.placeholder = variant.messagePlaceholder;
    submit.textContent = variant.submit;
    form.dataset.formName = variant.formName;
    const intentField = form.querySelector('[data-home-modal-intent-field]');
    if (intentField) intentField.value = variant.intent || 'commercial_offer';

    const status = form.querySelector('[data-form-status]');
    if (status && !submit.disabled) status.textContent = '';
  }

  function focusableElements() {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => !element.hasAttribute('hidden'));
  }

  function openModal(trigger) {
    returnFocus = trigger;
    applyVariant(trigger.dataset.homeModalIntent);
    document.body.classList.add('home-modal-open');
    modal.showModal();
    requestAnimationFrame(() => modal.querySelector('input[name="name"]')?.focus());
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-home-modal-intent]');
    if (!trigger || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openModal(trigger);
  });

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const elements = focusableElements();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('home-modal-open');
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  });
})();

(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('[data-lux-reveal]')];

  if (!reducedMotion && reveals.length && 'IntersectionObserver' in window) {
    document.body.classList.add('js-lux-ready');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((element) => observer.observe(element));
  }

  const purposeSelector = document.querySelector('[data-purpose-selector]');
  if (purposeSelector) {
    const tabs = [...purposeSelector.querySelectorAll('[data-purpose-tab]')];
    const panels = [...purposeSelector.querySelectorAll('[data-purpose-panel]')];

    function activatePurpose(index, focus = false) {
      tabs.forEach((tab) => {
        const active = tab.dataset.purposeTab === String(index);
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      panels.forEach((panel) => {
        const active = panel.dataset.purposePanel === String(index);
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activatePurpose(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
        activatePurpose(next, true);
      });
    });

    document.querySelectorAll('[data-direction-link]').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const key = trigger.dataset.directionLink;
        const index = tabs.findIndex((tab) => tab.dataset.directionKey === key);
        if (index < 0) return;
        event.preventDefault();
        activatePurpose(index);
        purposeSelector.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  const cropRail = document.querySelector('[data-crop-rail]');
  const previousCrop = document.querySelector('[data-crop-prev]');
  const nextCrop = document.querySelector('[data-crop-next]');
  if (cropRail && previousCrop && nextCrop) {
    const scrollRail = (direction) => cropRail.scrollBy({ left: direction * Math.max(260, cropRail.clientWidth * .72), behavior: reducedMotion ? 'auto' : 'smooth' });
    previousCrop.addEventListener('click', () => scrollRail(-1));
    nextCrop.addEventListener('click', () => scrollRail(1));
  }
})();

(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  const section = document.querySelector('.home-audience');
  const list = section?.querySelector('[data-audience-list]');
  const scenes = list ? [...list.querySelectorAll('[data-audience-scene]')] : [];
  if (!section || !list || scenes.length !== 4) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let activeIndex = -1;
  let suppressPointer = false;

  const setActive = (nextIndex) => {
    activeIndex = nextIndex;
    list.classList.toggle('is-exploring', nextIndex >= 0);
    scenes.forEach((scene, index) => {
      const active = index === nextIndex;
      const trigger = scene.querySelector('[data-audience-trigger]');
      const detail = scene.querySelector('[data-audience-detail]');
      scene.classList.toggle('is-active', active);
      trigger?.setAttribute('aria-expanded', String(active));
      if (detail) detail.hidden = !active;
    });
  };

  scenes.forEach((scene, index) => {
    const trigger = scene.querySelector('[data-audience-trigger]');
    scene.addEventListener('pointerenter', () => {
      if (!suppressPointer && desktop.matches && finePointer.matches) setActive(index);
    });
    trigger?.addEventListener('focus', () => {
      if (desktop.matches) setActive(index);
    });
    trigger?.addEventListener('click', () => {
      if (desktop.matches && finePointer.matches) {
        setActive(index);
        return;
      }
      setActive(activeIndex === index ? -1 : index);
    });
    scene.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      suppressPointer = true;
      setActive(-1);
      trigger?.focus();
      window.setTimeout(() => { suppressPointer = false; }, 900);
    });
  });

  list.addEventListener('pointerleave', () => {
    if (!desktop.matches || !finePointer.matches || list.contains(document.activeElement)) return;
    setActive(-1);
  });
  list.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (desktop.matches && !list.contains(document.activeElement)) setActive(-1);
    }, 0);
  });
  desktop.addEventListener('change', () => setActive(-1));
})();

;

/* home-v3-catalog-terrain.js */
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

;

/* home-v3-review-fixes.js */
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

(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  const heading = document.querySelector('#home-h1');
  if (!heading) return;

  const original = 'Семена и технологии для сельского хозяйства';
  const desktop = window.matchMedia('(min-width: 64rem)');

  const render = () => {
    if (desktop.matches) {
      heading.innerHTML = [
        '<span style="display:block;white-space:nowrap">Семена и технологии</span>',
        '<span style="display:block;white-space:nowrap">для сельского</span>',
        '<span style="display:block;white-space:nowrap">хозяйства</span>'
      ].join('');
      heading.setAttribute('aria-label', original);
    } else {
      heading.textContent = original;
      heading.removeAttribute('aria-label');
    }
  };

  render();
  desktop.addEventListener?.('change', render);
})();

;

/* lead-form.js */
(() => {
  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  const DISABLED_MESSAGE = 'Отправка будет доступна после подключения формы.';
  const config = window.SITE_CONFIG || {};
  const endpoint = String(config.leadEndpoint || '').trim();
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function normalizePhoneDigits(value) {
    const raw = String(value || '').trim();
    let digits = raw.replace(/\D/g, '');

    if (raw.startsWith('+7') && digits.startsWith('7')) {
      digits = digits.slice(1);
    } else if (digits.length >= 11 && digits.startsWith('8')) {
      digits = digits.slice(1);
    } else if (digits.length >= 11 && digits.startsWith('7')) {
      digits = digits.slice(1);
    }

    return digits.slice(0, 10);
  }

  function formatPhone(value) {
    const digits = normalizePhoneDigits(value);
    if (!digits.length) return '';
    const parts = ['+7'];
    if (digits.length) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 8));
    if (digits.length > 8) parts.push(digits.slice(8, 10));
    return parts.join(' ');
  }

  function isCompletePhone(value) {
    return normalizePhoneDigits(value).length === 10;
  }

  function validatePhone(input) {
    if (!input) return true;
    const valid = isCompletePhone(input.value);
    input.setCustomValidity(valid ? '' : 'Введите номер в формате +7 *** *** ** **');
    return valid;
  }

  function bindPhoneMask(form) {
    const inputs = form.querySelectorAll('input[name="phone"][data-phone-mask]');
    for (const input of inputs) {
      input.addEventListener('focus', () => {
        if (!input.value) input.value = '+7 ';
      });
      input.addEventListener('input', () => {
        input.value = formatPhone(input.value);
        validatePhone(input);
      });
      input.addEventListener('blur', () => {
        if (!normalizePhoneDigits(input.value).length) input.value = '';
        validatePhone(input);
      });
      input.addEventListener('paste', () => {
        queueMicrotask(() => {
          input.value = formatPhone(input.value);
          validatePhone(input);
        });
      });
    }
  }

  function canActivateLeadForm() {
    if (config.enabled === true && !endpoint) {
      console.error('Форма не может быть активна: endpoint пустой.');
      return false;
    }
    if (config.enabled !== true) return false;
    if (!endpoint || endpoint === 'ТРЕБУЕТ_ПОДТВЕРЖДЕНИЯ') return false;
    return true;
  }

  function disableForm(form) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.setAttribute('aria-disabled', 'true');
    }
    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = DISABLED_MESSAGE;
  }

  function enableForm(form) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = false;
      submit.removeAttribute('aria-disabled');
    }
    const status = form.querySelector('[data-form-status]');
    if (status && status.textContent === DISABLED_MESSAGE) status.textContent = '';
  }

  function captureUtm() {
    const params = new URLSearchParams(location.search);
    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    }
  }

  function getUtm() {
    return Object.fromEntries(
      utmKeys.map((key) => [key, sessionStorage.getItem(key) || ''])
    );
  }

  function formDataToObject(form) {
    const entries = [...new FormData(form).entries()]
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]);
    const data = Object.fromEntries(entries);
    if ('phone' in data) data.phone = formatPhone(data.phone);
    return data;
  }

  const active = canActivateLeadForm();

  for (const form of forms) {
    if (form.dataset.handlerBound === 'true') continue;
    form.dataset.handlerBound = 'true';
    bindPhoneMask(form);

    if (!active) {
      disableForm(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
      });
      continue;
    }

    enableForm(form);
    captureUtm();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!canActivateLeadForm()) {
        disableForm(form);
        return;
      }

      const status = form.querySelector('[data-form-status]');
      const submit = form.querySelector('button[type="submit"]');
      const phone = form.querySelector('input[name="phone"]');

      if (form.dataset.submitting === 'true') return;

      validatePhone(phone);
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = 'Проверьте обязательные поля.';
        return;
      }

      const data = formDataToObject(form);
      if (data.website) return;

      const payload = {
        ...data,
        form_name: form.dataset.formName || '',
        page_url: location.href,
        page_title: document.title,
        referrer: document.referrer || '',
        ...getUtm()
      };

      form.dataset.submitting = 'true';
      if (submit) submit.disabled = true;
      if (status) status.textContent = 'Отправляем…';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        if (status) status.textContent = 'Спасибо. Заявка отправлена.';
        form.reset();

        window.dispatchEvent(new CustomEvent('lead:success', {
          detail: { formName: payload.form_name }
        }));
      } catch (error) {
        console.error('Ошибка отправки формы:', error.message);
        if (status) {
          status.textContent =
            'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами другим способом.';
        }
      } finally {
        delete form.dataset.submitting;
        if (canActivateLeadForm()) enableForm(form);
        else disableForm(form);
      }
    });
  }
})();

;

/* home-v3-final-ui.js */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  /* Keep the Home destination in the header navigation. */
  const navList = document.querySelector('.home-header .home-nav > ul');
  if (navList && ![...navList.querySelectorAll(':scope > li > a')].some((a) => a.textContent.trim() === 'Главная')) {
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = '/';
    anchor.textContent = 'Главная';
    if (location.pathname === '/' || /\/preview\/home-v3\/?$/.test(location.pathname)) {
      anchor.setAttribute('aria-current', 'page');
    }
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

;

/* home-v3-mobile-pass3.js */
(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  const mobile = window.matchMedia('(max-width: 47.99rem)');

  /* Persistent mobile quick actions. Kept in the existing deferred homepage
     bundle so it adds no extra network request. */
  if (!document.querySelector('.home-mobile-quickbar')) {
    const quickbar = document.createElement('nav');
    quickbar.className = 'home-mobile-quickbar';
    quickbar.setAttribute('aria-label', 'Быстрые действия');
    quickbar.innerHTML = `
      <a class="home-mobile-quickbar-item" href="tel:+77059608987" aria-label="Позвонить в BAS Agros">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Позвонить</span>
      </a>
      <a class="home-mobile-quickbar-item home-mobile-quickbar-item--accent" href="https://wa.me/77059608987?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20BAS%20Agros" target="_blank" rel="noopener" aria-label="Написать BAS Agros в WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.3 4.7A9.1 9.1 0 0 0 5 15.7L3.8 20l4.4-1.2A9.1 9.1 0 0 0 19.3 4.7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.7 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.7 1.3 1.8 2.4 3.2 3 .3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .5-.3 1.4-.8 1.9-.6.6-1.5.9-2.4.8-1.4-.2-3.1-.8-5-2.5-1.4-1.4-2.5-3-2.8-4.3-.3-1.1-.1-2 .5-2.8Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>WhatsApp</span>
      </a>
      <a class="home-mobile-quickbar-item" href="/catalog/" aria-label="Открыть каталог BAS Agros">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/></svg>
        <span>Каталог</span>
      </a>`;
    document.body.append(quickbar);
  }

  const button = document.querySelector('.home-back-to-top');

  if (button) {
    const sync = () => {
      if (!mobile.matches) return;
      const threshold = Math.max(1050, window.innerHeight * 1.45);
      if (window.scrollY < threshold) button.classList.remove('is-visible');
    };

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    mobile.addEventListener?.('change', sync);
    sync();
  }

  /* Mobile ecosystem showcase must always open on its first direction.
     Browsers may restore an inner horizontal scroll position on reload/back,
     which previously left card 01 fully outside the viewport while progress
     still showed step 01 as active. */
  const catalog = document.querySelector('.home-catalog.home-catalog-lux-ready');
  const rail = catalog?.querySelector('.home-category-grid');
  const cards = rail ? [...rail.querySelectorAll(':scope > .home-category')] : [];
  const steps = catalog ? [...catalog.querySelectorAll('[data-catalog-step]')] : [];
  if (!catalog || !rail || !cards.length) return;

  let userHasMovedRail = false;
  let resetTimerA = 0;
  let resetTimerB = 0;

  const markInteraction = () => { userHasMovedRail = true; };

  const showFirst = () => {
    if (!mobile.matches || userHasMovedRail) return;
    rail.scrollTo({ left: 0, behavior: 'auto' });
    rail.scrollLeft = 0;
    cards.forEach((card, index) => card.classList.toggle('is-active', index === 0));
    steps.forEach((step, index) => {
      const active = index === 0;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  ['pointerdown', 'touchstart', 'wheel'].forEach((type) => {
    rail.addEventListener(type, markInteraction, { passive: true, once: true });
  });
  rail.addEventListener('keydown', markInteraction, { once: true });

  const syncProgress = () => {
    if (!mobile.matches || !steps.length || !cards.length) return;
    const railBox = rail.getBoundingClientRect();
    const targetX = railBox.left + Math.min(rail.clientWidth * .18, 64);
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const current = Math.abs(box.left - targetX);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    steps.forEach((step, index) => {
      const active = index === nearest;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  rail.addEventListener('scroll', () => requestAnimationFrame(syncProgress), { passive: true });

  const scheduleReset = () => {
    window.clearTimeout(resetTimerA);
    window.clearTimeout(resetTimerB);
    requestAnimationFrame(showFirst);
    resetTimerA = window.setTimeout(showFirst, 120);
    resetTimerB = window.setTimeout(showFirst, 650);
  };

  window.addEventListener('pageshow', scheduleReset);
  window.addEventListener('load', scheduleReset, { once: true });
  mobile.addEventListener?.('change', (event) => {
    if (event.matches) {
      userHasMovedRail = false;
      scheduleReset();
    }
  });

  scheduleReset();
})();
