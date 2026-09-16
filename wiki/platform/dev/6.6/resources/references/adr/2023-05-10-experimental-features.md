---
id: platform/dev/6.6/resources/references/adr/2023-05-10-experimental-features.md
title: Experimental features
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-05-10-experimental-features.html"
sourceHash: "a207ab07896fbb5cfb4de93caebf405fd70f157a"
keywords: ["experimental", "@experimental", "@internal", "@deprecated", "stableVersion", "backwards compatibility", "BC promise", "feature flag", "OpenAPI", "roadmap", "blue/green migration"]
summary: "ADR: introduces an @experimental annotation for classes/methods/UI not covered by BC promise, with a required stableVersion property."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record introducing the concept of "experimental" features: code marked as not yet covered by Shopware's backwards compatibility promise, released early to gather ecosystem feedback.

## When to use
Relevant when deciding whether new, still-evolving functionality should ship as a stable, BC-covered API or as an experimental one, or when encountering `@experimental` annotations in core/admin/storefront code.

## Key steps / config
- Code is marked with a new `@experimental` annotation (analogous to `@internal`), used at class or method level in PHP, JS, and templates.
- Every `@experimental` annotation must carry a `stableVersion` property, e.g. `@experimental stableVersion:v6.6.0`, naming the latest version by which the feature becomes stable (it can be removed earlier).
- A static analysis rule/unit test checks every `@experimental` annotation has `stableVersion` and that none target an already-released version (mirrors the existing `@deprecated` check).
- The BC checker is adapted to treat `@experimental` like `@internal`.
- API routes/entity definitions marked experimental get the `Experimental` tag in the OpenAPI definition.
- Admin example:
```js
/**
 * @experimental stableVersion:v6.6.0
 */
Component.register('sw-new-component', { ... });
```
- Storefront/Twig example:
```twig
{# @experimental stableVersion:v6.6.0 #}
{% block awesome_new_feature %}
{% endblock %}
```

## Essential identifiers
- `@experimental` annotation
- `@internal` annotation
- `stableVersion` property
- `Experimental` OpenAPI tag

## Gotchas
Experimental features are always present (not opt-in) technically; only the UI entry point may be hidden per-feature. Data generated during the experimental phase is never discarded, even if the underlying structure changes — migrations are provided. If a feature idea is killed, it is deprecated for the next major version rather than removed in a minor, even though it lacks the BC promise. Destructive DB changes still require the blue/green-compatible migration system and can only happen in a major version.
