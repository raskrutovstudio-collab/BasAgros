(() => {
  if (!document.body.classList.contains('page-product')) return;

  if (document.body.classList.contains('page-lucerne-v3')) {
    const enhancementStyle = document.createElement('style');
    enhancementStyle.dataset.lucerneHomeTypography = 'true';
    enhancementStyle.textContent = `
      .page-lucerne-v3,
      .page-lucerne-v3 button,
      .page-lucerne-v3 input,
      .page-lucerne-v3 select,
      .page-lucerne-v3 textarea {
        font-family: Inter, Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }

      .page-lucerne-v3 h1,
      .page-lucerne-v3 h2,
      .page-lucerne-v3 h3,
      .page-lucerne-v3 .product-hero-copy::before,
      .page-lucerne-v3 .product-kicker,
      .page-lucerne-v3 .product-eyebrow,
      .page-lucerne-v3 .home-btn,
      .page-lucerne-v3 .home-nav li a {
        font-family: inherit !important;
      }

      .page-lucerne-v3 h1,
      .page-lucerne-v3 h2,
      .page-lucerne-v3 h3 {
        text-transform: none !important;
      }

      .page-lucerne-v3 .product-hero h1 {
        line-height: 1.02 !important;
        letter-spacing: -.045em !important;
      }

      .page-lucerne-v3 .product-section h2,
      .page-lucerne-v3 .product-request h2 {
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
      }

      .page-lucerne-v3 .home-btn {
        font-weight: 700 !important;
        letter-spacing: normal !important;
      }

      .page-lucerne-v3 .home-nav li a {
        font-weight: 650 !important;
        letter-spacing: normal !important;
      }

      .page-lucerne-v3 .product-kicker,
      .page-lucerne-v3 .product-eyebrow {
        font-weight: 800 !important;
      }

      .page-lucerne-v3 .product-section {
        padding-block: clamp(3.4rem, 5.2vw, 5.6rem) !important;
      }

      .page-lucerne-v3 .product-request {
        padding-block: clamp(3.8rem, 5.8vw, 6rem) !important;
      }

      .page-lucerne-v3 .product-section + .product-section::before {
        opacity: .82;
      }

      .page-lucerne-v3 .lucerne-infographic {
        position: relative;
        margin-top: 1.5rem;
        padding: 1rem;
        border: 1px solid rgba(232,197,109,.18);
        border-radius: 1.15rem;
        background: radial-gradient(circle at 100% 0, rgba(201,151,45,.10), transparent 14rem), linear-gradient(145deg, rgba(16,18,14,.92), rgba(7,8,7,.84));
        box-shadow: 0 1.3rem 3rem rgba(0,0,0,.18);
        overflow: hidden;
      }

      .page-lucerne-v3 .lucerne-infographic::before {
        content: "";
        position: absolute;
        top: -5rem;
        right: -5rem;
        width: 10rem;
        aspect-ratio: 1;
        border: 1px solid rgba(232,197,109,.12);
        border-radius: 50%;
        box-shadow: 0 0 0 2.1rem rgba(201,151,45,.01), 0 0 0 4.2rem rgba(201,151,45,.006);
        pointer-events: none;
      }

      .page-lucerne-v3 .lucerne-infographic-head {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: .9rem;
      }

      .page-lucerne-v3 .lucerne-infographic-head strong {
        color: var(--lucerne-ivory);
        font-size: 1rem;
        font-weight: 800;
      }

      .page-lucerne-v3 .lucerne-infographic-head span {
        max-width: 34rem;
        color: var(--lucerne-muted);
        font-size: .84rem;
        line-height: 1.45;
      }

      .page-lucerne-v3 .lucerne-icon {
        display: grid;
        width: 2.4rem;
        height: 2.4rem;
        flex: 0 0 2.4rem;
        place-items: center;
        border: 1px solid rgba(232,197,109,.26);
        border-radius: .72rem;
        background: rgba(201,151,45,.055);
        color: var(--lucerne-gold-hi);
        box-shadow: inset 0 1px rgba(255,255,255,.025);
      }

      .page-lucerne-v3 .lucerne-icon svg {
        width: 1.25rem;
        height: 1.25rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .page-lucerne-v3 .lucerne-metrics-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: .55rem;
      }

      .page-lucerne-v3 .lucerne-metric {
        min-width: 0;
        padding: .8rem;
        border: 1px solid rgba(232,197,109,.13);
        border-radius: .82rem;
        background: rgba(4,5,4,.44);
        transition: transform .28s ease, border-color .28s ease, background .28s ease;
      }

      .page-lucerne-v3 .lucerne-metric:hover {
        transform: translateY(-3px);
        border-color: rgba(232,197,109,.34);
        background: rgba(201,151,45,.045);
      }

      .page-lucerne-v3 .lucerne-metric .lucerne-icon {
        margin-bottom: .65rem;
      }

      .page-lucerne-v3 .lucerne-metric strong {
        display: block;
        margin-bottom: .28rem;
        color: var(--lucerne-ivory);
        font-size: .9rem;
        line-height: 1.2;
      }

      .page-lucerne-v3 .lucerne-metric span {
        display: block;
        color: var(--lucerne-muted);
        font-size: .77rem;
        line-height: 1.38;
      }

      .page-lucerne-v3 .lucerne-use-map {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: .65rem;
      }

      .page-lucerne-v3 .lucerne-use-node {
        position: relative;
        min-height: 9.5rem;
        padding: .95rem;
        border: 1px solid rgba(232,197,109,.14);
        border-radius: .9rem;
        background: linear-gradient(145deg, rgba(18,20,15,.86), rgba(7,8,7,.76));
      }

      .page-lucerne-v3 .lucerne-use-node:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 2rem;
        left: calc(100% + 1px);
        width: .65rem;
        height: 1px;
        background: linear-gradient(90deg, rgba(232,197,109,.42), rgba(232,197,109,.08));
      }

      .page-lucerne-v3 .lucerne-use-node .lucerne-icon {
        margin-bottom: .75rem;
      }

      .page-lucerne-v3 .lucerne-use-node strong {
        display: block;
        margin-bottom: .35rem;
        color: var(--lucerne-gold-hi);
        font-size: .94rem;
      }

      .page-lucerne-v3 .lucerne-use-node p {
        margin: 0;
        color: var(--lucerne-muted);
        font-size: .8rem;
        line-height: 1.42;
      }

      .page-lucerne-v3 .product-flow-list {
        position: relative;
        overflow: visible;
      }

      .page-lucerne-v3 .product-flow-list::before {
        content: "";
        position: absolute;
        z-index: 0;
        top: 2.05rem;
        right: 10%;
        left: 10%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(232,197,109,.32) 12%, rgba(232,197,109,.32) 88%, transparent);
        box-shadow: 0 0 1.2rem rgba(232,197,109,.12);
        pointer-events: none;
      }

      .page-lucerne-v3 .product-flow-list li {
        position: relative;
        z-index: 1;
        overflow: hidden;
      }

      .page-lucerne-v3 .product-flow-list li::after {
        content: "";
        position: absolute;
        top: -2.4rem;
        right: -2.4rem;
        width: 5.2rem;
        aspect-ratio: 1;
        border: 1px solid rgba(232,197,109,.11);
        border-radius: 50%;
      }

      .page-lucerne-v3 .product-flow-icon {
        position: relative;
        z-index: 2;
        display: grid !important;
        width: 2.5rem;
        height: 2.5rem;
        place-items: center;
        border: 1px solid rgba(232,197,109,.3);
        border-radius: .72rem;
        background: #0c0e0b;
        color: var(--lucerne-gold-hi) !important;
        box-shadow: 0 0 0 .4rem rgba(5,6,5,.7), 0 .8rem 1.5rem rgba(0,0,0,.16);
      }

      .page-lucerne-v3 .product-flow-icon svg {
        width: 1.3rem;
        height: 1.3rem;
      }

      .page-lucerne-v3 .product-flow-list li strong {
        position: relative;
        z-index: 1;
      }

      @media (max-width: 63.99rem) {
        .page-lucerne-v3 .lucerne-metrics-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .page-lucerne-v3 .lucerne-use-map {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .page-lucerne-v3 .lucerne-use-node::after,
        .page-lucerne-v3 .product-flow-list::before {
          display: none;
        }
      }

      @media (max-width: 47.99rem) {
        .page-lucerne-v3 .product-section {
          padding-block: 3rem !important;
        }

        .page-lucerne-v3 .product-request {
          padding-block: 3.25rem !important;
        }

        .page-lucerne-v3 .lucerne-infographic {
          margin-top: 1.1rem;
          padding: .8rem;
          border-radius: 1rem;
        }

        .page-lucerne-v3 .lucerne-infographic-head {
          display: grid;
          align-items: start;
          gap: .4rem;
        }

        .page-lucerne-v3 .lucerne-metrics-grid,
        .page-lucerne-v3 .lucerne-use-map {
          grid-template-columns: 1fr 1fr;
        }

        .page-lucerne-v3 .lucerne-use-node {
          min-height: 0;
        }
      }

      @media (max-width: 28rem) {
        .page-lucerne-v3 .lucerne-metrics-grid,
        .page-lucerne-v3 .lucerne-use-map {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(enhancementStyle);

    const icon = (type) => {
      const icons = {
        seed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20c0-7 3-11 8-14-1 7-3.8 11-8 14Z"/><path d="M12 20C11 13 8.5 9 4 6c0 7 2.8 11 8 14Z"/><path d="M12 20v-8"/></svg>',
        layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/></svg>',
        calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v14H5z"/><path d="M8 3v6M16 3v6M5 10h14"/></svg>',
        shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.7-2.5 7.8-7 10-4.5-2.2-7-5.3-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
        sprout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-9"/><path d="M12 13c-4.5 0-7-2.2-7-6 4.5 0 7 2.2 7 6Z"/><path d="M12 11c0-4 2.5-6 7-6 0 4-2.5 6-7 6Z"/></svg>',
        package: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5V18l-8 4-8-4V8.5Z"/><path d="m4 8.5 8 4 8-4M12 12.5V22"/></svg>',
        bale: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="5"/><path d="M8 7v10M16 7v10"/></svg>',
        silo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10v12H7z"/><path d="M7 8c0-3 2-5 5-5s5 2 5 5M5 20h14"/><path d="M10 12h4M10 15h4"/></svg>',
        leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M7 18c3-5 6-7 10-10"/></svg>',
        pasture: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20c2-4 4-6 6-7M10 20c1.5-5 3.5-8 6-11M16 20c.7-4 2-6.5 4-8"/><path d="M4 20h16"/></svg>'
      };
      return icons[type] || icons.seed;
    };

    const partyGrid = document.querySelector('.product-party .product-party-grid');
    if (partyGrid && !document.querySelector('[data-lucerne-party-infographic]')) {
      partyGrid.insertAdjacentHTML('afterend', `
        <div class="lucerne-infographic" data-lucerne-party-infographic aria-label="Инфографика характеристик партии">
          <div class="lucerne-infographic-head">
            <strong>Паспорт доступной партии</strong>
            <span>Ключевые параметры, которые можно запросить перед согласованием поставки.</span>
          </div>
          <div class="lucerne-metrics-grid">
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('seed')}</span><strong>Сорт</strong><span>Конкретная позиция выбранной партии</span></div>
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('layers')}</span><strong>Репродукция</strong><span>Происхождение и категория семян</span></div>
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('calendar')}</span><strong>Год урожая</strong><span>Актуальность семенного материала</span></div>
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('shield')}</span><strong>Чистота</strong><span>Подтверждённый показатель качества</span></div>
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('sprout')}</span><strong>Всхожесть</strong><span>Параметр для расчёта нормы высева</span></div>
            <div class="lucerne-metric"><span class="lucerne-icon">${icon('package')}</span><strong>Фасовка</strong><span>МКР / БИГ-БЭГ или ПП-мешок</span></div>
          </div>
        </div>
      `);
    }

    const useGrid = document.querySelector('.product-use .product-use-grid');
    if (useGrid && !document.querySelector('[data-lucerne-use-infographic]')) {
      useGrid.insertAdjacentHTML('afterend', `
        <div class="lucerne-infographic" data-lucerne-use-infographic aria-label="Инфографика применения люцерны">
          <div class="lucerne-infographic-head">
            <strong>Четыре основных сценария использования</strong>
            <span>Одна культура закрывает несколько задач кормопроизводства — от заготовки до сезонного кормления.</span>
          </div>
          <div class="lucerne-use-map">
            <div class="lucerne-use-node"><span class="lucerne-icon">${icon('bale')}</span><strong>Сено</strong><p>Заготовка питательного объёмного корма для хозяйства.</p></div>
            <div class="lucerne-use-node"><span class="lucerne-icon">${icon('silo')}</span><strong>Сенаж</strong><p>Консервирование зелёной массы для стабильного рациона.</p></div>
            <div class="lucerne-use-node"><span class="lucerne-icon">${icon('leaf')}</span><strong>Зелёная масса</strong><p>Использование в период активной вегетации культуры.</p></div>
            <div class="lucerne-use-node"><span class="lucerne-icon">${icon('pasture')}</span><strong>Сенокосно-пастбищные системы</strong><p>Комбинированный сценарий для кормовой базы хозяйства.</p></div>
          </div>
        </div>
      `);
    }
  }

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
