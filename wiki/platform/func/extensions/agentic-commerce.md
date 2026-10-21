---
id: platform/func/extensions/agentic-commerce.md
title: Agentic Commerce
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/agentic-commerce
sourceHash: 2545837938ca6209f4868208b70c884f1453ff24d59e3160fddfe3dc4d3d2726
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.29"
  swMax: "6.6.10.29"
  swMin: "6.6.0.0"
keywords: ["Agentic Commerce", "UCP", "Universal Commerce Protocol", "/.well-known/ucp", "product feed", "JSONL feed", "OpenAI", "ChatGPT", "Google Merchant Center", "ai-catalog.json", "agents.md", "llms.txt", "MCP", "A2A", "Agentic files"]
summary: "Agentic Commerce extension (beta): product feed sales channel for ChatGPT and Google, UCP profile at /.well-known/ucp, and agentic files."
lastBuilt: 2026-10-20
---
## What it is

Agentic Commerce is an extension (install via **Extensions > My Extensions**, beta, article applies from extension version 1.1.0) with two components: the Universal Commerce Protocol (UCP), which lets AI commerce agents discover and use a shop, and a Product Feed sales channel that supplies product data to external systems and AI agents.

## When to use

When exposing a shop's catalogue to AI platforms such as ChatGPT or Google Merchant Center via a feed, or letting AI agents browse, cart and check out through UCP.

## Key steps / config

### Product feed sales channel

Create an **Agentic Commerce** sales channel under **Sales channels** (plus icon). Tabs and fields:

- **Basic settings**: Template (currently OpenAI), Name, favourite.
- **OpenAI settings**: mandatory Return policy URL; mapping of existing properties to Variant color, size, size system, gender, material and custom variant mappings (Shopware has no predefined color/size properties; only height, length, width, weight exist by default).
- **Google Settings**: map variant properties to Condition, Color, Size, Size System, Gender, Age Group, Material, plus Custom Variant Mapping.
- **Tracking codes**: Affiliate code, Campaign code.
- **Storefront sales channel**: storefront sales channel, domain for product URLs, currency; language and customer group are derived.
- **Product export**: Export variants as discrete products, Interval (for example Live), Generate via scheduler (if off, the feed is generated on URL access, slowing the first load after the interval), Dynamic product group.
- **Status**: Active, Maintenance, IP addresses allowlist.
- **Integration**: OpenAI needs merchant registration at chatgpt.com/merchants and submission of the public export URL (JSONL feed, no authentication). Google Merchant Center: create a product source with scheduled fetch via URL using the export URL.
- **Template**: Header row, Product row, Footer row in Twig; Test template, Generate preview, Reset to default.
- **Statistics**: Referred orders, customers and turnover with a time filter.

### UCP (Universal Commerce Protocol)

Configured per **Storefront** or **Headless** sales channel in the **Agentic Commerce** tab (independent of the feed channel); changes apply after saving and need the permission to edit the UCP configuration.

- **Expose via UCP** publishes the profile at `/.well-known/ucp`. **Profile domain**: the single domain is used automatically, otherwise select one (first domain by default); a sales channel without a domain cannot be exposed.
- **Capabilities** (all active by default): Browse catalog, Cart, Discounts, Checkout, Orders. Deactivated ones are removed from the profile.
- **Transports**: REST (default), A2A, Embedded, MCP (starting with Shopware 6.7); at least one required.
- **Preview** shows the profile including unsaved changes.

### Agentic files

Publicly available AI-readable files per sales channel: `ai-catalog.json` (catalog for Agentic Resource Discovery), `agents.md` (context for agent clients), `llms.txt` (Markdown index for AI assistants).

## Essential identifiers

- `/.well-known/ucp`
- `ai-catalog.json`, `agents.md`, `llms.txt`

## Gotchas

- ChatGPT Marketplace registration is currently US only, not available in Europe.
- The feed must be publicly reachable; otherwise products cannot appear on AI platforms, and appearing in results can take time.
- Beta: scope and behaviour may change.

## Version notes

UCP transport MCP starts with Shopware 6.7.
