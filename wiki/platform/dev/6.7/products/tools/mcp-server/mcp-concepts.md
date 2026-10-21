---
id: platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md
title: MCP Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/mcp-concepts.html
sourceHash: 1b74fc8b814c4d44aa3775d4749082ce37cce993
codeCheckedAgainst: "6.7.15.1"
keywords: ["model context protocol", "mcp", "mcp tool", "mcp resource", "mcp prompt", "shopware-entity-search", "shopware-entity-upsert", "shopware-order-state", "shopware://entities", "shopware://state-machines", "shopware-context", "dryRun", "ai agent"]
summary: "MCP building blocks in Shopware: tools (agent-invoked actions), resources (read-only URIs like shopware://entities), prompts (shopware-context)."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/products/tools/mcp-server/getting-started.md
  - platform/dev/6.7/products/tools/mcp-server/tools-reference.md
  - platform/dev/6.7/products/tools/mcp-server/best-practices.md
  - platform/dev/6.7/guides/plugins/plugins/mcp-server.md
---
## What it is

The Model Context Protocol (MCP) defines three building blocks a server can expose: **tools**, **resources**, and **prompts**. This page explains what each one is, when to choose it, and how Shopware's MCP server uses all three together. The full specification lives at modelcontextprotocol.io.

## When to use

Read this before connecting an AI client to Shopware's MCP server or before designing your own MCP capability in a plugin, to decide whether a capability should be a tool, a resource, or a prompt.

## Key steps / config

**Tools** — callable functions the AI agent invokes to act or retrieve data. The agent reads the name and description and decides when to call it; tools take typed parameters and return structured results. Choose a tool when:

- the agent must decide when/whether to call it;
- the operation needs parameters beyond a simple identifier;
- it writes, changes state, or runs dynamic queries;
- the description should steer agent behavior (e.g. "use this before building search criteria").

Shopware examples: `shopware-entity-search`, `shopware-entity-upsert`, `shopware-order-state`.

**Resources** — read-only data endpoints identified by a URI, fetched without decision-making; they carry no description to guide the agent.

```text
shopware://entities          → list of all entity names
shopware://sales-channels    → sales channels with IDs and domains
shopware://state-machines    → states and valid transitions per machine
```

Choose a resource when the data is read-only at a stable URI, needed often and unchanged mid-session (entity names, currencies, languages), should load without consuming tool-call budget, and is small enough for context. For large or dynamic data use a tool with filter parameters. Further examples: `shopware://business-events`, `shopware://flow-actions`.

**Prompts** — named instruction templates, user-triggered (the client requests a prompt by name and receives system instructions). Use them for step-by-step sequences, domain concepts (entity relationships, state machine semantics), and pointers to available resources. Shopware example: `shopware-context` explains the DAL criteria format, core entity relationships, tools by purpose, and error recovery.

| | Tool | Resource | Prompt |
|---|---|---|---|
| Invocation | Agent decides | Client/agent fetches | User selects in client |
| Parameters | Typed, named | URI only | Optional arguments |
| Can write data | Yes | No | No |
| Description guides agent | Yes | No | Yes |
| Counts as tool call | Yes | No | No |

**Working together** — resources supply reference data, prompts explain how to combine tools, tools do the work. Shipping an order:

1. Read `shopware://state-machines` to confirm `ship` is a valid delivery action.
2. Call `shopware-order-state` with `deliveryAction: "ship"` and `dryRun: true` to preview.
3. Call again with `dryRun: false` to execute.

## Essential identifiers

- Tools: `shopware-entity-search`, `shopware-entity-upsert`, `shopware-order-state`
- Resources: `shopware://entities`, `shopware://sales-channels`, `shopware://state-machines`, `shopware://business-events`, `shopware://flow-actions`
- Prompt: `shopware-context`
- Order tool parameters: `deliveryAction`, `dryRun`

## Code check (6.7.15.1)
- confirmed `shopware-entity-search` — tool name in `#[McpTool]` — vendor/shopware/core/Framework/Mcp/Tool/EntitySearchTool.php:22
- confirmed `shopware-entity-upsert` — tool name in `#[McpTool]` — vendor/shopware/core/Framework/Mcp/Tool/EntityUpsertTool.php:19
- confirmed `shopware-order-state` — tool name in `#[McpTool]` — vendor/shopware/core/Framework/Mcp/Tool/OrderStateTool.php:29
- confirmed `shopware://entities` — `#[McpResource]` URI — vendor/shopware/core/Framework/Mcp/Resource/EntityListResource.php:15
- confirmed `shopware://sales-channels` — `#[McpResource]` URI — vendor/shopware/core/Framework/Mcp/Resource/SalesChannelListResource.php:18
- confirmed `shopware://state-machines` — `#[McpResource]` URI — vendor/shopware/core/Framework/Mcp/Resource/StateMachineResource.php:18
- confirmed `shopware://business-events` — `#[McpResource]` URI — vendor/shopware/core/Framework/Mcp/Resource/BusinessEventsResource.php:16
- confirmed `shopware://flow-actions` — `#[McpResource]` URI — vendor/shopware/core/Framework/Mcp/Resource/FlowActionsResource.php:16
- confirmed `shopware-context` — prompt name in `#[McpPrompt]` — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:18
- confirmed `SKIP_TRIGGER_FLOW` — dry-run context state used by write tools — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:180
