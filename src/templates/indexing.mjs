const INDEXABLE_URLS = new Set([
  '/',
  '/catalog/travosmesi/',
  '/catalog/mnogoletnie-kormovye-travy/lyutserna/'
]);

const ALWAYS_INDEXABLE_URLS = new Set([
  '/catalog/travosmesi/'
]);

export function isIndexablePage(page) {
  return INDEXABLE_URLS.has(page?.url);
}

export function indexableUrls() {
  return [...INDEXABLE_URLS];
}

export function pageRobots(page) {
  if (ALWAYS_INDEXABLE_URLS.has(page?.url)) return 'index, follow';
  return isIndexablePage(page) ? 'index, follow' : 'noindex, nofollow';
}
