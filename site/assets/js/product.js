(() => {
  if (!document.body.classList.contains('page-product')) return;

  const modal = document.querySelector('[data-product-modal]');
  const form = modal?.querySelector('[data-lead-form]');
  const title = modal?.querySelector('[data-product-modal-title]');
  const description = modal?.querySelector('[data-product-modal-description]');
  const fieldLabel = modal?.querySelector('[data-product-modal-field-label]');
  const message = modal?.querySelector('[data-product-modal-message]');
  const submit = modal?.querySelector('[data-product-modal-submit]');
  const closeButton = modal?.querySelector('[data-product-modal-close]');
  const intentField = modal?.querySelector('[data-product-modal-intent-field]');

  if (!modal || !form || !title || !description || !fieldLabel || !message || !submit || !closeButton) return;

  const variants = {
    commercial_offer: {
      title: 'Получить коммерческое предложение',
      description: 'Укажите необходимый объём и место доставки. Менеджер подготовит цену, доступную партию, фасовку и условия поставки.',
      fieldLabel: 'Объём / место доставки',
      placeholder: 'Например, 2 тонны, доставка в Костанай',
      submit: 'Получить коммерческое предложение',
      formName: 'Товар — Люцерна — модальное окно — коммерческое предложение',
      intent: 'commercial_offer',
      selectionFields: false
    },
    selection_quote: {
      title: 'Подобрать семена и рассчитать поставку',
      description: 'Ответьте на четыре вопроса из блока подбора. Эти данные помогут рассчитать потребность в семенах и подготовить предложение под задачу хозяйства.',
      fieldLabel: 'Комментарий',
      placeholder: 'Дополнительные требования к посеву или поставке',
      submit: 'Получить коммерческое предложение',
      formName: 'Товар — Люцерна — подбор семян и расчёт поставки',
      intent: 'selection_quote',
      selectionFields: true
    },
    party_characteristics: {
      title: 'Запросить характеристики партии',
      description: 'Укажите объём заказа. Менеджер передаст характеристики доступной партии: сорт, репродукцию, год урожая, чистоту, всхожесть, фасовку и сведения по документам.',
      fieldLabel: 'Объём / место доставки',
      placeholder: 'Например, 2 тонны или площадь посева',
      submit: 'Запросить характеристики партии',
      formName: 'Товар — Люцерна — модальное окно — характеристики партии',
      intent: 'party_characteristics',
      selectionFields: false
    }
  };

  let returnFocus = null;

  function inferIntent(trigger) {
    const explicit = trigger.dataset.productModalIntent;
    if (explicit && variants[explicit]) return explicit;

    const label = (trigger.textContent || '').toLowerCase();
    if (label.includes('характеристик')) return 'party_characteristics';
    return 'commercial_offer';
  }

  function toggleSelectionFields(enabled) {
    const fields = modal.querySelectorAll('[data-product-selection-field]');
    for (const field of fields) {
      field.hidden = !enabled;
      const control = field.querySelector('input, textarea, select');
      if (control) control.disabled = !enabled;
    }
  }

  function applyVariant(intent) {
    const variant = variants[intent] || variants.commercial_offer;
    title.textContent = variant.title;
    description.textContent = variant.description;
    fieldLabel.textContent = variant.fieldLabel;
    message.placeholder = variant.placeholder;
    submit.textContent = variant.submit;
    form.dataset.formName = variant.formName;
    if (intentField) intentField.value = variant.intent;
    toggleSelectionFields(variant.selectionFields === true);

    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = '';
  }

  function focusableElements() {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => !element.hasAttribute('hidden') && !element.closest('[hidden]'));
  }

  function openModal(trigger) {
    returnFocus = trigger;
    applyVariant(inferIntent(trigger));
    document.body.classList.add('product-modal-open');
    modal.showModal();
    requestAnimationFrame(() => modal.querySelector('input[name="name"]')?.focus());
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('a[href="#request"], [data-product-modal-intent]');
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
    document.body.classList.remove('product-modal-open');
    toggleSelectionFields(false);
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  });
})();
