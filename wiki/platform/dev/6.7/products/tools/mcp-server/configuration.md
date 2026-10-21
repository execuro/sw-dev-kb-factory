---
id: platform/dev/6.7/products/tools/mcp-server/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/configuration.html
sourceHash: 1407863f15df1c7b77e43078c109a9c704d80d3c
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.mcp.allowed_tools", "shopware.mcp.app_tool_timeout", "shopware.mcp.pagination_limit", "sw-app-user-id", "debug:mcp", "mcp_admin_api", "mcp_store_api", "mcp.server.admin.session.store", "Psr16SessionStore", "mcp_toolset_session", "mcp allowlist", "session store redis", "rate limit", "symfony/mcp-bundle"]
summary: Shopware MCP server config - shopware.mcp keys, allowlists, sw-app-user-id, pagination, Redis session store, debug:mcp, rate limits, 6.7.15.0 changes.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/getting-started.md", "platform/dev/6.7/guides/hosting/performance/lock-store.md", "platform/dev/6.7/resources/references/adr/2026-08-31-mcp-capability-registration-via-container.md"]
---
## What it is

Configuration reference for the Shopware MCP server (6.7.14.0+, always enabled, progressive tool discovery): `shopware.mcp` keys, per-principal allowlists, `symfony/mcp-bundle` servers, pagination, session stores, `debug:mcp`, rate limits and 6.7.15.0 upgrade changes.

## When to use

Restricting MCP tools globally or per principal, running MCP on several servers/Kubernetes, debugging a missing tool, or upgrading MCP internals to 6.7.15.0.

## Key steps / config

`shopware.mcp` has exactly two keys:

```yaml
shopware:
    mcp:
        allowed_tools: []       # compile-time global allowlist, empty = all
        app_tool_timeout: 10    # seconds for app webhook tool calls, min 1
```

A non-empty `allowed_tools` must include `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`, or clients cannot discover other tools.

Per-principal allowlists: integration key (`SWIA...`) or client_credentials → integration allowlist (Settings → Integrations → Edit MCP Allowlist); user key (`SWUA...`) or user JWT (password/refresh, PKCE) → user allowlist; integration plus `sw-app-user-id: <user-uuid>` header → intersection of both (invalid UUID → integration only). Per type: `null` = all, list = only those, `[]` = deny. Admin users (`admin = true`) bypass allowlists; `--admin` integrations bypass ACL only.

Servers: `admin` → `/api/_mcp`, `store_api` → `/store-api/_mcp` (capabilities tagged `shopware.store_api_mcp.*`). Add settings in `config/packages/mcp.yaml`; never change `transports` or `registry`.

Pagination: `tools/list`, `resources/list`, `prompts/list` return `nextCursor`; pass it back as `cursor`. Page size defaults to 50, override with parameter `shopware.mcp.pagination_limit: 100` in `config/services.yaml`.

Session stores: one per server; `file` (default, `%kernel.cache_dir%/mcp-sessions/<server>`), `memory`, `cache` (PSR-16 `cache_pool`, key prefix `mcp-<server>-`); `framework` is unusable. `session.ttl` default `3600`. Multi-server setup:

```yaml
mcp:
    servers:
        admin:
            session: { store: cache, cache_pool: mcp.session.cache_psr16 }
        store_api:
            session: { store: cache, cache_pool: mcp.session.cache_psr16 }
```

`mcp.session.cache_psr16` is a `Symfony\Component\Cache\Psr16Cache` over pool `cache.mcp_sessions` (adapter `cache.adapter.redis_tag_aware`). Check with `bin/console debug:container mcp.server.admin.session.store --show-arguments`: expect `Mcp\Server\Session\Psr16SessionStore`. Also redefine `shopware.mcp.session_registry_cache` and `mcp.store_api.session_registry_cache` (default `cache.system`) on the shared pool so `notifications/tools/list_changed` reaches every session, and use a shared [lock store](platform/dev/6.7/guides/hosting/performance/lock-store.md).

