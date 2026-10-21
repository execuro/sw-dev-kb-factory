---
id: platform/dev/6.7/resources/references/adr/2026-03-18-app-url-verify-utils.md
title: Improved APP URL verification utils
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-18-app-url-verify-utils.html
sourceHash: 3d1fc7724700fa61efea6e9888929d7822d86993
codeCheckedAgainst: "6.7.15.1"
keywords: ["APP_URL", "app:url:verify", "app:url:status", "api/app-system/shop/verify", "AppUrlVerifier", "ShopIdChangedEvent", "VerificationStatus", "shop id fingerprint", "app url verification", "staging copy", "app system", "soft fail", "hard fail"]
summary: "ADR: Shopware verifies APP_URL points back to itself via api/app-system/shop/verify on Shop ID change; adds app:url:verify and app:url:status commands."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-09-22, area framework) adding infrastructure that checks whether the configured `APP_URL` points back to the same Shopware instance. It builds on the Shop ID fingerprinting mechanism, which detects environment changes (changed `APP_URL`, production copied to staging) and cuts off app-server communication until the Shop ID is updated.

## When to use

- Diagnosing app communication problems after copying a production shop to staging, or after changing `APP_URL`.
- Understanding why two shops sharing the same `APP_URL`, or a misconfigured `APP_URL`, would be flagged.
- Manually triggering or inspecting the verification result from the CLI.

## Key steps / config

Verification flow through the public endpoint `api/app-system/shop/verify`:

1. Shopware generates a random token, stores it in a short-lived cache under a cache key (installed code: 2-minute TTL, `runId` as the key suffix).
2. Shopware sends a `GET` request to the configured `APP_URL` plus `/api/app-system/shop/verify` with `runId` and `token` as query parameters.
3. The receiving instance looks up the cache key and compares the token.
4. Match: `204 No Content` -> pass. Not found / mismatch: `400 Bad Request` -> hard fail.

Commands:

```shell
php bin/console app:url:verify   # manually verify the APP_URL
php bin/console app:url:status   # print the current stored result
```

Verification states (`VerificationStatus`):

1. Pass: `APP_URL` points to the running shop.
2. Soft fail: connectivity issues, server errors and similar. Retried with exponential backoff up to once per hour; app communication continues. In the installed code, transport errors, 5xx and 429 responses are soft fails; backoff starts at 60 s and doubles up to 1 h.
3. Hard fail: `APP_URL` points elsewhere; the shop owner must resolve it. In the installed code 3xx/4xx responses, any non-204 success, an invalid URL or a non-HTTPS `APP_URL` are hard fails.

Shop ID change scenarios that trigger verification: migration from v1 to v2 Shop ID structure, `APP_URL` changed (no apps installed), installation path changed (no apps installed), new Shop ID generated where none existed, and manual resolution after a fingerprint mismatch cut-off.

Handled scenarios:

- Copy to staging with fingerprint mismatch: mismatch detected, app communication cut off (if apps with backends are installed), owner resolves, a new Shop ID is generated (`ShopIdChangedEvent` dispatched), `APP_URL` verified immediately; on failure communication is cut off again. Without app backends the Shop ID is regenerated and verified directly.
- Copy to staging with matching fingerprints: verifier checks the cached result; none found -> verify now; pass -> continue; soft fail -> increment fail counter and continue; hard fail -> throw and interrupt.
- `APP_URL` change: cached result removed, then verified right away.

## Essential identifiers

- `api/app-system/shop/verify` (route `api.app_system.shop_verify`, `GET`, no auth, rate-limited)
- `app:url:verify`, `app:url:status`
- `AppUrlVerifier`, `VerificationStatus`, `ShopIdChangedEvent`
- `APP_URL`

## Gotchas

- The ADR states that, at this stage, the result is only recorded, not acted upon; integration into live app communication is deferred to a later ADR/PR.
- In the installed code, `verify()`/`forceVerify()` return a pass without checking when the app environment is not `prod`; `app:url:verify` skips that environment check.
- Pass and soft-fail results are cached for 24 h; a hard-fail result never expires, so a persistent cache is needed for `app:url:status` to show anything.
- The `ShopIdChangedEvent` listener only re-verifies when the `APP_URL` fingerprint actually differs from the old one.

## Version notes

Consequences listed by the ADR: `APP_URL` verified on Shop ID change and every 24 hours; app communication cut off if validation fails; the admin prompts the user to resolve the issue (existing feature).

## Code check (6.7.15.1)
- confirmed `api/app-system/shop/verify` — GET route, auth not required — vendor/shopware/core/Framework/App/Api/VerifyShopController.php:33
- confirmed `VerifyShopController::verify()` — 204 on token match, otherwise 400 — vendor/shopware/core/Framework/App/Api/VerifyShopController.php:38
- confirmed `app:url:verify` — console command — vendor/shopware/core/Framework/App/Command/AppUrlVerifyCommand.php:20
- confirmed `app:url:status` — console command — vendor/shopware/core/Framework/App/Command/AppUrlVerificationStatusCommand.php:19
- confirmed `ShopIdChangedEvent` — event class — vendor/shopware/core/Framework/App/ShopId/ShopIdChangedEvent.php:13
- confirmed `VerificationStatus::SOFT_FAIL` — pass/hard fail/soft fail enum — vendor/shopware/core/Framework/App/Url/VerificationStatus.php:17
- confirmed `AppUrlVerifier::NON_HARD_FAIL_TTL` — 24h cache for non-hard-fail results — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:33
- confirmed `AppUrlVerifier::MAX_SOFT_FAIL_BACKOFF` — soft-fail retry capped at 1 hour — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:35
- confirmed `AppUrlVerifier::forceVerify()` — skipped outside prod unless env check bypassed — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:67
- confirmed `VerifyAppUrlListener::__invoke()` — force-verifies on ShopIdChangedEvent when APP_URL changed — vendor/shopware/core/Framework/App/Subscriber/VerifyAppUrlListener.php:22
