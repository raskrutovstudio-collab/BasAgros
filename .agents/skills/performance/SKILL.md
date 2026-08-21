---
name: performance
description: Оптимизация PageSpeed/Lighthouse, images/fonts/CSS/JS и mobile performance.
---
# Performance Optimization
Goal: faster site without harming design, SEO, analytics, forms or functionality.

Process: baseline → find LCP/blocking/images/fonts/third-party → small changes → regression check.

Images: right sizes, WebP/AVIF, dimensions, below-fold lazy, LCP not lazy, responsive sources.
Fonts: WOFF2, only needed weights, conscious font-display, only critical preload.
CSS: remove large unused/duplicate blocks, compact critical CSS.
JS: defer/async by purpose, no heavy lib for one function, no duplicate handlers.
Do not delete analytics/forms/CRM/chat/maps without agreement.
