(() => {
  if (!document.body.classList.contains('page-lucerne-v3')) return;

  const version = '20260915-27';

  const ensureStyle = (href, marker) => {
    if (document.querySelector(`link[${marker}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=${version}`;
    link.setAttribute(marker, 'true');
    document.head.appendChild(link);
  };

  ensureStyle('/assets/css/product-lucerne-selection-icons.css', 'data-lucerne-selection-icons');
  ensureStyle('/assets/css/product-lucerne-guide-balance.css', 'data-lucerne-guide-balance');
  ensureStyle('/assets/css/product-lucerne-agronomy-fix.css', 'data-lucerne-agronomy-fix');
  ensureStyle('/assets/css/product-lucerne-rhythm-v2.css', 'data-lucerne-rhythm-v2');
  ensureStyle('/assets/css/product-lucerne-backtop.css', 'data-lucerne-backtop');
  ensureStyle('/assets/css/product-lucerne-radius-system.css', 'data-lucerne-radius-system');
  ensureStyle('/assets/css/product-lucerne-party-image.css', 'data-lucerne-party-image');
  ensureStyle('/assets/css/product-lucerne-flow-steps.css', 'data-lucerne-flow-steps');

  const commercialCard = document.querySelector('[data-lucerne-commercial-flow] .product-commercial-card');
  if (commercialCard) {
    const links = commercialCard.querySelector('.product-commercial-links');
    const actions = commercialCard.querySelector('.product-actions');
    if (links && actions && actions.previousElementSibling !== links) {
      actions.classList.add('product-commercial-actions-bottom');
      links.insertAdjacentElement('afterend', actions);
    }
  }

  const partyInfographic = document.querySelector('[data-lucerne-party-infographic]');
  if (partyInfographic && !partyInfographic.querySelector('.lucerne-party-visual')) {
    const visual = document.createElement('figure');
    visual.className = 'lucerne-party-visual';
    visual.innerHTML = '<img src="/assets/img/products/lucerne-party-quality.webp?v=20260915-27" width="250" height="300" alt="Семена люцерны на фоне поля" loading="lazy" decoding="async">';
    const head = partyInfographic.querySelector('.lucerne-infographic-head');
    if (head) head.insertAdjacentElement('beforebegin', visual);
    else partyInfographic.prepend(visual);
  }

  const flowSection = document.querySelector('.product-flow');
  if (flowSection) {
    const intro = flowSection.querySelector('.product-two-col > div:first-child');
    if (intro && !intro.querySelector('.product-flow-cta')) {
      const cta = document.createElement('a');
      cta.className = 'home-btn home-btn-primary product-flow-cta';
      cta.href = '#request';
      cta.dataset.productModalIntent = 'commercial_offer';
      cta.textContent = 'Оставить заявку';
      intro.appendChild(cta);
    }

    flowSection.querySelectorAll('.product-flow-list li').forEach((item, index) => {
      if (item.querySelector('.product-flow-step-number')) return;
      const number = document.createElement('span');
      number.className = 'product-flow-step-number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');
      item.appendChild(number);
    });
  }

  const useNodes = document.querySelectorAll('[data-lucerne-use-infographic] .lucerne-use-node .lucerne-icon');
  const useIcons = [
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 8.5h11a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/><path d="M8.5 8.5v8M15.5 8.5v8"/><path d="M6 12.5h12"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 20V9.5c0-2.7 1.7-4.5 4-4.5s4 1.8 4 4.5V20"/><path d="M6 20h12"/><path d="M8 10h8"/><path d="M10 13h4M10 16h4"/><path d="M16 20v-5l2.5-2.3"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.5 4.5c-6.8.2-11.4 4.1-11.4 9.1 0 2.9 1.9 5.1 4.7 5.1 5.4 0 8.8-4.7 8.7-14.2Z"/><path d="M9.7 17.3c2.4-3.9 5-6.3 8.3-8"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 19.5h16"/><path d="M6.3 19.5c.8-2.8 1.9-5 3.5-6.9"/><path d="M10.8 19.5c.8-3.5 2.2-6.3 4.2-8.7"/><path d="M15.7 19.5c.6-2.4 1.5-4.4 2.9-6"/><path d="M8.7 10.3 10.2 7M14.1 9.3 15.7 6"/></svg>'
  ];

  useNodes.forEach((node, index) => {
    if (useIcons[index]) node.innerHTML = useIcons[index];
  });

  const selectionItems = [...document.querySelectorAll('.product-guide ol li')].slice(0, 4);
  const selectionIcons = [
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20v-8"/><path d="M12 13c-4.3 0-6.8-2.1-6.8-5.8 4.2 0 6.8 2.1 6.8 5.8Z"/><path d="M12 11c0-3.9 2.5-6 6.8-6 0 3.9-2.5 6-6.8 6Z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 7.5h15v9h-15z"/><path d="M8 7.5v9M12 7.5v9M16 7.5v9M4.5 12h15"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5.5h10l2 4v9.5H5V9.5l2-4Z"/><path d="M8 9.5h8"/><path d="M9.5 14h5"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s6-5.2 6-10.2a6 6 0 1 0-12 0C6 15.8 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/></svg>'
  ];

  selectionItems.forEach((item, index) => {
    if (item.querySelector('.product-selection-icon')) return;
    item.insertAdjacentHTML('afterbegin', `<span class="product-selection-icon" aria-hidden="true">${selectionIcons[index]}</span>`);
  });
})();
