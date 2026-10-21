---
id: platform/dev/6.7/guides/development/testing/store/functionality-integration.md
title: Functionality and integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/functionality-integration.html
sourceHash: 417ef02971c2a8c8c068777428351ddd108644e9
codeCheckedAgainst: "6.7.15.1"
keywords: ["store review", "api test button", "config.xml", "sales channel configuration", "message queue", "message size", "256 KB", "shopware.messenger.message_max_kib_size", "enforce_message_size", "media folder", "technology partner", "external fonts", "SystemConfigService"]
summary: Store review functionality rules - API credential test, per-sales-channel config.xml, 256 KB queue messages, media folders, external font disclosure
lastBuilt: 2026-10-21
---
## What it is

Shopware Store review requirements on how an extension integrates functionally: external API validation, sales-channel configuration, message queue payload size, structure rules and disclosure of external services. Visual design must stay consistent with Shopware and fit existing sections.

## When to use

When building or reviewing an extension that talks to external APIs, has Storefront-visible config, dispatches queue messages, or uploads media, before Store submission.

## Key steps / config

API validation and external services:

- Provide an **API test button** or validate credentials on saving settings.
- Show a **status message** in the Administration and log success/failure.
- Log invalid API data to `/var/log/` or the database event log. Example pattern: `https://github.com/shyim/ShyimApiTest`.

Configuration per sales channel: Storefront-visible extensions (plugins and apps using `config.xml`) must be configurable separately per sales channel, or scoped to a single channel. Read values with `SystemConfigService::get($key, $salesChannelId)` so per-channel values apply.

Message queue: keep each message at most **256 KB** — a limit of common queue workers. Core enforces a size only when `shopware.messenger.enforce_message_size` is `true` (default `false`), against `shopware.messenger.message_max_kib_size` (default `1024` KiB); exceeding it throws `FRAMEWORK__QUEUE_MESSAGE_SIZE_EXCEEDS`. Messages to the sync transport are not checked.

```yaml
shopware:
    messenger:
        enforce_message_size: true
        message_max_kib_size: 256
```

Structure:

- Create own media folders or use existing ones; do not change Shopware's base structure; do not add Administration main-menu entries.
- Do **not** load external files during installation in the Extension Manager, and do **not** modify the Extension Manager.
- Include an API test integration when credentials are required.
- A **Shopware Technology Partner (STP)** agreement is required for commission-based integrations that bill the merchant.

External fonts/services (e.g. Google Fonts, Font Awesome) must be named in the Store description.

## Essential identifiers

- `config.xml`
- `SystemConfigService::get()`
- `shopware.messenger.enforce_message_size`, `shopware.messenger.message_max_kib_size`
- `FRAMEWORK__QUEUE_MESSAGE_SIZE_EXCEEDS`

## Gotchas

- The guideline's 256 KB is stricter than the core default of 1024 KiB; core does not enforce any size unless `enforce_message_size` is enabled.
- `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` (256 KiB) is deprecated for v6.8.0 in favour of the `message_max_kib_size` config option.

## Code check (6.7.15.1)
- confirmed `shopware.messenger.enforce_message_size` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1514
- corrected `shopware.messenger.message_max_kib_size` — docs: 256 KB limit; core default is 1024 KiB — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1515
- deprecated `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` — 1024 * 256, deprecated tag:v6.8.0 — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:19
- confirmed `FRAMEWORK__QUEUE_MESSAGE_SIZE_EXCEEDS` — error code when the limit is exceeded — vendor/shopware/core/Framework/MessageQueue/MessageQueueException.php:19
- confirmed `SystemConfigService::get()` — accepts optional `$salesChannelId` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:60
- unverified `ShyimApiTest` — external example repository
