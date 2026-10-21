---
id: platform/dev/6.7/products/paas/shopware/fundamentals/account.md
title: Account
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/account.html
sourceHash: 8b991e4f61858a3cb68412f48b2c4d4db54bbd33
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas account", "sw-paas account whoami", "sw-paas account context set", "context-production.yaml", "sw-paas account user", "service account", "sw-paas account service-account grant", "sw-paas account token create", "SW_PAAS_TOKEN", "personal access token", "account-admin", "ci/cd authentication"]
summary: "sw-paas account commands: whoami, context, user access requests, service accounts, grants and access tokens."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/organization.md"]
---
## What it is

An account is your access to resources in the Shopware PaaS Native backend. The `sw-paas account` commands cover identity inspection, context management, human user memberships, service accounts and access tokens.

## When to use

When checking your roles, avoiding repeated organization/project prompts, managing who has access at organization/project/application level, or setting up machine authentication for CI/CD.

## Key steps / config

Identity: `sw-paas account whoami` shows the authenticated user and its roles (organization roles: [organization guide](platform/dev/6.7/products/paas/shopware/fundamentals/organization.md)).

Context (saves `organization-id` and `project-id` so the CLI stops asking):

```sh
sw-paas account context set
sw-paas account context show
sw-paas account context delete
```

Stored as `context-production.yaml` next to the main config: Unix `~/.config/sw-paas` (XDG_CONFIG_HOME) / `~/.local/state/sw-paas` (XDG_STATE_HOME), macOS `~/Library/Application Support/sw-paas`, Windows `%LOCALAPPDATA%`.

Human users (memberships at organization, project, application level):
- `sw-paas account user list` / `add` / `remove`
- self-service: `sw-paas account user request`, `sw-paas account user requests list`
- users with role `account-admin` resolve requests: `sw-paas account user requests resolve`

Service accounts (machine identities for CI/CD, or temporary access for an external developer):
- `sw-paas account service-account create` / `list` / `update` / `delete`
- grants: `sw-paas account service-account grant list` / `add` / `policies` / `revoke`

Tokens:

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

- `sw-paas account whoami`, `sw-paas account context set|show|delete`, `context-production.yaml`
- `sw-paas account user`, `sw-paas account service-account`, `sw-paas account token`
- `--token`, `SW_PAAS_TOKEN`, `--service-account-id`, `--token-id`
- roles/policies: `account-admin`, `organization:viewer`, `project:viewer`

## Gotchas

- Strictly scoped service account tokens should address resources with `--organization-id`, `--project-id`, `--application-id`. The name options `--organization`, `--project`, `--application` resolve names via internal list API calls that need extra permissions; to use names, grant the `organization:viewer` and `project:viewer` policies.
- Personal access tokens inherit all permissions of the creating user (except creating new tokens) — anyone holding one acts as that user. Use them for personal scripts only; use service accounts for CI/CD.
- Service account tokens authenticate as the service account and are limited to its grants.

## Code check (6.7.15.1)
- unverified `sw-paas account` — sw-paas CLI, outside vendor/shopware
- unverified `SW_PAAS_TOKEN` — CLI environment variable, not part of the Shopware code roots
- unverified `context-production.yaml` — CLI config file, out of scope of vendor/shopware
