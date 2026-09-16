---
id: platform/dev/6.7/products/tools/_index.md
title: Tools
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/
sourceHash: c1e30391a1a7d16839c194dc251d4064b231415e
codeCheckedAgainst: "6.7.13.0"
keywords: ["tools", "developer tools", "shopware cli", "shopware-cli", "mcp server", "model context protocol", "ai clients", "claude code", "cursor", "ci/cd"]
summary: "Index of standalone Shopware developer tools: Shopware CLI (projects, extensions, Store packaging, CI/CD) and the MCP Server for AI clients."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/products/tools/mcp-server/_index.md"]
---
## What it is

Overview of the standalone developer tools for building, running and extending Shopware.

## When to use

When choosing a tool for managing Shopware projects and extensions from the command line, or for letting an AI client work with a shop.

## Key steps / config

- [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md) — command-line tool for managing projects and extensions, packaging for the Store, and running CI/CD pipelines.
- [MCP Server](platform/dev/6.7/products/tools/mcp-server/_index.md) — a native Model Context Protocol server that lets AI clients (Claude Desktop, Cursor, Claude Code) interact with a Shopware shop through tools, resources and prompts; extensible via plugins and apps.

## Code check (6.7.13.0)
- confirmed `mcp/sdk` — core requires the MCP SDK, i.e. the MCP server ships with core — vendor/shopware/core/composer.json:92
- confirmed `symfony/mcp-bundle` — core depends on the Symfony MCP bundle — vendor/shopware/core/composer.json:135
- confirmed `Mcp/Controller` — core framework routes import the MCP controllers — vendor/shopware/core/Framework/Resources/config/routes.xml:20
- unverified `shopware-cli` — standalone Go binary, not part of vendor/shopware
