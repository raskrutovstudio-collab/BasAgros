---
name: core-web-vitals
description: Диагностика и исправление LCP, CLS и INP / PageSpeed mobile.
---
# Core Web Vitals
Targets: LCP <=2.5s, INP <=200ms, CLS <=0.1 field; project release target can be stricter.

## LCP
1. Find exact LCP separately mobile/desktop.
2. Check TTFB, discovery, resource size, CSS/font render delay.
3. Hero image: not lazy, proper size, priority only when confirmed.
4. Do not hide problem by deleting first-screen content.

## CLS
Check dimensions, late banners/header/forms, font metrics, injected content, layout animations.
Reserve space before load.

## INP
Check long tasks, heavy click/scroll/input handlers, forced layout, third-party JS.
