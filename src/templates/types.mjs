export const PAGE_TYPE_TO_TEMPLATE = {
  homepage: 'homepage',
  catalog_hub: 'catalog_hub',
  category: 'category',
  culture_hub: 'culture',
  product: 'product',
  service: 'commercial_service',
  trust: 'commercial_service',
  corporate: 'corporate',
  faq_hub: 'faq_hub',
  content_hub: 'article_hub',
  article: 'article',
  solution: 'solution'
};

export const ALLOWED_TEMPLATE_TYPES = new Set(Object.values(PAGE_TYPE_TO_TEMPLATE));

export function assertKnownTypes(page) {
  if (!Object.hasOwn(PAGE_TYPE_TO_TEMPLATE, page.page_type)) {
    throw new Error(`Неизвестный page_type: ${page.page_type} (${page.page_id} ${page.url})`);
  }
  if (!ALLOWED_TEMPLATE_TYPES.has(page.template_type)) {
    throw new Error(`Неизвестный template_type: ${page.template_type} (${page.page_id} ${page.url})`);
  }
  const expected = PAGE_TYPE_TO_TEMPLATE[page.page_type];
  if (page.template_type !== expected) {
    throw new Error(
      `Несоответствие типов ${page.page_id}: page_type=${page.page_type} ожидает template_type=${expected}, сейчас ${page.template_type}`
    );
  }
}
