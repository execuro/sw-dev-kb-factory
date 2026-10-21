---
id: platform/dev/6.7/guides/plugins/apps/mcp-server.md
title: MCP Server Extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/mcp-server.html
sourceHash: 073a79540172977a11bd606731398c80e3f1b68e
codeCheckedAgainst: "6.7.15.1"
keywords: ["mcp.xml", "mcp-tool", "mcp-prompt", "mcp-resource", "AppMcpToolLoader", "AppMcpCapabilityExecutor", "shopware-shop-signature", "shopware.mcp.app_tool_timeout", "debug:mcp", "shopware-toolset-enable", "mcp server", "ai tools", "app webhook", "model context protocol"]
summary: Apps add MCP tools, prompts and resources via Resources/mcp.xml; Shopware calls them by HMAC-signed POST or internal /api/script subrequest.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/mcp-server.md", "platform/dev/6.7/products/tools/mcp-server/extending.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md"]
---
## What it is

Apps extend the Shopware MCP server with custom tools, prompts and resources declared in `Resources/mcp.xml`. When an AI client calls one, Shopware forwards the call to the app's URL (HMAC-signed HTTP POST, or an internal subrequest for `/...` paths) and returns the response to the client.

## When to use

- The capability runs on a remote service (ERP, PIM, CRM, SaaS backend), must work in Shopware Cloud, or must scale/deploy independently.
- For in-process PHP with DAL access use a plugin instead: platform/dev/6.7/guides/plugins/plugins/mcp-server.md. Comparison: platform/dev/6.7/products/tools/mcp-server/extending.md.

## Key steps / config

1. Create `Resources/mcp.xml` with schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Mcp/Schema/mcp-1.0.xsd`:

```xml
<mcp>
  <mcp-tools>
    <mcp-tool name="sync-orders" url="https://app.example.com/mcp/sync-orders">
      <label>Sync Orders</label>
      <label lang="de-DE">...</label>
      <description>...</description>
      <input-schema><property name="since" type="string" description="..." required="true"/></input-schema>
      <required-privileges><privilege>order:read</privilege></required-privileges>
    </mcp-tool>
  </mcp-tools>
  <mcp-prompts><mcp-prompt name="erp-context" url="..."><label>...</label></mcp-prompt></mcp-prompts>
  <mcp-resources><mcp-resource name="erp-status" uri="my-erp://erp-status" url="..." mime-type="application/json"><label>...</label></mcp-resource></mcp-resources>
</mcp>
```

2. Names: only `a-zA-Z0-9_-`. Final name = `<app name>-<declared name>` (e.g. `my-erp-sync-orders`). Computed names starting with `shopware-` are skipped.
3. `<property>` attributes: `name` (required), `type` (`string`|`integer`|`number`|`boolean`|`array`|`object`, default `string`), `description`, `required` (default false).
4. URL modes:
   - External `https://...`: HMAC-signed POST. `<required-privileges>` is informational only — enforce on your side (e.g. by `source.shopId`).
   - Internal `/...` (e.g. `url="/api/script/mcp-greet"`): dispatched as a Symfony subrequest through the Admin API stack, so the integration's ACL applies. Serve it with an app script, e.g. `Resources/scripts/api-mcp-greet/greet.twig`, reading `hook.request.arguments` and calling `hook.setResponse(services.response.json({...}))`.
5. External webhook body (sent by `AppMcpCapabilityExecutor`):

```json
{"tool": "my-erp-sync-orders", "arguments": {...}, "source": {"url": "...", "shopId": "...", "appVersion": "..."}}
```

   Prompts and resources go through the same executor: the name is still under `tool`; prompts send empty `arguments`, resources send `arguments: {"uri": "..."}`. Prompt responses: JSON array of `{"role", "content"}` messages. Resource responses: one object with `uri`, `mimeType`, `text`.
6. Verify the HMAC-SHA256 signature in the `shopware-shop-signature` header against the raw body using the app secret from `manifest.xml`.
7. Return `{"success": true, "data": ...}` / `{"success": false, "error": "..."}`; a missing `success` key is logged as a warning, not rejected.
8. Timeout: `shopware.mcp.app_tool_timeout` seconds (default 10, min 1).
9. Install the app normally, then check with `bin/console debug:mcp` (tools show **Source: app**; `--integration=SWIA...` shows one integration's reachable set).

## Essential identifiers

- `Resources/mcp.xml`, elements `mcp-tool`, `mcp-prompt`, `mcp-resource`, `input-schema`, `required-privileges`
- Tables `app_mcp_tool`, `app_mcp_prompt`, `app_mcp_resource`
- Loaders `AppMcpToolLoader`, `AppMcpPromptLoader`, `AppMcpResourceLoader`; executor `AppMcpCapabilityExecutor`
- Header `shopware-shop-signature`; config `shopware.mcp.app_tool_timeout`
- Discovery tools `shopware-tool-search`, `shopware-toolset-enable`; CLI `bin/console debug:mcp`

## Gotchas

- All tools of an active app form one toolset named after the app's technical name; title is the name with hyphens as spaces, first letter capitalised, plus " tools" (`my-integration` → "My integration tools"). Tools are deferred until discovered or the toolset is enabled.
- Lifecycle changes (install/update/activate/deactivate/delete) queue `notifications/*/list_changed` only for declared capability types; clients see them on their next request or open stream, and only with a configured session store (platform/dev/6.7/products/tools/mcp-server/configuration.md). Plugin/bundle capability changes are not announced.
- Labels/descriptions resolve against the system default locale, fallback `en-GB`; `<label>` becomes the MCP `title`. The installed XSD declares `<label>` without `minOccurs="0"`, so it is mandatory in valid XML.
- The doc's claim that prompt/resource bodies use `prompt`/`resource` keys is not what the installed executor sends (see Code check).

## Code check (6.7.15.1)
- confirmed `mcp-1.0.xsd` — capabilityName pattern `[a-zA-Z0-9_-]+` — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:45
- confirmed `inputProperty.type` — enum string/integer/number/boolean/array/object, default string — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:115
- corrected `label` — docs: optional (clients fall back to name); XSD requires at least one — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:60
- confirmed `AbstractAppMcpLoader::capabilityName()` — returns `appName-name` — vendor/shopware/core/Framework/Mcp/Loader/AbstractAppMcpLoader.php:50
- confirmed `shopware-` — reserved prefix check — vendor/shopware/core/Framework/Mcp/Loader/AbstractAppMcpLoader.php:55
- confirmed `AppMcpToolLoader` — reads `app_mcp_tool` of active apps, internal URLs allowed without secret — vendor/shopware/core/Framework/Mcp/Loader/AppMcpToolLoader.php:21
- corrected `AppMcpCapabilityExecutor::execute()` — docs: prompt/resource body uses `prompt`/`resource` key; code always sends `tool` — vendor/shopware/core/Framework/Mcp/Loader/AppMcpCapabilityExecutor.php:54
- confirmed `shopware-shop-signature` — HMAC header constant — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `shopware.mcp.app_tool_timeout` — default 10, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1689
- confirmed `debug:mcp` — CLI command — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:33
