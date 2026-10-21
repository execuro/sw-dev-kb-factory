---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/lifecycle/app-secret-recovery.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md
  - platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md
sourceHash: 4861a59b527905cfa18805144eccd445e083d54d
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-secret-recovery.html
title: Secret Rotation & Recovery
version: "6.7"
versions:
  - "6.7"
keywords: ["app secret rotation", "app:secret:rotate", "app:install", "unconfirmed_app_secrets", "app_secret", "FRAMEWORK__APP_SECRET_RECOVERY_FAILED", "FRAMEWORK__APP_INSTALLATION_INCOMPLETE", "RotateAppSecretMessage", "deleted_apps", "app:shop-id:change", "secret recovery", "out of sync app"]
summary: How Shopware rotates app secrets and recovers apps whose registration confirmation was interrupted, via app:secret:rotate, app:install and the API.
lastBuilt: 2026-10-21
---
## What it is

Operator/core-level description of how Shopware rotates an app's shared secret and recovers an app whose rotation or first registration confirmation was interrupted (crash, lost response, timeout, HTTP `5xx`), leaving Shopware and the app server with different secrets.

## When to use

When an app stops accepting Shopware's requests after a rotation or install, when you want to rotate secrets, or when a cloned shop (staging) conflicts with production. For the app-side protocol see [App Registration & Backend Setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md) and [signature verification](platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md).

## Key steps / config

### Secret state per app

- `app_secret` — committed, active signing secret.
- `unconfirmed_app_secrets` — secrets generated during a handshake but not yet confirmed, newest first; `NULL` when nothing is pending.

| Outcome of the confirmation | `app_secret` | `unconfirmed_app_secrets` |
|---|---|---|
| before confirm | unchanged | new secret added at the front |
| `2xx` | set to new secret | cleared |
| `4xx` | unchanged | rejected secret removed |
| `5xx` / timeout | unchanged | kept for recovery |

On re-registration Shopware tries candidates in order: all unconfirmed secrets (newest first), then `app_secret`. Any failure moves to the next candidate; the first accepted one commits a fresh secret and clears the list. If none is accepted, all are kept and the run reports `FRAMEWORK__APP_SECRET_RECOVERY_FAILED`. The list is capped at five entries; the oldest always survives the cap.

### Rotate

```bash
bin/console app:secret:rotate <app-name>   # one app
bin/console app:secret:rotate              # every active app
```

The new secret is active only after confirmation. A pending unconfirmed secret does not block rotation; it becomes a signing candidate, so rotation is also a recovery path.

Self-service from the app (with working integration credentials): `POST /api/_action/app-system/secret/rotate`. The app is resolved from the caller's own app integration; other tokens are rejected. Shopware queues a `RotateAppSecretMessage` and returns `202 Accepted`; the CLI runs synchronously.

### Recover

```bash
bin/console app:install <app-name>
```

Safe on installed apps and safe to repeat; a failed attempt commits nothing. An unfinished install is completed; a fully installed app only has its credentials repaired (no lifecycle replay, config untouched). Expect several registration attempts, one per held secret. Outcomes: recovered and completed / already installed / no candidate accepted (`FRAMEWORK__APP_SECRET_RECOVERY_FAILED` — retry first).

### Unrecoverable: shop clone

If a clone (staging) rotated the secret for the shared shop ID, the original shop's candidates are all rejected. Give it a new identity: `bin/console app:shop-id:change reinstall-apps`. Run `bin/console app:shop-id:change` on any clone at first boot ([staging instance](platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md)).

### Uninstall/reinstall

On uninstall Shopware stashes the committed and unconfirmed secrets in `deleted_apps` and replays them on reinstall (unconfirmed before committed), so a reinstall works whether or not the app acted on the `app.deleted` webhook, including mid-rotation.

## Essential identifiers

- CLI: `app:secret:rotate`, `app:install`, `app:shop-id:change`
- Route: `POST /api/_action/app-system/secret/rotate`; message `RotateAppSecretMessage`
- Storage: `app_secret`, `unconfirmed_app_secrets`, table `deleted_apps`
- Error codes: `FRAMEWORK__APP_SECRET_RECOVERY_FAILED`, `FRAMEWORK__APP_INSTALLATION_INCOMPLETE`

## Gotchas

- `app:secret:rotate` refuses apps whose installation never finished (manifest with `<setup>` and no committed secret, or a secret still in `deleted_apps`) with `FRAMEWORK__APP_INSTALLATION_INCOMPLETE`; run `app:install <app-name>` instead.
- Shopware cannot distinguish a rejecting app from an unreachable one; a failed recovery means retry before changing the shop ID.
- Stashed unconfirmed secrets mark the install unfinished, so such a reinstall always takes the recovery path.

## Code check (6.7.15.1)
- confirmed `app:secret:rotate` — optional `name` argument, all active apps otherwise — vendor/shopware/core/Framework/App/Command/RotateAppSecretCommand.php:26
- confirmed `api.action.app.secret.rotate` — POST `/api/_action/app-system/secret/rotate` — vendor/shopware/core/Framework/App/Api/AppSecretRotationController.php:37
- confirmed `AppSecretRotationController::rotate()` — schedules rotation and returns HTTP 202 — vendor/shopware/core/Framework/App/Api/AppSecretRotationController.php:38
- confirmed `AppSecretRotationController::extractIntegrationIdOrFail()` — requires app integration auth — vendor/shopware/core/Framework/App/Api/AppSecretRotationController.php:61
- confirmed `RotateAppSecretMessage` — async message class — vendor/shopware/core/Framework/App/Message/RotateAppSecretMessage.php:15
- confirmed `AppException::APP_SECRET_RECOVERY_FAILED` — `FRAMEWORK__APP_SECRET_RECOVERY_FAILED` — vendor/shopware/core/Framework/App/AppException.php:37
- confirmed `AppException::APP_INSTALLATION_INCOMPLETE` — `FRAMEWORK__APP_INSTALLATION_INCOMPLETE` — vendor/shopware/core/Framework/App/AppException.php:38
- confirmed `AppRegistrationService::MAX_UNCONFIRMED_APP_SECRETS` — cap of 5 — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:36
- confirmed `unconfirmed_app_secrets` — app field, write-protected — vendor/shopware/core/Framework/App/AppDefinition.php:110
- confirmed `deleted_apps` — stores `app_secret` and `unconfirmed_app_secrets` — vendor/shopware/core/Framework/App/DeletedApps/DeletedAppsGateway.php:34
