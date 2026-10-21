---
id: platform/dev/6.7/resources/references/adr/2026-08-31-mcp-capability-registration-via-container.md
title: MCP capability registration via the container
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-31-mcp-capability-registration-via-container.html
sourceHash: 38313427f4ae49b2a27285c6ee3d639fb8564c8c
codeCheckedAgainst: "6.7.15.1"
keywords: ["McpToolDiscoveryCompilerPass", "McpServerBuilderCompilerPass", "shopware.mcp.tool", "shopware.store_api_mcp.tool", "mcp.tool", "mcp.servers.elements", "packages/mcp.php", "mcp.admin.request_handler", "shopware.mcp.pagination_limit", "debug:mcp --native", "scan_dirs", "symfony/mcp-bundle", "mcp server registration"]
summary: "ADR: MCP tools, prompts and resources register by DI tag only and are assigned to the admin or store_api server via namespace prefixes in packages/mcp.php."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-08-31, area framework) that supersedes only the registration half of the earlier MCP placement ADR. After `symfony/mcp-bundle` 0.12 replaced file-based discovery with compile-time container registration, and 0.13 added several MCP servers per application, Shopware registers every MCP capability by its DI tag alone and assigns it to exactly one of its two servers: `/api/_mcp` and `/store-api/_mcp`. The placement model (core vs plugin vs app) is unchanged.

## When to use

- You add an MCP tool, prompt or resource in a plugin, a third-party bundle, an in-tree Shopware bundle or core and need it to appear on the right endpoint.
- A correctly tagged capability is missing from an endpoint and you need to diagnose why.

## Key steps / config

1. **Registration.** A capability is a container service with an MCP attribute (`#[McpTool]`, `#[McpPrompt]`, `#[McpResource]`, `#[McpResourceTemplate]`) and the matching SDK tag (`mcp.tool`, `mcp.prompt`, `mcp.resource`, `mcp.resource_template`). The bundle collects them at compile time and derives the input schema. No directory is scanned; the file location does not matter.
2. **Extension authors (unchanged).** Plugins and third-party bundles tag with `shopware.mcp.tool` / `shopware.mcp.prompt` / `shopware.mcp.resource`; Store API capabilities use `shopware.store_api_mcp.tool` / `.prompt` / `.resource`. `McpToolDiscoveryCompilerPass` re-tags all six to the SDK tags. Store API capabilities keep their own tag as the scope marker read by the analysis passes.
3. **Server assignment.** Each server lists the namespace prefixes it exposes in `packages/mcp.php` (`Shopware/Core/Framework/Resources/config/packages/mcp.php`) under `registry`:

```php
'servers' => [
    'admin' => [ /* ... */ 'registry' => ['Shopware\\Core\\Framework\\Mcp\\' /* + 'Shopware\\Storefront\\Mcp\\' if Storefront is installed */] ],
    'store_api' => [ /* ... */ 'registry' => ['tools' => ['Shopware\\Core\\System\\SalesChannel\\Mcp\\']] ],
],
```

4. **Plugin/third-party capabilities** cannot be matched by prefix (arbitrary namespace; a `*` wildcard would claim the other server's elements). `McpToolDiscoveryCompilerPass` appends their class names to the bundle's `mcp.servers.elements` parameter before the bundle's own pass reads it. Plugin capabilities go to the Admin API server.
5. **In-tree bundles** (e.g. Storefront) tag with `mcp.tool` directly and must live under a namespace one server's `registry` covers; otherwise add the prefix in `packages/mcp.php`.
6. **Per-server wiring by `McpServerBuilderCompilerPass`** (things the bundle's `servers` config cannot express):
   - request handlers are scoped per server via `mcp.admin.request_handler` / `mcp.store_api.request_handler` (both `McpAllowlistListRequestHandler` instances answer `ListToolsRequest`, so a shared tag would leak the Admin handler onto the Store endpoint); the code scopes notification handlers the same way;
   - capability loaders (`addLoaders()`, app capabilities) stay on the Admin API server only;
   - both servers page with `shopware.mcp.pagination_limit` (default `50`).

## Essential identifiers

- `McpToolDiscoveryCompilerPass`, `McpServerBuilderCompilerPass`
- tags `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource`, `shopware.store_api_mcp.tool`, `mcp.tool`, `mcp.prompt`, `mcp.resource`, `mcp.resource_template`
- `mcp.servers.elements`, `mcp.servers.<name>.registry`, `packages/mcp.php`
- `mcp.admin.request_handler`, `mcp.store_api.request_handler`, `shopware.mcp.pagination_limit`
- `bin/console debug:mcp --native`

## Gotchas

- A capability in a namespace no server names is silently not registered; `bin/console debug:mcp --native` reports those. Only core and in-tree bundles are affected — plugin capabilities are assigned explicitly.
- Moving a core capability outside the configured prefixes requires updating `packages/mcp.php`. A prefix that matches nothing is a fatal container error in the bundle; in the installed code the Storefront prefix is only added when that bundle is installed, and `McpToolDiscoveryCompilerPass` prunes it if `shopware.mcp.allowed_tools` empties its namespace.
- Shopware depends on the bundle-internal `mcp.servers.elements` parameter; there is no public alternative for arbitrary-namespace capabilities.
- Both servers own separate session stores (session IDs are not namespaced per server), so `McpToolsetSessionCleanupTaskHandler` must consult every store.

## Version notes

- The `mcp.yaml` `discovery.scan_dirs` option no longer exists since `symfony/mcp-bundle` 0.12; the old failure mode (tagged tool missing because its directory was not scanned) is gone.

## Code check (6.7.15.1)
- confirmed `McpToolDiscoveryCompilerPass` — re-tags and assigns elements, registered at priority 20 — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:24
- confirmed `shopware.mcp.tool` — mapped to `mcp.tool` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `shopware.store_api_mcp.tool` — mapped to `mcp.tool`, tag kept as scope marker — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:59
- confirmed `mcp.servers.elements` — parameter extended with plugin class names — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:161
- confirmed `registry` — admin and store_api namespace prefixes — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:54
- confirmed `McpServerBuilderCompilerPass` — scopes handlers, loaders only on admin — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:32
- confirmed `mcp.admin.request_handler` — Admin allowlist handler tag — vendor/shopware/core/Framework/DependencyInjection/mcp.php:159
- confirmed `mcp.store_api.request_handler` — Store API allowlist handler tag — vendor/shopware/core/Framework/DependencyInjection/mcp.php:255
- confirmed `shopware.mcp.pagination_limit` — default 50, used for both servers — vendor/shopware/core/Framework/DependencyInjection/mcp.php:103
- confirmed `McpToolsetSessionCleanupTaskHandler` — scheduled cleanup handler — vendor/shopware/core/Framework/Mcp/ScheduledTask/McpToolsetSessionCleanupTaskHandler.php:33
