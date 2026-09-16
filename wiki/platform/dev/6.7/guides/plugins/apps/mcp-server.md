---
id: platform/dev/6.7/guides/plugins/apps/mcp-server.md
title: MCP Server Extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/mcp-server.html
sourceHash: 073a79540172977a11bd606731398c80e3f1b68e
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp.xml", "mcp-tool", "mcp-prompt", "mcp-resource", "AppMcpToolLoader", "AppMcpCapabilityExecutor", "shopware-shop-signature", "shopware.mcp.app_tool_timeout", "debug:mcp", "app_mcp_tool", "model context protocol", "ai tools", "app webhook", "hmac signature", "MCP_SERVER"]
summary: "App MCP capabilities via Resources/mcp.xml: tool/prompt/resource XML, app-name prefixing, HMAC-signed webhook or /api/script subrequest, timeout, debug:mcp."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/mcp-server.md", "platform/dev/6.7/products/tools/mcp-server/extending.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md"]
---
## What it is

Apps add MCP tools, prompts and resources to the Shopware MCP server by shipping a declarative `Resources/mcp.xml`. On install/update the declarations are persisted (`app_mcp_tool`, `app_mcp_prompt`, `app_mcp_resource`) and loaded at server build time by `AppMcpToolLoader`, `AppMcpPromptLoader`, `AppMcpResourceLoader`. Calls are executed by `AppMcpCapabilityExecutor`: an HMAC-signed HTTP POST to an external URL, or an internal Symfony subrequest for URLs starting with `/`.

## When to use

- The capability runs on a remote service (ERP, PIM, CRM, SaaS backend) or must work in Shopware Cloud, where plugins cannot run.
- The capability should deploy/scale independently of Shopware.
- A thin wrapper over data Shopware already has can use an app script endpoint instead of an external server.

For in-process PHP with DAL access, see [Extending via Plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md); comparison of extension types: [Extending the MCP Server](platform/dev/6.7/products/tools/mcp-server/extending.md).

## Key steps / config

1. Create `Resources/mcp.xml` against schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Mcp/Schema/mcp-1.0.xsd`:

```xml
<mcp xsi:noNamespaceSchemaLocation="...mcp-1.0.xsd">
  <mcp-tools>
    <mcp-tool name="sync-orders" url="https://app.example.com/mcp/sync-orders">
      <label>Sync Orders</label><label lang="de-DE">...</label>
      <description>...</description>
      <input-schema><property name="since" type="string" description="..." required="true"/></input-schema>
      <required-privileges><privilege>order:read</privilege></required-privileges>
    </mcp-tool>
  </mcp-tools>
  <mcp-prompts><mcp-prompt name="erp-context" url="..."><label>...</label></mcp-prompt></mcp-prompts>
  <mcp-resources><mcp-resource name="erp-status" uri="my-erp://erp-status" url="..." mime-type="application/json"><label>...</label></mcp-resource></mcp-resources>
</mcp>
```

   - `name` and `url` are required on all three; `uri` is also required on `mcp-resource`, `mime-type` optional. `<label>` is required (at least one); `<description>` optional.
   - `name` must match `[a-zA-Z0-9_-]+` (no dots).
   - `<property>` attributes: `name` (required), `type` (`string`, `integer`, `number`, `boolean`, `array`, `object`; default `string`), `description`, `required` (only `true` marks it required).
2. Naming: final name is `<app-name>-<declared-name>` (e.g. `my-erp-sync-orders`). A result starting with `shopware-` is skipped with a logged warning.
3. URL modes:
   - External `https://...`: POST with JSON body, signed in header `shopware-shop-signature` (HMAC-SHA256 with the app secret from `manifest.xml`). Verify the signature against the raw body before processing.
   - Internal `/...` (e.g. `url="/api/script/mcp-greet"`): dispatched as a subrequest with the parent request's authorization, so the integration's ACL applies; no HMAC. Serve it from `Resources/scripts/api-mcp-greet/greet.twig`, reading `hook.request.arguments` and calling `hook.setResponse(services.response.json({...}))`.
4. Webhook request body sent by the installed executor (tools, prompts and resources alike):

```json
{"tool": "my-erp-sync-orders", "arguments": {}, "source": {"url": "...", "shopId": "...", "appVersion": "1.2.0"}}
```

   Prompts send empty `arguments`; resources send `arguments: {"uri": "<declared uri>"}`.
5. Responses: tools return JSON forwarded as-is; follow `{"success": bool, "data": ..., "_meta": ...}` / `{"success": false, "error": "..."}` — a missing `success` key logs a warning. Prompts return an array of `{"role", "content"}` messages; resources return `{"uri", "mimeType", "text"}`.
6. Timeout: `shopware.mcp.app_tool_timeout` (integer seconds, default `10`, min `1`).
7. Install via the normal app lifecycle, then verify with `bin/console debug:mcp` (tools show **Source: app**; `--integration=SWIA...` restricts to one integration's allowlist).

## Essential identifiers

- `Resources/mcp.xml`, `mcp-tool`, `mcp-prompt`, `mcp-resource`, `input-schema`, `required-privileges`
- `AppMcpToolLoader`, `AppMcpPromptLoader`, `AppMcpResourceLoader`, `AppMcpCapabilityExecutor`
- `app_mcp_tool`, `app_mcp_prompt`, `app_mcp_resource`
- `shopware-shop-signature`, `shopware.mcp.app_tool_timeout`, `bin/console debug:mcp`

## Gotchas

- `<required-privileges>` is informational for external URLs (the app must enforce, e.g. by `source.shopId`); for internal paths ACL is enforced by the Admin API stack.
- The docs describe prompt/resource webhook bodies keyed `prompt`/`resource`; the installed 6.7.13.0 executor always sends `tool` (see Code check). Handle both if you target several versions.
- Labels/descriptions are resolved for the system default language at load time; the resolved `<label>` becomes the MCP `title`.
- Tool loading only includes tools of active apps with an app secret, or tools whose URL starts with `/`.
- The MCP server is experimental and gated by the `MCP_SERVER` feature flag (default `false` in 6.7.13.0).
- The docs mention toolset discovery via `shopware-tool-search` / `shopware-toolset-enable` and `notifications/*/list_changed` on app lifecycle changes; these were not found in the installed core code.

## Version notes

Tool search/toolsets and list-changed notifications described by the docs appear to postdate 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `capabilityName` — XSD name pattern `[a-zA-Z0-9_-]+` — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:43
- confirmed `AppMcpToolLoader` — loads `app_mcp_tool` rows of active apps with secret or `/` URL — vendor/shopware/core/Framework/Mcp/Loader/AppMcpToolLoader.php:21
- confirmed `AbstractAppMcpLoader::isReservedName()` — skips names starting `shopware-` — vendor/shopware/core/Framework/Mcp/Loader/AbstractAppMcpLoader.php:53
- confirmed `shopware.mcp.app_tool_timeout` — integer, default 10, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1626
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — header `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- corrected `tool` — docs: prompts/resources send `prompt`/`resource` key; executor always sends `tool` — vendor/shopware/core/Framework/Mcp/Loader/AppMcpCapabilityExecutor.php:54
- confirmed `AppMcpCapabilityExecutor::executeSubRequest()` — `/` URLs dispatched as subrequest with JSON `arguments` body — vendor/shopware/core/Framework/Mcp/Loader/AppMcpCapabilityExecutor.php:113
- confirmed `debug:mcp` — console command — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:28
- confirmed `MCP_SERVER` — feature flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- unverified `shopware-toolset-enable` — not found in vendor/shopware/core PHP (with `shopware-tool-search`, `list_changed`)
