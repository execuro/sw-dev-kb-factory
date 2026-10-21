---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/making-api-requests.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
  - platform/dev/6.7/concepts/api/_index.md
sourceHash: d16c607c1c4c48450db348f2f0a028f92db27cbb
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/making-api-requests.html
title: Making API Requests
version: "6.7"
versions:
  - "6.7"
keywords: ["ApiService", "Shopware.Classes", "addServiceProvider", "getBasicHeaders", "getApiBasePath", "handleResponse", "httpClient", "loginService", "inject", "api service", "http request", "custom endpoint", "administration plugin"]
summary: Admin plugin API service extending Shopware.Classes.ApiService, registered via addServiceProvider and injected into components.
lastBuilt: 2026-10-21
---
## What it is

How an Administration plugin creates its own API service class to send HTTP requests to Shopware API endpoints (typically custom backend routes of the plugin), registers it in the service container, and injects it into components.

## When to use

You need a plugin's Administration module or component to talk to a custom backend endpoint (for example an `_action/my-plugin` controller) or extend what the Admin API offers. Prerequisites: a plugin and a custom Administration module or component (see platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md). For the backend side see platform/dev/6.7/concepts/api/_index.md.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/api/my-api-service.js` with a class extending `ApiService` from `Shopware.Classes`:

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

   POST/DELETE work the same with `this.httpClient.post(route, data, { headers })` / `.delete(route, { headers })`; query parameters go in a `params` object next to `headers`.

2. Register it in `<plugin root>/src/Resources/app/administration/src/api/index.js`:

```javascript
Shopware.Application.addServiceProvider('myApiService', (container) => {
    const initContainer = Shopware.Application.getContainer('init');
    return new MyApiService(initContainer.httpClient, container.loginService);
});
```

3. Import it from the plugin's admin entry `src/main.js` with `import './api';`.
4. In a component, add `inject: ['myApiService']` and call e.g. `await this.myApiService.getMyData()` inside `try/catch`; the source pairs this with `Mixin.getByName('notification')` and `createNotificationSuccess` / `createNotificationError`.
5. Custom headers: `getBasicHeaders()` accepts an object of extra headers and merges it over the defaults (`this.getBasicHeaders({ 'X-Custom-Header': 'custom-value' })`); spreading `...this.getBasicHeaders()` into a new object also works.
6. File uploads: append the file to a `FormData` and post it with `'Content-Type': 'multipart/form-data'` overriding the default header.
7. For standard entities, use `inject: ['repositoryFactory']`, `this.repositoryFactory.create('product')` and a `new Shopware.Data.Criteria()` instead of a custom service.

## Essential identifiers

- `Shopware.Classes.ApiService` — base class; constructor `(httpClient, loginService, apiEndpoint, contentType = 'application/vnd.api+json')`
- `getApiBasePath(id?, prefix = '')` — returns the endpoint, optionally with `/<id>` and a `<prefix>/`
- `getBasicHeaders(additionalHeaders = {})`
- `ApiService.handleResponse(response)` (static)
- `Shopware.Application.addServiceProvider(name, provider)`, `Application.getContainer('init').httpClient`, `container.loginService`

## Gotchas

- The source says `getBasicHeaders()` adds "API version headers". The installed code sets `Accept` (the service's content type), `Authorization` (token from `loginService`), `Content-Type: application/json`, and `sw-language-id` when `Shopware.Context.api.languageId` is set. It sets no API version header.
- `handleResponse()` only parses JSON:API when the response `content-type` is `application/vnd.api+json`. Otherwise it returns `response.data`, or the whole response when `data` is null/undefined. It does not throw on HTTP errors itself. Failures reach you as rejected promises from `httpClient`, where you can inspect `error.response`, `error.request` or `error.message`.

## Code check (6.7.15.1)
- confirmed `ApiService` — base class for REST API services — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:24
- confirmed `contentType` — fourth constructor argument, default `application/vnd.api+json` — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:39
- confirmed `ApiService::getApiBasePath()` — builds endpoint path with optional id and prefix — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:50
- corrected `ApiService::getBasicHeaders()` — docs: auth, content-type and API version headers; code: Accept, Authorization, Content-Type, sw-language-id, plus merged extras — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:67
- confirmed `ApiService::handleResponse()` — static; parses JSON:API by content type — vendor/shopware/administration/Resources/app/administration/src/core/service/api.service.ts:89
- confirmed `Classes` — global object exposes `ApiService` on `Shopware.Classes` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:291
- confirmed `addServiceProvider` — registers a provider as `service.<name>` in the DI container — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:170
- confirmed `httpClient` — init container provides the HTTP client — vendor/shopware/administration/Resources/app/administration/src/app/init/index.ts:54
- confirmed `notification` — mixin providing `createNotificationSuccess`/`createNotificationError` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- confirmed `createNotificationSuccess` — mixin method — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:22
