# `dev-39` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-39` · `dev` · `Testing` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I write end-to-end Cypress tests for my plugin against a Shopware 6.7 store?

**Expected answer — every fact an answer must contain:**

1. There is no Cypress support in Shopware 6.7 — the premise of the question is stale. No `cypress.config.*`, `cypress/` directory, cypress dependency or cypress npm script exists in `shopware/core`, `shopware/storefront` or `shopware/administration`; upstream at tag v6.7.13.0 `tests/e2e/cypress` has been reduced to a single 0-byte `support/commands/commands.js`, and the only surviving traces are a `window.Cypress` guard in the admin shortcut plugin and two ESLint global declarations. `[code: Resources/app/administration/src/app/plugin/shortcut.plugin.js:95-98 and eslint.config.mjs:157-165 (shopware/administration), https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress]`
2. The current E2E path is Playwright with the published `@shopware-ag/acceptance-test-suite` package (12.13.3 in the v6.7.13.0 platform suite, alongside `@shopware/api-client`). Setup is `npm install` plus `npx playwright install` (and `install-deps`), an `.env` carrying `APP_URL` and the integration credentials `SHOPWARE_ACCESS_KEY_ID` / `SHOPWARE_SECRET_ACCESS_KEY` — created with `bin/console integration:create <name> --admin` — and runs are `npx playwright test` (`--ui`, `--project`, `--grep`, `--debug`, `--workers`), never a cypress binary. `[code: https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/package.json, https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md]`
3. Tests are written with the actor pattern on top of Playwright fixtures — `import { test } from '@fixtures/AcceptanceTest'`, then composing actor / task / page-object / data-fixture arguments (`shopCustomer`, `checkoutCartPage`, `promotionWithCodeData`, …), with new tasks scaffolded by the suite's own `npx createTask <actor>/<domain>/<task>` bin script. None of this ships inside the composer packages a project installs: `tests/acceptance` lives in the platform repository only, so a plugin stands up its own Playwright project against the published npm package. `[code: https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md, https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/package.json]`

**Trap:** The query presupposes Cypress. An answer that explains how to set up Cypress for 6.7 is wrong: Shopware stopped work on the Cypress suite in the 2023-12-12 acceptance-test-suite ADR, the helper package `@shopware-ag/e2e-testsuite-platform` is archived, and the docs keep the Cypress guide only under `testing/legacy/cypress/`.

