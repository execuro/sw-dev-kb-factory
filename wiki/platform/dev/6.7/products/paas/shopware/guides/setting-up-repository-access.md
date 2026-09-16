---
id: platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md
title: How to set up repository access
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/setting-up-repository-access.html
sourceHash: 91560279963336542e78a73f02efcf3f379b4ddd
codeCheckedAgainst: "6.7.13.0"
keywords: ["deploy key", "ssh key", "sw-paas vault create --type ssh", "--project", "--password-stdin", "ssh-keygen", "PEM", "private repository", "git access", "vault", "organization level", "project level", "paas native"]
summary: "Private Git repo access for PaaS Native: SSH deploy key via sw-paas vault create --type ssh, or ssh-keygen PEM key piped with --password-stdin."
lastBuilt: 2026-09-15
---
## What it is

How Shopware PaaS Native gets read access to a private Git repository: an SSH deploy key whose public half is added to the repository and whose private half is stored in the PaaS Vault. The platform uses it to clone the code during deployments.

## When to use

When setting up a PaaS Native project whose code lives in a private GitHub, GitLab or Bitbucket repository, or when replacing the deploy key.

## Key steps / config

In both options the public key must be added to the repository as a read-only deploy key (GitHub: repository `Settings` → `Deploy keys`; GitLab/Bitbucket: the equivalent "Deploy keys" section, with read-only access).

Option 1 — CLI generates and stores the key:

```sh
sw-paas vault create --type ssh                          # organization level (default)
sw-paas vault create --type ssh --project <project-id>  # project level
```

Copy the printed public key into the repository's deploy keys.

Option 2 — manual:

1. Generate a passwordless RSA key pair in PEM format: `ssh-keygen -t rsa -b 4096 -m PEM -f ./sw-paas`
2. Add the contents of `sw-paas.pub` as a read-only deploy key.
3. Store the private key in the Vault: `cat sw-paas | sw-paas vault create --type ssh --password-stdin`

## Essential identifiers

- `sw-paas vault create --type ssh`
- `--project <project-id>`
- `--password-stdin`
- `ssh-keygen -t rsa -b 4096 -m PEM -f ./sw-paas`

## Gotchas

- ED25519 and ECDSA keys also work, but the key must be passwordless and the private key must be in PEM format.
- Only one SSH key can be stored per level (organization or project); the name is free.
- A project-level key overrides the organization-level key during deployments.

## Code check (6.7.13.0)
- unverified `sw-paas vault create` — PaaS CLI, not part of vendor/shopware
- unverified `--password-stdin` — PaaS CLI flag, not part of vendor/shopware
- unverified `ssh-keygen` — OpenSSH tool, outside vendor/shopware
