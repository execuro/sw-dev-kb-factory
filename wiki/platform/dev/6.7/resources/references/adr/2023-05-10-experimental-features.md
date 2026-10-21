---
id: platform/dev/6.7/resources/references/adr/2023-05-10-experimental-features.md
title: Experimental features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-10-experimental-features.html
sourceHash: a207ab07896fbb5cfb4de93caebf405fd70f157a
codeCheckedAgainst: "6.7.15.1"
keywords: ["@experimental", "stableVersion", "experimental features", "backwards compatibility", "bc promise", "@internal", "Experimental tag", "OpenAPI", "feature flag", "OpenApiPathBuilder", "twig block annotation", "early access", "adr"]
summary: "ADR 2023-05-10: the @experimental stableVersion:vX annotation marks production-ready code that is not yet under the backwards-compatibility promise."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-05-10, areas core/administration/storefront) that adds "experimental" features to Shopware. These are increments of a feature that are shipped early and are production-ready, but are not yet covered by the backwards compatibility (BC) promise. The affected code is marked with an `@experimental` annotation that carries a `stableVersion`, such as `@experimental stableVersion:v6.6.0`.

## When to use

- You extend or build on Shopware code, routes, entities, admin components or Storefront templates marked `@experimental`, and need to know what stability you can rely on.
- You mark your own contributions as experimental in PHP, JS or Twig.

## Key steps / config

What `@experimental` means:

- The marked code is planned to become public API once the feature is stable. Code that should never become public API uses `@internal` instead.
- There is no BC promise, so the implementation may change without a deprecation period.
- Every annotation must carry `stableVersion`. This is the major version by which the feature is stable, or removed. The annotation can be removed earlier, in any minor version. The experimental phase can be extended case by case.
- Experimental features are always present and cannot be deactivated. If a merchant-facing feature is made opt-in, only its UI entry point is hidden.
- Data is never discarded. If the underlying structure changes, existing data is migrated. The blue/green migration rules still apply: destructive DB changes happen only in a major version.
- Killing a feature: it is deprecated for the next major version and never removed in a minor version.

How to mark code, per area:

- **Core (PHP)**: place it in the class or method docblock, in the same way as `@internal`.
- **API**: add the `Experimental` tag to the route's OpenAPI definition and note in the route summary that it is experimental. For entities, put `@experimental` on the entity definition class. The generated CRUD routes then get the `Experimental` tag automatically.
- **Admin**: it applies to modules, components, services and similar:

```js
/**
 * @experimental stableVersion:v6.6.0
 */
Component.register('sw-new-component', { /* ... */ });
```

- **Storefront**: it applies to Twig blocks, SCSS classes and JS plugins. You can mark a single block or a whole template:

```twig
{# @experimental stableVersion:v6.6.0 #}
{% block awesome_new_feature %}...{% endblock %}

{# @experimental stableVersion:v6.6.0 #}
{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}
```

Automated checks defined by the ADR:

- A static analysis rule or unit test requires `stableVersion` and rejects annotations for versions that have already been released, as is already done for `@deprecated`.
- The BC checker treats `@experimental` like `@internal`.
- The API schema generator adds the `Experimental` tag to the auto-generated CRUD routes of experimental entity definitions.
- The OpenAPI route test checks that experimental routes and controller methods are marked as experimental in the docs.

## Essential identifiers

- `@experimental stableVersion:v<major>` (PHP/JS docblock, Twig comment)
- `@internal`, `@deprecated` (sibling annotations)
- `Experimental` (OpenAPI tag)
- `Shopware\Core\Framework\Api\ApiDefinition\Generator\OpenApi\OpenApiPathBuilder` (adds the tag for experimental entity definitions)

## Gotchas

- An annotation was chosen over a PHP attribute for these reasons: it matches `@deprecated`/`@internal`, the same syntax works in PHP, JS and templates, it needs no runtime evaluation, and Symfony also uses `@experimental`.
- Experimental is not the old feature-flag approach. Feature flags hid work-in-progress code. Experimental code is finished and usable, but the feature may still be incomplete.
- By default, the UI does not distinguish experimental features from stable ones. Commercial features follow the same rules.
- Experimental features get dev, API and user docs, all labelled as not yet stable.

## Version notes

- A later ADR, "Add Feature property to `@experimental` annotation" (2023-09-06), supplements this one. Installed 6.7.15.1 code uses the extended form, for example `@experimental stableVersion:v6.8.0 feature:SPATIAL_BASES`.

## Code check (6.7.15.1)
- confirmed `@experimental` — PHP class docblock with `stableVersion` — vendor/shopware/core/Framework/Mcp/McpAllowedHostsProvider.php:9
- confirmed `OpenApiPathBuilder::isExperimental()` — reads `@experimental` from the entity definition docblock — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi/OpenApiPathBuilder.php:81
- confirmed `Experimental` — tag added to generated CRUD paths — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi/OpenApiPathBuilder.php:82
- confirmed `@experimental stableVersion` — Twig comment form, with `feature:` property — vendor/shopware/storefront/Resources/views/storefront/utilities/qr-code-modal.html.twig:1
- confirmed `@experimental stableVersion` — Admin JS docblock form — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/index.js:217
