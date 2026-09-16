---
id: platform/dev/6.7/guides/development/accessibility/_index.md
title: Accessibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/accessibility/
sourceHash: 945e99ccee36afcf0e635877d5810f8a982ebaef
codeCheckedAgainst: "6.7.13.0"
keywords: ["accessibility", "a11y", "wcag 2.1", "level aa", "barrier-free", "storefront accessibility", "accessibility checklist", "ACCESSIBILITY_TWEAKS", "feature flag", "eu accessibility regulations", "themes", "extensions"]
summary: Accessibility section overview - developers must keep Storefront themes and extensions WCAG 2.1 Level AA compliant; covers storefront guide and checklist.
lastBuilt: 2026-09-15
---
## What it is

Entry page of the accessibility section. Accessibility affects the core Storefront and every custom theme and extension; developers are responsible for making their implementations comply with accessibility standards such as WCAG 2.1 Level AA. The section contains a Storefront accessibility guide and an accessibility checklist.

## When to use

- Building or reviewing a Storefront theme or extension that renders customer-facing HTML.
- Assessing why accessibility matters for a project: legal compliance (e.g. EU accessibility regulations), better usability for all users, improved SEO and performance, and future-proof storefront implementations.

## Key steps / config

1. Target WCAG 2.1 Level AA for all templates, themes and extension markup.
2. Work through the Storefront accessibility guide and the accessibility checklist in this section.
3. Test extensions against the accessibility-related template changes Shopware ships in new releases (see Gotchas for the feature flag).

## Gotchas

- The docs say to always test extensions with the `ACCESSIBILITY_TWEAKS` feature flag enabled. In 6.7.13.0 the flag is still declared in `feature.yaml` (default `true`, marked `major`, toggleable) with the description that accessibility improvements can alter the HTML and CSS structure of templates, but no code in the checked vendor roots reads it — toggling it has no visible effect there.
- Accessibility improvements may change template HTML/CSS structure, so theme and extension overrides of core blocks need re-testing after updates.

## Version notes

- The `ACCESSIBILITY_TWEAKS` flag description states the accessibility improvements become standard as of v6.7.0; in 6.7 they are part of the default templates.

## Code check (6.7.13.0)
- unread `ACCESSIBILITY_TWEAKS` — declared in feature.yaml with default true, not read by any code in the checked roots — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:24
- unverified `WCAG 2.1 Level AA` — external standard, not verifiable in vendor code
