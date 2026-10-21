---
id: platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md
title: Accessibility Checklist
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/accessibility-checklist.html
sourceHash: ad9e6c19fe2a1c4a4a7001c038cfdf215984c602
codeCheckedAgainst: "6.7.15.1"
keywords: ["accessibility checklist", "a11y", "semantic html", "aria-label", "aria-describedby", "aria-live", "role alert", "skip link", "focus management", "keyboard navigation", "screen reader", "tabindex", "wcag"]
summary: "Storefront a11y checklist: semantic HTML, lang, form labels, focus, keyboard, ARIA, live regions, skip links, modals, testing."
lastBuilt: 2026-10-21
---
## What it is

A checklist of the key principles and technical requirements for building accessible Storefront interfaces in themes and extensions: semantic structure, keyboard usability, screen reader compatibility and inclusive design practices. Accessibility is presented as both a best practice and a legal and ethical responsibility; following the checklist also helps SEO, performance and user satisfaction.

## When to use

Reviewing Storefront templates, Twig overrides or JavaScript plugins of a theme/extension before release, or auditing an existing storefront for accessibility issues. The source recommends auditing code regularly and keeping up with evolving accessibility standards.

## Key steps / config

- **Semantic HTML** — use native elements that communicate their purpose: `<button>`, `<a>`, `<select>` for actions instead of `<div>`/`<span>`; structure layouts with `<nav>`, `<main>`, `<header>`, `<footer>`; always pair `<label>` with form controls via `for`/`id`, never rely on `placeholder` text alone for labelling.
- **Document language** — set `lang="en"` (or the matching language code) on `<html>` so screen readers use correct pronunciation and intonation.
- **Forms** — label every field with `<label for="input-id">`, `aria-label` or `aria-labelledby`; make error messages clear and easy to locate; do not indicate errors by colour alone (red) — add icons or text; connect inputs to help/error text with `aria-describedby`.
- **Focus** — use `tabindex="0"` for custom interactive elements, but avoid changing the tab index where possible and keep the natural tab flow; never remove focus outlines without a clear, visible replacement; use `focus()` to direct attention (after form errors, when a modal opens); every element that can be clicked or reached by keyboard (`<a>`, `<button>`, …) needs a clearly visible focus indicator.
- **Keyboard** — every feature must work with the keyboard alone: `Enter` and `Space` activate interactive elements; no `onclick` on non-focusable elements without keyboard support; custom widgets respond to arrow keys and expected keyboard patterns.
- **ARIA** — only when native HTML does not work: `role="alert"` for live error messages; `aria-expanded`, `aria-controls`, `aria-hidden` for toggleable UI. Prefer native elements to reduce complexity.
- **Live regions** — `aria-live="polite"` or `aria-live="assertive"` for real-time updates (validation messages, chat widgets).
- **Titles and headings** — update `<title>` on page load or route change; one `<h1>` per page, followed by a correct `<h2>`, `<h3>` hierarchy.
- **Skip links** — place a skip link at the top of the page so keyboard users can skip repetitive content (target id adapted to the core Storefront, see Gotchas):

```html
<a href="#content-main" class="skip-link">Skip to main content</a>
```

- **Modals/popovers** — trap focus while open; return focus to the initiating element once closed.
- **Media** — avoid auto-playing audio or video; if unavoidable, provide controls on `<video>`/`<audio>` and autoplay only muted and non-disruptive.
- **Unique IDs** — `id` attributes must be unique; IDs referenced in `aria-labelledby`/`aria-describedby` must exist and not be duplicated, otherwise screen readers become unreliable.
- **Testing** — screen readers (NVDA on Windows, VoiceOver on macOS), keyboard-only navigation (Tab, Shift+Tab, Enter, Space), browser dev tools (Chrome DevTools Accessibility panel, Axe Core).

## Essential identifiers

- `aria-label`, `aria-labelledby`, `aria-describedby`
- `aria-expanded`, `aria-controls`, `aria-hidden`
- `role="alert"`, `aria-live="polite"`, `aria-live="assertive"`
- `tabindex="0"`, `lang`

## Gotchas

- The source's skip-link example targets `#main-content`. The core Storefront already renders its own skip links from `component/skip-to-content.html.twig` (included in `base.html.twig`), targeting `#content-main` — extend that template instead of adding a second set.
- The core `<html>` tag already sets `lang` from the active language's locale code.
- For focus return after closing a modal, the core Storefront ships a `FocusHandler` helper that saves and restores focus.

## Code check (6.7.15.1)
- unverified `lang` — base template sets it from the locale code, but the only citable line sits next to an unrelated deprecation marker
- confirmed `skip-to-content.html.twig` — included by the base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:32
- confirmed `content-main` — id of the main content element — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:65
- corrected `#content-main` — docs: example skip link targets `#main-content` — vendor/shopware/storefront/Resources/views/storefront/component/skip-to-content.html.twig:22
- confirmed `role="alert"` — used by core alert utility template — vendor/shopware/storefront/Resources/views/storefront/utilities/alert.html.twig:111
- confirmed `FocusHandler` — core helper for saving/restoring focus — vendor/shopware/storefront/Resources/app/storefront/src/helper/focus-handler.helper.js:9
- confirmed `FocusHandler::resumeFocusState()` — returns focus to the saved element — vendor/shopware/storefront/Resources/app/storefront/src/helper/focus-handler.helper.js:60
