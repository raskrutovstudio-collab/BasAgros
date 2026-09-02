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
      description: 'Укажите культуру, объём и населённый пункт доставки. Менеджер подготовит коммерческий расчёт под параметры заказа.',
      categoryLabel: 'Категория или культура',
      categoryPlaceholder: 'Например, люцерна или травосмесь',
      messageLabel: 'Объём и место доставки',
      messagePlaceholder: 'Например, 2 тонны, Акмолинская область',
      submit: 'Получить коммерческое предложение',
      formName: 'Главная — модальное окно — коммерческое предложение',
      intent: 'commercial_offer'
    },
    request: {
      title: 'Получить коммерческое предложение',
      description: 'Укажите культуру, объём и населённый пункт доставки. Менеджер подготовит коммерческий расчёт под параметры заказа.',
      categoryLabel: 'Категория или культура',
      categoryPlaceholder: 'Например, люцерна или травосмесь',
      messageLabel: 'Объём и место доставки',
      messagePlaceholder: 'Например, 2 тонны, Акмолинская область',
      submit: 'Получить коммерческое предложение',
      formName: 'Главная — модальное окно — коммерческое предложение',
      intent: 'commercial_offer'
    },
    selection: {
      title: 'Подобрать семена под задачу',
      description: 'Укажите назначение посева, площадь и планируемый объём. Менеджер подберёт подходящую категорию и культуры из каталога.',
      categoryLabel: 'Что нужно подобрать',
      categoryPlaceholder: 'Например, семена для сенокоса',
      messageLabel: 'Задача хозяйства и регион',
      messagePlaceholder: 'Например, кормовая база, Акмолинская область',
      submit: 'Подобрать семена под задачу',
      formName: 'Главная — модальное окно — подбор семян',
      intent: 'seed_selection'
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

  const cropStage = document.querySelector('[data-crop-stage]');
  if (!cropStage) return;

  const triggers = [...cropStage.querySelectorAll('[data-crop-trigger]')];
  const previews = [...cropStage.querySelectorAll('[data-crop-preview]')];

  function activateCrop(index) {
    triggers.forEach((trigger) => trigger.classList.toggle('is-active', trigger.dataset.cropTrigger === String(index)));
    previews.forEach((preview) => preview.classList.toggle('is-active', preview.dataset.cropPreview === String(index)));
  }

  triggers.forEach((trigger) => {
    const index = trigger.dataset.cropTrigger;
    trigger.addEventListener('mouseenter', () => activateCrop(index));
    trigger.addEventListener('focus', () => activateCrop(index));
  });
})();
