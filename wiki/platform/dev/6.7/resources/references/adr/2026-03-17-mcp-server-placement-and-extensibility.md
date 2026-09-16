---
id: platform/dev/6.7/resources/references/adr/2026-03-17-mcp-server-placement-and-extensibility.md
title: MCP server placement and extensibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-17-mcp-server-placement-and-extensibility.html
sourceHash: a48f972ea372a631841fc836278be4d0967c94b6
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp", "model context protocol", "/api/_mcp", "MCP_SERVER", "shopware.mcp.tool", "mcp.tool", "McpToolDiscoveryCompilerPass", "McpToolResponse", "allowed_tools", "Resources/mcp.xml", "AppMcpCapabilityExecutor", "ai tools", "adr", "plugin extensibility"]
summary: "ADR: hybrid MCP model - core keeps /api/_mcp platform and entity primitives, workflow tools go to plugins/bundles, apps extend via Resources/mcp.xml webhooks."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-03-17) on where Shopware's experimental MCP (Model Context Protocol) server pieces live: core owns the MCP platform foundation and generic primitives, plugins/bundles own opinionated merchant-assistant workflows, external services handle cross-system orchestration. It also fixes the extension model for plugins, bundles and apps.

## When to use

- Deciding whether a new MCP tool, prompt or resource belongs in core, a plugin/bundle, or an app.
- Registering MCP capabilities from a plugin, an in-tree bundle, or an app.

## Key steps / config

Core owns: the `/api/_mcp` endpoint (Streamable HTTP via `symfony/mcp-bundle`), the auth bridge into Admin API permissions (`McpContextProvider`), ACL, rate limiting, audit logging (Monolog `mcp` channel), the `MCP_SERVER` feature flag (default false), `#[McpTool]` / `#[McpPrompt]` / `#[McpResource]` registration, the compiler passes `McpToolDiscoveryCompilerPass`, `McpToolAnalysisCompilerPass`, `McpServerBuilderCompilerPass`, the `shopware.mcp.allowed_tools` allowlist (empty = all tools), generic resources and the `shopware-context` prompt.

Core tools in 6.7.13.0: `EntitySchemaTool`, `EntitySearchTool`, `EntityReadTool`, `EntityAggregateTool`, `EntityUpsertTool`, `EntityDeleteTool`, `OrderStateTool`, `SystemConfigReadTool`, `SystemConfigWriteTool`, and still `MediaUploadTool`. `ThemeConfigTool` (`shopware-theme-config`) lives in Storefront.

Registration paths as implemented:

1. Plugins: tag the service `shopware.mcp.tool` (or `shopware.mcp.prompt` / `shopware.mcp.resource`); `McpToolDiscoveryCompilerPass` adds `mcp.tool` / `mcp.prompt` / `mcp.resource`, applies `allowed_tools`, and throws on duplicate tool names.
2. In-tree bundles (e.g. Storefront): tag `mcp.tool` directly; the bundle's `Mcp` directory is in the SDK `scan_dirs`, which core derives from bundle metadata (Framework and Storefront only).
3. Apps: declare capabilities in `Resources/mcp.xml`, loaded by `AppMcpToolLoader` / `AppMcpPromptLoader` / `AppMcpResourceLoader`, executed by `AppMcpCapabilityExecutor` via a HMAC-signed request.

Plugin tool shape (tools extend the abstract `McpToolResponse`):

```php
#[McpTool(name: 'swag-erp-sync-orders', description: '...')]
class SyncOrdersTool extends McpToolResponse {
    public function __invoke(string $since): string {
        return $this->success([/* ... */]);
    }
}
```

App `Resources/mcp.xml` skeleton (per `mcp-1.0.xsd`):

```xml
<mcp>
  <mcp-tools>
    <mcp-tool name="my-erp-sync-orders" url="...">
      <label>...</label>
      <description>...</description>
      <input-schema><property name="..." type="string"/></input-schema>
    </mcp-tool>
  </mcp-tools>
</mcp>
```

Naming: `shopware-*` core, `{plugin}-*` plugins, `{app}-*` apps.

## Essential identifiers

- `/api/_mcp`, `symfony/mcp-bundle`, `MCP_SERVER`
- `shopware.mcp.tool`, `mcp.tool`, `shopware.mcp.allowed_tools`
- `Shopware\Core\Framework\DependencyInjection\CompilerPass\McpToolDiscoveryCompilerPass`
- `Shopware\Core\Framework\Mcp\Tool\McpToolResponse`, `McpContextProvider`
- `AppMcpToolLoader`, `AppMcpCapabilityExecutor`
- `shopware-entity-search`, `shopware-entity-upsert`, `shopware-context`

## Gotchas

- The ADR pseudocode writes `use McpToolResponse;` like a trait; installed code has an abstract class that tools extend.
- The ADR names the app runtime `AppMcpToolExecutor` and shows `mcp.xml` with `<tools>/<tool>` and a `<url>` child; installed code uses `AppMcpCapabilityExecutor` and the XSD requires `<mcp-tools>/<mcp-tool>` with `name`/`url` attributes plus `label`.
- The ADR lists `custom/plugins` and `custom/static-plugins` in `scan_dirs`; installed config scans only Framework and Storefront `Mcp` dirs — plugins rely on the `shopware.mcp.tool` tag.
- Storefront DI is `mcp.php` (not `mcp.xml`) and tags only `mcp.tool`.
- Write-capable core tools carry higher security/support impact.

## Version notes

Experimental: classes are annotated `@experimental stableVersion:v6.8.0 feature:MCP_SERVER`. The ADR's workflow tools slated for removal (`OrderSummaryTool`, `CustomerLookupTool`, `ProductCreateTool`, `RevenueReportTool`, `BestsellerReportTool`, `StorefrontSearchTool`, `CartManageTool`, `CartCheckoutTool`, `CheckoutMethodsTool`) are no longer in core's `Mcp/Tool` directory in 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `McpToolDiscoveryCompilerPass` — maps `shopware.mcp.tool` to `mcp.tool`, enforces allowlist, detects duplicates — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:20
- confirmed `shopware.mcp.tool` — tag mapping entry — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:32
- confirmed `allowed_tools` — array node, default `[]` means all tools allowed — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1621
- confirmed `MCP_SERVER` — feature flag, default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- corrected `McpToolResponse` — docs: used as a trait; installed code is an abstract class — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- corrected `AppMcpCapabilityExecutor` — docs: `AppMcpToolExecutor`; installed executor signs with `RequestSigner` — vendor/shopware/core/Framework/Mcp/Loader/AppMcpCapabilityExecutor.php:27
- corrected `mcp-tool` — docs: `<tools>/<tool>` elements; XSD uses `mcp-tools`/`mcp-tool` with `name`/`url` attributes — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:9
- corrected `scan_dirs` — docs: includes custom/plugins and custom/static-plugins; installed: Framework and Storefront Mcp dirs only — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:36
- corrected `ThemeConfigTool` — docs: DI in Storefront `mcp.xml`; installed in `mcp.php` with `mcp.tool` tag — vendor/shopware/storefront/DependencyInjection/mcp.php:14
- confirmed `MediaUploadTool` — still registered in core MCP DI — vendor/shopware/core/Framework/DependencyInjection/mcp.php:64
