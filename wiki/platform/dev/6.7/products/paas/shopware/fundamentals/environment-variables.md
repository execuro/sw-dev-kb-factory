---
id: platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md
title: Environment variables
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/environment-variables.html
sourceHash: b39f220c45c3bbd1f2334a953b8fe2d89a99fba9
codeCheckedAgainst: "6.7.13.0"
keywords: ["environment variables", "env vars", "app.environment_variables", "application.yaml", ".env", "vault secrets", "sw-paas vault create", "sw-paas application update", "scope", "RUN", "BUILD", "build-time variables", "paas native"]
summary: "Shopware PaaS Native env var sources and priority (.env, application.yaml, vault) and app.environment_variables entries with name, value, scope RUN/BUILD."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md"]
---
## What it is

How environment variables are defined for a Shopware project running on Shopware PaaS Native: the three sources, their precedence, and the `app.environment_variables` block of `application.yaml`.

## When to use

When a PaaS Native application needs a configuration value at build time or at runtime, or when a variable seems to have the wrong value because another source overrides it.

## Key steps / config

Sources, from lowest to highest priority (higher wins when the same name is defined twice):

| Source | Notes |
|---|---|
| `.env` file | Committed to the repository; use for defaults |
| `application.yaml` | Defined in `app.environment_variables`; non-sensitive per-environment config (see platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md) |
| Vault secrets | Created via `sw-paas vault create`; sensitive values such as passwords or API tokens (see platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md and platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md) |

A variable in `application.yaml` overwrites the same variable from `.env`; a vault secret overwrites both.

Each entry in `app.environment_variables` needs `name`, `value` and `scope`:

- `RUN` — value is passed to the Shopware application at runtime.
- `BUILD` — build-time environment variable.

The same name may be defined twice with different scopes to use different values at build time and runtime.

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

Apply changes after editing `application.yaml`:

```sh
sw-paas application update
```

## Essential identifiers

- `app.environment_variables` (keys `name`, `value`, `scope`)
- Scopes `RUN`, `BUILD`
- `sw-paas application update`
- `sw-paas vault create`

## Gotchas

- Editing `application.yaml` has no effect until `sw-paas application update` is run.
- Do not put secrets in `.env` or `application.yaml`; use vault secrets, which also take precedence over both files.

## Code check (6.7.13.0)
- unverified `app.environment_variables` — PaaS Native `application.yaml` schema, not part of vendor/shopware
- unverified `sw-paas application update` — sw-paas CLI, out of scope of vendor/shopware
- unverified `sw-paas vault create` — sw-paas CLI, out of scope of vendor/shopware
- unverified `RUN` — PaaS scope value, not defined in vendor/shopware
- unverified `BUILD` — PaaS scope value, not defined in vendor/shopware
