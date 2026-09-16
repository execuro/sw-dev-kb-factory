---
id: platform/dev/6.6/products/paas/shopware/CLI/_index.md
title: Shopware PaaS Native CLI
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware/CLI/"
sourceHash: "72ab97ddd02d934d939d4bc5e5a526ec4cd0221e"
keywords: ["sw-paas", "shopware paas native cli", "aws cognito", "sw-paas auth", "sw-paas account whoami", "account admin role", "identity provider", "authentication", "authorization", "machine tokens"]
summary: Overview of the sw-paas CLI for managing Shopware PaaS Native resources, covering install, authentication, and authorization.
lastBuilt: "2026-09-15"
---
## What it is

This page introduces the Shopware PaaS Native CLI (`sw-paas`), which manages shops and resources within the PaaS cloud, and covers its prerequisites, installation, authentication, and authorization.

## When to use

Use this when first setting up access to Shopware PaaS Native: getting invited to the identity platform, installing the CLI, authenticating, and checking or granting roles.

## Key steps / config

- Shopware uses AWS Cognito as its identity provider; users must be invited before they can access resources. The first onboarded user gets the admin role and can assign roles to others.
- Install: download the release archive from the sw-paas-cli GitHub releases page for your OS/architecture.
- Authenticate:

```sh
sw-paas auth
```

- Check identity/roles:

```sh
sw-paas account whoami
```

- Only an **Account Admin** can add users to a role. Get a user's ID and add them:

```sh
sw-paas account whoami --output json
sw-paas account user add --sub "<user-id of the new user>"
```

## Essential identifiers

- `sw-paas auth`
- `sw-paas account whoami`
- `sw-paas account user add`
- AWS Cognito

## Gotchas

After a successful `sw-paas auth` login, the authentication token is saved in the `XDG` state directory, which depends on the system.
