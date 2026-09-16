---
id: platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md
title: MCP Concepts
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/mcp-concepts.html
sourceHash: 1b74fc8b814c4d44aa3775d4749082ce37cce993
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp tools", "mcp resources", "mcp prompts", "shopware-context", "shopware://entities", "shopware://state-machines", "shopware://business-events", "shopware-order-state", "tool vs resource vs prompt", "model context protocol", "dryRun", "capability types"]
summary: "Shopware MCP building blocks: tools (agent-called actions), resources (read-only URI data), prompts (instruction templates); when to use each."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/getting-started.md", "platform/dev/6.7/products/tools/mcp-server/tools-reference.md", "platform/dev/6.7/products/tools/mcp-server/best-practices.md", "platform/dev/6.7/guides/plugins/plugins/mcp-server.md"]
---
## What it is

Explains the three capability types an MCP server exposes — tools, resources and prompts — how Shopware's MCP server uses each, and when to pick which when building extensions.

## When to use

Before using Shopware's MCP server or deciding whether a new extension capability should be a tool, a resource or a prompt.

## Key steps / config

**Tools** — callable functions the agent invokes to act or fetch data. The agent reads name and description and decides when to call; tools take typed parameters and return structured results. Use a tool when the agent must decide whether to call it, parameters go beyond a simple identifier, the operation writes/changes state or runs dynamic queries, or the description should steer behaviour. Core examples: `shopware-entity-search`, `shopware-entity-upsert`, `shopware-order-state`.

**Resources** — read-only data at a stable URI, fetched without decision-making and without consuming tool-call budget. Use for small, frequently needed reference data that does not change mid-session (entity names, currencies, languages); use a filtered tool for large or dynamic data. Core examples:

```text
shopware://entities        → all entity names
shopware://sales-channels  → sales channels with IDs and domains
shopware://state-machines  → states and valid transitions
shopware://business-events, shopware://flow-actions
```

**Prompts** — named instruction templates, user-triggered (the client requests one by name). Use for step-by-step task sequences, domain concepts (entity relationships, state machine semantics) and pointing to available resources. Core example: `shopware-context` (DAL criteria format, entity relationships, tools by purpose, error recovery).

| | Tool | Resource | Prompt |
|---|---|---|---|
| Invocation | Agent decides | Client/agent fetches | User selects |
| Parameters | Typed, named | URI only | Optional arguments |
| Writes data | Yes | No | No |
| Counts as tool call | Yes | No | No |
| Best for | Actions, parameterised queries | Reference lookups | Instructions, workflow recipes |

**Working together** — to ship an order: read `shopware://state-machines` to confirm `ship` is a valid delivery action; call `shopware-order-state` with `deliveryAction: "ship"` and `dryRun: true` to preview; call again with `dryRun: false` to execute.

## Essential identifiers

- `shopware-entity-search`, `shopware-entity-upsert`, `shopware-order-state`
- `shopware://entities`, `shopware://sales-channels`, `shopware://state-machines`, `shopware://business-events`, `shopware://flow-actions`
- `shopware-context`

## Gotchas

- The docs say resources have no description to guide the agent; in the installed code every core `#[McpResource]` declares a `description` argument.
- `shopware-order-state` defaults to `dryRun` true; pass `false` explicitly to execute.

## Code check (6.7.13.0)
- confirmed `shopware-context` — core prompt — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:16
- confirmed `shopware://entities` — entity list resource — vendor/shopware/core/Framework/Mcp/Resource/EntityListResource.php:13
- confirmed `shopware://sales-channels` — sales channel resource — vendor/shopware/core/Framework/Mcp/Resource/SalesChannelListResource.php:16
- confirmed `shopware://state-machines` — states and transitions resource — vendor/shopware/core/Framework/Mcp/Resource/StateMachineResource.php:16
- confirmed `shopware://business-events` — business events resource — vendor/shopware/core/Framework/Mcp/Resource/BusinessEventsResource.php:14
- confirmed `shopware://flow-actions` — flow actions resource — vendor/shopware/core/Framework/Mcp/Resource/FlowActionsResource.php:14
- confirmed `shopware-entity-upsert` — core write tool — vendor/shopware/core/Framework/Mcp/Tool/EntityUpsertTool.php:16
- confirmed `shopware-order-state` — deliveryAction and dryRun default true — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:40
- corrected `McpResource` — docs: resources have no description; the attribute carries a `description` — vendor/shopware/core/Framework/Mcp/Resource/SalesChannelListResource.php:16
