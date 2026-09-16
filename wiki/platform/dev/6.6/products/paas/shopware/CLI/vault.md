---
id: platform/dev/6.6/products/paas/shopware/CLI/vault.md
title: Manage secrets
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/vault.html"
sourceHash: "d04c38592bc7f8ac0c2ce8b4e7a936d9ad7ce866"
keywords: ["vault command", "sw-paas vault", "secrets management", "vault create", "vault delete", "vault list", "API keys", "SSH private keys", "env secret", "buildenv secret", "ssh secret type", "password-stdin"]
summary: "The sw-paas vault command creates, deletes and lists encrypted secrets (env, buildenv, ssh) scoped to organizations, projects or applications."
lastBuilt: "2026-09-15"
---

## What it is

The `vault` command manages secrets in Shopware PaaS Native. Secrets are encrypted pieces of sensitive data such as API keys, credentials, or SSH private keys, securely stored and only accessible to users with the required permissions.

## When to use

Use `sw-paas vault` when a sensitive value (an API key, a build-time environment variable, or an SSH private key) needs to be stored securely and made available to an organization, project, or application at runtime or build time.

## Key steps / config

```sh
sw-paas vault [command]
```

- `sw-paas vault create [flags]` — creates and stores a new secret. Flags: `--key`, `--organization-id`, `--project-id`, `--application-id`, `--value` (used for all types except `ssh`), `--password-stdin` (read the value from stdin; only valid when `--type ssh`), `--type` (`env`, `buildenv`, `ssh`), `--help`.
- `sw-paas vault delete --secret-id [id]` — deletes an existing secret. Flag: `--secret-id`.
- `sw-paas vault list [flags]` — lists secrets for a scope. Flags: `--organization-id`, `--project-id`, `--application-id`, `--with-metadata` (include metadata such as project name), `--help`.

Secret type and scope of use: `env` is available at runtime in the environment; `buildenv` is used during build processes; `ssh` provides SSH keys for secure connections.

Examples:

```sh
sw-paas vault create --organization-id "org-123" --project-id "proj-456" --application-id "app-789" --key "API_KEY" --value "my-api-key" --type env
cat private.pem | sw-paas vault create --key "SSH_KEY" --type ssh --password-stdin
sw-paas vault delete --secret-id "secret-abc123"
sw-paas vault list --organization-id "org-123" --project-id "proj-456"
```

`vault list` for a project also includes secrets scoped to applications within that project.

## Essential identifiers

- `sw-paas vault create`
- `sw-paas vault delete`
- `sw-paas vault list`
- `--type` (`env`, `buildenv`, `ssh`)
- `--password-stdin`

## Gotchas

`--password-stdin` is only valid when `--type` is `ssh`; for other types the secret value is passed via `--value`.
