# Design QA — compact lucerne specifications

final result: passed

---

# Design QA — lucerne hero price line break

final result: passed

## Comparison target

- Source visual truth: `/workspace/scratch/06acb4949b46/upload/b0421eb7-c67e-4749-b8a1-66fd5e037243.png` (850 × 345 px).
- Implementation: locally built lucerne product page in the cloud browser.
- Implementation screenshot: browser-rendered in-session capture at a 1363 × 936 CSS px viewport and 1× density; the cloud browser did not expose a reusable filesystem path.
- State: product hero immediately after page load.

## Evidence

- The source image and implementation screenshot were opened together in one comparison input.
- The supplied reference shows the price continuing inside the audience paragraph.
- The implementation preserves the approved typography and hero layout while placing «Базовая цена…» on a new visual line.
- Computed layout: `.product-lead-price` is `display: block`, begins below the preceding text, and has a 6.9 px visual gap.
- Focused DOM evidence was sufficient because the requested change concerns one readable text boundary; no image asset changed.

## Fidelity surfaces

- Fonts and typography: existing family, weight, size, line height, color, and text width are unchanged.
- Spacing and layout rhythm: only a small `.35rem` gap was added before the price line; surrounding hero spacing is unchanged.
- Colors and tokens: inherited text and background colors are unchanged.
- Image quality: the field and seed images are unchanged.
- Copy and content: the approved audience, price, availability, and delivery wording is unchanged; only the line break changed.

## Findings and comparison history

- Initial P2: the price began on the same line as the audience copy in the supplied screenshot.
- Fix: wrapped the price sentence in a block-level `.product-lead-price` element.
- Post-fix evidence: the price starts on a separate line without clipping, overflow, or hero regression.
- No remaining P0/P1/P2 findings.

## Browser and functional checks

- Header, breadcrumbs, hero image, two fact cards, CTA buttons, and helper copy remain visible.
- The page contains the expected title and complete lucerne lead copy.
- Console: no site-originated errors; the only logged error belongs to the cloud-browser extension.
- Build: `npm run quality:all` passed; 59 pages, 0 audit errors, 0 warnings, 0 broken internal links, 0 indexing errors.

## Comparison target

- Source visual truth: `/workspace/scratch/06acb4949b46/upload/291fb67c-2750-47a9-9baf-42146db3712f.png`.
- Source pixels: 1788 × 777; desktop default state; native screenshot density.
- Implementation: `https://basagros.kz/catalog/mnogoletnie-kormovye-travy/lyutserna/#product-specs-title` at commit `a303f6252446cbccbc8cce7983648ac2f57f92e4`.
- Implementation screenshot: browser-rendered in-session capture from the production URL; the cloud browser did not expose a reusable filesystem path.
- Implementation viewport and pixels: 1363 × 920 CSS px and 1363 × 920 screenshot px; density normalized at 1 CSS px per screenshot pixel.
- State: published desktop section after GitHub Pages workflow 95.

## Evidence

- The source and implementation screenshots were placed in the same comparison input.
- The source used two columns and five rows of characteristics. The implementation uses three columns and four rows at the available desktop viewport.
- The published section height is 432 px; first card height is 51 px; card padding is 8.64 × 10.56 px; gaps are 7.2 × 8.8 px.
- Twelve characteristics remain visible and unchanged. Horizontal overflow is 0 px.
- A separate focused crop was unnecessary because labels, values, borders, padding, and wrapping were readable in the combined full-view comparison.

## Fidelity surfaces

- Fonts and typography: existing family, weight hierarchy, capitalization, and colors are preserved; smaller label/value sizing remains readable.
- Spacing and layout rhythm: section padding, card padding, inter-card gaps, and total height are reduced; desktop grid is compact without crowding.
- Colors and tokens: existing white cards, pale section background, green values, gray labels, borders, and radii are unchanged.
- Image quality: the section contains no raster or decorative image assets, so no image fidelity issue applies.
- Copy and content: all 12 labels and values are unchanged.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: none required for this iteration.

## Comparison history

1. Initial evidence showed a tall two-column, five-row grid with generous card and section spacing.
2. Fix applied: three desktop columns, four rows, reduced card padding and gaps, reduced section padding, responsive two-column tablet and one-column mobile rules.
3. Post-fix evidence: production grid measures three equal 261.656 px columns, 432 px section height, 51 px first-card height, and no horizontal overflow.

## Browser and functional checks

- Primary interaction: this information section has no interactive control; surrounding page navigation remains rendered.
- Console: no site-originated warnings or errors. Logged errors belong only to the cloud-browser extension.
- CSS cache key: `product.css?v=20260828-9`.
- Build: `npm run quality:all` passed; 59 pages, 0 audit errors, 0 broken internal links, 0 indexing errors.
- Deployment: GitHub Actions workflow 95, `Validate and build site` success, `Deploy to GitHub Pages` success.

