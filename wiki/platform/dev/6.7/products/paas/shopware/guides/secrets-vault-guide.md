---
id: platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md
title: Using the Vault
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/secrets-vault-guide.html
sourceHash: 3a1eaa2f188e23fd3ce6d07eb05519990b768b13
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas vault", "sw-paas vault create --type ssh", "sw-paas vault get --secret-id", "sw-paas vault edit", "sw-paas vault delete", "buildenv", "SHOPWARE_PACKAGES_TOKEN", "SSH_PRIVATE_KEY", "STOREFRONT_CREDENTIALS", "system-managed secrets", "secrets", "environment variables", "deploy key", "paas native"]
summary: "Shopware PaaS Vault secrets (env, buildenv, ssh): sw-paas vault create/get/list/edit/delete, system-managed secrets, no history, cleanup of typo secrets."
lastBuilt: 2026-09-15
---
## What it is

The Shopware PaaS Vault is the organization-wide store for secrets — runtime env vars, build-time env vars and SSH keys for private Git repositories — managed through the `sw-paas vault` CLI. Secrets are reusable across all applications in the organization.

## When to use

When you need to add, inspect, rotate or remove secrets for a PaaS application, set up an SSH deploy key, or clean up legacy/typo secrets without breaking platform-managed ones.

## Key steps / config

Secret types:

| Type | Purpose |
|---|---|
| `env` | Runtime environment variables |
| `buildenv` | Build-time environment variables |
| `ssh` | SSH keys for Git access |

Commands:

- `sw-paas vault create` — interactive: prompts for type, key, value.
- `sw-paas vault create --type ssh` — generates a key and prints the public key; add it to the Git host (GitHub: Settings → Deploy Keys → Add Key).
- `sw-paas vault list` — lists all organization secrets and their IDs; `sw-paas vault list --application-id YOUR-APP-ID` for an audit.
- `sw-paas vault get --secret-id SECRET-ID` — retrieve (IDs look like `ssh-abc123xyz`).
- `sw-paas vault edit` — select a secret and update its name/value.
- `sw-paas vault delete --secret-id SECRET-ID` — permanent.

Back up before changing or deleting, since there is no version history:

```sh
sw-paas vault get --secret-id SECRET-ID > backup-SECRET-NAME.txt
```

Fixing a typo secret: either `sw-paas vault edit` and update the application to the corrected name, or back up the value, `sw-paas vault create` a correctly named secret, switch the application to it, test, then `sw-paas vault delete --secret-id TYPO-SECRET-ID`.

Cleanup process: audit with `vault list`, identify unused secrets, back up, delete, document what was removed. Rotate sensitive credentials regularly (the source suggests every 90 days); for non-editable secret types create a new secret and retire the old one.

## Essential identifiers

System-managed (read-only, do not delete):

- `STOREFRONT_CREDENTIALS` — internal storefront credentials
- `GRAFANA_CREDENTIALS` — Grafana login, needed for `sw-paas open grafana`
- `NATS_USER_CREDENTIALS` — internal NATS messaging
- `STOREFRONT_PROXY_KEY` — storefront proxy authentication / routing

User-managed (editable):

- `SSH_PRIVATE_KEY` — deploy SSH key for repository access
- `SHOPWARE_PACKAGES_TOKEN` — token for Shopware packages

CLI: `sw-paas vault create|list|get|edit|delete`, flags `--type`, `--secret-id`, `--application-id`.

## Gotchas

- Deleting or modifying a system-managed secret is not technically blocked but is unsupported and causes platform outages (storefront, routing, Grafana, NATS). If one looks wrong, do not touch it or create duplicates — document the issue and contact PaaS support.
- System-managed secrets appear in `vault list` because they use the same retrieval mechanism as user secrets.
- Secrets are organization-global: applications using the same secret name share one underlying secret, not per-application copies.
- No version history or recovery: a modified or deleted value cannot be restored by the platform. After an accidental delete, check local backups, regenerate the token or SSH key pair (and update deploy keys), or contact support.
- Watch for typo variants such as `SHOPWAREPACKAGES_TOKEN` (missing underscore) and for duplicate secrets with different IDs.
- For support escalation, gather secret name and ID, application ID, error messages and reproduction steps, and check PaaS status first.

## Code check (6.7.13.0)
- unverified `sw-paas vault` — PaaS CLI, not part of vendor/shopware
- unverified `STOREFRONT_CREDENTIALS` — PaaS platform secret; no match in vendor/shopware
- unverified `GRAFANA_CREDENTIALS` — PaaS platform secret; no match in vendor/shopware
- unverified `NATS_USER_CREDENTIALS` — PaaS platform secret; no match in vendor/shopware
- unverified `STOREFRONT_PROXY_KEY` — PaaS platform secret; no match in vendor/shopware
- unverified `SSH_PRIVATE_KEY` — PaaS vault secret name; no match in vendor/shopware
- unverified `SHOPWARE_PACKAGES_TOKEN` — PaaS vault secret name; no match in vendor/shopware
