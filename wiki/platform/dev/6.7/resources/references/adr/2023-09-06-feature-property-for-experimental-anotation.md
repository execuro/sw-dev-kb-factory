---
id: platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md
title: Add Feature property to `@experimental` annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.html
sourceHash: b8c3fc60870b20f252b4c64f4d44e4b4bc5d685b
codeCheckedAgainst: "6.7.13.0"
keywords: ["@experimental", "stableVersion", "feature property", "experimental feature", "feature flag", "feature.yaml", "Feature::isActive", "shopware.feature.flags", "backwards compatibility", "bc promise", "ALL_CAPS feature name", "twig experimental block"]
summary: "ADR: every @experimental annotation (PHP, JS, Twig) needs feature:<ALL_CAPS_NAME> next to stableVersion; matching feature flag names link code to the flag."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (areas core, administration, storefront; 2023-09-06) that makes a `feature` property mandatory on every `@experimental` annotation, so all code belonging to one experimental feature can be found by name.

## When to use

Apply it when marking PHP classes, Administration components or Twig blocks/templates as experimental, when prolonging an experiment (updating `stableVersion` everywhere), or when deprecating a killed experimental feature before the next major.

## Key steps / config

Problem addressed: without a feature name, finding every piece of code for one experiment (to bump `stableVersion` or to deprecate a killed feature, which must stay until the next major) was impractical, especially with several experiments in parallel.

Rules:

1. Every `@experimental` annotation carries a mandatory string property `feature`.
2. All code of one feature uses the same feature name.
3. Feature names contain no spaces and are written in `ALL_CAPS`.
4. A static analysis rule / unit test checks that each `@experimental` annotation has `feature` (stated in the ADR).

Annotation formats:

```php
/**
 * @experimental stableVersion:v6.6.0 feature:WISHLIST
 */
class Foo {}
```

```twig
{# @experimental stableVersion:v6.6.0 feature:WISHLIST #}
{% block awesome_new_feature %}...{% endblock %}
```

The same docblock form is used above `Component.register('sw-new-component', {...})` in Administration JS; a Twig comment before `{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}` marks the whole template.

Combining with a feature flag (the two are separate: `@experimental` affects only BC promises, a flag controls visibility):

1. Name the flag exactly like the annotation's `feature` value.
2. Put the annotation text (`stableVersion` and `feature`) in the flag's `description`.

```yaml
shopware:
  feature:
    flags:
      - name: WISHLIST
        default: false
        major: true
        description: "experimental stableVersion:v6.6.0 feature:WISHLIST"
```

At the connection point, branch with `Feature::isActive('WISHLIST')`.

## Essential identifiers

- `@experimental stableVersion:<version> feature:<NAME>`
- `shopware.feature.flags` (`name`, `default`, `major`, `description`) in `feature.yaml`
- `Shopware\Core\Framework\Feature::isActive()`

## Gotchas

- The source's connection-point snippet writes `Feature.isActive('WISHLIST')`; in PHP it is the static call `Feature::isActive()`.
- The source's class example `class testClass()` is not valid PHP; the annotation format is what matters.
- In 6.7.13.0 core flags also list `toggleable`, and flag descriptions do not follow the recommended "experimental stableVersion… feature…" text (e.g. `MCP_SERVER`), though flag names do match annotation feature names.

## Code check (6.7.13.0)
- confirmed `@experimental stableVersion:v6.8.0 feature:MCP_SERVER` — PHP docblock uses the feature property — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolAttributeReader.php:10
- confirmed `@experimental stableVersion:v6.8.0 feature:ADMIN_COMPOSITION_API_EXTENSION_SYSTEM` — Administration TS docblock form — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:18
- confirmed `{# @experimental stableVersion:v6.8.0 feature:SPATIAL_BASES #}` — Twig comment form — vendor/shopware/storefront/Resources/views/storefront/utilities/ar-overlay.html.twig:1
- confirmed `shopware.feature.flags` — flag list with `name`/`default`/`major` — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:3
- corrected `MCP_SERVER` — docs: flag description holds the experimental annotation; code uses free text — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:90
- corrected `Feature::isActive()` — docs: `Feature.isActive`; static PHP method — vendor/shopware/core/Framework/Feature.php:128
- unverified `static analysis rule` — rule enforcing the `feature` property lives in dev tooling, not in the checked package roots
