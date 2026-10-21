---
id: platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md
title: Keep Administration HTTP transports behind a compatibility facade
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.html
sourceHash: bb1d982895c7e98be249c3b4bcc0b30d590311ff
codeCheckedAgainst: "6.7.15.1"
keywords: ["axios", "axios v1", "axios migration", "useAxiosV1", "createHTTPClient", "http client", "httpClient", "HttpRequestConfig", "interceptors", "repository", "V6_8_0_0", "administration", "http.factory"]
summary: "ADR: Admin HTTP client facade over Axios 0.x and 1.x; direct requests choose via useAxiosV1, repositories always use Axios v1."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-07-23) for the Administration HTTP client. Historically the client exposed Axios behavior to extensions, so swapping Axios 0.x for 1.x directly would affect interceptors, default configuration, request cancellation, TypeScript types and test mocks across the extension ecosystem. The decision: expose a Shopware-owned HTTP client facade and keep the concrete Axios instances private.

## When to use

- Writing or migrating Administration extension code that issues direct HTTP requests or registers interceptors/defaults.
- Assessing whether repository-based code needs changes for the Axios v1 upgrade (it does not).

## Key steps / config

- `createHTTPClient()` in `src/core/factory/http.factory.js` creates an Axios v0 and an Axios v1 instance and returns a dispatcher (the facade).
- Transport selection per direct request: an explicit `useAxiosV1: true|false` in the request config wins; otherwise the `V6_8_0_0` feature flag decides (v1 when active); otherwise v0.

```js
httpClient.get('/some/route', { useAxiosV1: true });
```

- Interceptors and defaults registered through the facade (`httpClient.interceptors.request/response`, `httpClient.defaults`) are mirrored onto both transports.
- Repository requests always send `useAxiosV1: true`; repository options cannot select the transport. Repository incompatibilities are fixed centrally in Shopware.
- New code should use Shopware's HTTP client types (`HttpRequestConfig`, `HttpResponse` in `src/core/factory/http-client.types.ts`) instead of depending on an Axios instance.

## Essential identifiers

- `useAxiosV1` (request config option)
- `createHTTPClient` (`src/core/factory/http.factory.js`)
- `HttpRequestConfig`, `HttpResponse`
- `V6_8_0_0` feature flag (default transport switch)

## Gotchas

- Code that depends directly on Axios-specific behavior (cancellation, errors, configuration) must still migrate before the legacy transport and compatibility surface are removed.
- The former runtime escape hatches (`axiosV0`, `axiosV1`, `interceptorsV0`/`V1`, `defaultsV0`/`V1` on the client) remain at runtime but are intentionally kept out of the TypeScript contract.
- Maintaining two transports adds temporary complexity; the facade is meant as the stable boundary for future HTTP-library upgrades.
- The ADR points to an "Axios migration guide" in the Administration technical docs for the supported migration path.

## Code check (6.7.15.1)
- confirmed `useAxiosV1` — optional boolean on the request config type — vendor/shopware/administration/Resources/app/administration/src/core/factory/http-client.types.ts:27
- confirmed `useAxiosV1` — explicit value wins, else `V6_8_0_0` flag, else v0 — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:101
- confirmed `createHTTPClient` — factory returning the facade dispatcher — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:21
- confirmed `dispatcher.interceptors` — mirrored interceptor managers for both transports — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:133
- confirmed `dispatcher.defaults` — mirrored defaults for both transports — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.js:137
- confirmed `Repository::buildRequestConfig()` — repository requests always set `useAxiosV1: true` — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:801
- confirmed `HttpRequestConfig` — Shopware-owned request config type — vendor/shopware/administration/Resources/app/administration/src/core/factory/http-client.types.ts:13
