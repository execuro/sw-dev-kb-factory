---
id: platform/dev/6.7/resources/references/_index.md
title: References
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/
sourceHash: 75215c2f0a1142089587e1d5ee831a89a1fb9aa9
codeCheckedAgainst: "6.7.15.1"
keywords: ["references", "technical reference", "bin/console", "manifest.xml", "cms.xml", "entities.xml", "flow-action.xml", "webhook events", "app scripts", "adr", "architecture decision records", "xml schema"]
summary: Overview of Shopware's technical reference section - security, CLI commands, app XML references (manifest, cms, entities, flow), app scripts and ADRs.
lastBuilt: 2026-10-21
---
## What it is

The entry page of the Shopware "References" section: structured technical reference documentation (precise specifications, XML schemas, CLI commands, event payloads, implementation details). Step-by-step guides live in other sections.

## When to use

When you need an exact specification rather than a tutorial: a schema element, a CLI command, a webhook payload, or the reasoning behind an architectural choice.

## Key steps / config

The section is grouped into four areas:

- **Core and platform references** — behavior, parameters and configuration:
  - Security: platform security features, configuration options, hardening.
  - Commands Reference: complete CLI command overview (`bin/console`).
  - System and configuration details.
- **App development reference** — authoritative docs for building and validating Shopware Apps:
  - Manifest Reference: `manifest.xml` structure and supported sections (read from the app root).
  - CMS Reference: `cms.xml` blocks and slots (read from `Resources/cms.xml`).
  - Entities Reference: `entities.xml` schema and relations.
  - Flow Action Reference: flow action definitions; the installed code reads them from `Resources/flow.xml`.
  - Payment Reference: app-based payment API contracts.
  - Webhook Events Reference: available webhook events, payloads and permissions.
- **Script reference** — Twig-based App Scripts: available services, cart manipulation, data loading, custom endpoints, hooks and extension points.
- **Architecture Decision Records (ADRs)** — rationale behind technical design choices, trade-offs and constraints, historical context for the core architecture. Consult them to understand *why* something works the way it does.

## Essential identifiers

- `bin/console`
- `manifest.xml`
- `Resources/cms.xml`
- `entities.xml`
- `Resources/flow.xml`

## Gotchas

- The docs list a "`flow-action.xml` definition"; the 6.7 app lifecycle handlers load flow actions (and flow events) from `Resources/flow.xml` instead.

## Code check (6.7.15.1)
- confirmed `manifest.xml` — app manifest loaded from the app root — vendor/shopware/core/Framework/App/Manifest/ManifestFactory.php:28
- confirmed `Resources/cms.xml` — CMS blocks of an app read from this file — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `CustomEntityXmlSchema::FILENAME` — value `entities.xml` — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- corrected `Resources/flow.xml` — docs: `flow-action.xml`; flow actions are loaded from `Resources/flow.xml` — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- unverified `bin/console` — console entry script belongs to the project template, outside the checked packages
