---
id: platform/dev/6.7/products/nexus/security.md
title: Security and Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/security.html
sourceHash: 5f1b2abc199ce39ed0f732e9c0d5a6d425484d13
codeCheckedAgainst: "6.7.13.0"
keywords: ["nexus", "shopware nexus", "security", "troubleshooting", "app:activate", "ShopwareNexusIngestionService", "runtime_extension_management", "event ingestion service", "sso", "aws kms", "encryption", "odata"]
summary: Shopware Nexus data security (SSO, AES-256-GCM via AWS KMS, EU hosting), common workflow issues, and CLI activation of the Nexus ingestion app.
lastBuilt: 2026-09-15
---
## What it is

The security and troubleshooting reference for Shopware Nexus: how Nexus handles authentication and data, a table of common problems with their fixes, and how to activate the Nexus event ingestion app when the Administration cannot do it.

## When to use

- Answering questions about where and how Nexus stores data.
- A Nexus workflow is stuck, returns unauthorized errors, misses event data, or a Slack/Business Central step fails.
- The **Shopware Nexus Event Ingestion Service** app cannot be activated from the Administration (typical on composer-managed installations).

## Key steps / config

Security and data handling (as stated by the docs):

- Authentication via Shopware SSO
- AES-256-GCM encryption using AWS KMS
- Tenant-isolated storage
- EU-based infrastructure (`eu-central-1`)

Troubleshooting:

| Issue | Solution |
|---|---|
| Workflow stuck deploying | Redeploy |
| Unauthorized errors | Re-authenticate |
| Missing event data | Inspect payload with a Log node |
| BC filter returns empty | Validate OData syntax |
| Slack message not sent | Re-authorize Slack |

Activating the ingestion app from the CLI when runtime extension management is disabled:

```bash
bin/console app:activate ShopwareNexusIngestionService
```

The command takes the app name as its single required `name` argument.

## Essential identifiers

- `bin/console app:activate ShopwareNexusIngestionService`
- `ShopwareNexusIngestionService` (app technical name)
- `shopware.deployment.runtime_extension_management` (when `false`, Administration extension lifecycle actions are refused)

## Gotchas

- With `shopware.deployment.runtime_extension_management: false`, the Administration's extension install/activate/deactivate/update API actions throw an error, so activation has to happen via `app:activate`. The key defaults to `true` in core.
- `app:activate` is marked `@internal` for the app system in core; it is still the documented CLI route here.
- For further help the docs point to the Nexus club on the Shopware hub.

## Code check (6.7.13.0)
- confirmed `app:activate` — console command name of ActivateAppCommand — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:15
- confirmed `AbstractAppActivationCommand::configure()` — `name` argument is required — vendor/shopware/core/Framework/App/Command/AbstractAppActivationCommand.php:53
- confirmed `shopware.deployment.runtime_extension_management` — boolean, defaults to true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `ExtensionStoreActionsController::checkExtensionManagementAllowed()` — throws when runtime management is disabled — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:217
- unverified `ShopwareNexusIngestionService` — app shipped externally, not in installed core code
- unverified `AES-256-GCM` — Nexus SaaS infrastructure claim, not in installed code
