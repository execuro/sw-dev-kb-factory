---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/making-api-requests.md
title: Making API Requests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/making-api-requests.html
sourceHash: d16c607c1c4c48450db348f2f0a028f92db27cbb
codeCheckedAgainst: "6.7.13.0"
keywords: ["ApiService", "Shopware.Classes", "getApiBasePath", "getBasicHeaders", "ApiService.handleResponse", "Application.addServiceProvider", "httpClient", "loginService", "api service", "http request", "custom endpoint", "axios", "inject"]
summary: Custom Administration API service extending Shopware.Classes.ApiService, registered via Application.addServiceProvider and injected into components.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md"]
---
## What it is

How a plugin creates its own Administration API service class by extending `ApiService` (from `Shopware.Classes`), registers it in the service container, and calls it from components to reach custom backend endpoints. Prerequisites: a plugin and a custom Administration module or component ([add custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md)).

## When to use

When Administration code must call plugin-specific backend routes (e.g. under `_action/my-plugin`) with the logged-in user's authentication. For standard entities, inject `repositoryFactory` and use `repositoryFactory.create('product')` with a `Shopware.Data.Criteria` instead.

## Key steps / config

1. `<plugin root>/src/Resources/app/administration/src/api/my-api-service.js`:

```javascript
const { ApiService } = Shopware.Classes;
class MyApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = '_action/my-plugin') {
        super(httpClient, loginService, apiEndpoint);
    }
    getMyData() {
        return this.httpClient
            .get(`${this.getApiBasePath()}/my-data`, { headers: this.getBasicHeaders() })
            .then((response) => ApiService.handleResponse(response));
    }
}
export default MyApiService;
```

POST/DELETE/query-param variants follow the same shape (`httpClient.post(route, data, { headers })`, `params: { term, limit }`).

2. `src/api/index.js` registers the provider; import it from `main.js` with `import './api';`:

```javascript
Shopware.Application.addServiceProvider('myApiService', (container) => {
    const initContainer = Shopware.Application.getContainer('init');
    return new MyApiService(initContainer.httpClient, container.loginService);
});
```

3. In a component: `inject: ['myApiService']`, then `await this.myApiService.getMyData()` inside `try/catch`, reporting via the `notification` mixin (`createNotificationSuccess`, `createNotificationError`).

Base class API in 6.7:
- `constructor(httpClient, loginService, apiEndpoint, contentType = 'application/vnd.api+json')`
- `getApiBasePath(id?, prefix = '')` returns `[prefix/]apiEndpoint[/id]`
- `getBasicHeaders(additionalHeaders = {})` returns `Accept` (the content type), `Authorization` (token from `loginService.getToken()`), `Content-Type: application/json`, plus `sw-language-id` when the API context has a language; extra headers can be passed as the argument.
- `ApiService.handleResponse(response)` returns `response.data` (parsed from JSON:API when the response content type is `application/vnd.api+json`), or the whole response when `data` is empty.

For uploads, post a `FormData` with `'Content-Type': 'multipart/form-data'` merged over the basic headers.

## Essential identifiers

- `Shopware.Classes.ApiService`
- `getApiBasePath`, `getBasicHeaders`, `ApiService.handleResponse`
- `Shopware.Application.addServiceProvider`, `Application.getContainer('init')`
- `httpClient`, `loginService`
- `Mixin.getByName('notification')`

## Gotchas

- `handleResponse` does not handle HTTP errors: it only unwraps/parses the data. Failed requests reject from `httpClient`; inspect `error.response` (status/data), `error.request` (no response) or `error.message` in the component.
- The docs list "API version headers" among the basic headers; the installed `getBasicHeaders` sets none — it sets `Accept`, `Authorization`, `Content-Type` and optionally `sw-language-id`.

## Code check (6.7.13.0)
- confirmed `ApiService` — exposed under Shopware.Classes — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:280
- confirmed `ApiService::constructor()` — httpClient, loginService, apiEndpoint, contentType default — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:35
- confirmed `ApiService::getApiBasePath()` — builds prefix/endpoint/id — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:50
- corrected `ApiService::getBasicHeaders()` — docs: includes API version headers — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:67
- corrected `ApiService::handleResponse()` — docs: handles common HTTP errors; code only unwraps/parses data — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:89
- confirmed `addServiceProvider` — registers `service.<name>` factory — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:169
- confirmed `initContainer.httpClient` — init container holds httpClient — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:126
- confirmed `loginService` — lives in the service container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:347
- confirmed `createNotificationSuccess` — notification mixin method — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:20
- unverified `Shopware.Data.Criteria` — not checked in this pass
