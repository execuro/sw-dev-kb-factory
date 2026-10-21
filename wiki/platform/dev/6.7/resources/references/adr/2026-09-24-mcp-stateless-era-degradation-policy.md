---
id: platform/dev/6.7/resources/references/adr/2026-09-24-mcp-stateless-era-degradation-policy.md
title: MCP behaviour on the stateless 2026-07-28 protocol era
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-24-mcp-stateless-era-degradation-policy.html
sourceHash: 5707f24d8d3eb66d412e3a0d76e70a88cee759de
codeCheckedAgainst: "6.7.15.1"
keywords: ["Mcp-Session-Id", "withoutModernEra", "McpServerBuilderCompilerPass", "?toolsets=", "shopware-toolset-enable", "mcp_tool_result_cache", "mcp_toolset_session", "McpToolResponse", "subscriptions/listen", "server/discover", "stateless era", "handshake era", "mcp protocol 2026-07-28", "resource_link"]
summary: "ADR: on the stateless MCP 2026-07-28 era, Shopware derives everything from the request (URL ?toolsets=, credentials, ACL), never from Mcp-Session-Id state."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-24, area framework) defining how Shopware's two MCP endpoints, `/api/_mcp` and `/store-api/_mcp`, must behave once the stateless MCP protocol era (revision 2026-07-28 and later) is switched on, and which session-based features must be redesigned first.

- **Handshake era** (revisions up to 2025-11-25, served today): `initialize` → server returns `Mcp-Session-Id` header → `notifications/initialized` → every request carries the session id → HTTP `DELETE` discards state.
- **Stateless era**: no `initialize`, no session id; clients call `server/discover`; each request carries protocol version, client capabilities and log level in `_meta`; no `DELETE` (a server answers `405`); any request may hit a fresh instance; push notifications go through a `subscriptions/listen` stream.

`mcp/sdk` 0.8 serves both eras on the same URL; the client chooses. Shopware currently disables the stateless ("modern") era on both endpoints in `McpServerBuilderCompilerPass`.

## When to use

- You build an MCP tool, prompt or resource for Shopware and need to know what state you may rely on between requests.
- You configure an MCP client and choose how to select toolsets.
- You operate a Shopware MCP setup and plan worker capacity and shared secrets/caches.

## Key steps / config

**Rule for both eras and both endpoints:** what a request can see and do is derived only from the request — the URL (e.g. `?toolsets=order,media`), the credentials, and the ACL/allowlist of the authenticated principal — never from server-kept state.

Session-dependent features and the decided direction:

| Feature (today, handshake era) | Stateless era decision |
|---|---|
| `shopware-toolset-enable` stores toolsets in `mcp_toolset_session` keyed by session id | Use the URL: `/api/_mcp?toolsets=order,media` or `?toolsets=all`. The tool keeps working for handshake clients; on the stateless era its error tells the client to reconnect with `?toolsets=` (sent as `isError`), or the tool is not offered |
| `McpListChangedNotifier` / `McpSessionRegistry` queue `list_changed` per session | A version per list stored in the database (shopware/shopware#21295) feeds both eras; stateless clients read the SDK notification bus via `subscriptions/listen` |
| Results above 100 KB stored in `mcp_tool_result_cache` under the session id, pointer `shopware://tool-result/<id>`, served by `ToolResultResource` to the same session | Pointer carries a short-lived signed token identifying the stored result and its principal; returned as an MCP `resource_link` content block; removed by age via a scheduled task |
| `McpSessionCleanupSubscriber` cleans up on `DELETE`; `McpSessionIdValidator` rejects malformed headers | Both stay for handshake clients; nothing on the stateless era may depend on them |

Principal for stored results: integration and user on the Admin endpoint; sales channel plus `sw-context-token` on the Store endpoint. `sw-access-key` alone is not a principal. The OAuth `jti` is deliberately not used. Clients on revisions 2024-11-05 or 2025-03-26 get the pointer in the text (as `_meta.resourceUri` today), because `resource_link` and `structuredContent` exist only since 2025-06-18. The Store endpoint gets its own tool-result resource authorized by the same signed token.

Multi-step requests: the SDK keeps intermediate state in a signed `request_state` value that needs a secret shared by all workers; it must be configured before features built on it are offered. Such features add to the existing `dryRun` default.

Rollout: both endpoints serve both eras from one URL; no stateless-only switch. The stateless era is enabled only after the above is implemented and tested against both eras.

## Essential identifiers

- Endpoints `/api/_mcp`, `/store-api/_mcp`; query `?toolsets=`
- `McpServerBuilderCompilerPass`, `McpToolResponse`, `ToolResultResource`
- `shopware-toolset-enable`, tables `mcp_toolset_session`, `mcp_tool_result_cache`
- `McpListChangedNotifier`, `McpSessionRegistry`, `McpSessionCleanupSubscriber`, `McpSessionIdValidator`
- Header `Mcp-Session-Id`; protocol methods `server/discover`, `subscriptions/listen`
- `Builder::setSubscriptionLifetime()` (SDK)

## Gotchas

- None of the session features fail loudly on the stateless era: the client looks connected but sees wrong tools, misses updates, or receives multi-megabyte inline payloads (`McpToolResponse` returns the full result inline without a session id).
- Extensions must not keep state keyed by `Mcp-Session-Id`; key it by the principal or pass it in the request.
- Stored results become readable by any agent using the same integration (same permissions). On the Store endpoint, login/logout changes the principal, so earlier results become unreadable; a client without `sw-context-token` gets results inline.
- Operators: each open `subscriptions/listen` stream occupies a PHP worker (in `mcp/sdk` 0.8.1 it polls every 250 ms and ends after 30 s, then the client reconnects) — account for it in `pm.max_children`. Multi-server setups may need a shared cache pool (e.g. Redis) for the notification stream.

## Version notes

- Since 6.7.14.0 `shopware-toolset-enable` returns an error naming the missing session when no session id is present; it does not yet point to `?toolsets=`.
- In 6.7.15.1 the stateless era is still pinned off; result cache rows are still keyed and read by session id.

## Code check (6.7.15.1)
- confirmed `McpServerBuilderCompilerPass::pinHandshakeEra()` — adds `withoutModernEra` to every server builder — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:107
- confirmed `Mcp-Session-Id` — toolset enable errors when the header is empty — vendor/shopware/core/Framework/Mcp/Tool/ToolsetEnableTool.php:39
- confirmed `shopware-toolset-enable` — tool name constant — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:16
- confirmed `McpToolResponse` — 100_000-byte inline limit, stores by session id or falls back inline — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `shopware://tool-result/` — pointer URI built from stored result id — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:88
- confirmed `mcp_tool_result_cache` — read filtered by `session_id` — vendor/shopware/core/Framework/Mcp/ToolResultCacheStorage.php:56
- confirmed `mcp_toolset_session` — table keyed by `session_id` — vendor/shopware/core/Migration/V6_7/Migration1783073015McpToolsetSession.php:23
- confirmed `McpListChangedNotifier` — session-based list_changed notifier — vendor/shopware/core/Framework/Mcp/Notification/McpListChangedNotifier.php:22
- confirmed `McpSessionCleanupSubscriber` — DELETE cleanup subscriber — vendor/shopware/core/Framework/Mcp/Session/McpSessionCleanupSubscriber.php:22
- unverified `Builder::setSubscriptionLifetime()` — mcp/sdk, out of scope
