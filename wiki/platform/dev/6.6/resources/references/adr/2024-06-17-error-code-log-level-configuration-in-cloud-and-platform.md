---
id: platform/dev/6.6/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.md
title: Error-code log Level configuration in platform or cloud
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.html"
sourceHash: 88c599a235b8086cc8fcb539ce5af1eb8ea15fbc
keywords: ["error code log level", "exception log level", "SaaS template", "cloud configuration file", "platform configuration file", "notice level", "on-premise customers", "flow misconfiguration", "404 errors", "observability", "error monitoring"]
summary: "ADR: guidance for deciding whether an error code's log level should be lowered in platform, in the cloud config, or neither."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record giving a guideline for deciding, per error code, whether to lower its log level in the platform configuration, only in the cloud (SaaS template) configuration, or not at all.

## When to use
Relevant when deciding at which log level a given error code should be logged for on-premise vs. cloud/SaaS customers.

## Key steps / config
- Never decrease the log level of critical errors in platform.
- Configure in cloud (SaaS template): unexpected errors a Shopware developer should investigate even though the root cause is calling code/configuration, e.g. API misuses or customer-side misconfigurations.
- Configure in platform: expected conditions that need no developer action, e.g. 404 errors or invalid login credentials.
- If an error is worth logging at high level for on-premise customers to notice, the error code must be added to the cloud configuration file in the SaaS template.

## Gotchas
An incorrectly configured flow on the customer side is an example of an error that does not need analysis by Shopware but should still be surfaced to the customer at the highest log level.
