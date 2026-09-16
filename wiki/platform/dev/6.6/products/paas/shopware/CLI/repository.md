---
id: platform/dev/6.6/products/paas/shopware/CLI/repository.md
title: Repository Access
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/repository.html"
sourceHash: "760be5046fdcd7f5e3c0b7ced01eac3a9e515caf"
keywords: ["ssh deploy key", "repository access", "sw-paas vault create", "deploy keys", "private git repository", "ssh-keygen", "organization level key", "project level key", "read-only access", "PEM format"]
summary: Configuring an SSH deploy key so Shopware PaaS Native can clone a private Git repository during deployments.
lastBuilt: "2026-09-15"
---
## What it is

This page describes how to set up an SSH deploy key so Shopware PaaS Native can securely clone a private Git repository during deployments.

## When to use

Use this when connecting a private Git repository to Shopware PaaS Native, either via the CLI or by manually generating and registering an SSH key.

## Key steps / config

**Option 1 — Automated via CLI:**

```sh
sw-paas vault create --type ssh
sw-paas vault create --type ssh --project <project-id>
```

By default the key is stored at the organization level (available to all projects); use `--project` to scope it to one project. Copy the generated public key into the repository's Deploy keys section.

**Option 2 — Manual:**

1. Generate a passwordless key pair (RSA in PEM format, or ED25519/ECDSA also supported if passwordless and PEM):

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f ./sw-paas
```

2. Add the contents of `sw-paas.pub` as a read-only deploy key (GitHub: `Settings` → `Deploy keys`; GitLab/Bitbucket: equivalent section).
3. Store the private key in the vault:

```bash
cat sw-paas | sw-paas vault create --type ssh --password-stdin
```

## Essential identifiers

- `sw-paas vault create --type ssh`
- `ssh-keygen -t rsa -b 4096 -m PEM -f ./sw-paas`
- `sw-paas.pub`

## Gotchas

Only one SSH key can be stored per level (organization or project); a project-level key overrides an organization-level one during deployments. The private key must be passwordless and in PEM format.