## Implementation checklist

- [x] Preserve all characteristics and wording.
- [x] Compact desktop grid to three columns.
- [x] Reduce vertical rhythm and card padding.
- [x] Preserve responsive two-column tablet and one-column mobile layouts.
- [x] Verify production CSS, layout metrics, overflow, build, and deployment.

---

# Design QA — mobile lucerne breadcrumbs

final result: passed

## Comparison target

- Source visual truth: `/workspace/scratch/06acb4949b46/upload/0e04d12b-0c8c-4e14-867c-6bf6d0e5f702.png` (808 × 628).
- Implementation: browser-rendered lucerne product page inside a 390 × 820 CSS px mobile viewport.
- Implementation screenshot: browser-rendered in-session capture; the cloud browser did not expose a reusable filesystem path.
- State: generated mobile product page after `npm run build:site`.

## Evidence

- Source and implementation screenshots were placed in one combined comparison input.
- Computed layout: `flex-direction: row`, `flex-wrap: wrap`, `align-items: center`, gap `5.6px 8px`, usable width `351px`.
- Row 1: «Главная» and «Каталог семян» at y=84.
- Row 2: «Многолетние кормовые травы» and «Люцерна» at y=107.
- All labels and arrow separators remain visible; there is no horizontal overflow or clipping.
- A focused crop was unnecessary because labels were readable and exact row positions were verified from rendered DOM geometry.

## Fidelity surfaces

- Fonts and typography: existing family, sizes, weights, colors, and line height are preserved.
- Spacing and layout rhythm: breadcrumbs occupy two compact rows instead of four, with even gaps.
- Colors and visual tokens: inherited text and separator colors are unchanged.
- Image quality: the breadcrumb component contains no raster or decorative assets; surrounding assets are unchanged.
- Copy and content: all four breadcrumb labels and URLs are unchanged.

## Findings and comparison history

- P0/P1/P2: none after the fix. P3: none required.
- Initial evidence: the global mobile rule forced every item onto its own row.
- Fix: a product-specific mobile override restores horizontal flow while preserving wrapping.
- Post-fix evidence: two items render on each of two rows at 390px.

## Browser and functional checks

- Breadcrumb links retain their original URLs and accessible navigation label.
- Header, hero, product facts, buttons, and fixed quick-action bar remain rendered without regression.
- Console: no site-originated errors; the only logged error belongs to the cloud-browser extension.
- CSS cache key: `product.css?v=20260828-11`.
- Build: `npm run quality:all` passed; 59 pages, 0 audit errors, 0 warnings, 0 broken internal links, 0 indexing errors.

---

# Design QA — desktop audience arrow controls

final result: passed

## Comparison target

- Source visual truth: `/workspace/scratch/eaf1b4c76392/upload/260b02c5-0f40-42ba-b776-2c9f31676e9c.png` (`1868 × 748`).
- Implementation screenshot: `/tmp/audience-arrow-comparison-final.png`, captured in the cloud browser.
- Implementation viewport: `1363 × 936` CSS px, DPR `1`.
- State: desktop, collapsed audience cards, first card selected by default.
- The viewport widths differ, so the comparison was scoped to the circular arrow controls rather than unrelated section proportions.

## Evidence and fidelity surfaces

- Source and implementation screenshots were placed in the same comparison input.
- Fonts, typography, imagery, copy, card geometry, circle size, and circle placement remain unchanged.
- The remaining arrow uses the existing `--gold-hi` token; computed color is `rgb(232, 197, 109)`.
- All desktop `.audience-scene-arrow` duplicates compute to `display: none`.
- Visible circular controls contain one glyph with center delta `0 px` horizontally and `-0.11 px` vertically.
- A focused region is sufficient because the requested correction affects only this control.

## Findings and comparison history

- P0/P1/P2: none after the fix. P3: none required.
- Initial P2: two arrows overlapped inside each circle and the link arrow inherited a white foreground color.
- Fix: hide the duplicate desktop trigger arrow, center the remaining link arrow with flex alignment, and enforce the existing gold token.
- Post-fix: one centered gold arrow remains in each visible circle.

## Browser and functional checks

- The second audience card opens successfully.
- Its trigger changes to `aria-expanded="true"` and its detail panel becomes visible.
- Mobile accordion arrows remain available because the duplicate is hidden only from `64rem` upward.
- No site-originated console errors were found; extension metadata errors were excluded.
- Build: `npm run quality:all` passed; 59 pages, 0 audit errors, 0 warnings, 0 broken internal links, 0 indexing errors.

