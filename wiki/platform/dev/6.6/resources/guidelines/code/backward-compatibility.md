---
id: "platform/dev/6.6/resources/guidelines/code/backward-compatibility.md"
title: "Backward Compatibility"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/backward-compatibility.html"
sourceHash: "8447ae9ad6dd444631daed541c7033ad45b36c10"
keywords: ["backward compatibility", "BC", "@deprecated", "@feature-deprecated", "@major-deprecated", "@internal", "feature flag", "semantic versioning", "deprecation workflow", "TWIG blocks", "getDecorated", "trunk branch", "changelog"]
summary: "Rules and annotations (@deprecated, @feature-deprecated, @major-deprecated, @internal) for keeping Shopware core changes backward compatible."
relatedPages: ["platform/dev/6.6/resources/references/adr/2020-08-03-implement-new-changelog.md"]
lastBuilt: "2026-09-15"
---
## What it is

Guidance on keeping code changes backward compatible across minor/patch releases, since Shopware follows semantic versioning, plus the annotations used to mark code for future removal.

## When to use

Apply this when changing public API, adding/removing functionality, or working under a feature flag in the `trunk` branch, to decide whether a change can ship in a minor release or must wait for the next major.

## Key steps / config

Four annotations mark planned changes:

```php
/**
 * @deprecated tag:v6.5.0 - Use NewFunction() instead
 */
```

- `@deprecated` — obsolete public code to be removed in the tagged major release; always states the replacement.
- `@feature-deprecated` (`flag:FEATURE_NEXT_11111`) — obsolete code still hidden behind a feature flag; must be changed to `@deprecated` when the feature ships and the flag is removed.
- `@major-deprecated` (`flag:FEATURE_NEXT_22222`) — breaking code kept behind a major feature flag until the next major release.
- `@internal` (with a feature flag) — new code not yet released, not treated as public API until the flag is removed.

Workflow for a backward-compatible feature: hide new code behind a normal feature flag during development, add `@internal` to new public API, mark obsolete code `@feature-deprecated`; on feature release remove the flag, remove `@internal`, and switch `@feature-deprecated` to `@deprecated`; the old code is finally removed only at the next major release.

For a breaking change: hide it behind a major feature flag, add `@major-deprecated` to obsolete code, and create a separate changelog entry for the major-flagged change; both the flag and the old code are removed only at the next major release.

Adding optional constructor/method arguments on non-service classes or protected/public methods must be done via `func_get_args()` rather than changing the signature outright.

## Essential identifiers

- `@deprecated`, `@feature-deprecated`, `@major-deprecated`, `@internal` annotations
- `func_get_args()` for adding optional arguments
- `getDecorated()` call required before a public function can be added to an abstract class
- TWIG `{% deprecated '...' %}` tag (Storefront) vs. a plain `{# @deprecated ... #}` comment (Administration)

## Gotchas

- Changing the typehint of a class/interface/trait, changing a method's return type, changing a public constant's value, making a class/method `final`, changing visibility from public to private/protected, changing a class namespace, or removing an event/dispatch are all disallowed — each requires the deprecate-then-remove workflow instead.
- Removing or renaming TWIG blocks, TWIG variables, JS services/plugins, VueJS slots, component props, or routes in the Administration/Storefront is not allowed without going through deprecation first.
- New public functions on interfaces are never allowed directly; new public functions on abstract classes are only possible if the abstract class already has a `getDecorated()` call.
