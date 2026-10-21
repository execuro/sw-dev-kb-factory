---
id: platform/dev/6.7/resources/references/adr/2026-09-24-mcp-tool-result-envelope.md
title: MCP tool results use an internal result object and one central output mapper
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-24-mcp-tool-result-envelope.html
sourceHash: c1969570d476f085ac89998c023cc09561e6570f
codeCheckedAgainst: "6.7.15.1"
keywords: ["McpToolResponse", "McpToolResponseRule", "structuredContent", "isError", "resource_link", "outputSchema", "_meta.resourceUri", "mcp_tool_result_cache", "v6.8.0.0", "mcp tool result", "output mapper", "tool response envelope", "adr"]
summary: "ADR: MCP tools return a result object that one core mapper renders to structuredContent/isError/resource_link; legacy envelope ends in 6.8"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-24) that changes the MCP tool contract: tools stop building the wire format themselves and instead describe a Shopware result; a single output mapper in core renders it to the MCP result shape (`content`, `structuredContent`, `isError`, `resource_link`) or to the legacy envelope, depending on phase, the `v6.8.0.0` feature flag and the negotiated protocol revision.

## When to use

- Writing or maintaining an MCP tool (core, plugin, bundle) that extends `McpToolResponse`, or an app MCP tool returning `{success, data}` from a webhook or app script.
- Building a client, agent or eval that reads Shopware tool output and needs to know how `success`/`data` map to `structuredContent`/`isError` over time.

## Key steps / config

Legacy envelope built today by `McpToolResponse::success()` / `::error()` (wrapped by the SDK into one text block):

```json
{"success": true, "data": {"...": "..."}, "_meta": {"responseSize": 24000}}
{"success": false, "error": "Missing privilege: product:read"}
```

Problems named by the ADR: failures travel as successful MCP results (no `isError`), no `structuredContent`/`outputSchema`, large-result pointers use the Shopware-specific `_meta.resourceUri` instead of `resource_link`, and every tool owns the wire format.

Decision (option 4): tools return a result object; one mapper in core renders it.

Result object parts (all optional except success vs. failure):

- **Data** — any JSON-serializable value; the mapper wraps it into an object for the handshake era.
- **Summary** — short text; derived from data if absent.
- **Error** — stable code (`invalid_arguments`, `missing_privilege`, `not_found`, `tool_error`), message, optional details.
- **Content parts** — text, image/binary with MIME type, resource link, embedded resource (closed set, core-defined).
- **Links to stored results** — reference plus size and MIME type; the mapper decides inline vs. link by target-format size limit.
- **Metadata** — typed fields (pagination, `dryRun`, response size, echoed query, *generated at*, *expires at*) plus a namespaced area for extensions.

Design rules: no part is named after an MCP field; extensions cannot add part types; grow by adding only; immutable value object; no transport concerns.

Mapper rules: one renderer per output format (legacy, handshake era, stateless era); every renderer handles every part with a documented text fallback; size limits applied to the full rendered result; serialized results (`mcp_tool_result_cache`, app tool responses) carry a core-defined format version; legacy `{success, data, error}` strings are parsed (an object `error` yields `message`/`code` plus details; sibling keys such as `dryRun`/`preview` kept as metadata; non-envelope strings pass through as one text block). Clients on 2024-11-05 or 2025-03-26 get everything in the text block, since `structuredContent` and `resource_link` exist only since 2025-06-18.

Phases:

1. **Both formats (default until 6.8.0)** — `structuredContent` = data, failure sets `isError: true`, text block still carries the legacy `{"success": ...}` string. Size check and storage stay in `McpToolResponse::success()`.
2. **Deprecation** — release/upgrade notes; a new PHPStan rule warns on hand-built JSON strings; tools return the object (`__invoke()` declared `string|<result object>`).
3. **Spec format only (6.8.0, early via `v6.8.0.0`)** — text block holds plain JSON data; optional summary in an extra text block; metadata as its own `{"_meta": ...}` text block.

Mapping: `success: true` + `data` becomes `structuredContent` plus text; `success: false` becomes `isError: true` (not a JSON-RPC error); `_meta.resourceUri` becomes a `resource_link` block; other `_meta` goes to MCP `_meta`; exceptions/protocol failures stay JSON-RPC errors. `outputSchema` is optional and describes the result data.

## Essential identifiers

- `McpToolResponse` (`Shopware\Core\Framework\Mcp\Tool\McpToolResponse`), `success()`, `error()`, `missingPrivilegesError()`
- `McpToolResponseRule` (PHPStan; unchanged)
- `#[McpTool]`, `__invoke()`
- `mcp_tool_result_cache`, `_meta.resourceUri`, `_meta.responseSize`
- MCP fields: `content`, `structuredContent`, `isError`, `resource_link`, `outputSchema`, `_meta`
- Feature flag `v6.8.0.0`; evaluation suite `shopware-mcp-evals`

## Gotchas

- In 6.7.15.1 none of the mapper or result object exists yet: `McpToolResponse::error()` takes only a message (no error code), and tools still return the legacy JSON string. The ADR's result class (named `McpToolResult` in the ADR text) is not in the installed code.
- Spec-only mode does not shrink results; the spec itself demands a text copy of `structuredContent`. Large results are handled by the size limit and `resource_link`.
- `structuredContent` must be an object on the handshake era; the mapper wraps non-object data.
- App tools keep their `{success, data}` format; the mapper translates it.

## Version notes

- Until 6.8.0: both formats in phase 1; declaring `string` on `__invoke()` keeps working.
- 6.8.0: spec format only; hand-built JSON strings become a PHPStan error. Related issues: #19965, #19967, #19966, #20520, #21306.

## Code check (6.7.15.1)
- confirmed `McpToolResponse` — abstract base all MCP tools extend — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `McpToolResponse::success()` — returns the legacy `{success, data, _meta}` JSON string — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:62
- confirmed `responseSize` — added to `_meta` at or above the 20 KB hint threshold — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:75
- confirmed `resourceUri` — oversized results stored and pointed to as `shopware://tool-result/<uuid>` — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:88
- corrected `McpToolResponse::error()` — docs: accepts an optional error code; installed signature is `error(string $message)` only — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:121
- confirmed `McpToolResponse::missingPrivilegesError()` — builds "Missing privilege: ..." via `error()`, no code — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:164
- confirmed `McpToolResponseRule` — only checks `#[McpTool]` classes extend `McpToolResponse` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/McpToolResponseRule.php:19
- confirmed `mcp_tool_result_cache` — table for stored oversized results — vendor/shopware/core/Migration/V6_7/Migration1777535833McpToolResultCache.php:23
- absent `McpToolResult` — result object proposed by the ADR is not in the installed code
- unverified `CallToolResult` — `mcp/sdk` class, outside the shopware package roots
