---
id: platform/dev/6.7/products/paas/shopware/known-issues.md
title: Known issues
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/known-issues.html
sourceHash: e4dbafc5c000399a44ff861e328bc55eafdc255b
codeCheckedAgainst: "6.7.15.1"
keywords: ["MessageQueueSizeRestrictListener", "shopware.messenger.message_max_kib_size", "shopware.messenger.enforce_message_size", "message size limit", "message queue", "s3", "remote storage", "mtls", "nat", "wsl", "sw-paas exec", "known issues"]
summary: "Shopware PaaS Native known issues: message queue size limit, plugins lacking S3 storage support, exec/service mTLS tunnels failing behind NAT."
lastBuilt: 2026-10-21
---
## What it is

A list of acknowledged limitations of Shopware PaaS Native, with workarounds where known: message queue message size, plugins that cannot use S3-compatible storage, and network modes that break the CLI's tunnelling commands.

## When to use

When a PaaS Native deployment shows oversized queue messages, a third-party plugin fails with media/file storage, or `sw-paas exec`/`service` cannot connect from a VM or WSL.

## Key steps / config

- **Message size**: keep the messages you dispatch below the queue size limit, and check your local log files for the error raised by `Shopware\Core\Framework\MessageQueue\Subscriber\MessageQueueSizeRestrictListener` (source file `src/Core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php` in `github.com/shopware/shopware`). In 6.7.15.1 the listener checks only messages sent to a non-sync transport, and only when enforcement is on:
  ```yaml
  shopware:
    messenger:
      enforce_message_size: false   # code default
      message_max_kib_size: 1024    # in KiB, code default
  ```
  When enabled and exceeded, it throws a `MessageQueueException` ("exceeds the … KiB size limit").
- **S3 storage**: PaaS Native uses S3-compatible storage as media storage backend. Plugins that do not support it cannot be used; check the plugin's documentation or contact its developer about remote/S3 support or workarounds.
- **Network**: `exec` and `service` establish mTLS tunnels, which do not work through NAT. In a VM or WSL, set the network mode to `Host` or `Mirrored`.

## Essential identifiers

- `MessageQueueSizeRestrictListener`, `shopware.messenger.message_max_kib_size`, `shopware.messenger.enforce_message_size`
- CLI commands `exec`, `service`; network modes `Host`, `Mirrored`

## Gotchas

- The docs say Shopware will prevent bigger messages starting with 6.7. In the installed 6.7.15.1 code, enforcement is opt-in: `enforce_message_size` defaults to `false`, so oversized messages are not rejected unless it is enabled.
- The old constant `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` (256 KiB) is deprecated for v6.8.0 in favour of `shopware.messenger.message_max_kib_size`.

## Code check (6.7.15.1)
- corrected `shopware.messenger.enforce_message_size` — docs: size is enforced from 6.7; code default is false (Configuration.php:1514) — vendor/shopware/core/Framework/DependencyInjection/message-queue.php:37
- confirmed `shopware.messenger.message_max_kib_size` — default 1024 KiB (Configuration.php:1515) — vendor/shopware/core/Framework/DependencyInjection/message-queue.php:38
- confirmed `MessageQueueSizeRestrictListener::__invoke()` — throws when size exceeds messageMaxKiBSize * 1024 — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:31
- deprecated `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` — deprecated tag:v6.8.0, use message_max_kib_size — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:19
- confirmed `MessageQueueException::maxQueueMessageSizeExceeded()` — exception raised on oversized messages — vendor/shopware/core/Framework/MessageQueue/MessageQueueException.php:88
- unverified `exec` — PaaS CLI mTLS tunnel, outside vendor/shopware
