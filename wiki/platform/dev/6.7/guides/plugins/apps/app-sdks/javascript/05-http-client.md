---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md
title: HTTP-client
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/05-http-client.html
sourceHash: e12e7057d29ff8d51891fbaf4bba62ed7c436e5e
codeCheckedAgainst: "6.7.15.1"
keywords: ["HttpClient", "EntityRepository", "Criteria", "SyncService", "SyncOperation", "contextResolver", "uploadMediaFile", "createMediaFolder", "getMediaFolderByName", "getMediaDefaultFolderByEntity", "admin api", "sync api", "oauth token", "javascript app sdk"]
summary: "JavaScript App Server SDK HttpClient for the Admin API, with EntityRepository, Criteria, SyncService/SyncOperation and media upload/folder helpers."
lastBuilt: 2026-10-21
---
## What it is

The HTTP client of the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`) for calling a shop's Admin API, plus helper abstractions for entity repositories, the Sync API and media. The client fetches the shop's OAuth2 token automatically and adds it to each request.

## When to use

When your app server needs to read or write data in a registered shop: fetching entities, batch upserts/deletes, uploading media or resolving media folders.

## Key steps / config

Get a client from a resolved context or construct it from a shop:

```ts
const ctx = await app.contextResolver.fromBrowser<BrowserAppModuleRequest>(/** Request */);
const res = await ctx.httpClient.get<{version: string}>('/_info/version');
// or
import { HttpClient } from "@shopware-ag/app-server-sdk"
const httpClient = new HttpClient(shop);
```

Paths are relative to the Admin API (`/_info/version` maps to the shop's `/api/_info/version`).

Entity repository (`@shopware-ag/app-server-sdk/helper/admin-api`, `Criteria` from `@shopware-ag/app-server-sdk/helper/criteria`):

```ts
const repository = new EntityRepository<Product>(httpClient, "product");
const products = await repository.search(new Criteria());   // products.first(), products.data[0]
const product = await repository.search(new Criteria(['my-uuid'])).first(); // may be null
await repository.upsert([{ id: 'my-uuid', name: 'My Product' }]);
await repository.delete([{ id: 'my-uuid' }]);
```

`upsert` and `delete` go through the Sync API under the hood. Direct Sync API use:

```ts
import { SyncOperation, SyncService } from "@shopware-ag/app-server-sdk/helper/admin-api";
const syncService = new SyncService(httpClient);
await syncService.sync([
  new SyncOperation('my-custom-key', 'product', 'upsert', [{ id: 'my-uuid', name: 'My Product' }]),
  new SyncOperation('my-custom-key', 'product', 'delete', [{ id: 'my-uuid' }]),
]);
```

The key (first argument) is shown in the error response if that operation fails. A second argument to `sync()` accepts an `ApiContext` to tune behaviour (disable indexing, queue indexing asynchronously, skip triggering flows).

Media helpers (`@shopware-ag/app-server-sdk/helper/media`):

- `createMediaFolder(httpClient, 'My Folder', {})` / with `{parentId: "parent-id"}` — returns folder id
- `getMediaFolderByName(httpClient, 'My Folder')`
- `getMediaDefaultFolderByEntity(httpClient, 'product')` — default folder for an entity
- `uploadMediaFile(httpClient, { file: Blob, fileName, mediaFolderId? })`

## Essential identifiers

- `HttpClient`, `ctx.httpClient`, `app.contextResolver.fromBrowser()`
- `EntityRepository`, `Criteria`, `search()`, `upsert()`, `delete()`, `first()`
- `SyncService`, `SyncOperation`, `ApiContext`
- `createMediaFolder`, `getMediaFolderByName`, `getMediaDefaultFolderByEntity`, `uploadMediaFile`

## Gotchas

- An upsert without all required fields (e.g. only `name` for a new product) fails on create.
- `search(...).first()` can return null.
- The source's upsert examples use PHP-style `['id': ...]` arrays; in TypeScript pass an array of objects.
- The source's media import line omits `getMediaDefaultFolderByEntity`; import it from the same module.

## Code check (6.7.15.1)
- confirmed `/api/_info/version` — GET route `api.info.shopware.version` — vendor/shopware/core/Framework/Api/Controller/InfoController.php:229
- confirmed `/api/_action/sync` — POST route `api.action.sync` backing batch upsert/delete — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `/api/oauth/token` — token endpoint the client authenticates against — vendor/shopware/core/Framework/Api/Controller/AuthController.php:38
- confirmed `PlatformRequest::HEADER_INDEXING_BEHAVIOR` — `indexing-behavior` header for disabling/queueing indexing — vendor/shopware/core/PlatformRequest.php:29
- confirmed `PlatformRequest::HEADER_SKIP_TRIGGER_FLOW` — `sw-skip-trigger-flow` header to skip flows — vendor/shopware/core/PlatformRequest.php:26
- confirmed `/api/_action/media/{mediaId}/upload` — media upload route, ACL `media:update` — vendor/shopware/core/Content/Media/Api/MediaUploadController.php:40
- unverified `HttpClient` — JavaScript SDK class, not in the Shopware code roots
- unverified `EntityRepository` — JavaScript SDK helper (`helper/admin-api`), out of scope
- unverified `SyncService` — JavaScript SDK helper, out of scope
- unverified `uploadMediaFile` — JavaScript SDK media helper, out of scope
