---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/mcp-server.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/mcp-server.md
  - platform/dev/6.7/products/tools/mcp-server/extending.md
  - platform/dev/6.7/products/tools/mcp-server/configuration.md
  - platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md
sourceHash: ecef6503d225d5004a08106013246c584244ff97
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/mcp-server.html
title: MCP Server Extension
version: "6.7"
versions:
  - "6.7"
keywords: ["McpTool", "McpToolResponse", "McpToolGroup", "McpToolDependsOn", "McpToolRequires", "McpContextProvider", "shopware.mcp.tool", "shopware.mcp.prompt", "shopware.mcp.resource", "debug:mcp", "requirePrivilege", "mcp server", "ai agent tools", "model context protocol", "plugin mcp tool"]
summary: Add MCP tools, prompts and resources from a plugin or bundle - McpTool on the class, McpToolResponse, tool groups, ACL, shopware.mcp.tool tag (6.7.14+).
lastBuilt: 2026-10-21
---
## What it is

How a Shopware plugin or Symfony bundle adds in-process tools, prompts and resources to the Shopware MCP server, with full DAL and container access. Tools are served on the Admin API MCP endpoint (`/api/_mcp`). For webhook-based capabilities see [Extending via App](platform/dev/6.7/guides/plugins/apps/mcp-server.md); for a comparison see [Extending the MCP Server](platform/dev/6.7/products/tools/mcp-server/extending.md).

## When to use

Your tool needs DAL repositories, services or the Symfony container, should ship via the Marketplace, or is tied to the plugin lifecycle.

## Key steps / config

Naming: capability names may only contain `a-zA-Z0-9_-` (no dots). Use `{vendor-name}-{tool-name}` (e.g. `swag-erp-sync-orders`); `shopware-{name}` is reserved for core.

1. Tool class — `#[McpTool]` on the class, extend `McpToolResponse`, get the context from `McpContextProvider`:

```php
#[McpTool(name: 'swag-my-plugin-orders', title: 'Order List', description: '...')]
#[McpToolGroup('swag-my-plugin')]
#[McpToolDependsOn('shopware-entity-schema')]
#[McpToolRequires('order:read')]
class MyTool extends McpToolResponse
{
    public function __construct(private readonly EntityRepository $orderRepository, private readonly McpContextProvider $contextProvider) {}
    /** @param string $email the customer's email address */
    public function __invoke(string $email, int $limit = 10): string
    {
        $context = $this->contextProvider->getContext();
        if ($error = $this->requirePrivilege($context, 'order:read')) { return $error; }
        /* search ... */ return $this->success($data, ['total' => $total]);
    }
}
```

Imports: `Mcp\Capability\Attribute\McpTool`, `Shopware\Core\Framework\Mcp\Attribute\McpToolGroup`, `...\McpToolDependsOn`, `...\McpToolRequires`, `Shopware\Core\Framework\Mcp\Context\McpContextProvider`, `Shopware\Core\Framework\Mcp\Tool\McpToolResponse`.

- `__invoke()` parameter types (`string`, `int`, `float`, `bool`) become JSON schema; defaults make parameters optional; `@param` text becomes the parameter `description` in `inputSchema`.
- Return a `string`. Use `$this->success()` / `$this->error()`; for write tools `$this->executeWithDryRun()`.

2. Group — `#[McpToolGroup('swag-my-plugin')]`, one group per tool. Each group becomes a toolset clients can enable per session; title is generated (`swag-my-plugin` → "Swag my plugin tools"). Without the attribute, the longest hyphen-segment prefix shared with other ungrouped tools is used (case-insensitive), falling back to the first segment. The special group `discovery` puts a tool in the initial session surface (always advertised, not listed in `shopware-toolsets-list`).

3. Dependencies and privileges — `#[McpToolDependsOn('<tool>')]` (repeatable; enabling the tool adds its transitive dependencies to the integration allowlist). `#[McpToolRequires('order:read')]` or `#[McpToolRequires(entityParam: 'entity', operations: ['read', 'update'])]` is declarative only (Admin UI coverage warnings, `debug:mcp`); enforce at runtime with `requirePrivilege()`.

