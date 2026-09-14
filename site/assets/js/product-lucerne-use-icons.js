(() => {
  if (!document.body.classList.contains('page-lucerne-v3')) return;

  const nodes = document.querySelectorAll('[data-lucerne-use-infographic] .lucerne-use-node .lucerne-icon');
  if (!nodes.length) return;

  const icons = [
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 8.5h11a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/><path d="M8.5 8.5v8M15.5 8.5v8"/><path d="M6 12.5h12"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 20V9.5c0-2.7 1.7-4.5 4-4.5s4 1.8 4 4.5V20"/><path d="M6 20h12"/><path d="M8 10h8"/><path d="M10 13h4M10 16h4"/><path d="M16 20v-5l2.5-2.3"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.5 4.5c-6.8.2-11.4 4.1-11.4 9.1 0 2.9 1.9 5.1 4.7 5.1 5.4 0 8.8-4.7 8.7-14.2Z"/><path d="M9.7 17.3c2.4-3.9 5-6.3 8.3-8"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 19.5h16"/><path d="M6.3 19.5c.8-2.8 1.9-5 3.5-6.9"/><path d="M10.8 19.5c.8-3.5 2.2-6.3 4.2-8.7"/><path d="M15.7 19.5c.6-2.4 1.5-4.4 2.9-6"/><path d="M8.7 10.3 10.2 7M14.1 9.3 15.7 6"/></svg>'
  ];

  nodes.forEach((node, index) => {
    if (icons[index]) node.innerHTML = icons[index];
  });
})();
