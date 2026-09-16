---
id: platform/dev/6.7/resources/references/adr/2023-05-10-experimental-features.md
title: Experimental features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-10-experimental-features.html
sourceHash: a207ab07896fbb5cfb4de93caebf405fd70f157a
codeCheckedAgainst: "6.7.13.0"
keywords: ["@experimental", "stableVersion", "feature", "Experimental", "@internal", "@deprecated", "experimental features", "backwards compatibility", "bc promise", "openapi tag", "AnnotationTagTester", "early access", "adr"]
summary: "ADR: @experimental marks code outside the BC promise; requires stableVersion and feature properties; API routes get an Experimental tag."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (areas: core, administration, storefront; 2023-05-10) introducing "experimental" features: production-ready increments of features still in active development, shipped early and explicitly excluded from the backwards compatibility (BC) promise. Code is marked with an `@experimental` annotation.

## When to use

- You find `@experimental` on a class, method, entity definition, route, admin component or Twig block and need to know what stability guarantees apply.
- You build on or extend a Shopware feature that is still experimental.
- You mark your own contribution to Shopware core/commercial code as experimental.

## Key steps / config

- Annotate code (class or method level) with `@experimental`, used like `@internal`. The annotation, not a PHP attribute, is used so the same marker works in PHP, JS and Twig and needs no runtime evaluation.
- Every annotation carries a `stableVersion` property (the major version at which the feature is stable at the latest) and a `feature` property in ALL_CAPS; the installed annotation test rejects annotations missing either.
- Parts that should never become public API get `@internal` instead; everything `@experimental` is designed to become public API.

PHP / Admin JS:

```js
/**
 * @experimental stableVersion:v6.8.0 feature:MY_FEATURE
 */
Component.register('sw-new-component', { /* ... */ });
```

Storefront Twig (a block, or a whole template before `sw_extends`):

```twig
{# @experimental stableVersion:v6.8.0 feature:MY_FEATURE #}
{% block awesome_new_feature %}...{% endblock %}
```

API:
- Mark an entity definition class with `@experimental`: the OpenAPI generator adds the `Experimental` tag to its auto-generated CRUD routes and appends a note to the summary that the API is not part of the BC promise.
- For custom routes, add the `Experimental` tag to the route's OpenAPI definition and mention the experimental state in its summary.

## Essential identifiers

- `@experimental` with properties `stableVersion` and `feature`
- `Experimental` — OpenAPI tag
- `@internal`, `@deprecated` — related annotations

## Gotchas

- No opt-in: experimental features are always present and cannot be deactivated technically. Any merchant-facing opt-in may only hide the UI entry point.
- Data is never discarded: if the underlying structure changes, existing data is migrated. Blue/green migration rules still apply, so destructive DB changes (dropping tables/columns) only happen in a major version.
- Killing a feature: it is deprecated and removed only with the next major version, never in a minor.
- The `@experimental` status can be removed in any minor; at the latest it must be gone by `stableVersion`. The phase may be extended case by case.
- The ADR's examples use only `stableVersion:v6.6.0`; the `feature` property was added by a later ADR and is enforced in 6.7.13.
- There is by default no UI distinction for merchants between experimental and stable features.

## Version notes

Original examples target `v6.6.0`; annotations in the installed 6.7.13 code use `stableVersion:v6.8.0` together with a `feature:` value.

## Code check (6.7.13.0)
- corrected `stableVersion` — docs: only `stableVersion` required; code also requires `feature` in ALL_CAPS — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:155
- confirmed `feature` — missing property throws — vendor/shopware/core/DevOps/Test/AnnotationTagTester.php:156
- confirmed `@experimental` — PHP class docblock usage — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:21
- confirmed `@experimental` — Twig comment usage in storefront templates — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image-gallery.html.twig:227
- confirmed `@experimental` — admin source usage — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:18
- confirmed `Experimental` — tag added to CRUD routes of experimental entity definitions — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi/OpenApiPathBuilder.php:82
- confirmed `EXPERIMENTAL_ANNOTATION_NAME` — generator detects the annotation in the definition docblock — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi/OpenApiPathBuilder.php:537