---

# Design QA — lucerne product page in Home V3 style

final result: passed

## Comparison target

- Source visual truth: `https://basagros.kz/` — the approved BAS Agros homepage, captured in the cloud browser on 2026-09-14.
- Implementation: `http://terminal.local:4173/catalog/mnogoletnie-kormovye-travy/lyutserna/`.
- Source screenshot: browser-rendered in-session capture; the cloud browser did not expose a reusable filesystem path.
- Implementation screenshot: browser-rendered in-session capture; the cloud browser did not expose a reusable filesystem path.
- Source and implementation screenshot pixels: 1348 × 926 each.
- CSS viewport: 1363 × 936 px for both pages; device pixel ratio 1, so density was normalized.
- State: desktop, first screen, default state, sticky header at the top of the document.

## Evidence

- The approved homepage and the local lucerne page were captured at the same viewport and placed in the same comparison input twice: before and after the header correction.
- Both pages use the same carbon background, ivory display type, metallic-gold primary CTA, gold hairlines, muted body copy, dark header and real agricultural photography.
- The implementation keeps the product-specific information hierarchy: breadcrumbs, product title, price, delivery, party CTA and seed detail remain above the fold.
- A focused first-screen comparison was required because header density, display typography, CTA material, panel borders, image crop and text wrapping are all visible there.
- Additional browser-rendered checks covered the commercial form, footer, application cards and middle-page product panels. No image failed after lazy-loaded assets were brought into view.

## Fidelity surfaces

- Fonts and typography: the implementation mirrors the homepage's condensed uppercase display treatment, strong optical weight, compact heading leading and smaller neutral UI copy. Product text wraps without clipping.
- Spacing and layout rhythm: the homepage's large framed stage, generous outer margins, rounded panels, compact navigation and sectional breathing room are retained. The two-column product stage is an intentional product-page adaptation of the full-width homepage hero.
- Colors and visual tokens: carbon `#050605`, graphite panels, ivory text, muted ivory copy, metallic-gold gradients and translucent gold borders map directly to the approved homepage system. No legacy green remains in the page-specific theme.
- Image quality and asset fidelity: existing real lucerne field, seed and use-case photographs are retained; all loaded successfully with valid natural dimensions. No product image was replaced by a CSS drawing or placeholder.
- Copy and content: title, price, delivery geography, party characteristics, agronomic content, FAQ, form fields and SEO text remain unchanged. Only presentation and the missing header contact link were changed.

## Findings and comparison history

1. Initial P2: the first local comparison had eight header links and omitted «Контакты», while the approved homepage showed nine links.
2. Fix: added the product-page «Контакты» anchor and tightened desktop navigation spacing so all nine links, phone and CTA remain on one row.
3. Post-fix evidence: the second same-viewport comparison shows «Контакты» in the local header; the navigation reports 9 items, `scrollWidth === clientWidth`, and the document has no horizontal overflow.
4. No remaining P0, P1 or P2 findings. P3: the muted breadcrumb contrast is intentionally quieter than the hero and remains readable.

## Browser and functional checks

- H1 count: 1.
- Header: 9 navigation items; no wrapping or horizontal overflow at the desktop comparison viewport.
- Forms: 2 lead forms; both retain required phone input, honeypot and live status region.
- Product modal: commercial and party-characteristic variants open and close; the selection variant opens with 4 visible and enabled task fields.
- FAQ markup and all internal page content remain present; page build validation reports no broken links.
- Images: 8/8 rendered with non-zero natural width after lazy-load traversal.
- Console: no site-originated errors; cloud-browser extension metadata errors were excluded.
- Build: `npm run quality:all` passed; 59 generated pages, 0 audit errors, 0 warnings, 0 broken internal links, 0 indexing errors, 0 detected secrets.
- Lighthouse mobile could not start because this runtime has no Chrome/Chromium executable. This is a tooling gap, not a detected page defect; the responsive CSS includes dedicated 64rem and 48rem breakpoints and the release audit should be rerun in the project's normal Chrome environment before publication.

## Implementation checklist

- [x] Apply the approved dark/gold homepage system only to the lucerne product page.
- [x] Preserve product content, SEO metadata, schema and one-H1 hierarchy.
- [x] Keep nine header links, phone and CTA on one desktop row.
- [x] Restyle product cards, FAQ, forms, modal and footer consistently.
- [x] Preserve form handlers and test the three modal intent variants.
- [x] Run full project quality gates and browser visual comparison.
- [ ] Rerun the three mobile Lighthouse passes in an environment with Chrome before publication.