```bash
bin/console debug:mcp                     # tools of both servers
bin/console debug:mcp --scope=api         # or --scope=store-api
bin/console debug:mcp --native            # = debug:mcp:native (prompts, resources, servers)
bin/console debug:mcp --integration=SWIA...
```

A missing tool means: plugin inactive, no `shopware.mcp.tool` tag, `#[McpTool]` on `__invoke()` instead of the class, or an unreachable app webhook URL.

Rate limits under `shopware.api.rate_limiter` (`time_backoff`, reset 1 hour): `mcp_admin_api` 300/min + 1000/10 min; `mcp_store_api` 120/min + 600/10 min. Exceeding returns HTTP 429, no `Retry-After`.

## Essential identifiers

- `shopware.mcp.allowed_tools`, `shopware.mcp.app_tool_timeout`, `shopware.mcp.pagination_limit`
- `sw-app-user-id`, `mcp_toolset_session`, `mcp_toolset_session.cleanup`
- `mcp.server.admin`, `mcp.server.store_api`, `mcp.server.admin.session.store`, `mcp.server.store_api.session.store`
- Tags `mcp.admin.request_handler`, `mcp.admin.notification_handler`, `mcp.store_api.request_handler`, `mcp.store_api.notification_handler`
- `debug:mcp`, `debug:mcp:native`, buckets `mcp_admin_api`, `mcp_store_api`

## Gotchas

- Session IDs are not namespaced per server; the bundle refuses two servers sharing one storage location.
- Enabled toolsets live in `mcp_toolset_session`, keyed only on `Mcp-Session-Id`; removed on `DELETE` of the endpoint or by the daily `mcp_toolset_session.cleanup` task — the scheduler must run.
- Bad cursors return JSON-RPC `-32602`; `?toolsets=all` clients ignoring `nextCursor` see page one only.
- `--integration` filters the Admin API server only.

## Version notes

- 6.7.11.0–6.7.13.x needed the `MCP_SERVER` flag and had no discovery/toolsets/pagination; from 6.7.14.0 it has no effect — remove it. Experimental until 6.8.0.
- 6.7.15.0 (`symfony/mcp-bundle` 0.13): `mcp.server` → `mcp.server.admin`, `mcp.registry` → `mcp.server.admin.registry`, `mcp.store_api.server` → `mcp.server.store_api`, shared `mcp.session.store` → per-server stores; `StoreApiMcpServerBuilderCompilerPass` removed; global `mcp.request_handler` tag alone reaches no server; `discovery.scan_dirs` and bundle `mcp.pagination_limit` removed; `debug:mcp` lists tools only (`--tools` no-op). Old sessions are discarded. See the [ADR](platform/dev/6.7/resources/references/adr/2026-08-31-mcp-capability-registration-via-container.md).

## Code check (6.7.15.1)
- confirmed `allowed_tools` — list, default [] — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1684
- confirmed `app_tool_timeout` — integer, default 10, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1689
- confirmed `shopware.mcp.pagination_limit` — container parameter set to 50 — vendor/shopware/core/Framework/DependencyInjection/mcp.php:103
- confirmed `shopware.mcp.session_registry_cache` — Psr16Cache over cache.system by default — vendor/shopware/core/Framework/DependencyInjection/mcp.php:105
- confirmed `mcp.server.admin.session.store` — per-server session store service consumed by core — vendor/shopware/core/Framework/DependencyInjection/mcp.php:117
- confirmed `mcp_admin_api` — time_backoff, 300/60s and 1000/10min — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:385
- confirmed `mcp_store_api` — time_backoff, 120/60s and 600/10min — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:396
- confirmed `mcp_toolset_session.cleanup` — scheduled task name — vendor/shopware/core/Framework/Mcp/ScheduledTask/McpToolsetSessionCleanupTask.php:16
- confirmed `debug:mcp:native` — bundle command renamed by McpDebugCommandCompilerPass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpDebugCommandCompilerPass.php:27
- absent `StoreApiMcpServerBuilderCompilerPass` — removed in 6.7.15.0, no longer in the code
