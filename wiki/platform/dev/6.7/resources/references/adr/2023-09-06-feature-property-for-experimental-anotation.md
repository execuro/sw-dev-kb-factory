---
id: platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md
title: Add Feature property to `@experimental` annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.html
sourceHash: b8c3fc60870b20f252b4c64f4d44e4b4bc5d685b
codeCheckedAgainst: "6.7.15.1"
keywords: ["@experimental", "feature", "stableVersion", "experimental feature", "annotation", "feature flag", "feature.yaml", "ALL_CAPS", "AnnotationTagTester", "backwards compatibility", "adr", "twig experimental block"]
summary: "ADR: @experimental annotations carry stableVersion plus a feature:<ALL_CAPS> name linking code to one experimental feature and its feature flag."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-09-06, areas core/administration/storefront) that extends the `@experimental` annotation with a `feature` property naming the experimental feature a piece of code belongs to. It builds on the earlier "Experimental features" ADR, which introduced `@experimental` with a `stableVersion` property.

## When to use

- You add or maintain experimental code in PHP, JS (Administration components) or Twig and need to annotate it.
- An experiment is prolonged and every `stableVersion` belonging to it has to be updated, or a feature is killed and all its code must be found and marked deprecated (the "Killing Feature" rule keeps it until the next major).
- You gate experimental code with a feature flag and want the flag and annotation linked.

## Key steps / config

1. Annotate experimental code with both properties; the feature name is shared by every piece of code of that feature:

```php
/**
 * @experimental stableVersion:v6.6.0 feature:WISHLIST
 */
class Foo {}
```

The same docblock form is used above JS code such as `Component.register('sw-new-component', { ... })`.

2. Twig: wrap a block, or mark the whole template by placing the comment before `sw_extends`:

```twig
{# @experimental stableVersion:v6.6.0 feature:WISHLIST #}
{% block awesome_new_feature %}...{% endblock %}

{# @experimental stableVersion:v6.6.0 feature:WISHLIST #}
{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}
```

3. Naming conventions for the feature name: no spaces, written in `ALL_CAPS`.

4. When a feature flag is also needed (e.g. at integration points), give the flag the same name as the annotation's `feature` value, and put the annotation properties into the flag's `description` in `feature.yaml`:

```yaml
shopware:
  feature:
    flags:
      - name: WISHLIST
        default: false
        major: true
        description: "experimental stableVersion:v6.6.0 feature:WISHLIST"
```

The connection point then branches on whether `WISHLIST` is active (new implementation vs. old/current implementation).

## Essential identifiers

- `@experimental` annotation, properties `stableVersion` and `feature`
- `feature.yaml` key `shopware.feature.flags` (`name`, `default`, `major`, `description`)
- `Shopware\Core\DevOps\Test\AnnotationTagTester` — validates annotation format

## Gotchas

- The `@experimental` annotation and a feature flag are separate concepts: the annotation only affects BC promises for the marked code, the flag controls visibility. The ADR neither forbids nor regulates combining them.
- The ADR calls `feature` mandatory, but the installed validator only requires `stableVersion`; `feature` is optional and, when present, must match `^(?:[A-Z]+(_[A-Z]+)*)+$` — uppercase letters and underscores only (no digits, no spaces).
- Only `stableVersion` and `feature` are accepted; any other `key:value` property in the annotation is rejected by the validator.
- The connection-point snippet in the source (`Feature.isActive('WISHLIST')`) is pseudo-code; in PHP the check is a static call on `Shopware\Core\Framework\Feature`.

## Code check (6.7.15.1)
- confirmed `@experimental stableVersion:v6.8.0 feature:CONSENT_MANAGEMENT` — annotation format with `feature` in use in core PHP — vendor/shopware/core/System/Consent/Api/ConsentController.php:18
- confirmed `@experimental stableVersion:v6.8.0 feature:SPATIAL_BASES` — Twig comment form used on a whole storefront template — vendor/shopware/storefront/Resources/views/storefront/utilities/qr-code-modal.html.twig:1
- confirmed `@experimental stableVersion:v6.8.0 feature:SPATIAL_BASES` — JS docblock form used in Administration — vendor/shopware/administration/Resources/app/administration/src/module/sw-media/component/sidebar/sw-media-quickinfo/index.js:91
- confirmed `AnnotationTagTester::validateExperimentalAnnotations()` — test helper validating `@experimental` annotations — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:65
- corrected `feature` — docs: mandatory property; code: optional, only `stableVersion` required — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:186
- confirmed `ALL_CAPS` — feature value must match uppercase/underscore pattern — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:190
- confirmed `stableVersion` — only `stableVersion` and `feature` properties allowed — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:177
