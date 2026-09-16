---
id: platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md
title: Storefront Accessibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html
sourceHash: ee5488b0fcdab0bb88bdc2e215140366e36af5fb
codeCheckedAgainst: "6.7.13.0"
keywords: ["accessibility", "a11y", "wcag 2.1 aa", "bitv 2.0", "feature flag", "feature()", "sw_extends", "theme:compile", "screen reader", "keyboard navigation", "breaking template changes", "storefront twig blocks"]
summary: Storefront accessibility (WCAG 2.1 AA) in 6.7, how breaking a11y template changes were gated by a feature flag, and a11y testing for extensions.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/store/quality-guidelines.md"]
---
## What it is

Shopware's stance and process for Storefront accessibility: the Storefront targets WCAG 2.1 AA and BITV 2.0, builds on Bootstrap components with ARIA roles, and uses Playwright E2E tests with an axe reporter. Breaking HTML/Twig/CSS accessibility changes were released in 6.6 minors behind a feature flag and became the default with 6.7.0. The page also lists best practices for testing extensions.

## When to use

- Your theme or plugin extends Storefront Twig blocks or CSS that were restructured for accessibility (lists, pagination, carousel, top-bar nav, text scaling).
- You are checking an extension for accessibility before a Store release.

## Key steps / config

1. On the installed 6.7 core the accessibility tweaks are already active by default (see Code check) — no `.env` change is needed. Template code guarded by the Twig `feature('<FLAG>')` function renders the new branch.
2. Recompile the theme so styling improvements (for example adjusted font sizes) apply:
   `bin/console theme:compile`
3. Adapt extensions that override restructured blocks. The pattern used in 6.6: the new markup gets a new inner block, the old block is marked `@deprecated tag:v6.7.0`. An extension could support both:

```twig
{% sw_extends '@Storefront/storefront/component/list.html.twig' %}
{% block component_list_items_inner %}
 {{ parent() }}
 <li class="list-item">...</li>
{% endblock %}
{# old block, removable after v6.7.0 #}
{% block component_list_items %}
 {{ parent() }}
 <div class="list-item">...</div>
{% endblock %}
```

(`component_list_items` / `component_list_items_inner` are the doc's illustrative example.)

4. Test the extension:
   - Automated: Google Lighthouse (see [quality guidelines](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md)), AXE DevTools, WAVE.
   - Manual: keyboard navigation with `Tab`, `Enter`, `Esc`; screen readers (NVDA, VoiceOver); colour contrast (WebAIM Contrast Checker).
5. Fix common issues before release: wrong HTML/ARIA roles, missing form labels and alt text, focus management in modals/dropdowns/popups, dynamic updates not announced to screen readers. Developers can self-certify; Shopware QA verification may be required for Store listing.

## Essential identifiers

- `feature()` Twig function (feature-flag check in templates)
- `sw_extends` Twig tag
- `bin/console theme:compile`
- `@deprecated tag:v6.7.0` template annotations on replaced blocks

## Gotchas

- Breaking accessibility changes altered HTML/Twig structure; an extension still assuming the old markup (e.g. `<div class="list-item">`) produces invalid HTML once the new structure is active.
- The docs tell you to set `ACCESSIBILITY_TWEAKS=1` in `.env`. In core 6.7.13.0 the flag is declared with `default: true` and no code in core, storefront or administration reads it, so setting it changes nothing.
- Topics marked breaking in the source's improvement list: carousel focused slides, 200% text resizing, pagination with links, no empty nav in top-bar, keyboard-operable content.
- Accessibility fixes ship in regular minor releases; there is no single "accessibility release". Open issues carry the GitHub label `area/accessibility`.

## Version notes

- 6.6 (6.6.1.0 through 6.6.6.0): improvements introduced; breaking ones gated behind `ACCESSIBILITY_TWEAKS`.
- 6.7.0: all accessibility improvements became the default.
- Shopware 5: no accessibility support.

## Code check (6.7.13.0)
- unread `ACCESSIBILITY_TWEAKS` — declared default true, major, toggleable; no code reads it — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
- confirmed `feature` — Twig function registered by FeatureFlagExtension — vendor/shopware/core/Framework/Adapter/Twig/Extension/FeatureFlagExtension.php:37
- confirmed `sw_extends` — Twig tag name from ExtendsTokenParser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `theme:compile` — ThemeCompileCommand name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
