---
id: platform/dev/6.7/products/tools/_index.md
title: Tools
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/
sourceHash: c1e30391a1a7d16839c194dc251d4064b231415e
codeCheckedAgainst: "6.7.15.1"
keywords: ["tools", "developer tools", "Shopware CLI", "shopware-cli", "MCP Server", "Model Context Protocol", "mcp", "AI clients", "Claude Code", "Cursor", "Claude Desktop", "CI/CD"]
summary: "Overview of Shopware's standalone developer tools: Shopware CLI for projects, extensions, Store and CI/CD, and the native MCP Server for AI clients."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/products/tools/mcp-server/_index.md"]
---
## What it is

This is the landing page for Shopware's standalone developer tools, which help you build, run, and extend Shopware. There are two:

- [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md): a command-line tool for managing projects and extensions, packaging extensions for the Store, and running CI/CD pipelines.
- [MCP Server](platform/dev/6.7/products/tools/mcp-server/_index.md): a native Model Context Protocol server. AI clients such as Claude Desktop, Cursor, and Claude Code use it to work with a Shopware shop through tools, resources, and prompts. Plugins and apps can extend it.

## When to use

- Use Shopware CLI to automate project and extension work, Store uploads, or CI/CD builds.
- Use the MCP Server to let an AI client read and act on shop data through MCP tools, resources, and prompts, or to add your own MCP capabilities from a plugin or app.

## Gotchas

- In the installed 6.7.15.1 core, the MCP server is built into the platform. It is not a separate binary. Its configuration only applies when the `mcp` bundle extension is registered. The core capabilities live in the `Shopware\Core\Framework\Mcp` namespace. Shopware CLI, by contrast, is a separate tool and is not in vendor/shopware.

## Code check (6.7.15.1)
- confirmed `mcp` — the core MCP server configuration only applies when the `mcp` container extension exists — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:8
- confirmed `$adminRegistry` — the core Framework Mcp namespace (plus the Storefront Mcp namespace, when installed) is registered for the admin MCP server — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:30
- confirmed `Migration1772626151AppMcpTool` — apps can contribute MCP tools, stored in the `app_mcp_tool` table — vendor/shopware/core/Migration/V6_7/Migration1772626151AppMcpTool.php:13
- unverified `shopware-cli` — standalone Go tool, not part of the checked package roots
