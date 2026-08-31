const INDEXABLE_URLS = new Set([
  '/',
  '/catalog/mnogoletnie-kormovye-travy/lyutserna/'
]);

export function isIndexablePage(page) {
  return INDEXABLE_URLS.has(page?.url);
}

export function indexableUrls() {
  return [...INDEXABLE_URLS];
}

export function pageRobots(page) {
  return isIndexablePage(page) ? 'index, follow' : 'noindex, nofollow';
}