4. Register in `src/Resources/config/services.php`:

```php
$services->set(MyTool::class)
    ->args([service('order.repository'), service(McpContextProvider::class)])
    ->tag('shopware.mcp.tool');
```

Tags: `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource` — remapped at compile time to `mcp.tool`/`mcp.prompt`/`mcp.resource`. No feature-flag tag or namespace config needed.

5. Install and verify:

```bash
bin/console plugin:refresh
bin/console plugin:install --activate SwagMyPlugin
bin/console cache:clear
bin/console debug:mcp
```

Prompts: `#[McpPrompt(name: ..., title: ..., description: ...)]` (`Mcp\Capability\Attribute\McpPrompt`), `__invoke(): array` returning `[['role' => 'user', 'content' => '...']]`. Resources: `#[McpResource(uri: 'swag-my-plugin://config', name: ..., description: ...)]` (`Mcp\Capability\Attribute\McpResource`), `__invoke(): array` returning `uri`, `mimeType`, `text`.

Symfony bundle: extend `Symfony\Component\HttpKernel\Bundle\Bundle`, register in `config/bundles.php`, load `services.php` in `build()` via `PhpFileLoader`; same tags, no install lifecycle.

## Essential identifiers

- `Mcp\Capability\Attribute\McpTool`, `McpPrompt`, `McpResource`
- `Shopware\Core\Framework\Mcp\Attribute\McpToolGroup`, `McpToolDependsOn`, `McpToolRequires`
- `Shopware\Core\Framework\Mcp\Tool\McpToolResponse` — `success()`, `error()`, `requirePrivilege()`, `executeWithDryRun()`
- `Shopware\Core\Framework\Mcp\Context\McpContextProvider::getContext()`
- Tags `shopware.mcp.tool`, `shopware.mcp.prompt`, `shopware.mcp.resource`
- `bin/console debug:mcp`, `bin/console debug:mcp --native`

## Gotchas

- `#[McpTool]` on `__invoke()` instead of the class silently drops the tool.
- Dots in names (`swag-my-plugin.orders`) are invalid.
- Do not add a `Context` parameter to `__invoke()` (not injected) and never use `Context::createDefaultContext()` — it bypasses the integration's ACL.
- `#[McpToolRequires]` without a `requirePrivilege()` call enforces nothing.
- Unhandled exceptions produce a generic MCP error `-32603`; catch and return `$this->error($message)`.
- Plugin tools use `shopware.mcp.tool`, not `mcp.tool`. If `debug:mcp` doesn't list the tool, check plugin active, tag, attribute placement.

## Version notes

- Describes 6.7.14.0+. Earlier 6.7 versions need `MCP_SERVER=1` and have no tool groups/toolsets (skip step 2) — see [Configuration](platform/dev/6.7/products/tools/mcp-server/configuration.md).
- Since 6.7.15.0 `debug:mcp` lists tools only; use `debug:mcp --native` for prompts and resources.

## Code check (6.7.15.1)
- confirmed `shopware.mcp.tool` — remapped to `mcp.tool` (also prompt/resource) — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `McpToolResponse::requirePrivilege()` — returns `?string` error — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:147
- confirmed `McpToolResponse::success()` — `(array $data, array $meta = [])` — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:62
- confirmed `McpToolResponse::error()` — `(string $message)` — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:121
- confirmed `McpToolResponse::executeWithDryRun()` — takes `Connection`, `Context`, callable — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:178
- confirmed `McpContextProvider::getContext()` — returns `Context` — vendor/shopware/core/Framework/Mcp/Context/McpContextProvider.php:28
- confirmed `McpToolGroup` — not repeatable — vendor/shopware/core/Framework/Mcp/Attribute/McpToolGroup.php:12
- confirmed `McpToolDependsOn` — class-level, `IS_REPEATABLE` — vendor/shopware/core/Framework/Mcp/Attribute/McpToolDependsOn.php:27
- confirmed `McpToolRequires` — `privilege`, `entityParam`, `operations` args — vendor/shopware/core/Framework/Mcp/Attribute/McpToolRequires.php:16
- confirmed `McpToolsetRegistry::DISCOVERY_GROUP` — value `discovery` — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:24
