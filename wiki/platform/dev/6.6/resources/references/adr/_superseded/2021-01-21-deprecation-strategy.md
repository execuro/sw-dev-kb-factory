---
id: platform/dev/6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.md
title: Deprecation strategy
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.html
sourceHash: 84078eecf8b6f5746573ceb8314379d70e4a3b5a
keywords: ["deprecation strategy", "feature flag", "major-flag", "minor-flag", "@feature-deprecated", "@major-deprecated", "@deprecated", "FEATURE::triggerDeprecated", "shopware.feature tag", "trunk-based development", "soft-break", "breaking code"]
summary: "Superseded ADR: Shopware's trunk-based deprecation workflow - minor vs major changes, feature-flag tagging, and deprecation annotations."
lastBuilt: 2026-09-15
---
## What it is

This is a superseded ADR that defines Shopware's deprecation strategy under trunk-based development: how to categorize a change (minor vs. major, breaking vs. non-breaking) and how to annotate and flag it accordingly. It states it is superseded by a later ADR on feature flags for major versions.

## When to use

Historical reference for classifying a change into one of four cases — minor without breaks, minor with deprecations, minor changes as part of a major feature, or major changes with breaks — and choosing the matching feature-flag/annotation workflow.

## Key steps / config

Dogma: no changes without feature flags (except bugfixes); don't break things without an alternative; don't break things in a minor release; annotate upcoming breaks as soon as possible.

Annotation conventions used throughout the workflow:

- `@internal (flag:FEATURE_NEXT_11111)` — new code hidden behind a minor flag while under development.
- `@feature-deprecated (flag:FEATURE_NEXT_11111)` — non-breaking old code queued for removal once the minor flag is removed.
- `@major-deprecated tag:v6.4.0 (flag:FEATURE_NEXT_22222)` — breaking old code kept until the next major release.
- `@deprecated tag:v6.4.0 (flag:FEATURE_NEXT_22222)` — the public deprecation annotation applied once a change is public.
- `FEATURE::triggerDeprecated('FEATURE_NEXT_22222', 'v6.3.4.0', 'v6.4.0', 'Use %s instead', 'NewClass')` — runtime deprecation trigger for calls to deprecated code.

New services declare their minor flag with the `shopware.feature` tag; an existing service being phased out uses the Symfony `<deprecated>` tag, optionally combined with a `deprecated` tag carrying the major flag:

```xml
<service id="...\MyTestClass" public="true">
    <tag name="deprecated" flag="FEATURE_NEXT_22222" version="tag:v6.4.0"/>
</service>
```

Unit tests for old vs. new behavior are duplicated and gated with `Feature::skipTestIfActive()`/`Feature::skipTestIfInActive()`, with the old test annotated `@group legacy`.

## Essential identifiers

- `@internal`
- `@feature-deprecated`
- `@major-deprecated`
- `@deprecated`
- `FEATURE::triggerDeprecated()`
- `shopware.feature` (service tag)
- `Feature::isActive()`

## Gotchas

A minor-flagged change that is a bugfix is the only exception to "no changes without a feature flag." Deprecated and major-deprecated code must not be called anywhere in the codebase while the corresponding major flag is inactive; even soft-breaks (behavior changes without errors, e.g. price rounding differences) should be avoided outside of security fixes or serious bugfixes.

## Version notes

The example migration walks a class rename (`MySampleClass` to `MyNewSampleClass`) through versions `6.3.3.0` (while developing, `@internal`/`@feature-deprecated`), `6.3.4.0` (feature release, `@deprecated tag:v6.4.0`), and `6.4.0.0` (major release, old class removed).
