---
id: platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md
title: Accessibility Checklist
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/accessibility-checklist.html
sourceHash: ad9e6c19fe2a1c4a4a7001c038cfdf215984c602
codeCheckedAgainst: "6.7.13.0"
keywords: ["accessibility", "a11y", "storefront", "semantic html", "aria-live", "role alert", "aria-describedby", "skip link", "skip-to-content-link", "focus management", "keyboard navigation", "screen reader", "live region"]
summary: "Storefront accessibility checklist: semantic HTML, labels, focus management, keyboard support, ARIA, live regions, skip links, modals, testing."
lastBuilt: 2026-09-15
---
## What it is

A checklist of principles and technical requirements for building accessible Shopware storefront interfaces: semantic structure, keyboard usability, screen reader compatibility and inclusive design.

## When to use

When building or reviewing storefront templates, themes or custom JavaScript widgets, and when auditing a shop for accessibility.

## Key steps / config

- **Semantic HTML**: use `<button>`, `<a>`, `<select>` for actions instead of `<div>`/`<span>`; structure with `<nav>`, `<main>`, `<header>`, `<footer>`; pair `<label>` with controls via `for`/`id` — `placeholder` alone is not a label.
- **Document language**: set `lang="en"` (or the matching code) on the `<html>` tag.
- **Forms**: label via `<label for="input-id">`, `aria-label` or `aria-labelledby`; clear, locatable error messages; do not signal errors by colour only (add icons/text); link help/error text with `aria-describedby`.
- **Focus**: `tabindex="0"` for custom interactive elements, otherwise keep the natural tab order; never remove focus outlines without a visible replacement; use `focus()` after form errors or opening a modal; every clickable/keyboard-reachable element needs visible focus indication.
- **Keyboard**: `Enter` and `Space` activate elements; no `onclick` on non-focusable elements without keyboard support; custom widgets handle arrow keys.
- **ARIA only when native HTML does not suffice**: `role="alert"` for live errors; `aria-expanded`, `aria-controls`, `aria-hidden` for toggles.
- **Live regions**: `aria-live="polite"` or `aria-live="assertive"` for real-time updates.
- **Titles and headings**: update `<title>` on load/route change; one `<h1>` per page with correct hierarchy.
- **Skip links** at the top of the page:
  ```html
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ```
  The installed storefront ships this as the `component_skip_to_content` template, whose `skip-to-content-link` anchors target `#content-main` (plus optional search and main-navigation targets) inside a `visually-hidden-focusable` container.
- **Modals/popovers**: trap focus while open, return focus to the trigger on close.
- **Media**: controls on `<video>`/`<audio>`; no autoplay unless muted and non-disruptive.
- **Unique IDs**: `id` values unique; IDs referenced by `aria-labelledby`/`aria-describedby` must exist once.
- **Testing**: NVDA (Windows), VoiceOver (macOS), keyboard-only navigation (Tab, Shift+Tab, Enter, Space), Chrome DevTools Accessibility panel, Axe Core.

## Essential identifiers

- `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-hidden`
- `role="alert"`, `aria-live="polite"`, `aria-live="assertive"`, `tabindex="0"`
- Storefront: `component_skip_to_content`, `skip-to-content-link`, `content-main`

## Gotchas

- The storefront alert utility already renders `role="alert"` with `aria-live` set to `assertive` for `danger`/`warning` types and `polite` otherwise — reuse it instead of hand-rolled error boxes.
- In the default layout the `<html lang>` value comes from `context.languageInfo.localeCode` inside the `base_html` block, which carries a v6.8.0 deprecation marker (WebPage microdata on `<html>` is replaced by JSON-LD); keep `lang` when overriding that block.
- Skip-link target in core templates is `#content-main`, not the `#main-content` used in the generic example.

## Code check (6.7.13.0)
- confirmed `component_skip_to_content` — skip link component block — vendor/shopware/storefront/Resources/views/storefront/component/skip-to-content.html.twig:3
- confirmed `visually-hidden-focusable` — skip link container visible only on focus — vendor/shopware/storefront/Resources/views/storefront/component/skip-to-content.html.twig:18
- confirmed `skip-to-content-link` — anchor targeting content-main — vendor/shopware/storefront/Resources/views/storefront/component/skip-to-content.html.twig:22
- confirmed `role="alert"` — rendered by alert utility — vendor/shopware/storefront/Resources/views/storefront/utilities/alert.html.twig:111
- confirmed `aria-live` — alert utility, assertive for danger/warning — vendor/shopware/storefront/Resources/views/storefront/utilities/alert.html.twig:112
- confirmed `aria-live="polite"` — listing filter panel live region — vendor/shopware/storefront/Resources/views/storefront/component/listing/filter-panel.html.twig:112
- confirmed `aria-live="assertive"` — checkout summary live update — vendor/shopware/storefront/Resources/views/storefront/page/checkout/summary.html.twig:21
- deprecated `context.languageInfo.localeCode` — used for html lang in base_html block marked deprecated tag:v6.8.0 — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:6
