---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/account.md
sourceHash: 8b991e4f61858a3cb68412f48b2c4d4db54bbd33
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/account.html
title: Account
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-paas account", "sw-paas account whoami", "sw-paas account context set", "sw-paas account user", "sw-paas account service-account", "sw-paas account token create", "SW_PAAS_TOKEN", "service account", "personal access token", "account-admin", "organization:viewer", "project:viewer", "context-production.yaml"]
summary: "sw-paas account CLI: whoami, context set/show/delete, user memberships and access requests, service accounts with grants, and personal/service tokens."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/organization.md"]
---
## What it is

Reference for the `sw-paas account` command group of the Shopware PaaS Native CLI: identity inspection, context management, human user memberships, service accounts and access tokens.

## When to use

When checking which resources and roles the current CLI user has, avoiding repeated `organization-id`/`project-id` prompts, granting people or CI/CD pipelines access, or creating and revoking tokens.

## Key steps / config

**Identity**: `sw-paas account whoami` shows the authenticated user and attached roles. Organization-level roles: see [organization guide](platform/dev/6.7/products/paas/shopware/fundamentals/organization.md).

**Context** (default `organization-id`/`project-id`):

- `sw-paas account context set` / `sw-paas account context show` / `sw-paas account context delete`
- Stored as `context-production.yaml` next to the main config file: Unix `~/.config/sw-paas` (`XDG_CONFIG_HOME`) or `~/.local/state/sw-paas` (`XDG_STATE_HOME`); macOS `~/Library/Application Support/sw-paas`; Windows `%LOCALAPPDATA%`.

**Human users** (memberships at organization, project, application level):

- `sw-paas account user list` / `add` / `remove`
- Self-service: `sw-paas account user request`, `sw-paas account user requests list`
- Users with the `account-admin` role resolve requests: `sw-paas account user requests resolve`

**Service accounts** (machine identities for CI/CD and automation; also usable for temporary external developer access):

- `sw-paas account service-account create` / `list` / `update` / `delete`
- Grants: `sw-paas account service-account grant list` / `add` / `policies` / `revoke`

**Tokens**:

```sh
sw-paas account token create
sw-paas --token "<your-token-here>" account whoami
export SW_PAAS_TOKEN=<your-token-here>
sw-paas account token revoke --token-id abcd-1234
sw-paas account token create --service-account-id <service-account-id>
sw-paas account token list --service-account-id <service-account-id>
sw-paas account token revoke --service-account-id <service-account-id>
```

## Essential identifiers

- `sw-paas account whoami`, `sw-paas account context set|show|delete`
- `sw-paas account user`, `sw-paas account user requests resolve`
- `sw-paas account service-account`, `sw-paas account service-account grant`
- `sw-paas account token create|list|revoke`, `--token`, `--token-id`, `--service-account-id`
- `SW_PAAS_TOKEN`, `context-production.yaml`
- Roles/policies: `account-admin`, `organization:viewer`, `project:viewer`

## Gotchas

- Strictly scoped service-account tokens may lack permission for name lookups. Use `--organization-id`, `--project-id`, `--application-id`; the name-based `--organization`, `--project`, `--application` options call internal list APIs. To use names, grant the service account the `organization:viewer` and `project:viewer` policies.
- Personal access tokens inherit all permissions of their creator (except creating new tokens) — anyone holding one acts as that user. Use service accounts for CI/CD.
- Service account tokens are limited to the permissions granted to the service account, not those of the creating user.

## Code check (6.7.13.0)
- unverified `sw-paas account` — PaaS CLI command group, not part of vendor/shopware
- unverified `SW_PAAS_TOKEN` — CLI environment variable, not read by the installed Shopware code
- unverified `organization:viewer` — PaaS backend policy name, out of scope of vendor/shopware
