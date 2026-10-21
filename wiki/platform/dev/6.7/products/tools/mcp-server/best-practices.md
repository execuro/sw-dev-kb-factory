---
id: platform/dev/6.7/products/tools/mcp-server/best-practices.md
title: Best Practices
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/best-practices.html
sourceHash: ea6b134da823ca71a1a0308a66ef05f09947a56a
codeCheckedAgainst: "6.7.15.1"
keywords: ["McpToolResponse", "#[McpTool]", "#[McpToolRequires]", "#[McpToolDependsOn]", "#[McpToolGroup]", "McpEntityIncludes", "requirePrivilege", "dryRun", "shopware-entity-aggregate", "shopware-entity-search", "shopware-context", "tool description routing", "mcp tool design", "prompt injection"]
summary: Design rules for Shopware MCP tools, resources and prompts - outcome tools, dryRun defaults, compact McpToolResponse output, ACL.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md"]
---
## What it is

Lessons from building Shopware's MCP server, applicable to any MCP extension (plugin, bundle or app) that exposes a complex domain to AI agents: how to design [tools, resources and prompts](platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md), keep responses compact, write descriptions that route correctly, and enforce ACL.

## When to use

When designing or reviewing custom MCP tools, resources or prompts for Shopware, or when an agent picks the wrong tool, overloads its context, or writes broken data.

## Key steps / config

Tools:
- Design for outcomes: wrap multi-step workflows into one tool with flattened parameters (e.g. `shopware-order-state` changes order, transaction and delivery state in one call with `orderNumber`). Three or more calls for one user intent signals a candidate. Keep the generic `shopware-entity-search`, `shopware-entity-upsert`, `shopware-entity-delete` tools for the remaining cases.
- Flatten parameters to strings, numbers, booleans; accept unavoidable complex input (search criteria) as a JSON string parsed server-side.
- All write tools default to `dryRun=true`; the agent calls again with `dryRun=false` to persist.
- Validate enum/registry/state-machine names before writing — the database may silently accept invalid values.
- Keep allowlists and toolsets focused: one integration per persona with a scoped allowlist (Settings → Integrations → Edit MCP Allowlist; per user under Settings → Users & Permissions → user → MCP tool allowlist). Each tool schema costs roughly 550–1,400 tokens. Reduce tool count with an `action` parameter (e.g. `shopware-theme-config` with `action: "get" | "update"`), resources for static data, and `#[McpToolGroup]` for cohesive groups.
- Responses: extend `McpToolResponse` for the envelopes `{"success": true, "data": ..., "_meta": ...}` / `{"success": false, "error": "..."}`. Separate rows from aggregations (`shopware-entity-aggregate` vs `shopware-entity-search`), use the `McpEntityIncludes` trait with `JsonEntityEncoder`, paginate with `limit`/`page`.
- Descriptions on `#[McpTool]` are the routing signal: lead with user trigger phrases, use negative phrasing to break ties, name the use cases users say, declare real prerequisites with `#[McpToolDependsOn]` instead of prose, give rarely-supplied parameters a `''`/`null` default, and regression-test descriptions with an LLM fixture set.
- Use the `shopware-context` prompt (or your own `#[McpPrompt]`) as the disambiguation override layer; it is fetched fresh each session, unlike descriptions.
- Write actionable errors that tell the agent how to recover.

Resources: use them for small, stable reference data (`shopware://entities`, `shopware://state-machines`, `shopware://sales-channels`, `shopware://business-events`); prefer a tool when you need a description, parameters, writes or dynamic queries.

Prompts: provide one coherent context prompt (domain model, tools by purpose, step-by-step workflow recipes, error recovery, available resources) rather than many fragments.

ACL:

```php
#[McpToolRequires('system_config:read')]
#[McpToolRequires(entityParam: 'entity', operations: ['read'])]
// inside __invoke(): runtime enforcement
$this->requirePrivilege($context, 'system_config:read');
```

Storefront tools (cart, checkout, storefront search) use `SalesChannelContext`, not the Admin `Context`, need a valid sales channel ID but no Admin ACL check; keep them in separate plugins such as `SwagMcpMerchantTools`.

## Essential identifiers

- `McpToolResponse`, `McpEntityIncludes`, `JsonEntityEncoder`
- Attributes: `#[McpTool]`, `#[McpToolRequires]`, `#[McpToolDependsOn]`, `#[McpToolGroup]`, `#[McpPrompt]`
- `requirePrivilege()`, error text `Missing privilege: order:read`
- Tools: `shopware-order-state`, `shopware-entity-search`, `shopware-entity-aggregate`, `shopware-entity-schema`, `shopware-theme-config`
- Resource URIs: `shopware://tool-result/{uuid}`, `shopware://entities`, `shopware://state-machines`
- `bin/console debug:mcp`, `bin/console cache:clear`

## Gotchas

- Responses over 100 KB are not inlined: the payload goes to a session-scoped cache and `_meta.resourceUri` holds `shopware://tool-result/{uuid}` (plus `responseSize`, `note`), fetched via `resources/read`. Above 20 KB, `_meta.responseSize` is added as a hint. Some clients do not follow up automatically.
- `#[McpTool]` descriptions are compiled into the DI container — run `bin/console cache:clear` before checking `debug:mcp` or `tools/list`.
- `#[McpToolRequires]` is declarative only (Admin UI warnings, `debug:mcp`); still call `requirePrivilege()` in `__invoke()`.
- Injection via tool results: user-generated content (order notes, customer names, product descriptions) can carry text that tries to redirect the agent. ACL and allowlists limit the blast radius but do not prevent it; prefer read-only integrations for workflows exposing customer-supplied data.
- The search tool's `_meta.total` is pagination metadata, not a reporting count — route counting questions to `shopware-entity-aggregate`.

## Code check (6.7.15.1)
- confirmed `McpToolResponse` — abstract response envelope base for tools — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `McpToolResponse::MAX_RESPONSE_SIZE` — 100_000 bytes inline cap — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `McpToolResponse::RESPONSE_SIZE_HINT_THRESHOLD` — 20_000 bytes adds responseSize — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:40
- confirmed `shopware://tool-result/` — oversized result URI in _meta.resourceUri — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:88
- confirmed `McpToolResponse::requirePrivilege()` — runtime ACL check, error prefix "Missing privilege:" — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- confirmed `McpToolRequires` — repeatable, informational only, static or entityParam/operations form — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:31
- confirmed `McpToolGroup` — class/method attribute assigning a tool group — vendor/shopware/core/Framework/Mcp/Attribute/McpToolGroup.php:12
- confirmed `McpEntityIncludes` — trait for compact entity responses — vendor/shopware/core/Framework/Mcp/Tool/McpEntityIncludes.php:26
- confirmed `shopware-order-state` — outcome tool name; dryRun defaults to true — vendor/shopware/core/Framework/Mcp/Tool/OrderStateTool.php:29
- confirmed `shopware-theme-config` — Storefront tool — vendor/shopware/storefront/Mcp/Tool/ThemeConfigTool.php:26
