---
id: platform/dev/6.7/products/tools/mcp-server/extending.md
title: Extending the MCP Server
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/extending.html
sourceHash: d2f551fadb369d204f487a10ffb72339e72e8d1d
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.mcp.tool", "shopware.mcp.prompt", "shopware.mcp.resource", "McpToolGroup", "McpToolResponse", "McpPrompt", "McpResource", "mcp.xml", "mcp-tool", "required-privileges", "McpContextProvider", "custom mcp tool", "mcp plugin app bundle"]
summary: Quick reference for adding MCP tools, prompts and resources via app (mcp.xml + webhook), plugin or Symfony bundle (attributes + service tags).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/guides/plugins/plugins/mcp-server.md", "platform/dev/6.7/guides/plugins/apps/mcp-server.md"]
---
## What it is

Side-by-side quick reference for the three MCP capability types — **tools** (actions), **prompts** (context messages), **resources** (read-only data by URI) — across the three extension types: **app** (webhook, works in Shopware Cloud), **plugin** (in-process PHP, full DAL) and **Symfony bundle** (in-process, always active, no install lifecycle). Describes 6.7.14.0+. Step-by-step guides: [plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [app](platform/dev/6.7/guides/plugins/apps/mcp-server.md).

## When to use

Choosing how to contribute a capability to the shop's MCP server, or looking up the attribute, tag or XML element for it.

## Key steps / config

**App tools** – declare in `Resources/mcp.xml`, handled by webhook POST. The name is auto-prefixed with the app name; all tools of an active app form a toolset named after the app's technical name. `<required-privileges>` lets the Admin UI warn about missing ACL roles; `url="/..."` routes to an app script instead of an external URL.

```xml
<mcp-tools>
    <mcp-tool name="sync-orders" url="...">
        <label>Sync Orders</label>
        <description>...</description>
        <input-schema>
            <property name="since" type="string" description="..." required="true"/>
        </input-schema>
        <required-privileges><privilege>order:read</privilege></required-privileges>
    </mcp-tool>
</mcp-tools>
```

Webhook response: a JSON object, ideally the `{"success": bool, "data": ...}` envelope.

**Plugin tools** – class with `#[McpTool]` on the class, extending `McpToolResponse`, tagged `shopware.mcp.tool` in `services.php`:

```php
#[McpTool(name: 'swag-my-plugin-orders', title: 'Order List', description: 'List recent orders.')]
#[McpToolGroup('swag-my-plugin')]
#[McpToolRequires('order:read')]
class OrdersTool extends McpToolResponse
{
    public function __invoke(int $limit = 10): string { /* requirePrivilege, query, $this->success([...]) */ }
}
```

`#[McpToolGroup]` is optional and takes exactly one group. Without it, the group is the longest hyphen-separated name prefix shared with another ungrouped tool (`swag-my-plugin-orders` + `swag-my-plugin-products` → `swag-my-plugin`), falling back to the first segment (`swag`). Set it explicitly if the group must not depend on the tool catalogue.

**Bundle** – same class and `services.php`; load the services unconditionally in the bundle's `build(ContainerBuilder $container)`. Bundles are always active when registered in `config/bundles.php`.

**Prompts** – return a list of `{role, content}` messages. App: `<mcp-prompts><mcp-prompt name="..." url="..."><label/><description/></mcp-prompt></mcp-prompts>`, webhook body carries `prompt` instead of `tool`. Plugin/bundle: class with `#[McpPrompt(name:, title:, description:)]`, tag `shopware.mcp.prompt`; no need to extend `McpToolResponse`.

**Resources** – return `{uri, mimeType, text}`. App: `<mcp-resource name="..." uri="my-erp://status" url="..." mime-type="application/json">`, webhook body carries `resource`. Plugin/bundle: class with `#[McpResource(uri:, name:, description:)]`, tag `shopware.mcp.resource`.

| | App | Plugin / Bundle |
|---|---|---|
| Context | `source.shopId` in webhook body | `McpContextProvider::getContext()` |
| DAL access | No (remote) | Full |
| Lifecycle | App install/update | Plugin install/activate (bundle: always) |

## Essential identifiers

- Tags: `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource`
- Attributes: `McpTool`, `McpPrompt`, `McpResource`, `McpToolGroup`, `McpToolRequires`
- `McpToolResponse`, `McpContextProvider::getContext()`
- `Resources/mcp.xml`: `<mcp-tools>`, `<mcp-prompts>`, `<mcp-resources>`, `<required-privileges>`

## Gotchas

- Extension services need no `shopware.feature` tag.
- App capability names starting with `shopware-` are skipped (reserved prefix, per installed code).

## Version notes

Before 6.7.14.0 the server had to be enabled with `MCP_SERVER=1`, and `#[McpToolGroup]` did not exist (every allowed tool was advertised directly). From 6.7.14.0 the flag is gone and the server is always on. See [Configuration](platform/dev/6.7/products/tools/mcp-server/configuration.md).

## Code check (6.7.15.1)
- confirmed `shopware.mcp.tool` — re-tagged as `mcp.tool` for the Admin API server — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `shopware.mcp.prompt` — re-tagged as `mcp.prompt` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:57
- confirmed `shopware.mcp.resource` — re-tagged as `mcp.resource` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:58
- confirmed `McpToolGroup` — single `$group` constructor argument — vendor/shopware/core/Framework/Mcp/Attribute/McpToolGroup.php:12
- confirmed `resolveToolGroups()` — longest hyphen-separated shared prefix, else first segment — vendor/shopware/core/Framework/Mcp/McpCapabilityCatalog.php:211
- confirmed `mcp-tools` — app XSD element — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:6
- confirmed `required-privileges` — optional element of an app MCP tool — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:73
- confirmed `shopware-` — reserved prefix, app capability skipped — vendor/shopware/core/Framework/Mcp/Loader/AbstractAppMcpLoader.php:55
- confirmed `McpContextProvider::getContext()` — returns the request's Context — vendor/shopware/core/Framework/Mcp/Context/McpContextProvider.php:28
- unverified `McpPrompt` — `Mcp\Capability\Attribute` attributes live in mcp/sdk, out of scope
