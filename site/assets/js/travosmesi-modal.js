(() => {
  if (!document.body.classList.contains('page-travosmesi')) return;

  const modal = document.querySelector('[data-mix-modal]');
  const form = modal?.querySelector('[data-lead-form]');
  const title = modal?.querySelector('[data-mix-modal-title]');
  const description = modal?.querySelector('[data-mix-modal-description]');
  const taskLabel = modal?.querySelector('[data-mix-modal-task-label]');
  const task = modal?.querySelector('[data-mix-modal-task]');
  const submit = modal?.querySelector('[data-mix-modal-submit]');
  const closeButton = modal?.querySelector('[data-mix-modal-close]');
  const intentField = modal?.querySelector('[data-mix-modal-intent-field]');

  if (!modal || !form || !title || !description || !taskLabel || !task || !submit || !closeButton || !intentField) return;

  const variants = {
    selection: {
      title: 'Подобрать травосмесь',
      description: 'Укажите назначение, площадь, необходимый объём и место доставки. Менеджер подберёт подходящую позицию из каталога.',
      taskLabel: 'Назначение посева',
      taskPlaceholder: 'Например, сенокос, пастбище или рекультивация',
      submit: 'Подобрать травосмесь',
      formName: 'Травосмеси — модальное окно — подбор',
      intent: 'travosmesi_selection'
    },
    quote: {
      title: 'Получить коммерческое предложение',
      description: 'Укажите травосмесь или задачу, площадь, необходимый объём и место доставки. Менеджер подготовит коммерческое предложение под параметры заказа.',
      taskLabel: 'Травосмесь или задача',
      taskPlaceholder: 'Например, кормовая травосмесь',
      submit: 'Получить коммерческое предложение',
      formName: 'Травосмеси — модальное окно — коммерческое предложение',
      intent: 'travosmesi_quote'
    }
  };

  let returnFocus = null;

  function applyVariant(intent) {
    const variant = variants[intent] || variants.selection;
    title.textContent = variant.title;
    description.textContent = variant.description;
    taskLabel.textContent = variant.taskLabel;
    task.placeholder = variant.taskPlaceholder;
    submit.textContent = variant.submit;
    form.dataset.formName = variant.formName;
    intentField.value = variant.intent;
    const status = form.querySelector('[data-form-status]');
    if (status && !submit.disabled) status.textContent = '';
  }

  function focusableElements() {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => !element.hasAttribute('hidden'));
  }

  function openModal(trigger, fallbackIntent = 'selection') {
    returnFocus = trigger;
    applyVariant(trigger.dataset.mixModalIntent || fallbackIntent);
    document.body.classList.add('home-modal-open');
    modal.showModal();
    requestAnimationFrame(() => modal.querySelector('input[name="name"]')?.focus());
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  document.addEventListener('click', (event) => {
    const explicitTrigger = event.target.closest('[data-mix-modal-intent]');
    const quoteTrigger = event.target.closest('a[href="#mix-request"]');
    const trigger = explicitTrigger || quoteTrigger;
    if (!trigger || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openModal(trigger, explicitTrigger ? 'selection' : 'quote');
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
