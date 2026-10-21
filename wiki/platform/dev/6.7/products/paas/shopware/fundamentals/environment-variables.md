---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md
relatedPages:
  - platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md
  - platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md
  - platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md
sourceHash: b39f220c45c3bbd1f2334a953b8fe2d89a99fba9
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/environment-variables.html
title: Environment variables
version: "6.7"
versions:
  - "6.7"
keywords: ["app.environment_variables", "application.yaml", ".env", "sw-paas vault create", "sw-paas application update", "RUN", "BUILD", "scope", "env vars", "environment variables", "vault secrets", "paas native", "build-time variable", "runtime variable"]
summary: "PaaS Native env vars: .env < application.yaml app.environment_variables < vault secrets; each entry has name, value and scope RUN or BUILD."
lastBuilt: 2026-10-21
---
## What it is

How environment variables are defined for a Shopware PaaS Native application: three sources with a fixed priority order, and the `app.environment_variables` list in `application.yaml` with per-variable build-time or runtime scope.

## When to use

When you need to pass configuration to the Shopware runtime or to the build, and must decide whether a value belongs in the committed `.env`, in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md), or in a vault secret.

## Key steps / config

Sources, lowest to highest priority — a higher source overwrites the same variable from a lower one:

| Source | Where | Use for |
|---|---|---|
| `.env` file | committed to the repository | defaults |
| `application.yaml` | `app.environment_variables` | non-sensitive per-environment config |
| [Vault secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) | `sw-paas vault create` | passwords, API tokens |

Each entry in `app.environment_variables` needs `name`, `value` and `scope`. `RUN` passes the value to the Shopware application at runtime; `BUILD` makes it a build-time variable. The same name may be defined twice with different scopes to get different build-time and runtime values.

```yaml
app:
  environment_variables:
    - name: MY_BUILDTIME_VARIABLE
      value: bar
      scope: BUILD
    - name: MY_RUNTIME_VARIABLE
      value: foo
      scope: RUN
```

Apply changes with `sw-paas application update`. For secret handling details see the [secrets vault guide](platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md).

## Essential identifiers

- `app.environment_variables` (`name`, `value`, `scope`)
- `RUN`, `BUILD`
- `.env`, `application.yaml`
- `sw-paas vault create`, `sw-paas application update`

## Gotchas

- A vault secret overrides both `application.yaml` and `.env`; an `application.yaml` entry overrides `.env`. Keep sensitive values out of `.env` and `application.yaml`.

## Code check (6.7.15.1)
- unverified `app.environment_variables` — PaaS application.yaml schema, not part of the Shopware code roots
- unverified `RUN` — PaaS scope value, out of scope
- unverified `BUILD` — PaaS scope value, out of scope
- unverified `sw-paas vault create` — PaaS CLI, out of scope
- unverified `.env` — loaded by the project front controller/Symfony Dotenv, not by the core/storefront/administration sources
