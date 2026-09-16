---
id: platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md
title: Secrets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/secrets.html
sourceHash: 2a5f2f83744c7f7443103591ed4764d301a4c8d3
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas vault create", "sw-paas vault list", "sw-paas vault get", "sw-paas vault delete", "--secret-id", "vault", "secrets", "env", "buildenv", "ssh", "environment variables", "api tokens", "passwords"]
summary: "Shopware PaaS Native Vault secrets (types env, buildenv, ssh), organization-global; create, list, get and delete via sw-paas vault with --secret-id."
lastBuilt: 2026-09-15
---
## What it is

Shopware PaaS Native stores sensitive values such as passwords or API tokens in Vault. Secrets are global to the organization, so every application can access and reuse the same value.

## When to use

When an application needs credentials at runtime, during the build, or SSH keys for secure connections, and those values must not live in the repository.

## Key steps / config

A secret consists of a **type**, a **key**, and a **value**. On creation it receives a unique `secret-id`, needed to retrieve or delete it.

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

- `sw-paas vault create`, `sw-paas vault list`, `sw-paas vault get`, `sw-paas vault delete`
- `--secret-id`
- Secret types `env`, `buildenv`, `ssh`

## Gotchas

- `get` and `delete` require the `--secret-id` flag; the key name alone is not enough.
- Deleting a secret is permanent — make sure no application still uses it.
- Because secrets are organization-global, a change or deletion affects every application using that value.

## Code check (6.7.13.0)
- unverified `sw-paas vault create` — external PaaS CLI command, no match in vendor/shopware core or storefront, out of scope
- unverified `sw-paas vault get` — external PaaS CLI command, out of scope
- unverified `sw-paas vault delete` — external PaaS CLI command, out of scope
- unverified `--secret-id` — PaaS CLI flag, not part of the installed Shopware code
- unverified `buildenv` — PaaS Vault secret type, platform-side behaviour, out of scope
