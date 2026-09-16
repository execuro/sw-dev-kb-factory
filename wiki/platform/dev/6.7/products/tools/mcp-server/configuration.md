---
id: platform/dev/6.7/products/tools/mcp-server/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/configuration.html
sourceHash: 604d265f39b0d35b130f2e00eb9068d78cf99b0a
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.mcp", "allowed_tools", "app_tool_timeout", "MCP_SERVER", "sw-app-user-id", "debug:mcp", "mcp_admin_api", "mcp_store_api", "pagination_limit", "mcp.session.store", "mcp allowlist", "mcp session redis", "mcp rate limit", "mcp configuration"]
summary: "shopware.mcp config (allowed_tools, app_tool_timeout), MCP_SERVER flag, per-principal allowlists, sw-app-user-id, session store, debug:mcp, rate limits."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md"]
---
## What it is

Configuration reference for the Shopware MCP server: enabling it, the `shopware.mcp` config keys, per-principal allowlists, delegated user calls, the `symfony/mcp-bundle` settings (pagination, sessions), ACL setup, the `debug:mcp` command and rate limits. The source describes 6.7.14.0+; this article follows the installed 6.7.13.0 code where they differ.

## When to use

Enabling or restricting MCP in an installation, wiring an app/Copilot that calls MCP on behalf of a user, running MCP on multiple servers, or debugging missing tools.

## Key steps / config

**Enable (6.7.11.0–6.7.13.x, incl. installed 6.7.13.0):** set `MCP_SERVER=1` in `.env`. Without it `/api/_mcp` and `/store-api/_mcp` answer 404.

**`shopware.mcp`** (e.g. `config/packages/shopware.yaml`) — these two keys are the whole section:

```yaml
shopware:
    mcp:
        allowed_tools: []       # list of strings, default [] = all tools; compile-time, installation-wide
        app_tool_timeout: 10    # integer seconds for app webhook tool calls, min 1
```

A non-empty `allowed_tools` removes every other tool service at compile time; the per-integration and per-user allowlists in the Administration are the day-to-day controls.

**Per-principal allowlist resolution:**

| Auth mode | Allowlist source |
|---|---|
| Integration access key (`SWIA...`) | integration: **Settings → Integrations → Edit MCP Allowlist** |
| User access key (`SWUA...`) | user: **Settings → Users & Permissions → [user] → MCP tool allowlist** |
| Bearer JWT, password/refresh grant | authenticated user |
| Bearer JWT, client_credentials | integration |
| Integration + `sw-app-user-id` | intersection of integration and user allowlists |

Per key (`tools`, `resources`, `prompts`): `null` = all allowed, JSON array = only listed names, `[]` = deny that type. Admin users (`admin = true`) always bypass the allowlist; integrations created with `--admin` bypass ACL but not their allowlist.

**Delegated calls:** send `sw-access-key`, `sw-secret-access-key` and `sw-app-user-id: <user-uuid>` (from `Shopware.Store.get('session').currentUser.id` or `GET /api/_info/me` → `data.id`). Invalid/missing UUID → integration allowlist only. Admin user side counts as `null`.

**MCP bundle:** Shopware ships `config/packages/mcp.php` (path `/api/_mcp`, server `instructions`); no changes needed normally. Page size is the bundle's `pagination_limit` option, set on the `mcp` extension:

```yaml
# config/packages/mcp.yaml
mcp:
    pagination_limit: 100
```

**Sessions in production (multi-server):** override `mcp.session.store` with a Redis-backed PSR-16 store:

```yaml
services:
    mcp.session.cache_psr16:
        class: Symfony\Component\Cache\Psr16Cache
        arguments: ['@cache.mcp_sessions']
    mcp.session.store:
        class: Mcp\Server\Session\Psr16SessionStore
        arguments: ['@mcp.session.cache_psr16', 3600]
```

