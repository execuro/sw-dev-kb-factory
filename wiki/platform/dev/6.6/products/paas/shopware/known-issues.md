---
id: platform/dev/6.6/products/paas/shopware/known-issues.md
title: Known issues
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/known-issues.html"
sourceHash: "5840fd4492009fdbeb0c2218a33842b5b3477599"
keywords: ["known issues", "Shopware PaaS Native", "message queue size limit", "MessageQueueSizeRestrictListener", "S3 compatible storage", "media storage backend", "plugin compatibility", "6.7 message size restriction", "workaround"]
summary: "Documented Shopware PaaS Native issues: an upcoming message queue size restriction and plugins lacking S3-compatible storage support."
lastBuilt: "2026-09-15"
---

## What it is

This page lists acknowledged issues with Shopware PaaS Native, along with workarounds where known.

## When to use

Consult this page when a plugin fails to work on Shopware PaaS Native, or when diagnosing message queue failures related to oversized messages, before filing a new issue.

## Key steps / config

**Size of messages for the message queue**: Shopware currently does not prevent bigger messages, but the restriction will be enforced starting with the next major version, 6.7. Until then, messages sent must be kept under the limit manually; local log files should be checked for the critical log message raised by `MessageQueueSizeRestrictListener.php`.

**Plugins should support S3 compatible storage**: some third-party plugin providers may not currently support S3-compatible storage solutions. Such plugins cannot be used on Shopware PaaS Native, since it uses S3-compatible storage as the media storage backend. If this is encountered, the plugin's own documentation should be checked, or the developer contacted directly, to verify whether the plugin supports remote storage via S3 or a compatible service, and whether workarounds or planned updates exist.

## Essential identifiers

- `MessageQueueSizeRestrictListener.php` (critical log message source)
- S3-compatible storage (media storage backend requirement)

## Version notes

The message queue size restriction is not yet enforced in 6.6 but will be enforced starting with Shopware 6.7.
