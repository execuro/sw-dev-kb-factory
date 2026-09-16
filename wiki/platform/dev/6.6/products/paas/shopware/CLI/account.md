---
id: platform/dev/6.6/products/paas/shopware/CLI/account.md
title: Managing your Account and Users
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/account.html"
sourceHash: "425f3299f4573e35200cacf24053aa35cbe4be1d"
keywords: ["sw-paas account", "account command", "context command", "token command", "user command", "whoami", "read-only role", "developer role", "account-admin role", "project-admin role", "XDG_CONFIG_HOME", "XDG_STATE_HOME"]
summary: The sw-paas account command's context, token, user, and whoami subcommands, plus available account roles.
lastBuilt: "2026-09-15"
---
## What it is

This page documents the `account` command of the Shopware PaaS Native CLI (`sw-paas account`), covering context management, token handling, user-role mapping, and identity lookup.

## When to use

Use this when configuring persistent CLI context, creating or revoking access tokens, adding/removing users and roles in an organization, or checking your own identity and permissions.

## Key steps / config

```sh
sw-paas account [command]
```

- `context`: manage a context file (`organization-id`, `project-id`) to skip repeated prompts. Subcommands: `set`, `show`, `delete`. Default file is `context-production.yaml`, stored alongside the main config (locations differ by OS, keyed by `XDG_CONFIG_HOME`/`XDG_STATE_HOME`).
- `token`: manage personal access tokens. Subcommands: `create`, `list`, `revoke`.
- `user`: map users to roles. Subcommands: `add`, `remove`. A user shares their `sub` ID (from `sw-paas account whoami --output json`) to be added.
- `whoami`: shows identity (User ID/Sub ID, email) and associated policies.

Example:

```sh
sw-paas account user add --sub adbs-123 --organization-id abc-123 --role developer
```

## Essential identifiers

- `sw-paas account context set|show|delete`
- `sw-paas account token create|list|revoke`
- `sw-paas account user add|remove`
- `sw-paas account whoami`
- `XDG_CONFIG_HOME`
- `XDG_STATE_HOME`

## Gotchas

Available roles: `read-only` (get/list only), `developer` (all actions on projects/applications), `account-admin` (all actions on projects/applications), `project-admin` (account management, can manage users). Only sufficiently privileged users (e.g. admin) can modify roles.
