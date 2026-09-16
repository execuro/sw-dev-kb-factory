---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md
title: Agentic Files
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/agentic-files.html
sourceHash: 3065c51b31203e1366a6fbdb540d5946e801b636
codeCheckedAgainst: "6.7.13.0"
keywords: ["agentic files", "llms.txt", "AGENTS.md", "ai-catalog.json", "SalesChannelFileRenderParametersExtension", "salesChannelFileContext", "agentic_llms_extensions", "agentic_agents_extensions", "agentic_ai_catalog_entries", "user_provided_content", "sales channel file", "ai agents", "mcp"]
summary: "Public sales-channel files (llms.txt, AGENTS.md, ai-catalog.json) rendered from Twig in Resources/views/files/; extend, add files, pass Twig context."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md"]
---
## What it is

Agentic files are public, per-sales-channel files for AI assistants, rendered from Twig templates. The default `agentic` family ships `/llms.txt`, an agents guidance file and `/.well-known/ai-catalog.json`. Files are enabled per sales channel in the Administration, where merchants can add notes or override content.

## When to use

A plugin, app or theme needs to add content to these files, ship its own public agent-facing file, or inject file-specific Twig data (e.g. an MCP server URL into the AI catalog).

## Key steps / config

1. **Path mapping**: templates below `Resources/views/files/<file-family>/`; the public path drops `files/<file-family>/` and `.twig` (`files/agentic/llms.txt.twig` serves `/llms.txt`). Disabled or unknown files return 404.
2. **Extend a default file**: same template path, unqualified `sw_extends`, always `parent()` in the blocks `agentic_llms_extensions`, `agentic_agents_extensions`, `agentic_ai_catalog_entries`:
   ```twig
   {% sw_extends 'files/agentic/.well-known/ai-catalog.json.twig' %}
   {% block agentic_ai_catalog_entries %}
       {% set entries = entries|merge([{ identifier: '...', displayName: '...',
           type: 'application/mcp-server-card+json', url: '...', description: '...',
           tags: [], capabilities: [], representativeQueries: [] }]) %}
       {{ parent() }}
   {% endblock %}
   ```
3. **Add a file**: `PLUGIN_ROOT/src/Resources/views/files/agentic/my-integration.md.twig` serves `/my-integration.md`. Put `{% block user_provided_content %}{% endblock %}` near the end for merchant notes.
4. **Template variables**: `context`, `salesChannel`, `salesChannelFile` (read-only metadata), `salesChannelFileContext` (for `.well-known/ai-catalog.json`: `baseUrl`, `publisher`, and for API sales channels `storeApiMcpServerUrl`, see [Store API MCP server](platform/dev/6.7/products/tools/mcp-server/store-api.md)).
5. **Add Twig context**: subscribe to `SalesChannelFileRenderParametersExtension::onPost()`; return early unless `$extension->file->fileFamily === SalesChannelFile::DEFAULT_FILE_FAMILY`, `$extension->file->fileName` matches and `$extension->result` is an array; then merge your keys into `$extension->result['salesChannelFileContext']`, preserving existing ones. FQCNs: `Shopware\Core\System\SalesChannel\File\Rendering\Extension\SalesChannelFileRenderParametersExtension`, `Shopware\Core\System\SalesChannel\File\Discovery\SalesChannelFile`.
6. **Administration description**: snippet key `sw-sales-channel.detail.agenticFiles.descriptions.<family>.<slug>`, slug = kebab-cased file name (`llms.txt` becomes `llms-txt`). No snippet, empty description.

## Essential identifiers

- `Resources/views/files/<file-family>/`, family `agentic`
- `SalesChannelFileRenderParametersExtension::onPost()`, `SalesChannelFile::DEFAULT_FILE_FAMILY`
- Blocks `agentic_llms_extensions`, `agentic_agents_extensions`, `agentic_ai_catalog_entries`, `user_provided_content`
- Twig vars `salesChannelFile`, `salesChannelFileContext`

## Gotchas

- Every Twig file below `Resources/views/files/**` becomes a public file; keep partials elsewhere and include them namespaced (`@MyPlugin/agentic/includes/content.md.twig`).
- Core ships `files/agentic/AGENTS.md.twig`, not `agents.md.twig` as the docs write; names match case-insensitively and case variants form one chain.
- The docs' admin snippet uses the raw key `"my-file.txt"`; the Administration looks up `my-file-txt`.
- Core's subscriber replaces the whole `salesChannelFileContext` for the catalog file; a listener running before it loses its keys.
- `storeApiMcpServerUrl` requires the `MCP_SERVER` feature flag (default off); the default catalog entry needs it plus `publisher`.

## Version notes

Core feature since 6.7.12.0. Older versions can serve compatible files via the Agentic Commerce plugin fallback (only where UCP is active; no Administration UI, overrides, discovery API or cache tagging). Unqualified `sw_extends` works in both modes; after upgrading clear the cache and rebuild assets.

## Code check (6.7.13.0)
- confirmed `SalesChannelFile::DEFAULT_FILE_FAMILY` — value `agentic` — vendor/shopware/core/System/SalesChannel/File/Discovery/SalesChannelFile.php:15
- confirmed `SalesChannelFileRenderParametersExtension` — public extension class with readonly `$file` — vendor/shopware/core/System/SalesChannel/File/Rendering/Extension/SalesChannelFileRenderParametersExtension.php:22
- confirmed `Extension::onPost()` — inherited static event-name helper — vendor/shopware/core/Framework/Extensions/Extension.php:47
- confirmed `agentic_llms_extensions` — block in core llms.txt template — vendor/shopware/core/Framework/Resources/views/files/agentic/llms.txt.twig:93
- confirmed `agentic_ai_catalog_entries` — block in core catalog template — vendor/shopware/core/Framework/Resources/views/files/agentic/.well-known/ai-catalog.json.twig:9
- corrected `AGENTS.md` — docs: `agents.md.twig`; core template is AGENTS.md.twig, names matched case-insensitively — vendor/shopware/core/System/SalesChannel/File/README.md:5
- corrected `kebabCase` — docs: snippet key `my-file.txt`; file name is kebab-cased for the key — vendor/shopware/administration/Resources/app/administration/src/module/sw-sales-channel/view/sw-sales-channel-detail-agentic-file/index.js:465
- confirmed `user_provided_content` — reserved merchant-notes block — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileRenderer.php:25
- confirmed `salesChannelFileContext` — core subscriber assigns a fresh array — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:57
- confirmed `MCP_SERVER` — gates `storeApiMcpServerUrl` for API sales channels — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:52
