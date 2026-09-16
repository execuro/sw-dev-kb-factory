---
id: platform/dev/6.7/resources/references/adr/2026-03-18-app-url-verify-utils.md
title: Improved APP URL verification utils
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-18-app-url-verify-utils.html
sourceHash: 3d1fc7724700fa61efea6e9888929d7822d86993
codeCheckedAgainst: "6.7.13.0"
keywords: ["APP_URL", "app url verification", "api/app-system/shop/verify", "app:url:verify", "app:url:status", "ShopIdChangedEvent", "AppUrlVerifier", "shop id", "fingerprint", "staging copy", "app system", "adr"]
summary: "ADR: verify APP_URL points to the same Shopware instance via a token check on api/app-system/shop/verify; pass, soft and hard fail states; CLI commands."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record on verifying that the configured `APP_URL` points back to the running Shopware instance. It complements the Shop ID fingerprinting: different shops can share an `APP_URL`, it can be misconfigured, or a production copy on staging can keep matching fingerprints.

## When to use

- A shop's app communication is cut off or an admin warning reports an `APP_URL` problem.
- Copying a production shop to staging, or changing `APP_URL` / the installation path.
- Debugging why app servers see two shops as one.

## Key steps / config

Verification flow (as implemented in `AppUrlVerifier`):

1. Shopware generates a random token and stores it in the cache under a run-specific key (2-minute lifetime).
2. It sends a `GET` to `<APP_URL>/api/app-system/shop/verify` with `runId` and `token` query parameters. `APP_URL` must be a valid `https` URL, otherwise the result is a hard fail.
3. The endpoint (route `api.app_system.shop_verify`, no auth, rate limited by `app_shop_verify`) looks up the key and compares the token.
4. Match returns `204 No Content` (pass); no match returns `400 Bad Request` (hard fail).

Verification states:

- Pass — `APP_URL` points to this instance.
- Soft fail — connectivity problems, 5xx or 429; app communication continues, retries back off exponentially (1 minute doubling, capped at once per hour).
- Hard fail — `APP_URL` points elsewhere (also 3xx/4xx or a non-204 success); the shop owner must fix it.

Triggers for a Shop ID change: v1 to v2 structure migration, `APP_URL` change or install path change (when no apps installed), a newly generated Shop ID, or manual resolution after a fingerprint mismatch. `ShopIdChangedEvent` is dispatched; a listener force-verifies when the `APP_URL` fingerprint changed.

CLI:

```shell
php bin/console app:url:verify
php bin/console app:url:status
```

`app:url:verify` verifies manually; `app:url:status` prints the stored result.

## Essential identifiers

- `api/app-system/shop/verify`
- `app:url:verify`, `app:url:status`
- `ShopIdChangedEvent`
- `Shopware\Core\Framework\App\Url\AppUrlVerifier`
- `APP_URL`

## Gotchas

- `AppUrlVerifier::verify()` returns success without checking unless the app environment is `prod`.
- The result is cached: non-hard-fail results for 24 hours (so re-verified daily), hard fails never expire until a forced re-verify. `app:url:status` needs a persistent cache to show anything.
- The ADR states the result is initially only recorded; integration into live app communication follows in a later ADR. Scenarios described: fingerprint mismatch on staging copy cuts off app communication until resolved; matching fingerprints use the cached result (hard fail throws and interrupts the flow).
- If the verification lock cannot be acquired or an unexpected exception occurs, verification returns success so app communication continues.

## Code check (6.7.13.0)
- confirmed `api/app-system/shop/verify` — GET route, `auth_required` false — vendor/shopware/core/Framework/App/Api/VerifyShopController.php:33
- confirmed `app_shop_verify` — rate limiter applied by client IP — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:42
- confirmed `app:url:verify` — console command — vendor/shopware/core/Framework/App/Command/AppUrlVerifyCommand.php:19
- confirmed `app:url:status` — console command printing stored state — vendor/shopware/core/Framework/App/Command/AppUrlVerificationStatusCommand.php:18
- confirmed `ShopIdChangedEvent` — dispatched by `ShopIdProvider` — vendor/shopware/core/Framework/App/ShopId/ShopIdProvider.php:103
- confirmed `VerifyAppUrlListener::__invoke()` — force-verifies when APP_URL fingerprint changes — vendor/shopware/core/Framework/App/Subscriber/VerifyAppUrlListener.php:22
- confirmed `AppUrlVerifier::NON_HARD_FAIL_TTL` — 24h cache for pass/soft fail — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:33
- confirmed `AppUrlVerifier::MAX_SOFT_FAIL_BACKOFF` — backoff capped at 1 hour — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:35
- confirmed `AppUrlVerifier::verify()` — skipped unless app env is prod — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:84
- confirmed `AppUrlVerifier::buildVerificationUrl()` — HTTPS required, else hard fail — vendor/shopware/core/Framework/App/Url/AppUrlVerifier.php:318
