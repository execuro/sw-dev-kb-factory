---
id: platform/dev/6.7/resources/references/adr/2026-07-13-app-feature-storage.md
title: Generic storage for manifest-declared app features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-13-app-feature-storage.html
sourceHash: 2a79c635891780bb4531d52bd63533ec24ea4da4
codeCheckedAgainst: "6.7.15.1"
keywords: ["app_feature", "AppFeatureDefinition", "AppFeatureConfig", "AppFeatureStorage", "AppFeatureLifecycleHandler", "shopware.app_feature.definition", "shopware.app_lifecycle.handler", "keepUserData", "Shopware\\Core\\Framework\\App\\Feature", "manifest", "app capabilities", "app update reconciliation"]
summary: "ADR: one app_feature table for manifest-declared app items, typed via AppFeatureDefinition subclasses and read through AppFeatureStorage (internal API)."
lastBuilt: 2026-10-21
---
## What it is

An ADR (2026-07-13, area: framework) introducing one generic `app_feature` table plus an `@internal` PHP API in `Shopware\Core\Framework\App\Feature` for simple manifest-declared app capabilities. Previously each capability added a JSON column to `app` (`modules`, `main_module`, `cookies`, `allowed_hosts`, `requested_privileges`, `source_config`) or its own `app_*` table, each with ad-hoc persistence and reads, and app updates discarded shop-side changes.

## When to use

- Adding a new manifest-declared app capability whose items are read back as "all items of one type" with shop-side changes living in the payload.
- Not for features needing foreign keys to core entities, state outside the payload, or indexed lookups by payload content — those stay in a dedicated table (as payment methods do).

## Key steps / config

Table (one row per declared item):

```sql
CREATE TABLE `app_feature` (
  `id` BINARY(16), `app_id` BINARY(16) NULL, `app_name` VARCHAR(255),
  `type` VARCHAR(64), `name` VARCHAR(255), `payload` JSON,
  `created_at` DATETIME(3), `updated_at` DATETIME(3) NULL,
  KEY `idx.app_feature.type` (`type`),
  CONSTRAINT `fk.app_feature.app_id` FOREIGN KEY (`app_id`) REFERENCES `app` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `uniq.app_feature.app_name_type_name` UNIQUE (`app_name`, `type`, `name`)
);
```

To add a capability: manifest XSD section and XML class, a config DTO implementing `AppFeatureConfig` (`getName(): string`, stable across updates), and an `AppFeatureDefinition` subclass tagged `shopware.app_feature.definition`:

```php
/** @extends AppFeatureDefinition<Cookie> */
class CookieFeatureDefinition extends AppFeatureDefinition
{
    public function getType(): string { return 'cookie'; }
    public function getConfigClass(): string { return Cookie::class; }
    public function fromApp(Manifest $manifest, Filesystem $appFilesystem, string $defaultLocale): array { /* list<Cookie> */ }
    public function toPayload(AppFeatureConfig $declared, ?AppFeatureConfig $stored): array { /* keep shop-owned values from $stored */ }
    public function fromPayload(array $payload): AppFeatureConfig { /* rebuild Cookie */ }
}
```

Optional hooks: `validate(array $configs, AppPersistContext $context)` (throw to abort install/update) and `persisted(...)` (provision related resources).

Reading and writing via `AppFeatureStorage`: `forActiveApps(Cookie::class)` (joins `app.active = 1`), `forApp($appId, Cookie::class)` (any active state), each returning `AppFeature` objects with `appName` and typed `config`; `save($appId, $config)` stores a shop-side change as is and throws if the app did not declare that item. `syncForApp()` is driven by `AppFeatureLifecycleHandler`, registered as `shopware.app_lifecycle.handler`.

## Essential identifiers

- `AppFeatureDefinition`, `AppFeatureConfig`, `AppFeatureStorage`, `AppFeatureLifecycleHandler`, `AppFeatureDefinitionRegistry`
- DI tags `shopware.app_feature.definition`, `shopware.app_lifecycle.handler`

## Gotchas

- Reconciliation is owned by the definition: on update `toPayload($declared, $stored)` decides what survives; `$stored` is null on first install and on `save()`. There is no platform merge policy.
- Sync diffs by `(type, name)`: surviving rows are rewritten in place (keeping `id`, `created_at`), new ones inserted, undeclared ones deleted — `name` stability is part of the contract.
- On uninstall with `keepUserData` rows are kept with `app_id` set to null and re-attached by `app_name` on reinstall; otherwise they are deleted.
- Payloads are opaque JSON; translatable values stay as locale-keyed maps (`{"label": {"en-GB": "...", "de-DE": "..."}}`) resolved at read time via `Context::getLanguageIdChain()` and `LanguageLocaleCodeProvider`, falling back to the default locale. No translation table.
- Data is not exposed through the auto-generated Admin API; existing JSON columns on `app` stay until a major.
- The ADR shows `AppFeatureDefinition` as an interface with `extract(Manifest $manifest)`; the installed code is an abstract class whose extraction method is `fromApp(...)` with a filesystem and default-locale argument.

## Code check (6.7.15.1)
- corrected `AppFeatureDefinition` — docs: interface; code: `@internal` abstract class — vendor/shopware/core/Framework/App/Feature/AppFeatureDefinition.php:24
- corrected `AppFeatureDefinition::fromApp()` — docs: `extract(Manifest $manifest)` — vendor/shopware/core/Framework/App/Feature/AppFeatureDefinition.php:44
- confirmed `AppFeatureDefinition::toPayload()` — receives declared and stored config — vendor/shopware/core/Framework/App/Feature/AppFeatureDefinition.php:56
- confirmed `AppFeatureDefinition::validate()` — optional pre-write hook, not in docs — vendor/shopware/core/Framework/App/Feature/AppFeatureDefinition.php:73
- confirmed `AppFeatureConfig::getName()` — item name within its type and app — vendor/shopware/core/Framework/App/Feature/AppFeatureConfig.php:22
- confirmed `AppFeatureStorage::forActiveApps()` — filters `app.active = 1` — vendor/shopware/core/Framework/App/Feature/AppFeatureStorage.php:43
- confirmed `AppFeatureStorage::save()` — throws when the item is not declared — vendor/shopware/core/Framework/App/Feature/AppFeatureStorage.php:189
- confirmed `shopware.app_feature.definition` — tagged iterator for the definition registry — vendor/shopware/core/Framework/DependencyInjection/app.php:384
- confirmed `shopware.app_lifecycle.handler` — `AppFeatureLifecycleHandler` priority -1300 — vendor/shopware/core/Framework/DependencyInjection/app.php:380
- confirmed `uniq.app_feature.app_name_type_name` — migration matches the ADR schema — vendor/shopware/core/Migration/V6_7/Migration1783666808AddAppFeatureTable.php:35
