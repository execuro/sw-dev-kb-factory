---
id: platform/dev/6.7/resources/references/adr/2025-09-05-app-requirements-validation.md
title: App requirements validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-05-app-requirements-validation.html
sourceHash: a39f1e0b4f02cb2dcb2dad9dcc95803722d39a99
codeCheckedAgainst: "6.7.15.1"
keywords: ["app requirements", "requirements", "public-access", "PublicAccess", "Requirement", "AbstractRequirement", "AppRequirementsValidator", "UnmetRequirement", "app.requirements_validator", "FRAMEWORK__APP_REQUIREMENTS_NOT_MET", "APP_URL", "manifest validation", "app install"]
summary: "ADR: apps declare manifest requirements like public-access; checked on install/update, failing with FRAMEWORK__APP_REQUIREMENTS_NOT_MET."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area: core, 2025-09-05) for a best-effort app requirements validation system. Apps declare environment requirements in their manifest; Shopware validates them during app installation and update so an app fails fast, with a clear error, instead of failing silently at runtime (e.g. webhooks that cannot reach a shop on localhost). The feature is opt-in: apps without declarations work unchanged.

## When to use

- Your app needs the shop to be publicly reachable over HTTPS (webhooks, app backend callbacks).
- Debugging an app install/update that fails with `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`.
- Adding a new requirement type to the platform (custom requirement types need a Shopware update; apps cannot ship them).

## Key steps / config

1. **Declare in the manifest.** Add a `<requirements>` element with empty child elements; presence enables a requirement. The XSD allows any child element.
   ```xml
   <requirements>
       <public-access/>
   </requirements>
   ```
2. **Validation on lifecycle.** `AppManager::install()` and `AppManager::update()` (and installation recovery) call the `AppRequirementsValidator`; unmet requirements throw `AppException::requirementsNotMet()` — HTTP 400, error code `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`, message listing app name, requirement name and an actionable resolution per violation.
3. **`public-access` checks** (`PublicAccess`):
   - `APP_URL` environment variable is set;
   - it is a valid public URL: HTTPS, not an IP address, not a reserved domain, host resolves via DNS to a public IP;
   - `<APP_URL>/api/_info/health-check` answers HTTP 200 (1 s timeout, no redirects).
   The result is cached per process (the check is app-independent) and reset via `ResetInterface`.
4. **Extending.** A validator implements `Shopware\Core\Framework\App\Validation\Requirements\Requirement` (or extends `AbstractRequirement`, whose `required()` checks whether `name()` is listed in the manifest's requirements) and is tagged `app.requirements_validator`:
   ```php
   class MyRequirement extends AbstractRequirement
   {
       public function validate(Manifest $manifest): ?UnmetRequirement { /* ... */ }
       public static function name(): string { return 'my-requirement'; }
   }
   ```

## Essential identifiers

- `Requirement` interface: `validate(Manifest $manifest): ?UnmetRequirement`, `required(Manifest $manifest): bool`, `static name(): string`
- `AbstractRequirement`, `PublicAccess` (name `public-access`), `UnmetRequirement`
- `Shopware\Core\Framework\App\Validation\AppRequirementsValidator`
- `AppException::requirementsNotMet()`, `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`
- Service tag `app.requirements_validator`; env var `APP_URL`

## Gotchas

- In the installed code requirements are enforced only in the `prod` environment; in dev/test, validation is skipped. Unknown requirement names in a manifest are not errors — they are logged as warnings and ignored until a matching validator is registered.
- The ADR places the integration in `AppLifecycle::install()`/`update()`; the installed code calls it from `AppManager`.
- `name()` is `static` in the installed interface, not an instance method as the ADR lists it.
- Network checks add latency to installation; overly strict validation could block legitimate edge-case installs. All requirement classes are `@internal`.

## Code check (6.7.15.1)
- confirmed `Requirement::validate()` — returns `?UnmetRequirement` — vendor/shopware/core/Framework/App/Validation/Requirements/Requirement.php:18
- corrected `Requirement::name()` — docs: instance method `name(): string`; code declares it `static` — vendor/shopware/core/Framework/App/Validation/Requirements/Requirement.php:23
- confirmed `AbstractRequirement::required()` — checks manifest requirement list — vendor/shopware/core/Framework/App/Validation/Requirements/AbstractRequirement.php:16
- confirmed `PublicAccess::name()` — returns `public-access` — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:66
- confirmed `APP_URL` — must be set and a valid public HTTPS URL — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:45
- confirmed `AppRequirementsValidator::validate()` — enforced only in `prod` — vendor/shopware/core/Framework/App/Validation/AppRequirementsValidator.php:34
- confirmed `app.requirements_validator` — service tag collected as tagged iterator — vendor/shopware/core/Framework/DependencyInjection/app.php:266
- corrected `ensureMeetsRequirements` — docs: AppLifecycle::install()/update(); code: AppManager install/update — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:113
- confirmed `AppException::requirementsNotMet()` — HTTP 400 — vendor/shopware/core/Framework/App/AppException.php:680
- confirmed `APP_REQUIREMENTS_NOT_MET` — `FRAMEWORK__APP_REQUIREMENTS_NOT_MET` — vendor/shopware/core/Framework/App/AppException.php:78
