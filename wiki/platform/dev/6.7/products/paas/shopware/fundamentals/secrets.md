---
id: platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md
title: Secrets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/secrets.html
sourceHash: 2a5f2f83744c7f7443103591ed4764d301a4c8d3
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas vault create", "sw-paas vault list", "sw-paas vault get", "sw-paas vault delete", "--secret-id", "vault", "secrets", "env", "buildenv", "ssh", "environment variables", "api tokens", "paas native"]
summary: Shopware PaaS Native Vault secrets (types env, buildenv, ssh) shared org-wide; create, list, get and delete them with sw-paas vault and --secret-id.
lastBuilt: 2026-10-21
---
## What it is

Shopware PaaS Native stores sensitive values such as passwords or API tokens in a Vault. Secrets are reusable across applications and global to the organization, so every application can access the same values.

## When to use

When an application or its build needs credentials, tokens or SSH keys without committing them to the repository.

## Key steps / config

A secret consists of a type, a key and a value. On creation it gets a unique `secret-id`, needed to retrieve or delete it.

Supported types:

| Type | Available |
|---|---|
| `env` | at runtime in the application |
| `buildenv` | during build processes |
| `ssh` | SSH keys for secure connections |

Commands:

```sh
sw-paas vault create
sw-paas vault list
sw-paas vault get --secret-id SECRET-ID
sw-paas vault delete --secret-id SECRET-ID
```

## Essential identifiers

- `sw-paas vault create` / `sw-paas vault list`
- `sw-paas vault get --secret-id SECRET-ID`
- `sw-paas vault delete --secret-id SECRET-ID`
- secret types `env`, `buildenv`, `ssh`

## Gotchas

- `get` and `delete` require the `--secret-id` flag; the key alone is not enough.
- Deleting a secret is permanent — ensure it is no longer in use first.
- Because secrets are organization-global, a change or deletion affects all applications that use the value.

## Code check (6.7.15.1)
- unverified `sw-paas vault create` — Shopware PaaS CLI command, not part of the installed Shopware packages
- unverified `sw-paas vault get` — Shopware PaaS CLI command, out of scope of vendor/shopware
- unverified `sw-paas vault delete` — Shopware PaaS CLI command, out of scope of vendor/shopware
- unverified `buildenv` — PaaS secret type, platform-side concept not in vendor/shopware
