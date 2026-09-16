---
id: platform/dev/6.7/resources/references/adr/2025-09-05-app-requirements-validation.md
title: App requirements validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-05-app-requirements-validation.html
sourceHash: a39f1e0b4f02cb2dcb2dad9dcc95803722d39a99
codeCheckedAgainst: "6.7.13.0"
keywords: ["app requirements", "manifest requirements", "public-access", "PublicAccess", "AppRequirementsValidator", "Requirement", "AbstractRequirement", "UnmetRequirement", "app.requirements_validator", "FRAMEWORK__APP_REQUIREMENTS_NOT_MET", "APP_URL", "app install validation", "health check"]
summary: "ADR: apps declare manifest requirements (e.g. public-access); in prod, tagged validators check them on install/update, else AppException (HTTP 400)."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-09-05) for a best-effort app requirements validation system: an app declares environment requirements in its manifest, and Shopware validates them before installing or updating the app, failing fast with a descriptive error instead of failing silently at runtime.

## When to use

- Building an app that needs a publicly reachable HTTPS shop (e.g. for webhooks) and should refuse installation otherwise.
- Debugging an app install/update that fails with `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`.

## Key steps / config

1. Declare requirements in `manifest.xml` as empty child elements of `<requirements>`; presence enables the requirement. The schema accepts any child element:

```xml
<requirements>
    <public-access/>
</requirements>
```

2. On install and update, `AppManager` calls `AppRequirementsValidator::validate()`, which iterates all services tagged `app.requirements_validator`, skipping those whose `required()` returns false. Unmet results are thrown via `AppException::requirementsNotMet()` (HTTP 400, code `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`, message lists app name, requirement name and actionable resolution per violation).
3. Requirements are enforced only when `kernel.environment` is `prod`; in dev/test validation is skipped.
4. Manifest requirement names with no registered validator are logged as a warning and ignored.
5. The `public-access` requirement (`PublicAccess`) checks: `APP_URL` is set; it is a valid public target (HTTPS, not an IP address, not a reserved domain, host resolves to a public IP); `<APP_URL>/api/_info/health-check` answers HTTP 200 within 1 s without redirects. The result is memoised per process and reset via `kernel.reset`.

Validator contract (`Shopware\Core\Framework\App\Validation\Requirements\Requirement`):

```php
public function validate(Manifest $manifest): ?UnmetRequirement;
public static function name(): string;
public function required(Manifest $manifest): bool;
```

## Essential identifiers

- `Shopware\Core\Framework\App\Validation\AppRequirementsValidator`
- `Shopware\Core\Framework\App\Validation\Requirements\Requirement`, `AbstractRequirement`, `PublicAccess`, `UnmetRequirement`
- `app.requirements_validator` (service tag)
- `AppException::requirementsNotMet()`, `FRAMEWORK__APP_REQUIREMENTS_NOT_MET`
- `APP_URL`

## Gotchas

- All these classes are `@internal`; per the ADR, adding a new requirement type requires a Shopware update, not an app-side extension.
- The public-accessibility network check adds latency to installation; overly strict checks may block legitimate edge-case setups.
- The feature is opt-in: apps without a `<requirements>` element are unaffected.
- The ADR places the hook in `AppLifecycle::install()`/`update()`; in the installed code the check runs in `AppManager`, which `AppLifecycle` delegates to.

## Code check (6.7.13.0)
- confirmed `Requirement::validate()` — returns `?UnmetRequirement` — vendor/shopware/core/Framework/App/Validation/Requirements/Requirement.php:18
- corrected `Requirement::name()` — docs: instance `name(): string`; code declares it `static` — vendor/shopware/core/Framework/App/Validation/Requirements/Requirement.php:23
- confirmed `Requirement::required()` — applicability check — vendor/shopware/core/Framework/App/Validation/Requirements/Requirement.php:28
- confirmed `AbstractRequirement` — abstract base implementing Requirement — vendor/shopware/core/Framework/App/Validation/Requirements/AbstractRequirement.php:14
- confirmed `PublicAccess::name()` — returns public-access — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:68
- confirmed `APP_URL` — must be set and pass secure URL validation — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:45
- confirmed `app.requirements_validator` — tag collected by AppRequirementsValidator — vendor/shopware/core/Framework/DependencyInjection/app.php:255
- corrected `AppRequirementsValidator::validate()` — docs: always validates; code skips outside prod — vendor/shopware/core/Framework/App/Validation/AppRequirementsValidator.php:34
- corrected `AppManager::ensureMeetsRequirements()` — docs: in `AppLifecycle::install()`/`update()`; runs in AppManager install/update — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:655
- confirmed `FRAMEWORK__APP_REQUIREMENTS_NOT_MET` — error code, HTTP 400 via requirementsNotMet — vendor/shopware/core/Framework/App/AppException.php:74
