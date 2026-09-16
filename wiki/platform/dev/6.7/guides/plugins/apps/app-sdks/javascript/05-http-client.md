---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md
title: HTTP-client
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/05-http-client.html
sourceHash: e12e7057d29ff8d51891fbaf4bba62ed7c436e5e
codeCheckedAgainst: "6.7.13.0"
keywords: ["HttpClient", "EntityRepository", "Criteria", "SyncService", "SyncOperation", "createMediaFolder", "uploadMediaFile", "getMediaFolderByName", "getMediaDefaultFolderByEntity", "/_info/version", "admin api client", "sync api", "media upload", "oauth2 token"]
summary: "JS App Server SDK HttpClient for Admin API calls with automatic OAuth2 token, plus EntityRepository, SyncService/SyncOperation and media helper functions."
lastBuilt: 2026-09-15
---
## What it is

The JavaScript App Server SDK (`@shopware-ag/app-server-sdk`) ships an HTTP client for calling the shop's Admin API. It fetches the shop's OAuth2 token automatically and adds it to each request. On top of it the SDK offers helpers for entity CRUD (`EntityRepository`), batch writes (`SyncService`) and the media manager.

## When to use

When an app backend needs to read or write shop data: fetch entities, upsert/delete in batches, create media folders or upload files.

## Key steps / config

**Get a client** — from a resolved context (`ctx.httpClient`) or manually:

```ts
import { HttpClient } from "@shopware-ag/app-server-sdk"
const httpClient = new HttpClient(shop);
const response = await httpClient.get<{version: string}>('/_info/version')
console.log(response.body.version)
```

**Entity repository** (`@shopware-ag/app-server-sdk/helper/admin-api`, `Criteria` from `@shopware-ag/app-server-sdk/helper/criteria`):

```ts
const repository = new EntityRepository<Product>(httpClient, "product");
const products = await repository.search(new Criteria());   // products.first(), products.data[0]
const product = await repository.search(new Criteria(['my-uuid'])).first(); // may be null
await repository.upsert([{ id: 'my-uuid', name: 'My Product' }]); // update if found, else create
await repository.delete([{ id: 'my-uuid' }]);
```

An upsert that creates an entity without all required fields fails. `upsert` and `delete` use the Sync API internally, because the regular API has no batch operations.

**Sync API directly:**

```ts
import { SyncOperation, SyncService } from "@shopware-ag/app-server-sdk/helper/admin-api";
const syncService = new SyncService(httpClient);
await syncService.sync([
  new SyncOperation('my-custom-key', 'product', 'upsert', [{id: 'my-uuid', name: 'My Product'}]),
  new SyncOperation('my-custom-key', 'product', 'delete', [{id: 'my-uuid'}]),
]);
```

The key (first argument) is shown in the error response if that operation fails. The second argument of `sync` accepts an `ApiContext` that controls API behaviour, such as indexing (skip or run asynchronously via the queue) or skipping flow triggers. On the Shopware side these map to the `indexing-behavior` and `sw-skip-trigger-flow` request headers.

**Media helpers** (`@shopware-ag/app-server-sdk/helper/media`): `createMediaFolder(httpClient, 'My Folder', {parentId})`, `getMediaFolderByName(httpClient, 'My Folder')`, `getMediaDefaultFolderByEntity(httpClient, 'product')` (returns the default folder id for an entity), `uploadMediaFile(httpClient, { file: Blob, fileName, mediaFolderId })`.

## Essential identifiers

- `HttpClient`, `ctx.httpClient`
- `EntityRepository`, `Criteria`, `search()`, `upsert()`, `delete()`
- `SyncService`, `SyncOperation`, `ApiContext`
- `createMediaFolder`, `getMediaFolderByName`, `getMediaDefaultFolderByEntity`, `uploadMediaFile`

## Gotchas

- The source's upsert example uses PHP-style `['id': ...]` arrays; in TypeScript pass an array of objects.
- The source calls `getMediaDefaultFolderByEntity` without importing it; import it from `@shopware-ag/app-server-sdk/helper/media` like the other helpers.
- Paths like `/_info/version` are relative to the Admin API; the core route is `/api/_info/version`.

## Code check (6.7.13.0)
- unverified `HttpClient` — JS SDK class, outside the vendor/shopware scope
- unverified `EntityRepository` — JS SDK helper, outside the vendor/shopware scope
- unverified `SyncService` — JS SDK helper, outside the vendor/shopware scope
- confirmed `/api/_info/version` — GET route api.info.shopware.version — vendor/shopware/core/Framework/Api/Controller/InfoController.php:222
- confirmed `/api/_action/sync` — POST route used for batch upsert/delete — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `HEADER_INDEXING_BEHAVIOR` — sync reads the indexing-behavior header — vendor/shopware/core/Framework/Api/Controller/SyncController.php:51
- confirmed `indexing-behavior` — header constant value — vendor/shopware/core/PlatformRequest.php:29
- confirmed `sw-skip-trigger-flow` — header to skip flow triggers — vendor/shopware/core/PlatformRequest.php:26
- confirmed `/api/_action/media/{mediaId}/upload` — core media upload route — vendor/shopware/core/Content/Media/Api/MediaUploadController.php:40
- confirmed `media_default_folder` — entity behind default folder per entity lookup — vendor/shopware/core/Content/Media/Aggregate/MediaDefaultFolder/MediaDefaultFolderDefinition.php:19
