---
id: platform/dev/6.7/resources/references/adr/2026-07-13-app-feature-storage.md
title: Generic storage for manifest-declared app features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-13-app-feature-storage.html
sourceHash: 2a79c635891780bb4531d52bd63533ec24ea4da4
codeCheckedAgainst: "6.7.13.0"
keywords: ["app_feature", "AppFeatureStorage", "AppFeatureDefinition", "AppFeatureConfig", "shopware.app_feature.definition", "shopware.app_lifecycle.handler", "AppCookieCollectListener", "PaymentMethodLifecycleHandler", "keepUserData", "manifest", "app storage", "app system", "adr"]
summary: "ADR: one generic app_feature table plus AppFeatureStorage/AppFeatureDefinition for manifest-declared app items; not present in installed 6.7.13.0."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2026-07-13) proposing one generic `app_feature` table and a typed PHP API for manifest-declared app capabilities that are a list of named items read back as a whole, instead of adding a JSON column to the `app` table or a dedicated `app_*` table per capability. None of the proposed table or classes exist in core 6.7.13.0.

## When to use

When designing or reviewing a new manifest-declared app capability, or when checking how the installed app system currently stores manifest data (e.g. cookies) versus what the ADR plans.

## Key steps / config

How manifest data is stored and read in installed 6.7.13.0:

1. JSON/list columns on the `app` row: `modules`, `main_module`, `cookies`, `allowed_hosts`, `requested_privileges`, `source_config`. Readers query them ad hoc; `Shopware\Core\Framework\App\Cookie\AppCookieCollectListener` searches active apps with `app.cookies` not null and reads `AppEntity::getCookies()`.
2. Dedicated tables such as `app_action_button`, `app_flow_action`, `app_payment_method`, `app_mcp_tool` for content that needs foreign keys, indexed lookups, per-item mutable state or translations.
3. Manifest persistence during install/update runs through services tagged `shopware.app_lifecycle.handler` (each with a priority), e.g. `PaymentMethodLifecycleHandler`, which re-links payment methods to a reinstalled app.
4. Translatable values can be resolved via `Context::getLanguageIdChain()` and `LanguageLocaleCodeProvider` (the mechanism the ADR plans to reuse).

## Essential identifiers

- `app` table columns `modules`, `main_module`, `cookies`, `allowed_hosts`, `requested_privileges`, `source_config`
- `AppCookieCollectListener`, `AppEntity::getCookies()`, `Manifest::getCookies()`
- `shopware.app_lifecycle.handler`, `PaymentMethodLifecycleHandler`
- `Context::getLanguageIdChain()`, `LanguageLocaleCodeProvider`

## Gotchas

- The ADR API lives in the `Shopware\Core\Framework\App\Feature` namespace, which does not exist in 6.7.13.0; do not code against it. All its classes are planned as `@internal`.
- Planned schema: `app_feature` with `id`, nullable `app_id` (FK to `app`, `ON DELETE SET NULL`), `app_name`, `type` (VARCHAR 64), `name`, `payload` JSON, timestamps; unique `(app_name, type, name)`, index on `type`. `app_name` exists so rows kept on uninstall with `keepUserData` re-attach on reinstall; without `keepUserData` rows are deleted.
- Planned contracts:
  ```php
  interface AppFeatureConfig { public function getName(): string; }
  interface AppFeatureDefinition {  // DI tag shopware.app_feature.definition
      public function getType(): string;
      public function getConfigClass(): string;
      public function extract(Manifest $manifest): array;
      public function toPayload(AppFeatureConfig $declared, ?AppFeatureConfig $stored): array;
      public function fromPayload(array $payload): AppFeatureConfig;
  }
  ```
- Planned reads via `AppFeatureStorage::forActiveApps(Cookie::class)` / `forApp($appId, ...)` (filters `app.active`); writes via `AppFeatureStorage::save($appId, $config)`; lifecycle sync via `syncForApp()` in a `shopware.app_lifecycle.handler`. Sync diffs by `(type, name)`, so `name` must be stable across app updates; `toPayload()` decides what shop-side changes survive (`$stored` is null on first install).
- Payloads are opaque JSON, not exposed via the auto-generated Admin API; translations stay as locale-keyed maps resolved at read time.

## Version notes

Existing JSON columns and `AppEntity` getters stay; migrating them needs a deprecation cycle at a major. The ADR scopes `app_feature` to new simple capabilities.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\App\Feature` — namespace not found in installed code
- absent `AppFeatureStorage` — not found in any installed Shopware package
- absent `AppFeatureDefinition` — not found in any installed Shopware package
- absent `app_feature` — no table or DI tag of this name installed
- confirmed `AppCookieCollectListener` — reads `app.cookies` of active apps — vendor/shopware/core/Framework/App/Cookie/AppCookieCollectListener.php:26
- confirmed `AppEntity::getCookies()` — cookies JSON column getter — vendor/shopware/core/Framework/App/AppEntity.php:323
- confirmed `PaymentMethodLifecycleHandler` — lifecycle handler class — vendor/shopware/core/Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:27
- confirmed `shopware.app_lifecycle.handler` — DI tag with priorities — vendor/shopware/core/Framework/DependencyInjection/app.php:273
- confirmed `Context::getLanguageIdChain()` — returns the language id chain — vendor/shopware/core/Framework/Context.php:167
- confirmed `LanguageLocaleCodeProvider` — maps languages to locale codes — vendor/shopware/core/System/Locale/LanguageLocaleCodeProvider.php:13
