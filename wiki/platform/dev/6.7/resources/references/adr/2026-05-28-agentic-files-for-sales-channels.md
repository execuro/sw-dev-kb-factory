---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-05-28-agentic-files-for-sales-channels.md
sourceHash: 5fc4b6fa87c0998cf3a6813e3aa563980bea41ce
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-28-agentic-files-for-sales-channels.html
title: Agentic files for sales channels
version: "6.7"
versions:
  - "6.7"
keywords: ["agentic files", "llms.txt", "AGENTS.md", ".well-known/ai-catalog.json", "Resources/views/files/agentic", "sales_channel_file", "template_overrides", "user_provided_content", "agentic_llms_extensions", "SalesChannelFileRenderParametersExtension", "salesChannelFileContext", "/api/_action/sales-channel-file", "public files", "twig namespace override"]
summary: "ADR: per-sales-channel public files (llms.txt, AGENTS.md, .well-known/*) discovered from Resources/views/files/agentic/**.twig, with merchant Twig overrides."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record for a generic sales-channel file backend. Its first file family, `agentic`, lets merchants expose public files such as `llms.txt`, `AGENTS.md` and `.well-known/` metadata per sales channel. Files are declared purely by shipping a Twig template in a known location (no provider interface), rendered from Shopware context, overridable by merchants per sales channel, and extensible by core, plugins, apps and themes through normal Twig inheritance.

## When to use

- A plugin, app or theme should publish or extend an agentic file (for example append to `llms.txt` or add a `.well-known/*.json`).
- You need extra Twig variables while such a file renders.
- You debug why a public file returns 404, or work with the `sales_channel_file` storage or its Administration API.

## Key steps / config

**Template location and public path** — the path below `files/agentic` minus `.twig` is the public path; subfolders and dot folders are allowed; lookup is case-insensitive; content type comes from the extension (UTF-8 charset):

| Template | Public path |
|---|---|
| `Resources/views/files/agentic/llms.txt.twig` | `/llms.txt` |
| `Resources/views/files/agentic/AGENTS.md.twig` | `/AGENTS.md` |
| `Resources/views/files/agentic/.well-known/ai-catalog.json.twig` | `/.well-known/ai-catalog.json` |

Core ships these three in the `@Framework` namespace. Extend one through its empty extension block:

```twig
{% sw_extends '@Framework/files/agentic/llms.txt.twig' %}

{% block agentic_llms_extensions %}
UCP clients may use the product discovery and cart capabilities exposed by this plugin.
{% endblock %}
```

Additive blocks: `agentic_llms_extensions`, `agentic_agents_extensions`; `user_provided_content` backs the Administration "Custom Notes" field. A new file is just a new template, e.g. `Resources/views/files/agentic/.well-known/ucp.json.twig`.

**Extra render data** — subscribe to `SalesChannelFileRenderParametersExtension::onPost()` (extension name `sales-channel-file.render-parameters`) and add to `$extension->result`; the extension exposes `$file`, `$context` and `$salesChannel`. Core passes file-specific data (public base URL, publisher host, Store API MCP endpoint) via the `salesChannelFileContext` variable; `salesChannelFile` is the file metadata object.

**Serving** — a core subscriber on `KernelEvents::EXCEPTION` (priority -90) handles only main-request `GET`/`HEAD` 404s without a matched `_route`. It validates the path, restores the sales channel context from the request when possible, loads the discovered file, checks the `sales_channel_file` row, renders with overrides and returns a cacheable response. Explicit routes (`/robots.txt`, `/sitemap.xml`, `/.well-known/change-password`) keep precedence.

**Storage** — table `sales_channel_file`: `id`, `sales_channel_id`, `file_family`, `file_name` (no leading slash, e.g. `.well-known/ucp.json`), `enabled`, `template_overrides`, `created_at`, `updated_at`; unique per sales channel, family and file name. `template_overrides` is JSON keyed by Twig namespace:

