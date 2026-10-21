---
id: platform/dev/6.7/products/tools/mcp-server/copilot-tool-approval.md
title: Copilot tool approval
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/copilot-tool-approval.html
sourceHash: 2d8dc5ee73d8654659ae914a3860a4ba3e1ac22a
codeCheckedAgainst: "6.7.15.1"
keywords: ["dryRun", "McpToolResponse", "McpToolGroup", "McpToolRequires", "McpContextProvider", "shopware.mcp.tool", "debug:mcp", "shopware-toolset-enable", "requirePrivilege", "shopware copilot", "approval card", "write tool preview", "mcp tool side effects"]
summary: The dryRun contract that makes Shopware Copilot show a merchant approval card before an extension's MCP tool changes data (6.7.14.0+).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/_index.md"]
---
## What it is

The contract an extension's MCP tool must follow so Shopware Copilot previews a change, asks the merchant to approve it, and only then commits it. Copilot discovers tools through the shop's own MCP catalog (no registration with Copilot) and decides how to call a tool from its input schema alone: a top-level boolean `dryRun` parameter marks it as data-changing; a tool without it is treated as read-only and called directly. Available from Shopware 6.7.14.0; the MCP server is experimental.

## When to use

You ship a plugin or app that registers MCP tools and want Copilot to use them safely — especially any tool that creates, updates or deletes data.

## Key steps / config

The four rules:

1. **R1** – a tool with side effects declares a boolean input `dryRun` with default `true` (case-sensitive, top-level in the input schema).
2. **R2** – `dryRun: true` writes nothing; it validates fully and returns a preview, shown on the merchant's approval card. Validation errors are returned here.
3. **R3** – `dryRun: false` commits using only the arguments (same as the preview call apart from `dryRun`) and returns the result incl. record identifiers. Preview and commit run in separate MCP sessions, possibly minutes apart.
4. **R4** – read-only tools must not declare `dryRun`.

Copilot finds tools by **description** (what it does, when to use it, what it returns) and **group**: tools sharing a `McpToolGroup` form one toolset, enabled only when needed. Use a short, stable, product-specific name like `b2b-quotes`.

Plugin write tool skeleton — the input schema is derived from the `__invoke()` signature, so `bool $dryRun = true` satisfies R1:

```php
use Mcp\Capability\Attribute\McpTool;
use Shopware\Core\Framework\Mcp\Attribute\McpToolGroup;
use Shopware\Core\Framework\Mcp\Attribute\McpToolRequires;
use Shopware\Core\Framework\Mcp\Tool\McpToolResponse;

#[McpTool(name: 'myext-promotion-pause', title: 'Pause Promotion', description: '...')]
#[McpToolGroup('myext-promotions')]
#[McpToolRequires('promotion:update')]
final class PromotionPauseTool extends McpToolResponse
{
    public function __invoke(string $promotionId, bool $dryRun = true): string { /* ... */ }
}
```

In `__invoke()`: get the context from an injected `McpContextProvider` (`getContext()`), check `$this->requirePrivilege($context, 'promotion:update')`, validate, then for `dryRun` return `$this->success([...], ['dryRun' => true])` without writing; otherwise commit and return `$this->success([...])`. Register the class as a service tagged `shopware.mcp.tool`.

Preview payload: name records by something the merchant recognises (product number, promotion name) next to the ID, describe changes as from/to values, summarise bulk operations with counts, and return `error()` for anything the commit would reject.

**App tools** (webhook): declare `dryRun` as optional boolean with `"default": true` in the JSON input schema; the handler must treat a missing value as `true` (`$dryRun = $args['dryRun'] ?? true`), since JSON Schema defaults do not populate omitted properties.

Testing: `bin/console debug:mcp` lists the tool with group and privileges; call the MCP endpoint with an Admin API token, enable the toolset via `shopware-toolset-enable`, and call with `dryRun: true` then `false`; finally ask Copilot in plain language, and try a request your validation rejects — it must fail at preview.

## Essential identifiers

- `dryRun` (boolean input, default `true`)
- `Shopware\Core\Framework\Mcp\Tool\McpToolResponse` – `success()`, `error()`, `requirePrivilege()`
- `Shopware\Core\Framework\Mcp\Attribute\McpToolGroup`, `Shopware\Core\Framework\Mcp\Attribute\McpToolRequires`
- `Shopware\Core\Framework\Mcp\Context\McpContextProvider`, `Mcp\Capability\Attribute\McpTool`
- tag `shopware.mcp.tool`; `bin/console debug:mcp`; `shopware-toolset-enable`

## Gotchas

- A side-effecting tool without `dryRun` looks like a read tool: Copilot runs it without an approval card.
- Never store and replay the preview; make commits idempotent where possible (retries can repeat a call).
- Copilot acts with the merchant's permissions. `McpToolRequires` is informational only; enforcement is `requirePrivilege()` plus DAL ACL.
- `success: false` is a tool error and stops the commit. Responses over 100 KB are delivered via a resource URI; Copilot waits only a few seconds, so long work should continue asynchronously.
- No preview side effects beyond logging (no drafts, stock reservation, notifications).
- Copilot cannot access extension-created tables unless users add a custom ACL under Copilot Settings -> Use custom roles for Copilot.
- Tools without a meaningful preview (e.g. file uploads) cannot use this flow.
- Docs say `McpToolResponse` subclasses log to the `mcp` Monolog channel; in code this is an `instanceof` rule in core's `mcp.php`, not verified for plugin services.

## Version notes

Requires 6.7.14.0+. The `dryRun` contract is a temporary workaround; a future release is expected to expose standard MCP tool annotations (incl. `readOnlyHint`), which Copilot will honour. `dryRun` stays supported.

## Code check (6.7.15.1)
- confirmed `McpToolResponse::success()` — protected helper, envelope `success`/`data`/optional `_meta` — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:62
- confirmed `McpToolResponse::error()` — returns `{"success": false, "error": ...}` — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:121
- confirmed `McpToolResponse::requirePrivilege()` — returns error JSON on the first missing privilege, else null — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- confirmed `McpToolGroup` — class/method attribute with a single `$group` string — vendor/shopware/core/Framework/Mcp/Attribute/McpToolGroup.php:12
- confirmed `McpToolRequires` — repeatable class attribute, informational only — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:31
- confirmed `McpContextProvider::getContext()` — returns request Context, CLI context fallback — vendor/shopware/core/Framework/Mcp/Context/McpContextProvider.php:28
- confirmed `shopware.mcp.tool` — re-tagged to `mcp.tool` by the discovery compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `MAX_RESPONSE_SIZE` — 100_000 bytes before the response is stored as a tool-result resource — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `debug:mcp` — CLI command listing MCP capabilities — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:33
- confirmed `ENABLE_TOOLSET_TOOL` — constant value `shopware-toolset-enable` — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:16
