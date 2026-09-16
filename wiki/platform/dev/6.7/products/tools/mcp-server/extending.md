---
id: platform/dev/6.7/products/tools/mcp-server/extending.md
title: Extending the MCP Server
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/extending.html
sourceHash: d2f551fadb369d204f487a10ffb72339e72e8d1d
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.mcp.tool", "shopware.mcp.prompt", "shopware.mcp.resource", "McpToolResponse", "McpContextProvider", "McpToolRequires", "mcp.xml", "mcp-tool", "custom mcp tool", "mcp prompt", "mcp resource", "MCP_SERVER", "plugin app bundle"]
summary: "Reference for adding MCP tools, prompts and resources via app (Resources/mcp.xml + webhook), plugin or Symfony bundle (attributes + shopware.mcp.* tags)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/mcp-server.md", "platform/dev/6.7/guides/plugins/apps/mcp-server.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md"]
---
## What it is

Quick reference for contributing MCP tools, prompts and resources as an app (webhook, Cloud-compatible, no DAL), a plugin (in-process, full DAL) or a Symfony bundle (in-process, always active once in `config/bundles.php`). Guides: [plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [app](platform/dev/6.7/guides/plugins/apps/mcp-server.md).

## When to use

When adding custom AI-callable capabilities and you need the registration pattern for your extension type.

## Key steps / config

**Enable (installed 6.7.13.0)**: endpoints return 404 unless feature flag `MCP_SERVER` is active — set `MCP_SERVER=1`. Extension services need no `shopware.feature` tag.

**Tools — app**: declare in `Resources/mcp.xml`, handle via webhook POST, return JSON ideally as `{"success": bool, "data": ...}`. Names are auto-prefixed with the app name; `<required-privileges>` is informational; `url="/..."` routes to an app script.

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

**Tools — plugin/bundle**: `#[McpTool]` on a class extending `Shopware\Core\Framework\Mcp\Tool\McpToolResponse`, service tagged `shopware.mcp.tool` in `services.php`. Inject `McpContextProvider` via the constructor — the base class does not provide it. Bundles load the same `services.php` in `build(ContainerBuilder $container)`.

```php
#[McpTool(name: 'swag-my-plugin-orders', title: 'Order List', description: 'List recent orders.')]
#[McpToolRequires('order:read')]
class OrdersTool extends McpToolResponse
{
    public function __construct(private readonly McpContextProvider $contextProvider) {}
    public function __invoke(int $limit = 10): string
    {
        $context = $this->contextProvider->getContext();
        if ($error = $this->requirePrivilege($context, 'order:read')) { return $error; }
        // ... return $this->success([...]);
    }
}
```

`#[McpToolRequires]` is declarative; enforcement is `requirePrivilege()` plus DAL ACL.

**Prompts**: app — `<mcp-prompts><mcp-prompt name="erp-context" url="...">` with `<label>`/`<description>`; webhook body uses `prompt` and returns `[{"role": "user", "content": "..."}]`. Plugin — `#[McpPrompt(name:, title:, description:)]` class whose `__invoke(): array` returns `role`/`content` messages, tag `shopware.mcp.prompt`, no `McpToolResponse` needed.

**Resources**: app — `<mcp-resource name="erp-status" uri="my-erp://status" url="..." mime-type="application/json">` (both `uri` and `url`); webhook body uses `resource`, returns `{uri, mimeType, text}`. Plugin — `#[McpResource(uri:, name:, description:)]`, `__invoke(): array` with `uri`, `mimeType`, `text`, tag `shopware.mcp.resource`.

Apps read shop context from `source.shopId` in the webhook body.

## Essential identifiers

- `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource`
- `McpToolResponse`, `McpContextProvider::getContext()`, `#[McpToolRequires]`
- `Resources/mcp.xml`: `<mcp-tool>`, `<mcp-prompt>`, `<mcp-resource>`

## Gotchas

- The source describes 6.7.14.0+, with `#[McpToolGroup]` (one group per tool, else inferred from the longest shared hyphen prefix such as `swag-my-plugin`) and app toolsets. Installed 6.7.13.0 has neither; allowed tools are advertised directly.

## Version notes

- 6.7.11.0–6.7.13.x: server behind `MCP_SERVER`. 6.7.14.0+ (per docs): flag removed, tool groups and toolsets added.

## Code check (6.7.13.0)
- confirmed `MCP_SERVER` — endpoint returns 404 unless `Feature::isActive('MCP_SERVER')` — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:83
- absent `McpToolGroup` — not found in the installed code index; docs target 6.7.14.0+
- confirmed `shopware.mcp.tool` — tagged services collected by compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:43
- confirmed `shopware.mcp.prompt` — tagged prompt services collected — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:57
- confirmed `shopware.mcp.resource` — tagged resource services collected — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:69
- confirmed `McpToolResponse::requirePrivilege()` — returns error JSON or null — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- corrected `McpToolResponse` — docs: snippet reads `$this->contextProvider` without injecting it; base class declares no such property — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `McpContextProvider::getContext()` — returns authenticated Context — vendor/shopware/core/Framework/Mcp/Context/McpContextProvider.php:28
- confirmed `McpToolRequires` — attribute class — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:31
- confirmed `required-privileges` — optional element in app mcp.xml schema — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:73