**Official reference URL:** https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The ADR records the decision to stop the Cypress E2E suite and build a Playwright acceptance suite in `tests/acceptance` | `https://github.com/shopware/shopware/blob/trunk/adr/2023-12-12-acceptance-test-suite.md` | "We will stop our efforts on the existing E2E test suite based on Cypress and start a new acceptance test suite based on Playwright." |
| At v6.7.13.0 the E2E directory is `tests/acceptance`, a Playwright project (playwright.config.ts, fixtures/, tasks/, tests/, helpers/, bin/) | `https://github.com/shopware/shopware/tree/v6.7.13.0/tests/acceptance` | `[…, playwright.config.ts, scripts, tasks, tests, tsconfig.json]` |
| Its dependencies are Playwright-based and include `@shopware-ag/acceptance-test-suite` 12.13.3; no cypress dependency | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/package.json` | `"@shopware-ag/acceptance-test-suite": "12.13.3", "@shopware/api-client": "1.4.0",` |
| Setup and run: `npx playwright install`, `.env` with `APP_URL` and integration keys, `npx playwright test` | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md` | `npx playwright install` … `APP_URL="<shop base url>"` … `npx playwright test` |
| Credentials come from `bin/console integration:create <name> --admin` | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md` | `bin/console integration:create AcceptanceTest --admin` |
| Tests use the actor pattern with `test` imported from `@fixtures/AcceptanceTest` | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md` | `import { test } from '@fixtures/AcceptanceTest';` |
| Tasks are scaffolded via the suite's `createTask` bin | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/package.json` | `"bin": { "createTask": "./bin/createTask.js" },` |
| The Administration's shipped testing overview lists Jest only, with a TODO for Playwright; Cypress is absent | `Resources/app/administration/technical-docs/07-testing/01-overview.md:1-18` (shopware/administration) | `// TODO: Add information about Playwright E2E tests later` |
| Vestigial trace 1: a `window.Cypress` runtime guard in the admin shortcut plugin | `Resources/app/administration/src/app/plugin/shortcut.plugin.js:95-98` (shopware/administration) | `if (event.constructor !== KeyboardEvent && window.Cypress === undefined) { return; }` |
| Vestigial trace 2: `Cypress`/`cy` ESLint global declarations beside the Jest globals, used by no test file | `Resources/app/administration/eslint.config.mjs:157-165` (shopware/administration) | `Cypress: true, cy: true,` |
| Upstream `tests/e2e/cypress` at v6.7.13.0 holds one 0-byte file | `https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress` | `[{"name":"commands.js","path":"tests/e2e/cypress/support/commands/commands.js","size":0,"type":"file"}]` |
| Every code-search hit for "cypress" in shopware/shopware is historical (6.3–6.5 changelogs, the replacement ADR) | GitHub code search `repo:shopware/shopware cypress` | `changelog/release-6-5-0-0/2023-01-12-update-cypress-to-v12.md`, `adr/2023-12-12-acceptance-test-suite.md` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware 6.7 ships Cypress tooling a plugin can hook into | absent | no `cypress.config.*`, `cypress.json`, `cypress/` directory, cypress dependency or npm script in core, storefront or administration; a case-insensitive grep over `vendor/shopware` returns three files — the admin eslint config, `shortcut.plugin.js` and a compiled bundle carrying that same guard |
| A Cypress plugin-test package (`@shopware-ag/e2e-testsuite-platform`) is referenced by 6.7 | absent | no such package anywhere in the installed vendor tree; the GitHub code search returns only changelog and ADR prose |
| The Playwright acceptance suite ships inside the composer packages a project installs | absent | `tests/acceptance` exists in the platform repository only; grep for "playwright" over `vendor/shopware` returns a transitive lock-file mention and the admin doc TODO — no playwright.config.ts, fixtures or tasks |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| the maintained 6.7 E2E entry point and how a scenario is structured | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md` |
| the reusable npm package a plugin author depends on | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/package.json` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `shopware/e2e-testsuite-platform` — the package the Cypress guide told plugin developers to install — was archived on 2025-04-23 and moved to `shopwareArchive` | unclear | closed | https://github.com/shopware/e2e-testsuite-platform |
| A docs PR reclassifies that repo as archived | unclear | merged | https://github.com/shopware/docs/pull/2008 |
| The ADR records stopping Cypress work in favour of Playwright, citing flakiness and inability to test cloud environments | ADR 2023-12-12 | merged | https://developer.shopware.com/docs/resources/references/adr/2023-12-12-acceptance-test-suite.html |
| The Cypress plugin-testing guide URL now 404s; the current plugin E2E guide prescribes Playwright + `@shopware-ag/acceptance-test-suite` | 6.7 | open | https://developer.shopware.com/docs/guides/plugins/plugins/testing/playwright/install-configure.html |
| Open maintainer ticket to properly deprecate the old Cypress repo | unclear | open | https://github.com/shopware/shopware/issues/8480 |
| "CYtoPW Migration" tickets port Cypress scenarios (from a 6.4 tree) into the Playwright suite | 6.4 sources | open | https://github.com/shopware/shopware/issues/8095 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does the 6.7 tree still contain any Cypress infrastructure — directory, config, or `@shopware-ag/e2e-testsuite-platform` dependency? | code | no: `tests/e2e/cypress` is a single 0-byte file upstream, and nothing in the installed packages references cypress beyond a runtime guard and two lint globals |
| Does 6.7 contain `tests/acceptance` with a playwright.config.ts, depending on `@shopware-ag/acceptance-test-suite`, and at which version? | code | yes — version 12.13.3 at tag v6.7.13.0 |
| Are any npm/composer scripts left in 6.7 that run Cypress? | code | no — grep for cypress in all three package.json files returns nothing |
| Do the Cypress-era fixtures/commands (`cy.loginViaApi`, `cy.createProductFixture`) survive anywhere? | code | no — the only Cypress identifiers left are the `window.Cypress` guard and the ESLint globals |
| What does the acceptance suite expose that a plugin extends? | code (partly) | the platform suite imports `test` from `@fixtures/AcceptanceTest` and scaffolds tasks via `npx createTask`; the package's own public API is outside this repository, and the code lane records that a *plugin-owned* layout is not documented in the source |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Cypress is deprecated and unmaintained; Playwright is recommended for new projects | "Cypress has been deprecated and is no longer maintained." | `guides/development/testing/legacy/index.md:11` | yes — the ADR and the emptied `tests/e2e/cypress` |
| Playwright is the officially supported E2E tool | "Playwright is the officially supported tool for automating entire workflows across the application." | `guides/development/testing/index.md:14` | yes — `tests/acceptance` is the only E2E project at v6.7.13.0 |
| The replacement setup is an own Playwright project plus `@shopware-ag/acceptance-test-suite`, configured via `APP_URL` and integration keys or admin credentials | "npm install @shopware-ag/acceptance-test-suite" | `guides/development/testing/e2e-playwright/install-configure.md:19-49` | yes for the package, `APP_URL` and the integration keys; the admin-credential alternative is not visible in the code lane's evidence |
| A plugin creates `Resources/app/<environment>/test/e2e/cypress` with fixtures/integration/plugins/support and installs `@shopware-ag/e2e-testsuite-platform` | "npm install @shopware-ag/e2e-testsuite-platform" | `guides/development/testing/legacy/cypress/index.md:51-93` | no — that package is archived and referenced nowhere in 6.7 |
| Plugin Cypress tests run with `CYPRESS_baseUrl=<your-url> npm run open` | "CYPRESS_baseUrl=<your-url> npm run open" | `…/legacy/cypress/index.md:165-168` | no — no cypress binary or script exists in 6.7 |
| Platform E2E runs use `composer run e2e:setup / e2e:prepare / e2e:open` and `composer e2e:cypress -- run --spec=…`, plus `bin/console e2e:restore-db` / `e2e:dump-db` | "composer e2e:cypress -- run --spec=\"cypress/e2e/administration/**/*.cy.js\"" | `…/legacy/cypress/index.md:184-208`; `resources/references/testing-reference/e2e-commands.md:12-18` | no — none of these exists in 6.7; the run command is `npx playwright test` |
| Test data is created through axios services in `e2e/cypress/support/service/` exposed as `createDefaultFixture(endpoint, options = [])` | "You just need to use the `createDefaultFixture(endpoint, options = [])` command" | `…/legacy/cypress/index.md:412-501` | no — the command set is gone; the Playwright suite uses data fixtures injected into the test |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The Cypress guide is still published with complete, working plugin instructions (folder layout, `@shopware-ag/e2e-testsuite-platform`, `CYPRESS_baseUrl … npm run open`) and carries no deprecation notice on the page itself | 6.7 has no Cypress infrastructure at all; the helper package is referenced nowhere and the upstream cypress tree is one 0-byte file | `legacy/cypress/index.md:51-168` vs `https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress` |
| `resources/references/testing-reference/e2e-commands.md` lists the Cypress composer scripts as current reference material | no `e2e:*` composer script or cypress npm script exists in the 6.7 packages | `e2e-commands.md:12-18` |
| The Cypress guide documents both a `cypress/integration` layout and `cypress/e2e/**/*.cy.js` run targets, and links repositories now under `shopwareArchive` | irrelevant in 6.7 — neither layout exists | `legacy/cypress/index.md:202-241` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "The suite is set up with `npm init playwright@latest`, `npm install @shopware-ag/acceptance-test-suite` and `npx playwright install` — the package is `@shopware-ag/acceptance-test-suite`, not Cypress." | rewritten | the package, `npx playwright install` and the run command are code-confirmed from the v6.7.13.0 acceptance suite; `npm init playwright@latest` is a docs-only step no code finding supports, so it is not asserted |
| "Authentication comes from the environment variables `APP_URL`, `SHOPWARE_ACCESS_KEY_ID`, `SHOPWARE_SECRET_ACCESS_KEY`, `SHOPWARE_ADMIN_USERNAME` and `SHOPWARE_ADMIN_PASSWORD`, with `playwright.config.ts` reusing `APP_URL` as `use.baseURL`." | rewritten | `APP_URL`, `SHOPWARE_ACCESS_KEY_ID` and `SHOPWARE_SECRET_ACCESS_KEY` are confirmed by the suite README, together with `bin/console integration:create <name> --admin`; the admin-username/password pair and the `use.baseURL` wiring are not in any code finding and were dropped |
| "`package.json` must set `\"type\": \"module\"`, and a base test file re-exports the suite and extends `test` with `FixtureTypes` so fixtures like `AdminApiContext` and `DefaultSalesChannel` are available." | removed | no code finding supports `\"type\": \"module\"`, the `FixtureTypes` extension or those fixture names; the code lane records that a plugin-owned acceptance-suite layout is not documented in the source at all. Replaced by the actor-pattern shape the platform suite actually shows |
| — | added | the decisive fact for this trap case: Cypress does not exist in 6.7, evidenced by the emptied upstream tree and the absence of any cypress config, dependency or script in the installed packages |
