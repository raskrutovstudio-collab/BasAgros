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

  if (!modal || !form || !title || !description || !fieldLabel || !message || !submit || !closeButton) return;

  const variants = {
    price: {
      title: 'Запросить цену на семена люцерны',
      description: 'Укажите контактные данные, необходимый объём и место доставки. Менеджер рассчитает стоимость для вашей заявки.',
      fieldLabel: 'Необходимый объём и место доставки',
      placeholder: 'Например, 2 тонны, доставка в Костанай',
      submit: 'Запросить цену',
      formName: 'Товар — Люцерна — модальное окно — запрос цены'
    },
    availability: {
      title: 'Уточнить наличие семян люцерны',
      description: 'Сообщите необходимый объём и желаемый срок получения. Менеджер проверит актуальное наличие и свяжется с вами.',
      fieldLabel: 'Необходимый объём и желаемый срок',
      placeholder: 'Например, 1 тонна, требуется в сентябре',
      submit: 'Уточнить наличие',
      formName: 'Товар — Люцерна — модальное окно — уточнение наличия'
    },
    selection: {
      title: 'Подобрать вариант семян люцерны',
      description: 'Опишите задачу хозяйства, площадь посева и регион. Менеджер уточнит доступные варианты продукции.',
      fieldLabel: 'Задача, площадь посева и регион',
      placeholder: 'Например, сенокос, 50 га, Акмолинская область',
      submit: 'Подобрать вариант',
      formName: 'Товар — Люцерна — модальное окно — подбор варианта'
    },
    request: {
      title: 'Оставить заявку на семена люцерны',
      description: 'Оставьте контактные данные и кратко опишите задачу. Менеджер свяжется с вами для уточнения деталей.',
      fieldLabel: 'Что вас интересует',
      placeholder: 'Например, необходимый объём или место доставки',
      submit: 'Отправить заявку',
      formName: 'Товар — Люцерна — модальное окно — общая заявка'
    }
  };

  let returnFocus = null;

  function inferIntent(trigger) {
    const explicit = trigger.dataset.productModalIntent;
    if (explicit && variants[explicit]) return explicit;

    const label = (trigger.textContent || '').toLowerCase();
    if (label.includes('налич')) return 'availability';
    if (label.includes('подход') || label.includes('вариант')) return 'selection';
    if (label.includes('цен')) return 'price';
    return 'request';
  }

  function applyVariant(intent) {
    const variant = variants[intent] || variants.request;
    title.textContent = variant.title;
    description.textContent = variant.description;
    fieldLabel.textContent = variant.fieldLabel;
    message.placeholder = variant.placeholder;
    submit.textContent = variant.submit;
    form.dataset.formName = variant.formName;

    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = '';
  }

  function focusableElements() {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => !element.hasAttribute('hidden'));
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
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  });
})();
