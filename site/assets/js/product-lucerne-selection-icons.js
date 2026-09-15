(() => {
  if (!document.body.classList.contains('page-lucerne-v3')) return;

  const items = [...document.querySelectorAll('.product-guide ol li')].slice(0, 4);
  if (!items.length) return;

  const icons = [
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20v-8"/><path d="M12 13c-4.3 0-6.8-2.1-6.8-5.8 4.2 0 6.8 2.1 6.8 5.8Z"/><path d="M12 11c0-3.9 2.5-6 6.8-6 0 3.9-2.5 6-6.8 6Z"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 7.5h15v9h-15z"/><path d="M8 7.5v9M12 7.5v9M16 7.5v9M4.5 12h15"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5.5h10l2 4v9.5H5V9.5l2-4Z"/><path d="M8 9.5h8"/><path d="M9.5 14h5"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s6-5.2 6-10.2a6 6 0 1 0-12 0C6 15.8 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/></svg>'
  ];

  items.forEach((item, index) => {
    if (item.querySelector('.product-selection-icon')) return;
    item.insertAdjacentHTML('afterbegin', `<span class="product-selection-icon" aria-hidden="true">${icons[index]}</span>`);
  });
})();
