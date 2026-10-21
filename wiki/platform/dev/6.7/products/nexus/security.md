---
id: platform/dev/6.7/products/nexus/security.md
title: Security and Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/security.html
sourceHash: 5f1b2abc199ce39ed0f732e9c0d5a6d425484d13
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware nexus", "nexus security", "troubleshooting", "app:activate", "ShopwareNexusIngestionService", "Shopware Nexus Event Ingestion Service", "runtime_extension_management", "aes-256-gcm", "aws kms", "eu-central-1", "odata", "log node"]
summary: "Nexus security (SSO, AES-256-GCM via AWS KMS, EU hosting), fixes for common issues, and CLI activation of ShopwareNexusIngestionService."
lastBuilt: 2026-10-21
---
## What it is

This page covers how Shopware Nexus handles security and data, lists fixes for common workflow problems, and explains how to activate the Nexus event ingestion app from the CLI.

## When to use

Use it when you check how Nexus stores data, when a workflow or integration fails, or when the Nexus ingestion service cannot be activated in the Administration.

## Key steps / config

Security and data handling:

- Authentication via Shopware SSO
- AES-256-GCM encryption using AWS KMS
- Tenant-isolated storage
- EU-based infrastructure (`eu-central-1`)

Troubleshooting:

| Issue | Solution |
|---|---|
| Workflow stuck deploying | Redeploy |
| Unauthorized errors | Re-authenticate |
| Missing event data | Inspect the payload with a Log node |
| BC filter returns empty | Validate the OData syntax |
| Slack message not sent | Re-authorize Slack |

Activating the ingestion service: when runtime extension management is disabled (`shopware.deployment.runtime_extension_management: false`, common on composer-managed installations), the **Shopware Nexus Event Ingestion Service** cannot be activated from the Administration. Activate it from the CLI:

```bash
bin/console app:activate ShopwareNexusIngestionService
```

`app:activate` takes one required `name` argument, the app's technical name.

## Essential identifiers

- `bin/console app:activate ShopwareNexusIngestionService`
- `shopware.deployment.runtime_extension_management`

## Gotchas

- `runtime_extension_management` defaults to `true`. When it is `false`, the Admin API info endpoint reports `disableExtensionManagement`, and the Administration does not offer extension activation.
- If you are still stuck, ask in the Nexus club on the Shopware hub.

## Code check (6.7.15.1)
- confirmed `app:activate` — core console command, activates an installed app via the app lifecycle — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:16
- confirmed `AbstractAppActivationCommand::configure()` — required `name` argument — vendor/shopware/core/Framework/App/Command/AbstractAppActivationCommand.php:53
- confirmed `shopware.deployment.runtime_extension_management` — boolean, default `true` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `disableExtensionManagement` — the info endpoint exposes the negated setting to the Administration — vendor/shopware/core/Framework/Api/Controller/InfoController.php:217
- unverified `ShopwareNexusIngestionService` — app name delivered as a Shopware service, not in core code
