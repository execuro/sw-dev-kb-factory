---
id: platform/dev/6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md
title: Add Feature property to `@experimental` annotation
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.html"
sourceHash: b8c3fc60870b20f252b4c64f4d44e4b4bc5d685b
keywords: ["@experimental", "feature property", "stableVersion", "experimental annotation", "feature flag", "ALL_CAPS", "Feature.isActive", "feature.yaml", "backwards compatibility", "ADR", "killing feature", "annotation conventions"]
summary: "ADR: `@experimental` annotations now require a mandatory `feature` property naming the associated feature, in ALL_CAPS."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record describing a required `feature` property added to the `@experimental` annotation, so experimental code can be traced back to the feature it belongs to.

## When to use
Relevant when marking new code (PHP classes, JS components, Twig blocks/templates) as experimental, or when deciding whether to also introduce a feature flag for that experimental code.

## Key steps / config
- Every `@experimental` annotation must carry a mandatory `feature` string property.
- All code belonging to one feature must use the same `feature` name.
- Feature names cannot contain spaces and must be written in `ALL_CAPS`.

Examples of the annotation shape:

```php
/**
 * @experimental stableVersion:v6.6.0 feature:WISHLIST
 */
class testClass()
{
}
```

```twig
{# @experimental stableVersion:v6.6.0 feature:WISHLIST #}
{% block awesome_new_feature %}
{% endblock %}
```

When linking the annotation to a feature flag:
1. Match the feature flag's `name` to the annotation's `feature` value.
2. Put the annotation's `stableVersion`/`feature` values into the flag's `description`.

```yaml
shopware:
  feature:
    flags:
      - name: WISHLIST
        default: false
        major: true
        description: "experimental stableVersion:v6.6.0 feature:WISHLIST"
```

Connection point pattern:

```php
if (Feature.isActive('WISHLIST') {
        $obj = new Foo();
} else {
}
```

## Essential identifiers
- `@experimental` annotation `feature` property
- `stableVersion` annotation property
- `Feature.isActive('WISHLIST')`
- `feature.yaml`

## Gotchas
A static analysis rule / unit test is planned to check that every `@experimental` annotation declares the `feature` property. The `@experimental` annotation and a feature flag are distinct concepts: the annotation only affects BC promises for the code, while the flag controls visibility.
