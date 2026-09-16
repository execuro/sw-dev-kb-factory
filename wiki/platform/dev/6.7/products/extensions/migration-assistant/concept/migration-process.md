---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/migration-process.md
title: Migration Process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/migration-process.html
sourceHash: 87fd607f8789f71bec0dcdc7cfa1b018a2cf5e7c
codeCheckedAgainst: "6.7.13.0"
keywords: ["SwagMigrationAssistant", "migration assistant", "migration run", "MigrationProcessMessage", "/migration/start-migration", "/migration/get-state", "StatusController", "MigrationFingerprintService", "MigrationEntityValidationService", "swag_migration_data", "swag_migration_fix", "swag_migration_media_file", "error resolution", "message queue"]
summary: "Migration Assistant run flow: message-queue steps, states from fetching to approval, controllers, validation services and swag_migration_* tables."
lastBuilt: 2026-09-15
---
## What it is

A high-level description of how a Shopware Migration Assistant migration run executes: the admin browser starts the run via API routes, the server processes it asynchronously through the message queue (`MigrationProcessMessage`), and the run moves through a fixed set of states until the user approves completion. Each run is saved so users get a detailed error history.

## When to use

When extending or debugging the Migration Assistant plugin and you need to know which step (fetching, error resolution, writing, media processing, cleanup, indexing, approval) a class or table belongs to, or which admin API calls drive a run.

## Key steps / config

API interaction (from the docs' sequence diagram):

1. `POST /migration/start-migration` — server dispatches `MigrationProcessMessage`, responds `204 No Content`.
2. Message queue processes a step and dispatches the next message while the step needs a processor.
3. Browser polls `GET /migration/get-state` — `fetching | writing | media-processing | cleanup | indexing`, then `error-resolution`.
4. After fixes: `POST /migration/resume-after-fixes` (dispatches `MigrationProcessMessage` again).
5. On `waiting-for-approve`: `POST /migration/approve-finished`; state returns to `idle`.

State flow: Fetching → ErrorResolution → Writing → MediaProcessing → Cleanup → Indexing → WaitingForApprove → Finished. Fetching, ErrorResolution, Writing and MediaProcessing can go to Aborting → Cleanup; Indexing can end in Aborted.

Run steps in classes and tables:

1. Connection (profile + gateway): `StatusController::checkConnection()` reads environment information, stores a source fingerprint, and `MigrationFingerprintService` prevents duplicates.
2. User selects `DataSelections`.
3. Premapping is generated; mapping decisions are stored with the connection.
4. Run starts.
5. Fetching: for each `DataSet`, the Reader reads source data; the Converter converts it, stores it in `swag_migration_data`, and stores mapping info (old identifier, new identifier, checksum) in the mapping table.
6. Validation during conversion (nested required fields, associations): `MigrationEntityValidationService`, `MigrationFieldValidationService`; issues go to the migration logs.
7. Error resolution: users inspect grouped logs; field fixes (new values) are stored in `swag_migration_fix`.
8. Resume: fixes are applied, writing is attempted.
9. Writing: the Writer for each `DataSet` writes data.
10. Media processing: pending `swag_migration_media_file` records (`written = true`) are downloaded/copied into media storage and marked `processed = true` or `processFailure = true`.
11. Cleanup and indexing; run enters `WAITING_FOR_APPROVE`.
12. User approves completion.

## Essential identifiers

- `MigrationProcessMessage`
- `StatusController::checkConnection()`, `MigrationFingerprintService`
- `MigrationEntityValidationService`, `MigrationFieldValidationService`
- `swag_migration_data`, `swag_migration_fix`, `swag_migration_media_file`
- `/migration/start-migration`, `/migration/get-state`, `/migration/resume-after-fixes`, `/migration/approve-finished`

## Gotchas

- All fetched data is deleted after a run finishes or is aborted; the identifier mapping is kept, so later runs from the same connection update the right records.
- A run does not finish on its own: it waits in `waiting-for-approve` until the user confirms.
- The steps from connection selection to approval can be repeated; each repetition is a separate migration run.

## Code check (6.7.13.0)
- confirmed `SwagMigrationAssistant` — plugin name referenced by the first-run wizard; the plugin itself is not installed — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:33
- unverified `MigrationProcessMessage` — SwagMigrationAssistant plugin code, out of scope
- unverified `/migration/start-migration` — plugin API route, out of scope
- unverified `StatusController::checkConnection()` — plugin code, out of scope
- unverified `MigrationFingerprintService` — plugin code, out of scope
- unverified `MigrationEntityValidationService` — plugin code, out of scope
- unverified `MigrationFieldValidationService` — plugin code, out of scope
- unverified `swag_migration_fix` — plugin table, out of scope
- unverified `swag_migration_media_file` — plugin table, out of scope
- unverified `WAITING_FOR_APPROVE` — plugin run state, out of scope
