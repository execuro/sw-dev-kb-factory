---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md
sourceHash: 33b9347a7758cf8b0bdceb47c0dd925e1db16b6e
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/not-allowed-store-behaviors.html
title: Not allowed store behaviors
version: "6.7"
versions:
  - "6.7"
keywords: ["store review", "forbidden behavior", "direct sql", "core files", "core table structure", "DAL", "EntityRepository", "MigrationStep", "decorator pattern", "subscribers", "security", "legal compliance"]
summary: Shopware Store ban list - no direct SQL from the Admin, core table/file changes or API bypass; extend via DAL, migrations, events, decorators.
lastBuilt: 2026-10-21
---
## What it is

The Shopware Store's list of prohibited changes for extensions (plugins and apps) and the extension patterns that are permitted instead.

## When to use

When designing an extension feature for Store distribution, or checking why a review rejected direct database, file-system or core modifications.

## Key steps / config

Basic rule: an extension must not change the existing Shopware structure directly. Not allowed:

- Direct database manipulation (e.g. executing SQL queries from the Administration).
- Changes to the core table structure.
- Writing, overwriting or deleting files inside the Shopware core or the existing directory structure.
- Circumventing the designated APIs, DAL, events or services.

Additional prohibitions (security and law) — extensions must not:

- Undermine security mechanisms (rights and role concepts, CSRF protection, validations).
- Enable uncontrolled system interventions by the shop operator or end customer (arbitrary SQL execution, file access or shell commands via the Administration UI).
- Circumvent legal requirements: data protection and consent mechanisms; logging, documentation or verification obligations; mandatory information or legally prescribed processes.

Permitted:

- Extending via Shopware's mechanisms: DAL (`EntityRepository`), migrations (`MigrationStep` subclasses in the plugin's own namespace), events, decorator pattern, subscribers, services.
- Copying existing structures (templates, configurations, assets) and adapting the copy without changing the original.
- Creating own tables, entities, configuration values or directories that are clearly assigned to the extension.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- Reasons given: unrestricted SQL/file access enables data leaks and privilege escalation; core structures are not a stable contract and may break after the next update; undermining legal mechanisms creates liability for merchants.
- If a feature is only possible through direct SQL, core file manipulation or bypassing intended interfaces, the approach has to change.

## Code check (6.7.15.1)
- confirmed `EntityRepository` — DAL repository class extensions should use for data access — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `MigrationStep` — abstract base for schema changes in own tables — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
- confirmed `MigrationStep::update()` — abstract method every migration declares — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::getCreationTimestamp()` — abstract method every migration declares — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `Plugin` — plugin base class extends `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- unverified `CSRF protection` — policy statement, not checked against a specific code path
