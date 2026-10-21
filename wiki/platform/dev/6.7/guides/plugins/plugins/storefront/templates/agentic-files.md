---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md
title: Agentic Files
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/agentic-files.html
sourceHash: 3065c51b31203e1366a6fbdb540d5946e801b636
codeCheckedAgainst: "6.7.15.1"
keywords: ["agentic files", "llms.txt", "agents.md", "ai-catalog.json", "SalesChannelFileRenderParametersExtension", "salesChannelFileContext", "agentic_llms_extensions", "agentic_ai_catalog_entries", "user_provided_content", "storeApiMcpServerUrl", "sales channel files", "ai agents", "agentic commerce"]
summary: Agentic sales-channel files (/llms.txt, /agents.md, ai-catalog.json) - template paths, extension blocks, render parameters, admin snippets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md"]
---
## What it is

Agentic files are public, per-sales-channel files rendered from Twig templates that tell AI assistants how to interact with a shop. Core ships the `agentic` file family: `/llms.txt`, `/agents.md` and `/.well-known/ai-catalog.json` (an Agentic Resource Discovery catalog). Each file is enabled per sales channel in the Administration, where merchants can also add notes or override content sources.

## When to use

When a plugin, app or theme adds content to the default agentic files, ships an additional public file, or injects file-specific template data.

## Key steps / config

**Path mapping.** Templates live under `Resources/views/files/<file-family>/`; the public path is the template path minus `files/<file-family>/` and `.twig`: `files/agentic/llms.txt.twig` → `/llms.txt`, `files/agentic/.well-known/ai-catalog.json.twig` → `/.well-known/ai-catalog.json`, core's `files/agentic/AGENTS.md.twig` → `/AGENTS.md`. Only enabled files are served; others return 404.

**Extend a default file.** Ship a template at the same path, use unqualified `sw_extends`, and always render `{{ parent() }}` in the extension block:

```twig
{% sw_extends 'files/agentic/llms.txt.twig' %}
{% block agentic_llms_extensions %}
    {{ parent() }}
    ## My integration
{% endblock %}
```

Additive blocks: `agentic_llms_extensions`, `agentic_agents_extensions`, `agentic_ai_catalog_entries`. In `agentic_ai_catalog_entries`, merge into `entries` before `{{ parent() }}`; entry keys: `identifier`, `displayName`, `type` (`application/mcp-server-card+json`), `url`, `description`, `tags`, `capabilities`, `representativeQueries`.

**Add a custom file.** Every template below `Resources/views/files/<file-family>/` is public, e.g. `PLUGIN_ROOT/src/Resources/views/files/agentic/my-integration.md.twig` → `/my-integration.md`. Put `{% block user_provided_content %}{% endblock %}` near the end so merchants can add notes.

**Template variables:** `context`, `salesChannel`, `salesChannelFile` (read-only metadata), `salesChannelFileContext`. For the AI catalog core sets `baseUrl` and `publisher` when a domain exists, plus `storeApiMcpServerUrl` for API-type sales channels ([Store API MCP server](platform/dev/6.7/products/tools/mcp-server/store-api.md)); the default entry renders only if both `storeApiMcpServerUrl` and `publisher` are set.

**Add template context.** Subscribe to `SalesChannelFileRenderParametersExtension::onPost()`, return early unless `$extension->file->fileFamily === SalesChannelFile::DEFAULT_FILE_FAMILY` and `$extension->file->fileName` matches, then extend `$extension->result['salesChannelFileContext']`, preserving existing keys.

**Administration description.** Snippet key `sw-sales-channel.detail.agenticFiles.descriptions.<family>.<file>` with both segments kebab-cased, e.g. `{"sw-sales-channel":{"detail":{"agenticFiles":{"descriptions":{"agentic":{"my-file-txt":"..."}}}}}}`. No snippet, no description.

## Essential identifiers

- `Shopware\Core\System\SalesChannel\File\Rendering\Extension\SalesChannelFileRenderParametersExtension`
- `Shopware\Core\System\SalesChannel\File\Discovery\SalesChannelFile` (`DEFAULT_FILE_FAMILY = 'agentic'`)
- `agentic_llms_extensions`, `agentic_agents_extensions`, `agentic_ai_catalog_entries`, `user_provided_content`
- `salesChannelFileContext`, `storeApiMcpServerUrl`

## Gotchas

- Keep private partials outside `Resources/views/files/**` and include them with an explicit namespace (e.g. `@MyPlugin/agentic/includes/content.md.twig`).
- The docs call the template `agents.md.twig`; core ships `AGENTS.md.twig`. Discovery lowercases file-name keys and groups case variants, so `/agents.md` resolves either way.
- The docs' snippet example uses the key `my-file.txt`; the Administration kebab-cases it (`my-file-txt`).

## Version notes

Core feature since 6.7.12.0. Older versions can use the Agentic Commerce plugin fallback (routes for the three files, only where UCP is active; no Administration UI, overrides, discovery API or cache tagging). Unqualified `sw_extends` keeps templates working in both modes; after upgrading, clear the cache and rebuild assets.

## Code check (6.7.15.1)
- confirmed `SalesChannelFileRenderParametersExtension` — extension class, result is the Twig parameter array — vendor/shopware/core/System/SalesChannel/File/Rendering/Extension/SalesChannelFileRenderParametersExtension.php:22
- confirmed `SalesChannelFileRenderParametersExtension::onPost()` — core subscriber uses the same hook — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:28
- confirmed `SalesChannelFile::DEFAULT_FILE_FAMILY` — value `'agentic'` — vendor/shopware/core/System/SalesChannel/File/Discovery/SalesChannelFile.php:15
- confirmed `storeApiMcpServerUrl` — set only for API-type sales channels, alongside `baseUrl`/`publisher` — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileStoreApiMcpSubscriber.php:53
- confirmed `agentic_llms_extensions` — empty extension block in core llms.txt template — vendor/shopware/core/Framework/Resources/views/files/agentic/llms.txt.twig:93
- confirmed `agentic_agents_extensions` — empty extension block in core agents template — vendor/shopware/core/Framework/Resources/views/files/agentic/AGENTS.md.twig:37
- confirmed `agentic_ai_catalog_entries` — default entry needs `storeApiMcpServerUrl` and `publisher` — vendor/shopware/core/Framework/Resources/views/files/agentic/.well-known/ai-catalog.json.twig:9
- confirmed `user_provided_content` — merchant notes injected into this block — vendor/shopware/core/System/SalesChannel/File/Rendering/SalesChannelFileRenderer.php:145
- corrected `SalesChannelFile::$templatePaths` — docs: `agents.md.twig`; core ships `AGENTS.md.twig`, case variants grouped — vendor/shopware/core/System/SalesChannel/File/Discovery/SalesChannelFile.php:30
- corrected `sw-sales-channel.detail.agenticFiles.descriptions` — docs: key `my-file.txt`; segments are kebab-cased — vendor/shopware/administration/Resources/app/administration/src/module/sw-sales-channel/view/sw-sales-channel-detail-agentic-files/index.js:227
