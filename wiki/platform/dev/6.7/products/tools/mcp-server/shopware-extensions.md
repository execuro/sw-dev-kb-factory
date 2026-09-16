---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md
sourceHash: 0fe20ae2b4b0f81ecc473c2f367abdcd7f197cef
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/shopware-extensions.html
title: Shopware Extensions
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware Copilot", "SwagMcpMerchantTools", "SwagMcpDevTools", "ai-coding-tools", "/api/_mcp", "merchant-order-summary", "swag-dev-tools-log-stream", "shopware://extensions", "mcp extensions", "merchant tools", "log diagnostics", "claude code plugin"]
summary: "MCP-related projects beyond core: Shopware Copilot, SwagMcpMerchantTools (merchant-*), SwagMcpDevTools (log tools) and the ai-coding-tools marketplace."
lastBuilt: 2026-09-15
---
## What it is

Overview of MCP-related projects next to the core MCP server at `/api/_mcp`: the Administration assistant Shopware Copilot, two experimental Composer packages adding MCP tools, and a Claude Code plugin marketplace for local development.

## When to use

Deciding whether merchant workflow tools or remote log diagnostics need an extra package, or separating the shop's MCP endpoint from IDE-side developer tooling.

## Key steps / config

**Shopware Copilot** — AI assistant in the Administration and primary consumer of `/api/_mcp`; uses the registered tools once the MCP server is enabled, no extra configuration.

**SwagMcpMerchantTools** (plugin, `shopware/SwagMcpMerchantTools`)
- Install: `composer require swag/mcp-merchant-tools`; tool prefix `merchant-*`.
- High-level workflows with human-readable parameters: `merchant-order-summary`, `merchant-customer-lookup`, `merchant-product-create`, `merchant-revenue-report`, `merchant-bestseller-report`, `merchant-storefront-search`, `merchant-cart-manage`, `merchant-cart-checkout`, `merchant-checkout-methods`.
- Writing tools default to `dryRun=true`.

**SwagMcpDevTools** (Symfony bundle, not a plugin, `shopware/SwagMcpDevTools`)
- Install: `composer require swag/mcp-dev-tools`, then one line in `config/bundles.php`.
- Tools: `swag-dev-tools-log-stream` (recent Monolog entries by level/timestamp), `swag-dev-tools-log-search` (substring search, optional level/filename filters).
- Read-only, gated by MCP authentication and the per-integration allowlist; secrets redacted, values over 300 characters truncated. Targets SaaS, staging and on-premises instances.

**ai-coding-tools** (`shopwareLabs/ai-coding-tools`, MIT, community) — Claude Code marketplace for local dev tasks (`bin/console`, tests, linting, boilerplate); unrelated to `/api/_mcp`:

```bash
/plugin marketplace add shopwareLabs/ai-coding-tools
/plugin install dev-tooling@shopware-ai-coding-tools
```

Plugins include `dev-tooling`, `gh-tooling`, `test-writing`, `chunkhound-integration`.

## Essential identifiers

- `/api/_mcp`, `shopware://extensions`
- `swag/mcp-merchant-tools`, `merchant-*`
- `swag/mcp-dev-tools`, `swag-dev-tools-log-stream`, `swag-dev-tools-log-search`

## Gotchas

- All three packages are experimental without backward-compatibility guarantee; the merchant tools may be dropped in favour of Copilot.
- In 6.7.13.0 the core `shopware://extensions` resource hardcodes the extension as `SwagMcpMerchantAssistant` (install `bin/console plugin:install --activate SwagMcpMerchantAssistant`), not the docs' package name.
- The MCP endpoints return 404 unless the `MCP_SERVER` feature flag (default `false`) is active.

## Code check (6.7.13.0)
- confirmed `/api/_mcp` — Admin API MCP route `api.mcp.endpoint` — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:76
- confirmed `MCP_SERVER` — endpoint returns 404 when the flag is inactive — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:83
- confirmed `MCP_SERVER` — feature flag default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- confirmed `shopware://extensions` — core resource listing optional MCP extensions — vendor/shopware/core/Framework/Mcp/Resource/ExtensionsResource.php:19
- corrected `SwagMcpMerchantAssistant` — docs: SwagMcpMerchantTools; core extension list names SwagMcpMerchantAssistant, prefix merchant- — vendor/shopware/core/Framework/Mcp/Resource/ExtensionsResource.php:76
- unverified `SwagMcpMerchantTools` — external Composer package, not in vendor/shopware
- unverified `swag/mcp-dev-tools` — external bundle package, not in vendor/shopware
- unverified `ai-coding-tools` — external Claude Code marketplace, out of scope
