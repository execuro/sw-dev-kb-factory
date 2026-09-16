---
id: platform/dev/6.7/resources/references/adr/2026-05-28-agentic-files-for-sales-channels.md
title: Agentic files for sales channels
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-28-agentic-files-for-sales-channels.html
sourceHash: 5fc4b6fa87c0998cf3a6813e3aa563980bea41ce
codeCheckedAgainst: "6.7.13.0"
keywords: ["llms.txt", "AGENTS.md", "ai-catalog.json", ".well-known", "sales_channel_file", "template_overrides", "user_provided_content", "agentic_llms_extensions", "agentic_agents_extensions", "SalesChannelFileRenderParametersExtension", "salesChannelFileContext", "/api/_action/sales-channel-file", "agentic files", "file family", "ai agents"]
summary: "Agentic files (llms.txt, AGENTS.md, .well-known) per sales channel from Twig templates in Resources/views/files/agentic; overrides in sales_channel_file"
lastBuilt: 2026-09-15
---
## What it is

An ADR (2026-05-28, areas core/administration/storefront) introducing a generic sales-channel public-file backend. The first file family, `agentic`, serves files like `llms.txt`, `AGENTS.md` and `.well-known/*` per sales channel, generated from Twig templates discovered below `Resources/views/files/agentic/`, with per-sales-channel enablement and merchant overrides. No provider interface: a template in the known location declares the file.

## When to use

- A plugin, app or theme wants to add or extend an agentic public file (e.g. `/.well-known/ucp.json`, extra text in `/llms.txt`).
- Debugging why `/llms.txt` or `/AGENTS.md` returns 404 on a sales channel domain, or how merchant overrides are stored.

## Key steps / config

1. Ship a template below `Resources/views/files/<file-family>/**/*.twig`. Public path = relative path below `files/agentic` minus `.twig`:
   - `files/agentic/llms.txt.twig` → `/llms.txt`
   - `files/agentic/AGENTS.md.twig` → `/AGENTS.md`
   - `files/agentic/.well-known/ai-catalog.json.twig` → `/.well-known/ai-catalog.json`
   Core ships these three in `@Framework`. Dot directories are supported; lookup is case-insensitive; content type comes from the file extension (UTF-8 charset).
2. Extend a core template through normal Twig inheritance, preferably via the empty extension blocks:

```twig
{% sw_extends '@Framework/files/agentic/llms.txt.twig' %}

{% block agentic_llms_extensions %}
UCP clients may use the product discovery and cart capabilities exposed by this plugin.
{% endblock %}
```

   Core `llms.txt.twig` blocks: `agentic_llms_header`, `agentic_llms_summary`, `agentic_llms_resources`, `agentic_llms_localization`, `agentic_llms_guidance`, `agentic_llms_extensions`, `user_provided_content`. `AGENTS.md.twig` exposes `agentic_agents_extensions`.
3. Add Twig render data by subscribing to `SalesChannelFileRenderParametersExtension::onPost()` (`Shopware\Core\System\SalesChannel\File\Rendering\Extension\SalesChannelFileRenderParametersExtension`, name `sales-channel-file.render-parameters`) and writing to `$extension->result`; subscribers get the file, sales channel context and loaded sales channel. Core puts base URL/publisher/Store API MCP data into the `salesChannelFileContext` variable; `salesChannelFile` is the file metadata object.
4. Enable the file per sales channel (Administration: "Agentic files" tab on Storefront/Headless sales channel detail). Built-in files are opt-in.

Storage — table `sales_channel_file`, one row per `sales_channel_id` + `file_family` + `file_name` (unique): `id`, `enabled`, `template_overrides` (JSON keyed by Twig namespace), `created_at`, `updated_at`. `file_name` has no leading slash (`.well-known/ucp.json`).

```json
{ "Framework": "{% block agentic_llms_extensions %}...{% endblock %}", "user_provided_content": "..." }
```

Administration HTTP API (route contract public, controller internal):

- `GET /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}`
- `GET /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/detail?fileName=<fileName>`
- `POST /api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/preview`

## Essential identifiers

- `Resources/views/files/agentic/`, `@Framework/files/agentic/llms.txt.twig`
- `sales_channel_file`, `template_overrides`, `user_provided_content`
- `agentic_llms_extensions`, `agentic_agents_extensions`
- `SalesChannelFileRenderParametersExtension::onPost()`, `salesChannelFileContext`
- `TemplateFinder` (template chain resolution)

## Gotchas

- Serving is a 404 fallback: a `KernelEvents::EXCEPTION` subscriber (priority -90) handles only main-request `GET`/`HEAD` 404s with no matched `_route`. Explicit routes (`/robots.txt`, `/sitemap.xml`, `/.well-known/change-password`) win. It is not an SEO URL. The installed subscriber obtains the sales channel context via `SalesChannelContextRequestRestorer` and returns early when none is available.
- Disabled files, missing `sales_channel_file` rows, invalid paths and undiscovered files are plain 404s.
- Path validation rejects empty/absolute paths, trailing `/`, empty, `.` or `..` segments, backslashes, NUL bytes, no extension, disallowed characters; no double-decoding; request input is never concatenated into a template name.
- The override Twig loader is not a database loader; overrides are loaded before render and activated for one render only. Resetting removes the namespace key; shipped template content is never copied to the DB.
- Cache entries are tagged per `sales_channel_file` id; template/discovery changes need a full cache clear on deploy.
- Only documented HTTP behavior is BC-promised; PHP services, entities, tables, default template text and Administration components are internal. Apps must be allowed the `files` template root.

## Code check (6.7.13.0)
- confirmed `SalesChannelFileRenderParametersExtension` — final Extension class for render parameters — vendor/shopware/core/System/SalesChannel/File/Rendering/Extension/SalesChannelFileRenderParametersExtension.php:22
- confirmed `sales_channel_file` — entity name — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelFile/SalesChannelFileDefinition.php:23
- confirmed `template_overrides` — JsonField keyed by Twig namespace — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelFile/SalesChannelFileDefinition.php:58
- confirmed `user_provided_content` — reserved override key rendered as generated block override — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileRenderer.php:25
- confirmed `agentic_llms_extensions` — empty block in core llms.txt.twig — vendor/shopware/core/Framework/Resources/views/files/agentic/llms.txt.twig:93
- confirmed `agentic_agents_extensions` — empty block in core AGENTS.md.twig — vendor/shopware/core/Framework/Resources/views/files/agentic/AGENTS.md.twig:37
- confirmed `salesChannelFileContext` — set by Store API MCP subscriber — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:57
- confirmed `/api/_action/sales-channel-file/{fileFamily}/{salesChannelId}/preview` — POST route — vendor/shopware/core/System/SalesChannel/File/Api/SalesChannelFileController.php:63
- confirmed `KernelEvents::EXCEPTION` — 404 fallback subscriber, priority -90 — vendor/shopware/core/System/SalesChannel/File/SalesChannelFileNotFoundSubscriber.php:39
- confirmed `TemplateFinder` — existing template chain resolver class — vendor/shopware/core/Framework/Adapter/Twig/TemplateFinder.php:15
