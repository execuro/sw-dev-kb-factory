---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/migration-process.md
title: Migration Process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/migration-process.html
sourceHash: 87fd607f8789f71bec0dcdc7cfa1b018a2cf5e7c
codeCheckedAgainst: "6.7.15.1"
keywords: ["migration run", "MigrationProcessMessage", "/migration/start-migration", "/migration/get-state", "/migration/resume-after-fixes", "/migration/approve-finished", "MigrationFingerprintService", "MigrationEntityValidationService", "swag_migration_data", "swag_migration_fix", "swag_migration_media_file", "WAITING_FOR_APPROVE", "error resolution", "migration states"]
summary: Migration Assistant run lifecycle - message-queue steps, state machine (fetching to finished), API endpoints, error resolution, media processing, approval.
lastBuilt: 2026-10-21
---
## What it is

The high-level flow of a Shopware Migration Assistant (`SwagMigrationAssistant` plugin) migration run: how the browser, server and message queue interact, which states a run passes through, and what happens in which classes and tables at each step. Each execution is a "run" (migration run), saved so users get a detailed history of errors.

## When to use

When you need to understand or debug where a migration is in its lifecycle, which endpoint drives which transition, or where fetched data, fixes, mappings and media records are stored.

## Key steps / config

Message-queue flow:

1. `POST /migration/start-migration` dispatches a `MigrationProcessMessage` and returns `204 No Content`.
2. Each consumed `MigrationProcessMessage` processes a step and dispatches the next message when the step needs a processor.
3. The browser polls `GET /migration/get-state` (states: `fetching`, `writing`, `media-processing`, `cleanup`, `indexing`).
4. On `error-resolution`, the user reviews unresolved logs, applies fixes, then calls `POST /migration/resume-after-fixes` (dispatches a new `MigrationProcessMessage`, `204`).
5. On `waiting-for-approve`, the user confirms via `POST /migration/approve-finished` (`204`); the state returns to `idle`.

State machine: `Fetching -> ErrorResolution -> Writing -> MediaProcessing -> Cleanup -> Indexing -> WaitingForApprove -> Finished`. `Fetching`, `ErrorResolution`, `Writing` and `MediaProcessing` can go to `Aborting`, which leads to `Cleanup`; `Indexing` can end in `Aborted`.

Run overview:

1. **Connection** - user selects/creates a connection (profile + gateway). `StatusController::checkConnection()` reads environment information and stores a source fingerprint; `MigrationFingerprintService` prevents duplicates.
2. **Data selection** - user picks `DataSelections`.
3. **Premapping** - generated for the connection; the user maps source to target values, stored with the connection.
4. **Start** the run.
5. **Fetching** - per `DataSet`, the Reader reads source data; the Converter converts it, stores it in `swag_migration_data`, and stores mapping info (old identifier, new identifier, checksum) in the mapping table.
6. **Validation** during conversion (nested required fields, associations) by `MigrationEntityValidationService` and `MigrationFieldValidationService`; issues go to the migration logs.
7. **Error resolution** - users inspect grouped logs; field validation issues are fixed by providing a new value, stored in `swag_migration_fix`.
8. **Resume** - fixes are applied and writing is attempted.
9. **Writing** - per `DataSet`, the Writer writes the data.
10. **Media processing** - pending `swag_migration_media_file` records with `written = true` are downloaded/copied into Shopware media storage; the record gets `processed = true` or `processFailure = true`.
11. **Cleanup and indexing**, then the run enters `WAITING_FOR_APPROVE`.
12. **Approval** by the user.

## Essential identifiers

- `MigrationProcessMessage`
- `StatusController::checkConnection()`, `MigrationFingerprintService`
- `MigrationEntityValidationService`, `MigrationFieldValidationService`
- Tables: `swag_migration_data`, `swag_migration_fix`, `swag_migration_media_file`
- Endpoints: `/migration/start-migration`, `/migration/get-state`, `/migration/resume-after-fixes`, `/migration/approve-finished`

## Gotchas

- All fetched data is deleted after a run finishes or is aborted; the identifier mappings are kept.
- A run does not finish on its own: it stops in `waiting-for-approve` until `approve-finished` is called.
- The Migration Assistant is a separate plugin; none of its classes ship in Shopware core, so they cannot be checked against the core code.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — core admin references the plugin by name (first-run wizard data import), plugin itself not bundled — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:26
- unverified `MigrationProcessMessage` — SwagMigrationAssistant plugin class, not in installed core/storefront/administration
- unverified `StatusController::checkConnection()` — plugin controller, out of scope
- unverified `MigrationFingerprintService` — plugin service, out of scope
- unverified `MigrationEntityValidationService` — plugin service, out of scope
- unverified `MigrationFieldValidationService` — plugin service, out of scope
- unverified `swag_migration_data` — plugin table, no definition in core
- unverified `swag_migration_fix` — plugin table, no definition in core
- unverified `swag_migration_media_file` — plugin table, no definition in core
- unverified `/migration/start-migration` — plugin API route, out of scope
