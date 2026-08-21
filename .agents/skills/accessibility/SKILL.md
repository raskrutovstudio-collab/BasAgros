---
name: accessibility
description: Аудит и исправление accessibility/a11y/WCAG, keyboard, labels, alt, focus, screen reader.
---
# Accessibility
- semantic header/nav/main/footer/headings;
- native button/a instead of click-div;
- logical Tab order and visible focus;
- menu/popup/accordion/tabs/forms work without mouse;
- modal focus trap, Escape, return focus;
- linked label for each field;
- errors not communicated by color only;
- informative img have alt, decorative alt="";
- icon buttons have accessible name;
- sufficient contrast;
- zoom/reflow friendly;
- respect prefers-reduced-motion.
Prefer native HTML; ARIA must not mask wrong semantics.
