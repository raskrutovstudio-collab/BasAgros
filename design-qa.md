# Design QA — BAS Agros homepage

final result: blocked

## Visual target

- Approved reference: `/workspace/scratch/7ac0d3b42d89/upload/2.png`
- Required comparison viewports: 1400 px desktop and 390 px mobile
- Reference state: default page state

## Implementation capture

- Desktop baseline supplied by the user: `/workspace/scratch/7ac0d3b42d89/upload/пк.pdf`
- Mobile baseline supplied by the user: `/workspace/scratch/7ac0d3b42d89/upload/моб.pdf`
- Rendered desktop baseline: `tmp/pdfs/desktop-current.png`
- Rendered mobile baseline: `tmp/pdfs/mobile-current.png`
- These captures show commit `0931a9d` before the current CSS correction pass.

## Blocking conditions

- The local Chromium binary available to Playwright is incomplete and exits with a segmentation fault before launch.
- Downloading a replacement Playwright browser is truncated by the current network path.
- The cloud Playwright browser is not permitted to open the GitHub Pages host for this repository.
- `https://basagros.kz/` currently returns `502 Bad Gateway` because upstream TLS verification rejects the self-signed certificate.
- A new implementation capture is required after the current correction pass; the supplied PDFs document only the previous deployed build.

## Work completed before the gate

- Corrected the desktop content density and heading scale toward the approved 1400 px composition.
- Changed the hero category links to four columns on desktop.
- Changed the catalog to one four-column row with a dominant featured direction.
- Changed the compact selection form to a three-column desktop grid.
- Reduced oversized section spacing and aligned the major section proportions with the reference.
- `npm run quality:all` passes after the changes.

## Required next evidence

Capture the built homepage at 1400 px and 390 px in Playwright, compare each against the approved reference, fix all P0/P1/P2 visual differences, and change this report to `final result: passed` before publishing.
