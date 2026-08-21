export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function childrenOf(pageId, pages) {
  return pages
    .filter((page) => page.parent_id === pageId)
    .slice()
    .sort((a, b) => a.page_id.localeCompare(b.page_id));
}

export function breadcrumbsOf(page, byId) {
  const chain = [];
  const seen = new Set();
  let current = page;
  while (current && !seen.has(current.page_id)) {
    seen.add(current.page_id);
    chain.unshift(current);
    current = current.parent_id ? byId.get(current.parent_id) : null;
  }
  return chain;
}

export function pageByUrl(pages, url) {
  return pages.find((page) => page.url === url);
}

export function joinSections(sections) {
  return sections
    .map((section) => String(section || '').replace(/^\s*\n/, '').replace(/\s+$/g, ''))
    .filter(Boolean)
    .join('\n');
}
