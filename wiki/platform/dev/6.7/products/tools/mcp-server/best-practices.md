---
id: platform/dev/6.7/products/tools/mcp-server/best-practices.md
title: Best Practices
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/best-practices.html
sourceHash: ea6b134da823ca71a1a0308a66ef05f09947a56a
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp best practices", "McpToolResponse", "McpToolRequires", "McpToolDependsOn", "McpEntityIncludes", "#[McpTool]", "dryRun", "shopware-order-state", "shopware-entity-search", "shopware-entity-aggregate", "shopware-context", "tool description routing", "mcp allowlist", "mcp resources"]
summary: "Design rules for MCP tools, resources and prompts: dryRun defaults, flat params, McpToolResponse, McpToolRequires, routing descriptions, allowlists."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md"]
---
## What it is

Design guidance, distilled from building Shopware's own MCP server, for any MCP extension (plugin, bundle or app) exposing Shopware to AI agents: shaping tools, resources, prompts, ACL handling and responses. Concepts: [MCP concepts](platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md).

## When to use

When writing or reviewing custom MCP tools/resources/prompts, choosing allowlists for an integration, or debugging why an agent picks the wrong tool.

## Key steps / config

**Tools**
- Design for outcomes: if one user intent needs 3+ tool calls, add an outcome tool (e.g. `shopware-order-state` wraps order, transaction and delivery transitions using `orderNumber` plus per-entity action parameters). Keep the generic `shopware-entity-search`, `shopware-entity-upsert`, `shopware-entity-delete` for the rest.
- Flatten parameters to strings/numbers/booleans; accept unavoidable complex input (e.g. criteria) as a JSON string.
- Default every write tool to `dryRun=true`; the agent calls again with `dryRun=false` to persist.
- Validate enum/state/event names before writing; multiplex related operations with an `action` parameter.
- Extend `McpToolResponse` for uniform envelopes: `{"success": true, "data": ..., "_meta": ...}` / `{"success": false, "error": "..."}`. Responses over 100 KB are cached per session and replaced by `_meta.resourceUri` = `shopware://tool-result/{uuid}` (fetch via `resources/read`) plus `responseSize` and `note`; above 20 KB `_meta.responseSize` is added as a hint.
- Use the `McpEntityIncludes` trait for DAL entity output; keep aggregations (`shopware-entity-aggregate`) apart from records (`shopware-entity-search`); paginate with `limit`/`page`.
- The `description` of `#[McpTool]` drives routing: lead with user trigger phrases, contrast similar tools explicitly, name the use cases users say, declare real prerequisites with `#[McpToolDependsOn]` instead of prose, give rarely-provided parameters a `''`/`null` default, and regression-test descriptions with a prompt fixture set against an LLM.
- Attributes are read at container compile time: after changing a description run `bin/console cache:clear`, then check `bin/console debug:mcp` or `tools/list`.
- Put cross-tool disambiguation rules into the `shopware-context` prompt (or your own `#[McpPrompt]`); it is fetched fresh each session. Write actionable error messages.

**Resources** — small, read-only, stable URIs such as `shopware://entities`, `shopware://state-machines`, `shopware://sales-channels`, `shopware://business-events`. Prefer a tool when you need a `description`, extra parameters, writes or dynamic queries.

**Prompts** — one coherent prompt: domain model, tools by purpose, step-by-step workflow recipes, error recovery, available resources.

**ACL**
```php
#[McpToolRequires('system_config:read')]
#[McpToolRequires(entityParam: 'entity', operations: ['read'])]
```
`#[McpToolRequires]` is declarative only (Admin UI coverage warnings, `debug:mcp`); enforce with `$this->requirePrivilege($context, '...')` inside `__invoke()`, returning e.g. `"Missing privilege: order:read"`. Storefront tools use `SalesChannelContext` (no Admin ACL, but a valid sales channel ID).

**Allowlists** — one integration per persona/job with a scoped tool allowlist: **Settings → Integrations → Edit MCP Allowlist** and **Settings → Users & Permissions → [user] → MCP tool allowlist**. Each tool schema costs roughly 550–1,400 tokens of context.

## Essential identifiers

- `McpToolResponse`, `McpToolResponse::requirePrivilege()`, `McpEntityIncludes`
- `#[McpTool]`, `#[McpPrompt]`, `#[McpToolRequires]`, `#[McpToolDependsOn]`
- `shopware-order-state`, `shopware-entity-aggregate`, `shopware-context`
- `shopware://tool-result/{uuid}`

## Gotchas

- Tool results with user-generated content (order notes, customer names) can carry instruction-like text that misleads the agent; ACL and allowlists limit impact but do not prevent it. Prefer read-only integrations for such workflows.
- Deferred large results still cost tokens when fetched, and some clients do not follow up.
- `_meta.total` of the search tool is pagination metadata, not a reporting count.

## Version notes

- The source describes progressive discovery (a fresh session advertising three meta-tools, toolsets enabled on demand), allowlist modals grouped by tool group, and a `#[McpToolGroup]` attribute. None of these exist in the installed 6.7.13.0 (the MCP configuration page dates progressive discovery to 6.7.14.0); there `tools/list` advertises every allowed tool.

## Code check (6.7.13.0)
- absent `McpToolGroup` — attribute not present in 6.7.13.0; only McpToolDependsOn and McpToolRequires exist in Framework/Mcp/Attribute
- confirmed `McpToolResponse` — abstract base class for tool envelopes — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `McpToolResponse::MAX_RESPONSE_SIZE` — 100_000 bytes before deferring to a resource — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `McpToolResponse::RESPONSE_SIZE_HINT_THRESHOLD` — 20_000 bytes adds responseSize hint — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:40
- confirmed `McpToolResponse::requirePrivilege()` — protected runtime ACL check — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- confirmed `McpToolRequires` — informational, privilege or entityParam+operations — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:31
- confirmed `McpToolDependsOn` — repeatable class attribute declaring tool dependencies — vendor/shopware/core/Framework/Mcp/Attribute/McpToolDependsOn.php:28
- confirmed `McpEntityIncludes` — trait for compact entity output — vendor/shopware/core/Framework/Mcp/Tool/McpEntityIncludes.php:26
- confirmed `dryRun` — core upsert tool defaults bool $dryRun = true — vendor/shopware/core/Framework/Mcp/Tool/EntityUpsertTool.php:32
- confirmed `shopware-order-state` — core outcome tool — vendor/shopware/core/Framework/Mcp/Tool/OrderStateTool.php:26
