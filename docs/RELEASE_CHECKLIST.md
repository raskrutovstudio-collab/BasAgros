# Production Release Checklist

## Code
- [ ] `git status` понятен.
- [ ] Нет несвязанных изменений.
- [ ] `npm run quality:all` — PASS.
- [ ] `git diff --check` — PASS.
- [ ] Secrets scan — PASS.

## HTML / SEO
- [ ] `lang`, charset, viewport.
- [ ] Один H1.
- [ ] Unique Title.
- [ ] Unique Description.
- [ ] Absolute self-canonical.
- [ ] Correct robots/indexability.
- [ ] Crawlable internal links.
- [ ] Breadcrumbs correct.
- [ ] JSON-LD valid and truthful.

## Performance
- [ ] First screen не зависит от JS.
- [ ] Реальный LCP определён.
- [ ] LCP image не lazy.
- [ ] Max one `fetchpriority="high"`.
- [ ] Responsive image sources.
- [ ] Image dimensions/aspect ratio.
- [ ] Below-fold images lazy.
- [ ] WOFF2 / only required font weights.
- [ ] Нет лишних blocking JS/CSS.
- [ ] Нет builder runtime.

## Lighthouse mobile
- [ ] 3 runs.
- [ ] Каждый Performance >= 90.
- [ ] Target median >= 95.
- [ ] Accessibility >= 95, target 100.
- [ ] SEO = 100.
- [ ] LCP <= 2.5 s target.
- [ ] CLS <= 0.05 target.
- [ ] TBT <= 100 ms target.

## Responsive
- [ ] 360.
- [ ] 390.
- [ ] 412.
- [ ] 430.
- [ ] 768.
- [ ] 1280.
- [ ] 1440.
- [ ] Нет horizontal scroll.
- [ ] Нет overlap/cropped text.

## Functions
- [ ] Menu.
- [ ] CTA.
- [ ] Forms validation.
- [ ] Success/error.
- [ ] Consent.
- [ ] Popup/Escape/focus.
- [ ] FAQ/tabs/slider.
- [ ] Phone/WhatsApp/email.
- [ ] Console clean.
- [ ] Network без 404/403.

## Release
- [ ] URL/redirect changes approved.
- [ ] Analytics changes approved.
- [ ] Production test conversions approved.
- [ ] Production deploy explicitly requested.
