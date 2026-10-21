---
id: platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md
title: Using the Vault
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/secrets-vault-guide.html
sourceHash: 3a1eaa2f188e23fd3ce6d07eb05519990b768b13
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas vault", "sw-paas vault create", "sw-paas vault get", "sw-paas vault list", "sw-paas vault delete", "sw-paas vault edit", "secret-id", "buildenv", "SSH_PRIVATE_KEY", "SHOPWARE_PACKAGES_TOKEN", "STOREFRONT_CREDENTIALS", "secrets", "environment variables", "deploy key", "paas native"]
summary: Shopware PaaS Native Vault - create, list, get, edit and delete org-wide secrets (env, buildenv, ssh) with sw-paas vault; system-managed secrets.
lastBuilt: 2026-10-21
---
## What it is

The Vault of Shopware PaaS Native is a central, organization-wide store for sensitive data, managed with the `sw-paas vault` CLI commands. It holds runtime environment variables, build-time secrets and SSH keys for cloning private Git repositories. Secrets are reusable across all applications in the organization: applications that reference the same secret name share one underlying Vault secret, not per-application copies.

## When to use

- Supplying runtime or build-time environment variables (API tokens, credentials) to a PaaS Native application.
- Creating an SSH deploy key so the platform can access a private repository.
- Auditing, rotating, renaming or cleaning up secrets, including typo and legacy entries.

## Key steps / config

Secret types:

| Type | Purpose |
|---|---|
| `env` | Runtime environment variables for the app |
| `buildenv` | Build-time environment variables |
| `ssh` | SSH keys for Git access |

Commands:

```sh
sw-paas vault create                      # interactive: type, key, value
sw-paas vault create --type ssh           # generates key, prints public key
sw-paas vault list                        # all secrets and their IDs
sw-paas vault list --application-id YOUR-APP-ID
sw-paas vault get --secret-id SECRET-ID
sw-paas vault edit                        # pick a secret, change name/value
sw-paas vault delete --secret-id SECRET-ID
```

SSH key workflow:

1. `sw-paas vault create --type ssh` — the CLI outputs the public key.
2. Add the public key in GitHub under repository Settings → Deploy Keys → Add Key.
3. `sw-paas vault list` to verify; `sw-paas vault get --secret-id ssh-abc123xyz` to retrieve.
4. `sw-paas vault delete --secret-id ssh-abc123xyz` once it is no longer needed.

Back up before modifying or deleting, since there is no history:

```sh
sw-paas vault get --secret-id SECRET-ID > backup-SECRET-NAME.txt
```

Cleanup process: audit with `sw-paas vault list --application-id YOUR-APP-ID`, identify unused secrets, back up, delete, and document what was removed and when. For a typo secret either edit it in place with `sw-paas vault edit` (then update the app if the name changed and test), or back it up, create a correctly named secret with `sw-paas vault create`, switch the app to it, test, and delete the typo secret.

## Essential identifiers

- CLI: `sw-paas vault create`, `sw-paas vault list`, `sw-paas vault get`, `sw-paas vault edit`, `sw-paas vault delete`; options `--type ssh`, `--secret-id`, `--application-id`.
- Secret types: `env`, `buildenv`, `ssh`.
- System-managed (do not edit/delete): `STOREFRONT_CREDENTIALS` (storefront), `GRAFANA_CREDENTIALS` (needed for `sw-paas open grafana`), `NATS_USER_CREDENTIALS` (internal messaging), `STOREFRONT_PROXY_KEY` (routing).
- User-managed: `SSH_PRIVATE_KEY` (deploy key for repository access), `SHOPWARE_PACKAGES_TOKEN` (Shopware packages access).

## Gotchas

- System-managed secrets appear in `sw-paas vault list` because they use the same retrieval mechanism, but deleting or modifying them is unsupported and causes platform outages. The platform does not technically block it. If one seems wrong, do not touch it, document the issue (name, behavior), contact PaaS support, and do not create duplicates as a workaround.
- Deletion is permanent and there is no version history or rollback — a changed or deleted value cannot be recovered through the platform. After an accidental delete: check local backups and app config files, regenerate tokens or SSH key pairs (and update deploy keys), or contact support.
- Watch for typo variants such as `SHOPWAREPACKAGES_TOKEN` instead of `SHOPWARE_PACKAGES_TOKEN`, plus deprecated and duplicate secrets.
- Recommended practice from the source: rotate sensitive credentials regularly (e.g. every 90 days), test changes outside production, keep an inventory of secret purposes and owners, run a quarterly audit of user-managed secrets, and limit Vault access. For non-editable secret types, create a new secret and retire the old one.
- For support escalation gather secret name and ID, application ID, error messages and reproduction steps, and check for ongoing PaaS incidents first.

## Code check (6.7.15.1)
- unverified `sw-paas vault` — PaaS CLI, not part of vendor/shopware core, storefront or administration; no match in the installed code
- unverified `SHOPWARE_PACKAGES_TOKEN` — platform-level Vault secret, not read by vendor/shopware code (no match)
- unverified `STOREFRONT_PROXY_KEY` — platform-level system secret, no match in vendor/shopware code
