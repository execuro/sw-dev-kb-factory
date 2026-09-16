---
id: platform/dev/6.7/products/paas/shopware/known-issues.md
title: Known issues
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/known-issues.html
sourceHash: e4dbafc5c000399a44ff861e328bc55eafdc255b
codeCheckedAgainst: "6.7.13.0"
keywords: ["paas native", "known issues", "MessageQueueSizeRestrictListener", "shopware.messenger.message_max_kib_size", "shopware.messenger.enforce_message_size", "message queue size limit", "s3 compatible storage", "amazon-s3", "remote media storage", "mtls tunnel", "nat", "wsl", "sw-paas exec", "sw-paas service"]
summary: "Shopware PaaS Native known issues: message queue size limit, plugins lacking S3 storage support, and exec/service mTLS tunnels failing behind NAT."
lastBuilt: 2026-09-15
---
## What it is

A list of acknowledged issues with Shopware PaaS Native and their workarounds: oversized message queue messages, third-party plugins that do not support S3-compatible storage, and CLI tunnel commands that fail behind NAT.

## When to use

- A message dispatched to the queue fails with a size-exceeded error, or you want to make sure your plugin's messages stay within the limit before deploying to PaaS Native.
- You plan to install a third-party plugin on PaaS Native and need to know whether it works with remote media storage.
- `exec` or `service` CLI commands cannot establish a connection from a VM or WSL.

## Key steps / config

### Message queue message size

- Keep messages sent to asynchronous transports small. The size check lives in `Shopware\Core\Framework\MessageQueue\Subscriber\MessageQueueSizeRestrictListener`, which listens on Symfony Messenger's `SendMessageToTransportsEvent`.
- In the installed code the limit is configurable and the check is opt-in:

```yaml
shopware:
    messenger:
        enforce_message_size: false   # default; when true, oversize messages throw
        message_max_kib_size: 1024    # limit in KiB
```

- When enforced and exceeded, the listener throws `MessageQueueException::maxQueueMessageSizeExceeded()` ("exceeds the {{ maxSize }} KiB size limit"). Messages routed only to the sync transport are not checked.
- Check your local log files for this error before deploying.

### Plugins and S3-compatible storage

- PaaS Native uses S3-compatible storage as the media storage backend (Shopware's filesystem adapter type `amazon-s3`). Plugins that assume local filesystem storage cannot be used.
- Check the plugin's documentation or contact its developer to confirm remote storage support via S3 or a compatible service, and ask about workarounds or planned updates.

### Network configuration for `exec` and `service`

- The `exec` and `service` commands establish mTLS tunnels, which are not compatible with NAT (Network Address Translation).
- In a Virtual Machine or Windows Subsystem for Linux, set the network mode to `Host` or `Mirrored`.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\Subscriber\MessageQueueSizeRestrictListener`
- `shopware.messenger.enforce_message_size`, `shopware.messenger.message_max_kib_size`
- `MessageQueueException::maxQueueMessageSizeExceeded()`
- Filesystem adapter type `amazon-s3`
- CLI commands `exec`, `service`; network modes `Host`, `Mirrored`

## Gotchas

- The docs describe a fixed limit that "will" be enforced with 6.7; in 6.7.13.0 the limit is 1024 KiB by default and enforcement is off unless `shopware.messenger.enforce_message_size` is `true`. The old 256 KiB constant `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` is deprecated.
- NAT networking (default in many VM/WSL setups) breaks the mTLS tunnels silently from the user's perspective; switch the network mode rather than debugging the command.

## Version notes

- `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` (262144 bytes) is marked `@deprecated tag:v6.8.0` in favour of `shopware.messenger.message_max_kib_size`.

## Code check (6.7.13.0)
- confirmed `MessageQueueSizeRestrictListener` — readonly listener class performing the size check — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:12
- deprecated `MessageQueueSizeRestrictListener::MESSAGE_SIZE_LIMIT` — 1024 * 256 bytes, deprecated for v6.8.0 — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:19
- corrected `enforce_message_size` — docs: limit enforced from 6.7; code defaults it to false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1469
- corrected `message_max_kib_size` — docs: fixed limit; code default 1024 KiB, configurable — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1470
- confirmed `MessageQueueException::maxQueueMessageSizeExceeded()` — thrown when size exceeds the configured KiB limit — vendor/shopware/core/Framework/MessageQueue/Subscriber/MessageQueueSizeRestrictListener.php:50
- confirmed `amazon-s3` — S3 filesystem adapter type — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- unverified `exec` — PaaS CLI command, not part of vendor/shopware
- unverified `service` — PaaS CLI command and its mTLS/NAT behaviour, not part of vendor/shopware
