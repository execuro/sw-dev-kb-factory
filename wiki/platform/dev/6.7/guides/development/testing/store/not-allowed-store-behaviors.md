---
id: platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md
title: Not allowed store behaviors
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/not-allowed-store-behaviors.html
sourceHash: 33b9347a7758cf8b0bdceb47c0dd925e1db16b6e
codeCheckedAgainst: "6.7.13.0"
keywords: ["not allowed behaviors", "store review", "direct sql", "core table changes", "core file manipulation", "DAL", "MigrationStep", "EntityRepository", "decorator pattern", "event subscribers", "csrf", "rights and roles", "legal compliance", "permitted extension patterns"]
summary: Store rules on forbidden extension behavior - no direct SQL, core table/file edits, API/DAL bypass or security circumvention; use DAL, migrations, events.
lastBuilt: 2026-09-15
---
## What it is

The Shopware Store's list of prohibited changes for extensions (plugins and apps) and the extension patterns to use instead.

## When to use

When designing an extension feature that seems to need direct database, file-system or core access, or when a Store review rejects an extension for architecture violations.

## Key steps / config

**Not allowed — direct changes to the existing Shopware structure**
- Direct database manipulation (e.g. executing SQL queries from the Administration).
- Changing the core table structure.
- Writing, overwriting or deleting files in the Shopware core or the existing directory structure.
- Circumventing designated APIs, the DAL, events or services.

**Not allowed — security and law**
- Undermining protection mechanisms: rights and role concepts, CSRF protection, validations.
- Enabling uncontrolled system interventions by the shop operator or customer: arbitrary SQL execution, file access, or shell commands via the Administration UI.
- Circumventing legal requirements: data protection and consent mechanisms; logging, documentation or verification obligations; mandatory information or legally prescribed processes.

**Permitted**
- Extending through Shopware mechanisms: DAL (`EntityDefinition`, `EntityRepository`), migrations (`MigrationStep`), events and subscribers, the decorator pattern, services.
- Copying existing structures (templates, configurations, assets) and adapting the copy without changing the original.
- Creating your own tables, entities, configuration values or directories, clearly assigned to the extension.

## Essential identifiers

- `EntityDefinition`, `EntityRepository` (DAL)
- `MigrationStep` (migrations)
- `DecorationPatternException` (thrown by core services not meant to be decorated)

## Gotchas

- Core structures are not a stable contract: direct SQL against core tables or core file edits may break shops after the next update.
- Unrestricted SQL or file access risks data leaks, manipulation and privilege escalation.
- If a feature is only possible via direct SQL, core file manipulation or bypassing intended interfaces, the approach must change.
- The installed Storefront has no form CSRF token mechanism; request forgery protection relies on the session cookie setting `cookie_samesite: lax`.

## Code check (6.7.13.0)
- confirmed `EntityDefinition` — DAL base class for own entities — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `EntityRepository` — DAL repository for data access instead of raw SQL — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `MigrationStep` — base class for own schema migrations — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
- confirmed `DecorationPatternException` — core signal for services not to be decorated — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `cookie_samesite` — session cookie SameSite lax in core framework config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- unverified `EventSubscriberInterface` — Symfony component, vendor/symfony out of scope
