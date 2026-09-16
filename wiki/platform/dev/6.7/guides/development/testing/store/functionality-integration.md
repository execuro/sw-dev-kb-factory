---
id: platform/dev/6.7/guides/development/testing/store/functionality-integration.md
title: Functionality and integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/functionality-integration.html
sourceHash: 417ef02971c2a8c8c068777428351ddd108644e9
codeCheckedAgainst: "6.7.13.0"
keywords: ["store review", "functionality and integration", "api test button", "credential validation", "config.xml", "per sales channel configuration", "SystemConfigService", "message queue size", "256 kb", "shopware.messenger.message_max_kib_size", "log_entry", "media folder", "technology partner agreement", "external fonts"]
summary: Store review rules for extension behavior - API test button, per-sales-channel config.xml, 256 KB queue messages, media folders, no main-menu entries, STP.
lastBuilt: 2026-09-15
---
## What it is

Shopware Store quality requirements for how an extension integrates functionally: external API validation, per-sales-channel configuration, message queue payload size, structural restrictions, and disclosure of external fonts/services.

## When to use

When building or testing a plugin or app for Store submission that calls external APIs, has Storefront-visible settings, dispatches queue messages, or uploads media.

## Key steps / config

**API validation and external services**
- Provide an API test button, or validate credentials when settings are saved.
- Show a status message in the Administration; log success or failure.
- Log invalid API data to `/var/log/` or the database event log (the `log_entry` entity in core).
- Reference pattern named by the docs: the `ShyimApiTest` example repository.

**Configuration per sales channel**
- Extensions appearing in the Storefront must be configurable per sales channel, or scoped to a single channel. This applies to plugins and to apps that ship `config.xml` (read from `Resources/config/config.xml`).
- In code, read values scoped with `SystemConfigService::get(string $key, ?string $salesChannelId = null)`.

**Message queue**
- Messages added to the queue must not exceed **256 KB** (limit of common queue workers, e.g. SQS).
- Core can enforce a size cap via `shopware.messenger.enforce_message_size` together with `shopware.messenger.message_max_kib_size`:

```yaml
shopware:
    messenger:
        enforce_message_size: true
        message_max_kib_size: 256
```

**Structure**
- Use your own media folders or existing ones for uploads; do not change Shopware's base structure.
- Do not add entries to the Administration main menu.
- Do not load external files during installation in the Extension Manager, and do not modify the Extension Manager.
- Include an API test integration when API credentials are required.
- A Shopware Technology Partner (STP) agreement is required for commission-based integrations that bill the merchant.

**External fonts and services**
- If external fonts (e.g. Google Fonts, Font Awesome) or services are used, state it in the Store description.

**Helpful tools** named by the docs: the FroshTools Store extensions "Adminer for Admin", "Tools" and "Mail Archive".

## Essential identifiers

- `config.xml` (`Resources/config/config.xml`)
- `SystemConfigService::get()`
- `shopware.messenger.enforce_message_size`
- `shopware.messenger.message_max_kib_size`
- `log_entry`
- `/var/log/`

## Gotchas

- The installed core does not enforce 256 KB by default: `enforce_message_size` defaults to `false` and `message_max_kib_size` defaults to `1024` KiB. The Store limit is stricter, so size your messages yourself or set the config for testing.
- The old constant `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` (262144 bytes) is deprecated for v6.8.0 in favor of `shopware.messenger.message_max_kib_size`.

## Code check (6.7.13.0)
- confirmed `SystemConfigService::get()` — accepts optional `$salesChannelId` for per-channel values — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- confirmed `Resources/config/config.xml` — plugin config file path read by core — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:33
- confirmed `Resources/config/config.xml` — app config file path read by core — vendor/shopware/core/System/SystemConfig/Service/AppConfigReader.php:26
- confirmed `shopware.messenger.enforce_message_size` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1469
- confirmed `shopware.messenger.message_max_kib_size` — integer, default 1024 KiB (Store limit of 256 KB is stricter) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1470
- deprecated `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` — 1024 * 256 bytes, deprecated tag:v6.8.0 — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:19
- confirmed `log_entry` — database event log entity — vendor/shopware/core/Framework/Log/LogEntryDefinition.php:19
- unverified `ShyimApiTest` — external example repository, out of scope of vendor/shopware
