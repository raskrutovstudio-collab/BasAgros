(() => {
  if (!document.body.classList.contains('page-travosmesi')) return;

  const modals = [...document.querySelectorAll('[data-mix-modal]')];
  if (!modals.length) return;

  let returnFocus = null;

  function focusableElements(modal) {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => !element.hasAttribute('hidden'));
  }

  function openModal(modal, trigger) {
    returnFocus = trigger;
    document.body.classList.add('home-modal-open');
    modal.showModal();
    requestAnimationFrame(() => focusableElements(modal)[0]?.focus());
  }

  function closeModal(modal) {
    if (modal.open) modal.close();
  }

  document.addEventListener('click', (event) => {
    const catalogTrigger = event.target.closest('a[href="#mix-products"]');
    if (catalogTrigger && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      const catalog = document.querySelector('#mix-products');
      if (!catalog) return;
      event.preventDefault();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      catalog.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    const trigger = event.target.closest('[data-mix-modal-intent]');
    if (!trigger || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const modal = document.querySelector(`[data-mix-modal="${trigger.dataset.mixModalIntent}"]`);
    if (!modal) return;
    event.preventDefault();
    openModal(modal, trigger);
  });

  modals.forEach((modal) => {
    modal.querySelector('[data-mix-modal-close]')?.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });

    modal.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeModal(modal);
    });

    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const elements = focusableElements(modal);
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
  });
})();
