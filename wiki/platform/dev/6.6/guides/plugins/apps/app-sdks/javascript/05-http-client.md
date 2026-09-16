---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.md
title: HTTP-client
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/05-http-client.html
sourceHash: e12e7057d29ff8d51891fbaf4bba62ed7c436e5e
keywords: ["HttpClient", "EntityRepository", "Criteria", "SyncService", "SyncOperation", "upsert", "OAuth2", "media manager", "createMediaFolder", "uploadMediaFile", "getMediaFolderByName", "sync api", "ApiContext"]
summary: "JS App SDK HTTP client: ctx.httpClient or new HttpClient(shop), plus EntityRepository, SyncService, and media-manager helpers."
lastBuilt: "2026-09-15"
---
## What it is

Documents the SDK's HTTP client for calling the Shopware server API, and the higher-level EntityRepository, Sync API, and Media API abstractions built on top of it. The client automatically fetches and attaches the shop's OAuth2 token.

## Key steps / config

Get a client either via a resolved context or manually:

```ts
const ctx = await app.contextResolver.fromBrowser<BrowserAppModuleRequest>(/** Request */);
const response = await ctx.httpClient.get<{version: string}>('/_info/version')
```

```ts
import { HttpClient } from "@shopware-ag/app-server-sdk"
const httpClient = new HttpClient(shop);
```

`EntityRepository` wraps the generic API for a given entity name:

```ts
import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

const repository = new EntityRepository<Product>(httpClient, "product");
const products = await repository.search(new Criteria());
await repository.upsert(['id': 'my-uuid', 'name': 'My Product']);
await repository.delete([{id: 'my-uuid'}]);
```

`EntityRepository.upsert`/`delete` use the Sync API under the hood; it can also be called directly via `SyncService`/`SyncOperation`, and an `ApiContext` argument configures behaviour such as disabling indexing or flow triggers.

Media helpers (`createMediaFolder`, `uploadMediaFile`, `getMediaFolderByName`, `getMediaDefaultFolderByEntity`) live under `@shopware-ag/app-server-sdk/helper/media`.

## Essential identifiers

- `HttpClient`
- `EntityRepository`
- `Criteria`
- `SyncService`, `SyncOperation`
- `@shopware-ag/app-server-sdk/helper/admin-api`
- `@shopware-ag/app-server-sdk/helper/media`
- route `/_info/version`

## Gotchas

`EntityRepository.upsert` with missing required fields fails at the server side rather than client-side, per the source's example of an upsert without a `name` failing because required fields are absent.
