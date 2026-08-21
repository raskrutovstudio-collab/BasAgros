---
name: lp-motor-clean-migration
description: Перенос/пересборка страницы или сайта из LP Motor/Mottor в чистый HTML/CSS/JS.
---
# LP Motor Clean Migration
Source is visual/content/function reference; source DOM/CSS/JS/runtime is NOT architecture.

Forbidden:
- copying full source HTML/DOM;
- wget/HTTrack/Save Page recursive mirror;
- public.bundle/runtime/vendor/editor/lpmotor/motor;
- hidden desktop/mobile duplicates;
- mechanical inline CSS/JS;
- blind counters/pixels/forms copy;
- dependency on source domain/CDN;
- iframe source page;
- large base64 assets;
- arbitrary redesign;
- unrelated page changes;
- commit/push/deploy without command.

Process:
1. git status.
2. Study AGENTS/rules/components/forms/analytics/SEO/assets.
3. Reference screenshots 1440 and 390.
4. Map sections/forms/popup/menu/FAQ/tabs/slider/video/events.
5. Select only used assets.
6. New semantic HTML from scratch.
7. New CSS without builder bundle.
8. Vanilla JS only for real functions.
9. Responsive images/fonts/LCP optimization.
10. Forms connect to new project mechanism.
11. Preserve SEO/analytics without duplicates.
12. QA 1920/1440/1280/1024/768/390/360.
13. Quality gate + Lighthouse x3.
