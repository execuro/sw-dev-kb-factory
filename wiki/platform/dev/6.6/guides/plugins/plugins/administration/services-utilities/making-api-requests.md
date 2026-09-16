---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.md
title: Making API requests
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/making-api-requests.html
sourceHash: 3cc6af13388883e8bd6a5725718f77f866b92361
keywords: ["ApiService", "custom API service", "getBasicHeaders", "handleResponse", "getApiBasePath", "addServiceProvider", "httpClient", "repositoryFactory", "Shopware.Classes", "api service registration", "Criteria"]
summary: How to build, register, and use a custom ApiService subclass for plugin HTTP requests in the Administration.
lastBuilt: 2026-09-15
---
## What it is
This guide shows how to create a custom API service in a plugin's Administration that extends Shopware's `ApiService` class to make HTTP requests to custom backend endpoints.

## When to use
Use when a plugin needs to communicate with a custom backend endpoint or extend Shopware's API functionality beyond the standard repository pattern.

## Key steps / config
1. Create a service extending `ApiService` (from `Shopware.Classes`):
```javascript
const { ApiService } = Shopware.Classes;
class MyApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = '_action/my-plugin') {
        super(httpClient, loginService, apiEndpoint);
    }
    getMyData() {
        const apiRoute = `${this.getApiBasePath()}/my-data`;
        return this.httpClient.get(apiRoute, { headers: this.getBasicHeaders() })
            .then((response) => ApiService.handleResponse(response));
    }
}
export default MyApiService;
```
2. Register it as a service provider (e.g. `api/index.js`):
```javascript
const { Application } = Shopware;
Application.addServiceProvider('myApiService', (container) => {
    const initContainer = Application.getContainer('init');
    return new MyApiService(initContainer.httpClient, container.loginService);
});
```
3. Import that index file in the plugin's `main.js`.
4. Inject `myApiService` into a component via `inject: ['myApiService']` and call its methods (e.g. `getMyData()`, `createMyData(data)`, `deleteMyData(id)`, `searchMyData(term, limit)`).

## Essential identifiers
- `ApiService` (from `Shopware.Classes`)
- `ApiService.handleResponse(response)`
- `getApiBasePath()`, `getBasicHeaders()`
- `Application.addServiceProvider(name, factory)`
- `repositoryFactory`, `Shopware.Data.Criteria`

## Gotchas
`getBasicHeaders()` supplies the authorization token, content-type, and API version headers automatically; custom headers must be merged in via spread (`...this.getBasicHeaders()`).
