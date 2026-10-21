---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-03-17-mcp-server-placement-and-extensibility.md
sourceHash: 2bcf6a71763b356a0d828981ea0d5c1e7b6ac9dc
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-17-mcp-server-placement-and-extensibility.html
title: MCP server placement and extensibility
version: "6.7"
versions:
  - "6.7"
keywords: ["mcp", "/api/_mcp", "shopware.mcp.tool", "mcp.tool", "McpToolDiscoveryCompilerPass", "shopware.mcp.allowed_tools", "McpTool", "McpToolResponse", "Resources/mcp.xml", "symfony/mcp-bundle", "model context protocol", "ai tools", "plugin mcp tool"]
summary: "ADR: MCP foundation and entity primitives stay in core; workflow assistant tools move to plugins/bundles; apps extend via mcp.xml."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2026-03-17, area framework) that decides where Shopware's experimental MCP (Model Context Protocol) server pieces live. Hybrid model: core = MCP platform primitives; plugin or bundle = merchant-facing assistant capabilities; external service = cross-system orchestration and isolated integrations. It also fixes the extension paths for plugins, bundles and apps. The ADR's own registration/discovery details are marked superseded by a later ADR ("MCP capability registration via the container"); the placement model is unchanged.

## When to use

- Deciding whether a new MCP tool belongs in core, a plugin/bundle, or an external service.
- Adding an MCP tool, prompt or resource from a plugin, a non-core bundle or an app.
- Restricting which MCP tools an installation exposes.

## Key steps / config

1. Core owns: the Admin API MCP endpoint `/api/_mcp` (Streamable HTTP, `symfony/mcp-bundle`), the auth bridge into Admin API ACL (`McpContextProvider`), rate limiting and audit logging (Monolog `mcp` channel), capability registration via `#[McpTool]`, `#[McpPrompt]`, `#[McpResource]`, the compiler passes `McpToolDiscoveryCompilerPass`, `McpToolAnalysisCompilerPass`, `McpServerBuilderCompilerPass`, the allowlist `shopware.mcp.allowed_tools`, generic reference resources, the `shopware-context` prompt (`ShopwareContextPrompt`) and a small set of stable primitives.
2. Primitives kept in core: `shopware-entity-schema`, `shopware-entity-search`, `shopware-entity-read`, `shopware-entity-aggregate`; write-capable, evaluate carefully: `shopware-entity-upsert`, `shopware-entity-delete`, `shopware-order-state`, `shopware-system-config-read`, `shopware-system-config-write`. Classes live in `Shopware\Core\Framework\Mcp\Tool` (e.g. `EntitySearchTool`).
3. Plugin tool: a class with `#[McpTool(name: ..., description: ...)]` that extends the abstract `McpToolResponse` base, tagged `shopware.mcp.tool`; `McpToolDiscoveryCompilerPass` remaps it to the SDK tag `mcp.tool` (and prompts/resources from `shopware.mcp.prompt`/`shopware.mcp.resource`). The DI tag alone registers the capability:

   ```xml
   <service id="Swag\Erp\Mcp\Tool\SyncOrdersTool">
       <tag name="shopware.mcp.tool"/>
   </service>
   ```

4. Non-core in-tree bundles tag `mcp.tool` directly (e.g. `Shopware\Storefront\Mcp\Tool\ThemeConfigTool`, `shopware-theme-config`).
5. Apps declare capabilities in `Resources/mcp.xml` (validated against `mcp-1.0.xsd`), loaded by `AppMcpToolLoader`/`AppMcpPromptLoader`/`AppMcpResourceLoader` and executed as HMAC-signed HTTP calls:

   ```xml
   <mcp>
     <tools>
       <tool name="my-erp-sync-orders">
         <description>...</description>
         <input-schema>{...}</input-schema>
         <url>https://my-erp.example.com/mcp/sync-orders</url>
       </tool>
     </tools>
   </mcp>
   ```

6. Naming: `shopware-*` for core, `{plugin}-*` for plugins, `{app}-*` for apps; duplicate names are rejected at compile time.

## Essential identifiers

- `/api/_mcp`, `symfony/mcp-bundle`
- `shopware.mcp.tool`, `mcp.tool`, `#[McpTool]`, `#[McpPrompt]`, `#[McpResource]`
- `McpToolDiscoveryCompilerPass`, `McpToolAnalysisCompilerPass`, `McpServerBuilderCompilerPass`
- `shopware.mcp.allowed_tools`, `McpContextProvider`, `McpToolResponse`
- `Resources/mcp.xml`, `AppMcpToolLoader`

## Gotchas

- The ADR's pseudocode configures discovery via `mcp.yaml` `scan_dirs` (incl. `custom/plugins`, `custom/static-plugins`); that no longer exists — the DI tag alone registers a capability, and each capability is assigned to one of two MCP servers (`admin` and `store_api`).
- The ADR gates services with a `shopware.feature` tag and flag `MCP_SERVER`; in the installed code the MCP server is always enabled and there is no such flag (classes stay `@experimental stableVersion:v6.8.0`).
- The ADR shows `use McpToolResponse;` as a trait; in the installed code it is an abstract class tools extend.
- The ADR names `AppMcpToolExecutor` for app calls; the installed executor is `AppMcpCapabilityExecutor`.
- The ADR places the `ThemeConfigTool` DI registration in `src/Storefront/DependencyInjection/mcp.xml`; the installed file is `mcp.php`.
- Built-in assistant tools are product features, not stable platform API; only the endpoint, registration contracts, capability attributes, security model and extension mechanisms are public API.
- Write-capable primitives carry higher security/support impact; some may start in a plugin.

## Version notes

- Workflow tools the ADR lists for removal from core (`OrderSummaryTool`, `CustomerLookupTool`, `ProductCreateTool`, `RevenueReportTool`, `BestsellerReportTool`, `StorefrontSearchTool`, `CartManageTool`, `CartCheckoutTool`, `CheckoutMethodsTool`) are no longer in `Shopware\Core\Framework\Mcp\Tool` in 6.7.15.1; `MediaUploadTool` still is. The MCP classes remain experimental.

## Code check (6.7.15.1)
- confirmed `/api/_mcp` — Admin API MCP route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `McpToolDiscoveryCompilerPass` — remaps shopware.mcp.tool to mcp.tool — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:24
- confirmed `shopware.mcp.allowed_tools` — compile-time allowlist parameter — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:314
- corrected `McpToolResponse` — docs: trait used via `use`; code: abstract class — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `ThemeConfigTool` — Storefront bundle tool registered with mcp.tool tag — vendor/shopware/storefront/DependencyInjection/mcp.php:14
- corrected `scan_dirs` — docs: mcp.yaml discovery dirs; removed, DI tag registration only — vendor/shopware/core/Framework/Mcp/AGENTS.md:115
- corrected `MCP_SERVER` — docs: feature flag gates MCP; no flag, server always enabled — vendor/shopware/core/Framework/Mcp/AGENTS.md:87
- confirmed `AppMcpCapabilityExecutor` — executes app MCP capabilities — vendor/shopware/core/Framework/Mcp/Loader/AppMcpCapabilityExecutor.php:27
- unverified `AppMcpToolExecutor` — no such class in PHP code; only named in a backlog doc
- absent `OrderSummaryTool` — workflow tool no longer in core
