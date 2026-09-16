---
id: platform/dev/6.6/products/paas/shopware/project_setup.md
title: Project Setup
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware/project_setup.html
sourceHash: 54417618ed1fb226493029c88f7a638b7132652d
keywords: ["project setup", "PaaS", "composer create-project", "shopware/k8s-meta", "application.yaml", "operator.yaml", "deploy keys", "sw-paas vault create", "ssh-keygen", "Shopware Operator", "local development"]
summary: Steps to set up a Shopware PaaS Native project locally, install k8s-meta, write application.yaml, and configure git deploy keys.
lastBuilt: "2026-09-15"
---
## What it is

Describes the local project setup workflow for a Shopware PaaS Native project: filesystem-affecting customizations, project creation, and repository deploy-key configuration.

## When to use

Use when bootstrapping a new Shopware project for PaaS deployment or connecting an existing private repository to the PaaS backend.

## Key steps / config

1. Customizations that touch the filesystem (updates, plugin install/update, initial config, code changes) must be done locally; plugin management is not possible in the Administration in a distributed/HA setup — perform it during deployment/rollout. Mac/Linux recommended; on Windows use Docker or WSL2.
2. Create a new project:
   ```sh
   composer create-project shopware/production <folder-name>
   ```
3. Install the operator package:
   ```sh
   cd <folder-name>
   composer require shopware/k8s-meta --ignore-platform-reqs
   ```
   Verify by checking `config/packages/operator.yaml`. `--ignore-platform-reqs` pulls recipes regardless of local PHP setup.
4. Create `application.yaml` at the project root:
   ```yaml
   app:
     php:
       version: "8.3"
     environment_variables: []
     hooks: {}
   services:
     mysql:
       version: "8.0"
   ```
   Environment variables can be added with `name`, `value`, `scope` (e.g. `INSTALL_LOCALE`, `fr-FR`, `RUN`).
5. Repository setup with deploy keys:
   ```bash
   sw-paas vault create --type ssh
   ```
   Adds an org-level key by default; use `--project` to scope it. Generate a key with:
   ```bash
   ssh-keygen -t rsa -b 4096 -m PEM -f ./sw-paas
   ```
   RSA, ED25519, or ECDSA are supported; the key must be passwordless and stored in PEM format. Add the public key (`sw-paas.pub`) to the repository's deploy keys, then store the private key:
   ```bash
   cat sw-pass | sw-paas vault create --type ssh --password-stdin
   ```

## Essential identifiers

- `composer create-project shopware/production`
- `shopware/k8s-meta`
- `application.yaml`
- `config/packages/operator.yaml`
- `sw-paas vault create --type ssh`

## Gotchas

- A project-level key overwrites an organization-level key; only one SSH key can be stored per level.
