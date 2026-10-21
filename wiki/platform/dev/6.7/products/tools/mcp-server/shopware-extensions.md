---
id: platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md
title: Shopware Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/shopware-extensions.html
sourceHash: 0fe20ae2b4b0f81ecc473c2f367abdcd7f197cef
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware copilot", "SwagMcpMerchantTools", "swag/mcp-merchant-tools", "SwagMcpDevTools", "swag/mcp-dev-tools", "ai-coding-tools", "merchant-*", "swag-dev-tools-*", "/api/_mcp", "shopware://extensions", "mcp plugin", "claude code plugin marketplace"]
summary: "Shopware MCP add-ons: Copilot in Admin, SwagMcpMerchantTools (merchant-* tools), SwagMcpDevTools (log tools), and the ai-coding-tools IDE marketplace."
lastBuilt: 2026-10-21
---
## What it is

An overview of MCP-related projects Shopware ships beyond the core MCP server: Shopware Copilot, the `SwagMcpMerchantTools` plugin, the `SwagMcpDevTools` bundle, and the community `ai-coding-tools` Claude Code plugin marketplace — what each does, who it is for, and how to install it.

## When to use

When you want higher-level merchant workflow tools or remote log diagnostics on top of the core `/api/_mcp` tools, when you need to know how Copilot relates to the MCP server, or when you want an IDE coding assistant to work against a local Shopware installation.

## Key steps / config

**Shopware Copilot** — the AI assistant embedded in the Administration and the primary consumer of the MCP server. It connects to the shop's `/api/_mcp` endpoint; no extra configuration is needed — once the MCP server is enabled, Copilot can use the registered tools on behalf of the merchant.

**SwagMcpMerchantTools** (repository `shopware/SwagMcpMerchantTools`, tool prefix `merchant-*`) — a plugin adding merchant-focused workflow tools with human-readable parameters, as opposed to the core DAL primitives (search, read, upsert, delete).

```bash
composer require swag/mcp-merchant-tools
```

| Tool | Purpose |
|---|---|
| `merchant-order-summary` | Order overview: customer, line items, totals, state |
| `merchant-customer-lookup` | Find customer by email, customer number, or UUID |
| `merchant-product-create` | Create product from gross price, tax rate, currency code |
| `merchant-revenue-report` | Revenue by day, week, or month for a date range |
| `merchant-bestseller-report` | Top products by quantity sold |
| `merchant-storefront-search` | Customer-facing search with resolved prices |
| `merchant-cart-manage` / `merchant-cart-checkout` | Create, inspect, modify, and check out a cart |
| `merchant-checkout-methods` | Payment and shipping methods per sales channel |

All writing tools default to `dryRun=true`.

**SwagMcpDevTools** (repository `shopware/SwagMcpDevTools`, tool prefix `swag-dev-tools-*`) — a Symfony bundle (not a plugin) with developer diagnostics for environments host-side tools cannot reach (SaaS, staging, on-premises). Require it, then register it with one line in `config/bundles.php`.

```bash
composer require swag/mcp-dev-tools
```

- `swag-dev-tools-log-stream` — recent Monolog entries from disk, filtered by level and timestamp.
- `swag-dev-tools-log-search` — substring search in log files, optional level and filename filters.

Access is read-only and governed by MCP authentication plus the per-integration allowlist. Passwords, tokens, and auth headers are redacted; values over 300 characters are truncated.

**ai-coding-tools** (`shopwareLabs/ai-coding-tools`, MIT, community) — developer-facing local MCP tools (code generation, tests, linting, cache clearing, deployment), distinct from the shop's `/api/_mcp`. Use it when an IDE assistant should run `bin/console`, execute tests, or generate boilerplate against a local install. In Claude Code:

```bash
/plugin marketplace add shopwareLabs/ai-coding-tools
/plugin install dev-tooling@shopware-ai-coding-tools
```

Bundled plugins include `dev-tooling`, `gh-tooling`, `test-writing`, and `chunkhound-integration`; selected skills are also exported as portable Agent Skills packages for Cursor, Codex, and Gemini CLI.

## Essential identifiers

- `/api/_mcp` (Admin API MCP endpoint used by Copilot)
- `SwagMcpMerchantTools`, `swag/mcp-merchant-tools`, prefix `merchant-*`
- `SwagMcpDevTools`, `swag/mcp-dev-tools`, `config/bundles.php`, prefix `swag-dev-tools-*`
- `shopwareLabs/ai-coding-tools`, `dev-tooling@shopware-ai-coding-tools`

## Gotchas

- `SwagMcpMerchantTools` and `SwagMcpDevTools` are experimental proofs of concept with no backward-compatibility guarantee and may be removed at any time; the merchant tools are likely to give way to Shopware Copilot.
- `ai-coding-tools` is an experimental community project, not an official Shopware product.
- The core `shopware://extensions` resource in 6.7.15.1 still hardcodes the merchant extension as `SwagMcpMerchantAssistant` (prefix `merchant-`, install hint `bin/console plugin:install --activate SwagMcpMerchantAssistant`), not the `SwagMcpMerchantTools` / Composer name this page gives.

## Code check (6.7.15.1)
- confirmed `/api/_mcp` — Admin API MCP route path — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `shopware://extensions` — resource listing known optional MCP extensions — vendor/shopware/core/Framework/Mcp/Resource/ExtensionsResource.php:21
- corrected `SwagMcpMerchantAssistant` — docs: `SwagMcpMerchantTools` via `composer require swag/mcp-merchant-tools`; core resource names `SwagMcpMerchantAssistant` — vendor/shopware/core/Framework/Mcp/Resource/ExtensionsResource.php:80
- confirmed `merchant-` — tool prefix in the extensions resource — vendor/shopware/core/Framework/Mcp/Resource/ExtensionsResource.php:82
- confirmed `swag-dev-tools-log-search` — referenced by the shopware-context prompt — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:49
- confirmed `swag-dev-tools-log-stream` — referenced by the shopware-context prompt — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:50
- confirmed `merchant-storefront-search` — referenced by the shopware-context prompt — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:129
- unverified `swag/mcp-merchant-tools` — separate Composer package, not part of the core checkout
- unverified `swag/mcp-dev-tools` — separate Composer package, not part of the core checkout
- unverified `dev-tooling@shopware-ai-coding-tools` — external community marketplace, out of scope