Plus `framework.cache.pools.cache.mcp_sessions` with `adapter: cache.adapter.redis_tag_aware`, `provider: '<redis-dsn>'` (reuse Shopware's existing Redis/Valkey DSN), `default_lifetime: 3600`.

**ACL:** create a role with only needed privileges, assign it to the integration (omit `--admin`), then restrict the MCP allowlist. The role detail page offers **Show MCP tool requirements** / **Grant all missing**; the allowlist modal warns on privilege gaps.

**Debugging:** `bin/console debug:mcp` (Admin API server only), filters `--tools`, `--prompts`, `--resources`, a capability name (`bin/console debug:mcp shopware-entity-search`), or `--integration=SWIA...`. In 6.7.13.0 the tool table columns are Name, Source, Dependencies, Privileges.

**Rate limits** (`shopware.api.rate_limiter`, policy `time_backoff`, reset `1 hours`): `mcp_admin_api` 300/60 s and 1000/10 min; `mcp_store_api` 120/60 s and 600/10 min. Exceeding returns HTTP 429, no `Retry-After` header.

## Essential identifiers

- `shopware.mcp.allowed_tools`, `shopware.mcp.app_tool_timeout`
- `MCP_SERVER`, `sw-app-user-id`
- `mcp.pagination_limit`, `mcp.session.store`, `cache.mcp_sessions`
- `bin/console debug:mcp`, service tag `shopware.mcp.tool`
- `mcp_admin_api`, `mcp_store_api`

## Gotchas

- A tool missing from `debug:mcp` is missing from the endpoint: plugin inactive, missing `shopware.mcp.tool` tag, `#[McpTool]` placed on `__invoke()` instead of the class, or unreachable app webhook URL.
- Store the default file sessions (`%kernel.cache_dir%/mcp-sessions/`) only on one machine; `memory` and `cache` stores do not work multi-worker, `framework` needs a PHP session (Admin API is stateless).
- Cursors are opaque and per principal; bad cursors yield JSON-RPC `-32602` `Invalid value for pagination parameter "cursor"`. `resources/templates/list` is not allowlist-filtered.
- If you set a non-empty `allowed_tools` on 6.7.14.0+, keep the discovery tools in it or clients cannot find other tools.

## Version notes

- 6.7.14.0+ (source): `MCP_SERVER` removed (delete it from `.env`), server always on; progressive discovery with `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`, toolsets stored in `mcp_toolset_session` (cleaned by the daily `mcp_toolset_session.cleanup` task, ended via `DELETE /api/_mcp`), a **Group** column in `debug:mcp`, and server `instructions` pointing to `shopware-tool-search`. None of this exists in 6.7.13.0, where `tools/list` advertises every allowed tool.
- MCP classes stay experimental until 6.8.0.

## Code check (6.7.13.0)
- confirmed `allowed_tools` — array node, default [] — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1621
- confirmed `app_tool_timeout` — integer, default 10, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1626
- confirmed `MCP_SERVER` — flag still present in 6.7.13.0, default false; endpoint 404 when inactive — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- absent `shopware-tool-search` — progressive discovery tools are not in 6.7.13.0
- absent `mcp_toolset_session` — no toolset session table or cleanup task in 6.7.13.0
- corrected `debug:mcp` — docs: five columns incl. Group; 6.7.13.0 renders Name, Source, Dependencies, Privileges — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:28
- confirmed `sw-app-user-id` — integration + user allowlist intersection — vendor/shopware/core/Framework/Mcp/AllowList/McpAllowlistProvider.php:21
- confirmed `mcp.pagination_limit` — bundle parameter passed to setPaginationLimit — vendor/shopware/core/Framework/DependencyInjection/mcp.php:152
- confirmed `mcp_admin_api` — time_backoff, 300/60 s and 1000/10 min — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:355
- confirmed `mcp_store_api` — time_backoff, 120/60 s and 600/10 min — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:366
