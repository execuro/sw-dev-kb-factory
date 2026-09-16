---
id: platform/dev/6.7/guides/plugins/plugins/mcp-server.md
title: MCP Server Extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/mcp-server.html
sourceHash: d217963f18c1db70aa9b8912aaa315b7b2b1ca14
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp", "model context protocol", "McpTool", "McpToolResponse", "McpContextProvider", "McpToolDependsOn", "McpToolRequires", "requirePrivilege", "shopware.mcp.tool", "shopware.mcp.prompt", "shopware.mcp.resource", "debug:mcp", "MCP_SERVER", "ai tools plugin", "McpPrompt"]
summary: "Add MCP tools, prompts and resources from a Shopware plugin: #[McpTool] class extending McpToolResponse, tagged shopware.mcp.tool, checked with debug:mcp"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/extending.md", "platform/dev/6.7/guides/plugins/apps/mcp-server.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/products/tools/mcp-server/best-practices.md"]
---
## What it is

How a Shopware plugin (or plain Symfony bundle) registers in-process PHP tools, prompts and resources on Shopware's MCP server, with full DAL and container access. Remote/webhook capabilities: [Extending via App](platform/dev/6.7/guides/plugins/apps/mcp-server.md); comparison: [Extending the MCP Server](platform/dev/6.7/products/tools/mcp-server/extending.md).

## When to use

A tool needs DAL repositories, services or the container, ships via the Marketplace, or depends on the plugin lifecycle.

## Key steps / config

**Naming**: only `a-zA-Z0-9_-` (no dots). Core reserves `shopware-{name}`; plugins/bundles use `{vendor-name}-{tool-name}` (e.g. `swag-erp-sync-orders`); apps are auto-prefixed. Same for tools, prompts, resources.

**1. Tool class** — attributes on the class, extend `Shopware\Core\Framework\Mcp\Tool\McpToolResponse`:

```php
#[McpTool(name: 'swag-my-plugin-orders', title: 'Order List', description: '...')] // Mcp\Capability\Attribute\McpTool
#[McpToolDependsOn('shopware-entity-schema')]
#[McpToolRequires('order:read')]
class MyTool extends McpToolResponse
{
    public function __construct(private readonly EntityRepository $orderRepository, private readonly McpContextProvider $contextProvider) {}
    public function __invoke(string $email, int $limit = 10): string
    {
        $context = $this->contextProvider->getContext();
        if ($error = $this->requirePrivilege($context, 'order:read')) { return $error; }
        // search ... return $this->success($data, ['total' => $total]);
    }
}
```

- `title` optional (clients display it instead of `name`).
- `__invoke()` parameters map to JSON schema: `string`, `int`, `float`, `bool`; defaults make them optional. Return a `string`.
- Context only via `McpContextProvider::getContext()` — no `Context` parameter on `__invoke()`, never `Context::createDefaultContext()` (bypasses the integration ACL).

**2. Dependencies and privileges** (repeatable):
- `#[McpToolDependsOn('shopware-entity-search')]` — enabling the tool in the Admin allowlist auto-adds transitive dependencies; declare only genuine needs.
- `#[McpToolRequires('order:read')]` or `#[McpToolRequires(entityParam: 'entity', operations: ['read', 'update'])]` — declarative only (Admin warnings, `debug:mcp`); enforcement needs `requirePrivilege()`.

**3. Register** in `src/Resources/config/services.php`:

```php
$services->set(MyTool::class)
    ->args([service('order.repository'), service(McpContextProvider::class)])
    ->tag('shopware.mcp.tool');
```

Tags: `shopware.mcp.tool`, `shopware.mcp.prompt` (class with `#[McpPrompt]`, `__invoke()` returns role/content messages), `shopware.mcp.resource` (`#[McpResource(uri:, name:, description:)]`, returns `uri`, `mimeType`, `text`). The compiler remaps them to `mcp.tool` / `mcp.prompt` / `mcp.resource`; no `shopware.feature` tag needed.

**4. Install and verify**:

```bash
bin/console plugin:refresh
bin/console plugin:install --activate SwagMyPlugin
bin/console cache:clear
bin/console debug:mcp
```

**Symfony bundle**: same tags; the bundle extends `Symfony\Component\HttpKernel\Bundle\Bundle`, is active once in `config/bundles.php`, and loads `services.php` in `build()` via `PhpFileLoader`.

## Essential identifiers

- `Mcp\Capability\Attribute\McpTool`, `McpPrompt`, `McpResource`
- `Shopware\Core\Framework\Mcp\Tool\McpToolResponse` (`success()`, `error()`, `requirePrivilege()`, `executeWithDryRun()`)
- `Shopware\Core\Framework\Mcp\Context\McpContextProvider`
- `Shopware\Core\Framework\Mcp\Attribute\McpToolDependsOn`, `Shopware\Core\Framework\Mcp\Attribute\McpToolRequires`
- Tags `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource`; `bin/console debug:mcp`; flag `MCP_SERVER`

## Gotchas

- `#[McpTool]` on `__invoke()` silently drops the tool; `debug:mcp` not listing it means inactive plugin, missing tag, or misplaced attribute.
- Dots in names are invalid.
- Unhandled exceptions give a generic MCP error (`-32603`); catch and return `$this->error($e->getMessage())`. Write tools: `$this->executeWithDryRun()` catches exceptions.
- `#[McpToolGroup]` (`Shopware\Core\Framework\Mcp\Attribute\McpToolGroup`) appears in the source but does not exist in 6.7.13.0.

## Version notes

- Source targets 6.7.14.0+: `#[McpToolGroup('swag-my-plugin')]` assigns a tool to exactly one group, which becomes a client-enableable toolset; without it the group is inferred from the longest shared hyphen prefix among ungrouped tools. The special `discovery` group is always advertised and absent from `shopware-toolsets-list`.
- Earlier 6.7 (including 6.7.13.0): no groups/toolsets; feature flag `MCP_SERVER` defaults off, so set `MCP_SERVER=1`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Mcp\Attribute\McpToolGroup` — not in the installed code index (tool groups arrive with 6.7.14.0 per docs)
- confirmed `MCP_SERVER` — feature flag, default false, must be enabled on 6.7.13.0 — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- confirmed `McpToolResponse::requirePrivilege()` — returns ?string error — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- confirmed `McpToolResponse::success()` — protected helper with data and meta — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:62
- confirmed `McpToolResponse::executeWithDryRun()` — takes Connection, Context, callable — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:167
- confirmed `McpContextProvider::getContext()` — returns Context — vendor/shopware/core/Framework/Mcp/Context/McpContextProvider.php:28
- confirmed `McpToolDependsOn` — class-level, repeatable attribute — vendor/shopware/core/Framework/Mcp/Attribute/McpToolDependsOn.php:28
- confirmed `McpToolRequires` — repeatable; privilege, entityParam, operations arguments — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:31
- confirmed `shopware.mcp.tool` — remapped to mcp.tool (prompt/resource likewise) — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:32
- confirmed `debug:mcp` — console command lists registered capabilities — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:28
