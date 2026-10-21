---
id: platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md
title: Storefront Accessibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html
sourceHash: ee5488b0fcdab0bb88bdc2e215140366e36af5fb
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront accessibility", "a11y", "ACCESSIBILITY_TWEAKS", "feature flag", "WCAG 2.1 AA", "BITV 2.0", "theme:compile", "sw_extends", "feature()", "breaking accessibility changes", "lighthouse", "axe", "screen reader"]
summary: "Storefront accessibility releases, the ACCESSIBILITY_TWEAKS flag (default in 6.7), adapting Twig overrides, a11y testing for extensions."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md"]
---
## What it is

Explains Shopware's Storefront accessibility commitments (WCAG 2.1 AA and the German BITV 2.0), how accessibility improvements are released, how breaking markup changes were gated during 6.6, and best practices for testing and validating accessibility in extensions and themes.

## When to use

- An extension or theme overrides Storefront Twig blocks or CSS that core accessibility work has changed (lists, pagination, carousel, top-bar nav, text scaling).
- Preparing an extension for Store listing where accessibility QA or self-certification may be required.
- Setting up accessibility testing for a theme.

## Key steps / config

What core does:

- The Storefront builds on Bootstrap components that already follow accessibility practices (e.g. ARIA roles); much of the HTML/CSS already meets the guidelines, with remaining items tracked as open issues labelled `area/accessibility` on [GitHub](https://github.com/shopware/shopware/issues?q=state%3Aopen%20label%3Aarea%2Faccessibility).
- Automated [Playwright acceptance tests](https://github.com/shopware/shopware/tree/trunk/tests/acceptance) with an axe reporter guard against regressions.
- Improvements ship in regular minor releases; there is no single "accessibility release".

Testing your extension on 6.7:

1. Accessibility improvements are already active by default in 6.7 (see Gotchas for the former opt-in flag); no `.env` change is needed.
2. After theme or style changes, recompile the theme so styling improvements (e.g. adjusted font sizes) apply:

   ```text
   bin/console theme:compile
   ```

3. Automated audits: Google Lighthouse ([quality guidelines](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md)), AXE DevTools, WAVE (WebAIM).
4. Manual checks: keyboard navigation with `Tab`, `Enter`, `Esc`; screen readers NVDA (Windows) or VoiceOver (Mac/iOS); colour contrast with the WebAIM Contrast Checker.
5. Fix before release: misused HTML/ARIA roles, missing form labels and alt text, broken focus management in modals/dropdowns/popups, dynamic content not announced to screen readers. Details in the [Accessibility Checklist](platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md).

Adapting Twig overrides when core markup changes: extend the template with `sw_extends` and override the block that carries the new structure (e.g. a `<ul>`/`<li>` list block instead of the old `<div class="list-item">` block), calling `{{ parent() }}`:

```twig
{% sw_extends '@Storefront/storefront/component/list.html.twig' %}
{% block component_list_items_inner %}
    {{ parent() }}
    <li class="list-item">...</li>
{% endblock %}
```

(The template and block names are the source's illustrative example, not real core templates.)

Store listing: developers can self-certify an extension as a11y-compliant; Shopware QA verification may be required for listing.

## Essential identifiers

- `bin/console theme:compile`
- `sw_extends`, `parent()`
- `area/accessibility` (GitHub issue label)

## Gotchas

- The source describes `ACCESSIBILITY_TWEAKS=1` in `.env` as the opt-in for breaking accessibility changes (activated like major flags such as `V6_7_0_0`). In 6.7.15.1 the flag is declared in core `feature.yaml` with `default: true`, `major: true`, `toggleable: true`, and no Storefront template or code reads it — the gated changes were merged as the 6.7 default, so setting it has no effect.
- Breaking accessibility changes alter HTML/Twig structure or CSS; an extension overriding the old block can produce invalid markup (e.g. a `<div class="list-item">` inside a `<ul>`).

## Version notes

- 6.6: accessibility improvements introduced from 6.6.1.0 on (distinctive document titles, no empty top-bar `nav`, focus handling after modal close, carousel focus, 200% text scaling, pagination with links, labelled quantity selector, etc. — breaking ones were gated). During 6.6 the gating pattern was:

  ```twig
  {% if feature('ACCESSIBILITY_TWEAKS') %}
      {# new <ul>/<li> markup, block component_list_items_inner #}
  {% else %}
      {# old <div> markup, block component_list_items, @deprecated tag:v6.7.0 #}
  {% endif %}
  ```

  Extensions overrode both blocks and could drop the old one after v6.7.0.
- 6.7.0: all accessibility improvements became the default; 6.7+ adds further enhancements.
- Shopware 5: no accessibility support.

## Code check (6.7.15.1)
- unread `ACCESSIBILITY_TWEAKS` — declared default true, major, toggleable; no template or code reads it — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
- confirmed `v6.7.0.0` — major flag, default true (docs spell it `V6_7_0_0`) — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:12
- confirmed `Feature::normalizeName()` — maps `v6.7.0.0` to `V6_7_0_0` — vendor/shopware/core/Framework/Feature.php:42
- confirmed `feature` — Twig function for feature-flag checks — vendor/shopware/core/Framework/Adapter/Twig/Extension/FeatureFlagExtension.php:36
- confirmed `sw_extends` — Twig tag for template inheritance — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `theme:compile` — storefront console command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `component/list.html.twig` — illustrative template from the docs, not checked as a real core file
