# Design QA — BAS Agros homepage

final result: blocked

## Visual target

- Approved reference: `/workspace/scratch/7ac0d3b42d89/upload/2.png`
- Required comparison viewports: 1400 px desktop and 390 px mobile
- Reference state: default page state

## Published implementation

- Production URL: `https://basagros.kz/`
- Published branch: `work/cursor`
- Visual implementation commit: `3fe84b3432ff3f31507c8089dc053db7c4d38d12`
- Cache-busting follow-up commit: `f66a04d58c6030554d3f51b372ecd062e2047b38`

## Playwright evidence

- Cloud Playwright desktop viewport: 1363 × 936 CSS px.
- Header height: 69 px.
- Hero height: 500 px.
- H1: 47.02 px, three lines, 143.91 px total height.
- Page height: 5498 px.
- Horizontal overflow: none.
- All 17 responsive images load successfully after lazy-load traversal.
- FAQ accordion opens by click and exposes the visible answer.
- Two forms remain deliberately disabled; no fictitious successful submission is possible.
- One H1, absolute self-canonical and prelaunch `noindex, nofollow` are present.
- Page console has no site-originated errors. The only logged errors come from the cloud-browser extension.

## Visual comparison result

- Desktop composition now follows the approved reference: compact 69 px header, three-line H1, 500 px two-column hero, four navigation links under the hero, four solution directions, dominant Travosmesi catalog card, horizontal `Who → Task → Catalog direction` infographic, green selection section, corporate collage, delivery/quality split, editorial blog, two-column FAQ, final request block and expanded footer.
- The generated field, seed, pasture, hay, phacelia, forage, sorghum and neutral quality images are loaded from local AVIF/WebP assets.
- The live page has no horizontal overflow at the available desktop viewport.

## Remaining blocker

- The available cloud browser has a fixed 1363 px viewport and does not expose viewport resizing or mobile emulation. The local Lighthouse/Playwright environment has no usable Chrome/Chromium binary. Therefore the mandatory same-state screenshots at exactly 1400 px and 390 px cannot be produced in this environment.
- The mobile CSS covers the required breakpoints and the earlier 390 px baseline was used during implementation, but a new exact 390 px Playwright capture is still required before changing this report to `final result: passed`.

## Required next evidence

Capture the published homepage at exactly 1400 px and 390 px in a Playwright environment with viewport control, compare both captures with the approved reference, and change this report to `final result: passed` only if no P0/P1/P2 visual differences remain.
