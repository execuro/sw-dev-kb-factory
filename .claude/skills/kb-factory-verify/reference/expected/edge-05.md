# `edge-05` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-05` · `edge` · `Trap` |
| Version | `6.6` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` (6.6 checked at tag `v6.6.10.0`) |

**Query:** How do I enable Shopware's built-in MCP server on a Shopware 6.6 shop?

**Expected answer — every fact an answer must contain:**

1. States that 6.6 contains no MCP implementation at all — no `Framework/Mcp` namespace, no `MCP_SERVER` entry in the feature-flag config and no `mcp/sdk` or `symfony/mcp-bundle` dependency at tag `v6.6.10.0` — so there is nothing to enable and no env var or config that would switch it on.  `[code: https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Resources/config/packages/feature.yaml]`
2. Places the built-in MCP server in the 6.7 line, where it exposes the Admin API endpoint `/api/_mcp` (route `api.mcp.endpoint`, methods GET/POST/DELETE/OPTIONS) and the sales-channel endpoint `/store-api/_mcp`, and states that reaching it requires an upgrade off 6.6.  `[code: Framework/Mcp/Controller/McpServerController.php:75-80]`
3. States that in 6.7 the feature is experimental (`@experimental stableVersion:v6.8.0`) and gated behind the toggleable `MCP_SERVER` flag, which defaults to `false`; with the flag off the endpoint answers 404.  `[code: Framework/Resources/config/packages/feature.yaml:89-93]`

**Trap:** The query presupposes the feature exists on 6.6. It does not exist in that line in any form; an answer that supplies a 6.6 flag, bundle or command is fabricating it.

**Official reference URL:** https://developer.shopware.com/docs/products/tools/mcp-server/intro.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Admin API MCP endpoint `/api/_mcp`, route `api.mcp.endpoint`, methods GET/POST/DELETE/OPTIONS | `Framework/Mcp/Controller/McpServerController.php:75-80` | `#[Route(path: '/api/_mcp', name: 'api.mcp.endpoint', defaults: ['auth_required' => true], methods: [GET, POST, DELETE, OPTIONS])]` |
| Store API MCP endpoint `/store-api/_mcp`, authenticated with the sales-channel access key | `Framework/Mcp/Controller/StoreApiMcpServerController.php:62-67` | `#[Route(path: '/store-api/_mcp', name: 'store-api.mcp.endpoint', …)]` |
| Both controllers are experimental until 6.8 and gated on the MCP_SERVER feature | `Framework/Mcp/Controller/McpServerController.php:41` | `* @experimental stableVersion:v6.8.0 feature:MCP_SERVER` |
| With the flag off (or the bundle absent) the action returns 404 | `Framework/Mcp/Controller/McpServerController.php:83-91` | `if (!Feature::isActive('MCP_SERVER') \|\| $this->server === null …) { return new Response(null, Response::HTTP_NOT_FOUND); }` |
| MCP_SERVER is a non-major, toggleable flag defaulting to false in 6.7 | `Framework/Resources/config/packages/feature.yaml:89-93` | `- name: MCP_SERVER / default: false / major: false / toggleable: true` |
| Container config no-ops when the `mcp` extension is missing | `Framework/Resources/config/packages/mcp.php:8-11` | `if (!$builder->hasExtension('mcp')) { return; }` |
| 6.7 core requires the MCP SDK and the Symfony MCP bundle | `composer.json:92,135` | `"mcp/sdk": "^0.6.0"`, `"symfony/mcp-bundle": "~0.10.0"` |
| 6.7 ships an experimental `debug:mcp` CLI command | `Framework/Mcp/Command/DebugMcpCommand.php:26,28` | `#[AsCommand(name: 'debug:mcp', description: 'List registered MCP capabilities …')]` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| 6.6 has a built-in MCP server that can be enabled | absent | At tag `v6.6.10.0` there is no `src/Core/Framework/Mcp` path at all — a GitHub contents request returns "The path does not point to a file or directory". No MCP controller, command, tool or resource class exists in 6.6. |
| A `MCP_SERVER` feature flag can be switched on in a 6.6 shop | absent | The complete v6.6.10.0 `feature.yaml` lists only v6.5.0.0, v6.6.0.0, v6.7.0.0, ADDRESS_SELECTION_REWORK, DISABLE_VUE_COMPAT, ACCESSIBILITY_TWEAKS, ADMIN_VITE, TELEMETRY_METRICS, PERFORMANCE_TWEAKS, cache_rework. No MCP_SERVER entry, so the env var would toggle nothing. |
| 6.6 core pulls in an MCP dependency | absent | v6.6.10.0 `src/Core/composer.json` require, require-dev and suggest blocks contain no `mcp/sdk` and no `symfony/mcp-bundle`; the file has no `mcp` string at all. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none found_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware's MCP docs state the feature arrived in 6.7.11.0 behind a flag; 6.7.14.0 removes the flag | 6.7.11.0+ | open | https://developer.shopware.com/docs/products/tools/mcp-server/intro.html |
| "[Core] MCP Server v1" epic opened 2026-04-16, dating the feature well after the 6.6 line | 6.7 | closed | https://github.com/shopware/shopware/issues/16205 |
| Follow-up MCP issues (toolset enablement, allowlist bypass) all filed in 2026 against the core implementation | 6.7 | open | https://github.com/shopware/shopware/issues/20374 |
| The standalone `shopware/shopware-admin-mcp` — the external Admin API route a 6.6 shop could have used — is archived and read-only | Shopware 6 generally | closed | https://github.com/shopware/shopware-admin-mcp |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does the 6.6 branch contain any MCP code at all? | code lane at tag v6.6.10.0 | No — no `Framework/Mcp` path, no flag, no dependency. |
| Is MCP_SERVER registered in 6.7's feature config, and with what default? | `Framework/Resources/config/packages/feature.yaml:89-93` | Registered; `default: false`, `major: false`, `toggleable: true`. |
| What is the endpoint path and auth in 6.7? | `Framework/Mcp/Controller/McpServerController.php:75-80` and `StoreApiMcpServerController.php:62-67` | `/api/_mcp` (`auth_required`, Admin API) and `/store-api/_mcp` (sales-channel access key). |
| Does 6.7 composer.json require `symfony/mcp-bundle` and `mcp/sdk`? | `composer.json:92,135` | Yes — `mcp/sdk ^0.6.0`, `symfony/mcp-bundle ~0.10.0`. |
| Is any Shopware-supplied package installable on 6.6 that provides an MCP server? | not settled from source | The code lane records this as unresolved: nothing in `vendor/` or `custom/plugins/` speaks to it. The facts therefore claim only that 6.6 core contains no MCP implementation, not that no external process could talk to a 6.6 Admin API. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Introduced in 6.7.11.0 behind the flag; 6.7.14.0 removes the flag | "The MCP server was introduced in Shopware 6.7.11.0 behind the `MCP_SERVER` feature flag. Shopware 6.7.14.0 removes the flag…" | `developer/products/tools/mcp-server/intro.md` | partly — code confirms the flag exists and defaults to false in 6.7.13.0; the patch-release pins are not confirmable from the dist tree |
| Prerequisite is 6.7.14.0, or 6.7.11.0-6.7.13.x with `MCP_SERVER=1` | "- Shopware 6.7.14.0 or later. On 6.7.11.0 to 6.7.13.x, set `MCP_SERVER=1` in your `.env` file first…" | `developer/products/tools/mcp-server/getting-started.md` | partly — same |
| Ships with core, exposing `/api/_mcp` and `/store-api/_mcp` | "It exposes an endpoint at `/api/_mcp` … and a sales-channel-facing endpoint at `/store-api/_mcp`" | `developer/products/tools/mcp-server/intro.md` | yes |
| `symfony/mcp-bundle` is a required dependency | "- `symfony/mcp-bundle` installed — verify with `composer show symfony/mcp-bundle`" | `developer/products/tools/mcp-server/getting-started.md` | yes — `composer.json:135` |
| No MCP page mentions 6.6; a Grep for `6.6` across the mcp-server directory returned no matches | "The MCP server is considered experimental until Shopware 6.8." | `developer/products/tools/mcp-server/intro.md` | yes — 6.6 has no MCP code |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The flag applies to 6.7.11.0-6.7.13.x and is removed in 6.7.14.0 | The installed 6.7.13.0 tree has the flag registered and defaulting to false; the tree carries no changelog, so neither the introducing nor the removing patch release can be pinned from source | `Framework/Resources/config/packages/feature.yaml:89-93` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that no 6.6 documentation exists for a built-in MCP server and that the feature belongs to the 6.7 line (experimental until 6.8 per the 6.7 page). | rewritten | The load-bearing point is not that documentation is missing but that the code is: at v6.6.10.0 there is no `Framework/Mcp`, no MCP_SERVER flag and no MCP dependency. The new fact 1 states the code absence. |
| If the 6.7 page was read, names its endpoints `POST /api/_mcp` and `POST /store-api/_mcp` explicitly as 6.7-only. | rewritten | Two defects: the conditional "if the 6.7 page was read" is a tolerance clause, and the method list is wrong — both routes declare GET, POST, DELETE and OPTIONS, not POST alone. |
| Invents no 6.6 configuration flag, bundle or command. | merged into fact 1 | Restated as the code-cited absence of the flag, the bundle and the command in 6.6. |
| _(new)_ | added | The 6.7 gating — experimental until 6.8, `MCP_SERVER` default `false`, 404 when off — decides whether an answer about the 6.7 line is usable. |