```json
{ "Framework": "{% block agentic_llms_extensions %}...{% endblock %}", "Ucp": "..." }
```

**Administration API** (ACL `sales_channel_file:read`):

- `GET /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}`
- `GET /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/detail?fileName=<fileName>`
- `POST /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/preview`

## Essential identifiers

- `Resources/views/files/<file-family>/**/*.twig`, family `agentic`
- `@Framework/files/agentic/llms.txt.twig`, `AGENTS.md.twig`, `.well-known/ai-catalog.json.twig`
- `agentic_llms_extensions`, `agentic_agents_extensions`, `user_provided_content`
- `SalesChannelFileRenderParametersExtension`, `salesChannelFileContext`, `salesChannelFile`
- `sales_channel_file`, `template_overrides`, `file_family`, `file_name`
- `api.action.sales_channel_file.list` / `.detail` / `.preview`

## Gotchas

- Files are opt-in per sales channel: no row or `enabled` false means a normal 404, as do invalid or undiscovered paths.
- Path validation rejects empty or absolute paths, trailing `/`, empty, `.` or `..` segments, backslashes, NUL bytes, paths without an extension and disallowed characters; input is never concatenated into a template name and must not be double-decoded.
- Overrides are keyed by Twig namespace, not file family. Resetting removes the namespace key; shipped templates are never copied to the database.
- Responses are cache-tagged per `sales_channel_file.id`; template changes need a full cache clear on deploy.
- Only the HTTP behaviour is BC-promised. PHP services, entities, tables, default text and the Administration components are internal; prefer the extension blocks over core structure blocks.
- Apps can only ship these templates if app template loading allows the `files` root.
- `ai-catalog.json` lists the Store API MCP server (`application/mcp-server+json`) only when the MCP feature is active for a headless sales channel.

## Code check (6.7.15.1)
- confirmed `agentic_llms_extensions` — empty extension block in core llms.txt template, followed by `user_provided_content` — vendor/shopware/core/Framework/Resources/views/files/agentic/llms.txt.twig:93
- confirmed `agentic_agents_extensions` — extension block in core AGENTS.md template — vendor/shopware/core/Framework/Resources/views/files/agentic/AGENTS.md.twig:37
- confirmed `agentic_ai_catalog_json` — core `.well-known/ai-catalog.json.twig` exists — vendor/shopware/core/Framework/Resources/views/files/agentic/.well-known/ai-catalog.json.twig:1
- confirmed `SalesChannelFileRenderParametersExtension` — exposes file, context, salesChannel; name sales-channel-file.render-parameters — vendor/shopware/core/System/SalesChannel/File/Rendering/Extension/SalesChannelFileRenderParametersExtension.php:22
- confirmed `salesChannelFileContext` — set on the extension result by the Store API MCP subscriber — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:56
- confirmed `KernelEvents::EXCEPTION` — 404 fallback subscriber at priority -90, main request, GET/HEAD, no `_route` — vendor/shopware/core/System/SalesChannel/File/SalesChannelFileNotFoundSubscriber.php:39
- corrected `SalesChannelContextRequestRestorer` — docs: subscriber does not resolve a context itself and returns early when missing; code restores it from the request — vendor/shopware/core/System/SalesChannel/File/SalesChannelFileNotFoundSubscriber.php:32
- confirmed `sales_channel_file` — table with `file_family`, `template_overrides` JSON, unique sc/family/file_name — vendor/shopware/core/Migration/V6_7/Migration1780062008CreateSalesChannelFile.php:24
- confirmed `/api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/detail` — GET detail route, ACL sales_channel_file:read — vendor/shopware/core/System/SalesChannel/File/Api/SalesChannelFileController.php:45
- confirmed `/api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/preview` — POST preview route — vendor/shopware/core/System/SalesChannel/File/Api/SalesChannelFileController.php:63
