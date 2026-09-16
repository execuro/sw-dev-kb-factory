---
id: platform/dev/6.6/resources/accessibility/storefront/_index.md
title: Storefront
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/accessibility/storefront/
sourceHash: 0aa965ffc882f449528dbddc4a074c0993b106a1
keywords: ["accessibility", "Storefront accessibility", "WCAG 2.1 AA", "BITV 2.0", "ACCESSIBILITY_TWEAKS", "feature flag", "Bootstrap", "aria roles", "E2E testing playwright", "breaking accessibility change", "sw_extends", "v6.7.0"]
summary: How Shopware rolls out Storefront accessibility improvements behind the ACCESSIBILITY_TWEAKS flag, defaulting on in v6.7.0.
lastBuilt: "2026-09-15"
---
## What it is

Describes Shopware's approach to accessibility in the Storefront: commitment to WCAG 2.1 AA and BITV 2.0, use of Bootstrap components with aria roles, and automated E2E testing with Playwright and an axe reporter.

## When to use

Relevant when a Storefront extension modifies markup that accessibility changes might also touch, or when checking whether a project is affected by an upcoming accessibility-driven breaking change.

## Key steps / config

Accessibility improvements ship in regular minor releases of the current major version `6.6.x`; there is no single "accessibility release". Breaking accessibility changes are gated behind a feature flag so they are not active by default:

```env
ACCESSIBILITY_TWEAKS
```

Enable it in `.env` like the major feature flags (e.g. `V6_7_0_0`) to activate all available accessibility improvements early. Example of a gated Twig change:

```twig
{% if feature('ACCESSIBILITY_TWEAKS') %}
    {% block component_list_items_inner %}...{% endblock %}
{% else %}
    {% block component_list_items %}...{% endblock %}
{% endif %}
```

An extension using `sw_extends` should target the new block name (`component_list_items_inner`) to already account for the future structure.

## Essential identifiers

- `ACCESSIBILITY_TWEAKS`
- `component_list_items`
- `component_list_items_inner`
- `sw_extends`

## Gotchas

If a change ships without a feature flag, an extension still assuming the old markup (e.g. `<div class="list-item">`) can produce incorrect HTML once the block structure changes.

## Version notes

With major version v6.7.0, all accessibility improvements gated by `ACCESSIBILITY_TWEAKS` become the default.
