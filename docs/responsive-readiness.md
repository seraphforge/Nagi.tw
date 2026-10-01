# Responsive and identity readiness — source review

No screenshot review was completed. This document does **not** certify visual QA. Automated DOM/layout checks supplement the source audit.

| Width | Source behavior reviewed |
| --- | --- |
| 375px | 343px content area, compact menu/brand/language controls; section/topic grids collapse; footer stacks; article byline and previous/next navigation stack |
| 768px | 720px content area; menu remains collapsed; section headers use a shrinkable first column; article sidebar becomes a block above prose; footer links wrap |
| 1024px | 976px content area; menu stays collapsed through 1050px; article reading grid reserves 13rem for contents and lets prose shrink; tables/pre scroll within prose |
| 1440px | Content capped at 1120px; full six-link navigation and locale controls; bounded reading column and contents sidebar; footer columns have room to wrap |

Narrow structural corrections only:

- Global `overflow-wrap: anywhere` allows long English words/URLs and mixed-script titles to wrap. CJK text keeps normal line-breaking opportunities; there is no `word-break: keep-all` or forced single-line heading.
- Grid content/prose have `min-width: 0`; previous/next article columns use `minmax(0, 1fr)`.
- Images have bounded width and automatic height. Existing cover sizing remains unchanged.
- Preformatted blocks and tables have `max-width: 100%` and local horizontal scrolling; code keeps its formatting rather than forcing the entire page wider.
- Article language links can wrap. The compact header uses a smaller gap, and its menu is positioned at `top: 100%` instead of overlapping the 68px header at 60px; tall menus can scroll.
- Existing footer wrapping/stacking is retained, with Contact added as a secondary link.

The runtime validator now covers 320, **375**, 390, **768**, **1024**, and **1440** pixels in every language, including the article-reading layout. Passing geometric checks cannot establish line-break aesthetics, visual balance, color rendering or screenshot-level correctness.

## Penguin

`public/nagi-penguin.svg` is byte-identical to the previous primary site's source and the copy in `dist/`. [SHA-256 baseline](penguin-preservation.json). The SVG's original explicit colors are unchanged. No `fill:`/`filter:` CSS overrides are present; this app uses the existing light color scheme and has no theme-dependent penguin treatment. The image remains 24px and decorative within the keyboard-accessible brand link. There is no “Hello, world!” interaction, so no separate easter-egg keyboard behavior exists to test.
