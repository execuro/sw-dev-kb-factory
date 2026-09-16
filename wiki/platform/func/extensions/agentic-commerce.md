---
id: platform/func/extensions/agentic-commerce.md
title: Agentic Commerce
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/agentic-commerce
sourceHash: 98a80007cf3d479f1bef5355cc28c64c92b14b2706b36f15ece4fcda6a36a9b8
revision:
  current: true
  range: "6.7.0.0"
  swMax: null
  swMin: null
keywords: ["Agentic Commerce", "Universal Commerce Protocol", "UCP", "Product Feed Sales Channel", "ai-catalog.json", "agents.md", "llms.txt", "ChatGPT Marketplace", "Google Merchant Center", "sales channel", "JSONL feed", "Twig"]
summary: "Beta extension exposing a shop to AI agents via UCP and a JSONL product feed sales channel for ChatGPT/Google Merchant Center."
lastBuilt: "2026-09-15"
---

## What it is

Agentic Commerce is a beta Shopware extension (from version 1.1.0) that adds the Universal Commerce Protocol (UCP) for AI-agent shop discovery, and a Product Feed Sales Channel exposing products to AI platforms (e.g. ChatGPT) and Google Merchant Center via a JSONL feed.

## When to use

When a merchant wants to list products on AI shopping platforms via a standards-compliant feed, or expose an existing sales channel to compatible AI commerce agents over UCP.

## Key steps / config

- Install via **Extensions > My Extensions**.
- Create an **Agentic Commerce sales channel** from Sales channels; pick the OpenAI template.
- OpenAI settings: mandatory **return policy URL**; map shop properties to color, size, size system, gender, material and custom variant mappings for AI platforms.
- Google Settings: map variant properties to Google attributes (Condition, Color, Size, Size System, Gender, Age Group, Material) plus custom variant mappings.
- Storefront sales channel section links the storefront sales channel, domain, currency, language, and customer group used to source product data.
- Product export: export variants as discrete products, set the feed interval, enable "Generate via scheduler" (otherwise the feed regenerates on access), select a dynamic product group.
- Integration: register at chatgpt.com/merchants and submit the export URL (must be public and unauthenticated); or add the export URL as a scheduled-fetch data source in Google Merchant Center.
- Template tab: customize Header row / Product row / Footer row using Shopware's Twig syntax; use **Test template**, **Generate preview**, **Reset to default**.
- Statistics tab: referred orders, referred customers, referred turnover, filterable by time range.
- UCP is configured per sales channel under the **Agentic Commerce** tab (independent of an Agentic Commerce channel). The **Exposure** tab toggles "Make available via UCP" and defines capabilities (Browse catalog, Cart, Discounts, Checkout, Orders) and transports (REST, A2A, Embedded); a **Preview** tab shows the resulting UCP profile.
- **Agentic files**: `ai-catalog.json` (machine-readable catalog for Agentic Resource Discovery), `agents.md` (context/instructions for agent clients), `llms.txt` (Markdown index for AI assistants).

## Essential identifiers

`ai-catalog.json`, `agents.md`, `llms.txt`, Universal Commerce Protocol (UCP), Agentic Commerce sales channel, Product Feed Sales Channel

## Gotchas

- This feature is in beta status; its range of functions and behaviour may still change.
- Registration for the ChatGPT Marketplace is currently only available in the US, not Europe.
- The feed export URL must be publicly accessible without authentication, or products cannot appear on AI platforms.
- Deleting the sales channel cannot be undone.
- The Administration only exposes the standard UCP setup; developers must configure additional technical settings via console commands.

## Version notes

Applies from version 1.1.0 of the Agentic Commerce extension.
