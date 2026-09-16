---
id: platform/dev/6.7/resources/references/_index.md
title: References
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/
sourceHash: 75215c2f0a1142089587e1d5ee831a89a1fb9aa9
codeCheckedAgainst: "6.7.13.0"
keywords: ["references", "bin/console", "manifest.xml", "cms.xml", "entities.xml", "flow-action.xml", "webhook events", "app scripts", "adr", "xml schema", "cli commands", "payment reference"]
summary: "Index of Shopware technical references: security, bin/console commands, app manifest/cms/entities/flow XML, payment, webhooks, app scripts, and ADRs."
lastBuilt: 2026-09-15
---
## What it is

The landing page of the References section: structured technical reference documentation (specifications, XML schemas, CLI commands, event payloads, implementation details). Step-by-step guides live in other sections.

## When to use

When you need a precise specification rather than a tutorial, or need to understand why a core design decision was made.

## Key steps / config

The section is organised into:

- **Core and platform references** — Security (features, configuration, hardening); Commands Reference (CLI overview of `bin/console`); system and configuration details.
- **App development reference** —
  - Manifest Reference: `manifest.xml` structure and sections
  - CMS Reference: `cms.xml` blocks and slots (loaded from the app's `Resources/cms.xml`)
  - Entities Reference: `entities.xml` schema and relations
  - Flow Action Reference: flow action definition (the installed code reads it from `Resources/flow.xml`)
  - Payment Reference: app-based payment API contracts
  - Webhook Events Reference: webhook events, payloads, permissions
- **Script reference** — Twig-based App Scripts: available services, cart manipulation, data loading, custom endpoints, hooks and extension points.
- **Architecture Decision Records (ADRs)** — rationale, trade-offs and historical context for core architecture; consult them to understand *why* something works the way it does.

## Essential identifiers

- `bin/console`
- `manifest.xml`
- `cms.xml`
- `entities.xml`
- `Resources/flow.xml`

## Gotchas

- The docs name the flow action reference file `flow-action.xml`; the installed app lifecycle handlers load `Resources/flow.xml`, whose root element is `flow-actions`.

## Code check (6.7.13.0)
- confirmed `manifest.xml` — app root manifest loaded by the app loader — vendor/shopware/core/Framework/App/Lifecycle/AppLoader.php:109
- confirmed `Resources/cms.xml` — CMS block definitions read at app lifecycle — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:46
- confirmed `entities.xml` — custom entity schema file name constant — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- corrected `Resources/flow.xml` — docs: flow-action.xml — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:87
- confirmed `flow-actions` — flow schema element for action definitions — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:11
- unverified `bin/console` — project entry script, not part of the vendor/shopware packages
