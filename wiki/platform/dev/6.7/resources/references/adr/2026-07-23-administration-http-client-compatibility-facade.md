---
id: platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md
title: Keep Administration HTTP transports behind a compatibility facade
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.html
sourceHash: bb1d982895c7e98be249c3b4bcc0b30d590311ff
codeCheckedAgainst: "6.7.13.0"
keywords: ["useAxiosV1", "axios", "axios v1", "axios-v1", "http client", "createHTTPClient", "interceptors", "interceptorsV0", "interceptorsV1", "V6_8_0_0", "compatibility facade", "administration", "adr"]
summary: "ADR: Admin HTTP client facade over Axios 0.x and 1.x; useAxiosV1 selects transport per request. 6.7.13.0 defaults to 0.x unless V6_8_0_0 is on."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2026-07-23): the Administration exposes a Shopware-owned HTTP client facade over two private Axios instances (legacy 0.x and 1.x) so extensions can migrate to Axios 1 incrementally, and repository requests are meant to always use Axios v1 internally.

## When to use

When an Administration extension makes direct HTTP requests, registers interceptors or defaults on the Admin HTTP client, mocks it in tests, or depends on Axios-specific behaviour (cancellation, errors, types) ahead of the Axios 1 migration.

## Key steps / config

Installed 6.7.13.0 behaviour of `createHTTPClient` (`src/core/factory/http.factory.js`):

1. Two instances are created from the same base config (`baseURL` = API path, `timeout` 30000, 50 MB `maxContentLength`/`maxBodyLength`); refresh-token, global-error, session-expired and tracing interceptors are applied to both.
2. The returned dispatcher routes each request by `config.useAxiosV1`, else the `V6_8_0_0` feature flag, else Axios 0.x.
   ```javascript
   httpClient.get(url, { useAxiosV1: true });
   ```
3. The dispatcher offers `request`, `get`, `delete`, `head`, `options`, `post`, `put`, `patch`, `getUri`, `isCancel` (checks both adapters) and `CancelToken` (v0).
4. `dispatcher.interceptors` and `dispatcher.defaults` point to ONE instance (v1 when `V6_8_0_0` is active, else v0). To affect both transports, register on `interceptorsV0` and `interceptorsV1` / `defaultsV0` and `defaultsV1`.
5. `axiosV0` and `axiosV1` are exposed on the dispatcher for testing/mocking.
6. `useAxiosV1?: boolean` is declared on `AxiosRequestConfig` for both `axios` and `axios-v1` module typings.

## Essential identifiers

- `useAxiosV1`
- `createHTTPClient`, `CancelToken`, `isCancel`
- `interceptorsV0`, `interceptorsV1`, `defaultsV0`, `defaultsV1`, `axiosV0`, `axiosV1`
- `V6_8_0_0` feature flag

## Gotchas

- The ADR states interceptors and defaults registered through the facade apply to both transports; in 6.7.13.0 the plain `interceptors`/`defaults` properties map to a single instance only.
- The ADR states repository requests always use Axios v1 and repository options cannot select the transport; in 6.7.13.0 the repository does not pass `useAxiosV1`, so repository calls follow the dispatcher default (v0 unless `V6_8_0_0` is active).
- New code should use Shopware's HTTP client types instead of depending on an Axios instance; code relying on Axios-specific behaviour must migrate before the legacy transport is removed.

## Version notes

Two transports are transitional; the legacy Axios 0.x path and compatibility surface are planned for removal. The `V6_8_0_0` feature flag already switches the default to v1.

## Code check (6.7.13.0)
- confirmed `useAxiosV1` — per-request transport selector, falls back to V6_8_0_0 then v0 — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:98
- confirmed `useAxiosV1` — typed on AxiosRequestConfig — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:610
- confirmed `createHTTPClient` — facade factory — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:21
- corrected `dispatcher.interceptors` — docs: facade interceptors apply to both transports; maps to one instance — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:127
- corrected `dispatcher.defaults` — docs: defaults apply to both transports; maps to one instance — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:132
- confirmed `dispatcher.interceptorsV1` — separate per-transport interceptors — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:129
- confirmed `dispatcher.axiosV1` — instances exposed for mocking — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:138
- corrected `Repository::search()` — docs: repositories always use Axios v1; no transport flag passed — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:124
