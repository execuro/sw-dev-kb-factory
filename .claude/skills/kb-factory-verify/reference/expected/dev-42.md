# `dev-42` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-42` · `dev` · `Config & CLI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 and shopware-cli 0.18.4 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** How do I check extension compatibility before upgrading with shopware-cli, and why does it report my plugins in custom/plugins as blocking?

**Expected answer — every fact an answer must contain:**

1. The check is the `shopware-cli project upgrade` wizard (added in shopware-cli 0.17.0); the older `shopware-cli project upgrade-check` still exists but is marked deprecated, "Will be removed in October 2026". A read-only preflight is `shopware-cli project upgrade --no-interaction --target <value> --dry-run`: `--target` is required in non-interactive mode and accepts an exact catalog version, `recommended` or `latest-patch` (the only other flag is `--no-audit`), and `--dry-run` stops after readiness + extension compatibility + the Composer dry run without touching the project. `[shopware-cli 0.18.4: cmd/project/project_upgrade_check.go:27-30]` `[shopware-cli 0.18.4: cmd/project/project_upgrade.go:71-76]` `[shopware-cli 0.18.4: internal/shop/upgrade/headless.go:16-35,146-181]`
2. Plugins in `custom/plugins` are blocking because of the **readiness** check "Extensions managed through Composer" (`Blocking: true`), not the extension-compatibility classification: any discovered extension with `ComposerManaged == false` sets the check to `StateFail`, `Readiness.Blocked()` returns true and the headless run aborts with "the project is not ready to upgrade; fix the failing checks above" before a target is resolved. The detail printed is "Not managed through Composer: <names>" plus "Run `shopware-cli project autofix composer-plugins` to migrate them." Since 0.18.4 an extension counts as managed when it is under `vendor/` **or** present in `composer.lock`, so a path-repository plugin (typically `custom/static-plugins`) no longer blocks — a plain copied plugin in `custom/plugins` that Composer neither requires nor locks still does. `[shopware-cli 0.18.4: internal/shop/upgrade/readiness.go:145-170,213-257]` `[shopware-cli 0.18.4: internal/shop/upgrade/headless.go:51-62]`
3. The run writes a Markdown report to `<projectRoot>/.shopware-cli/upgrade/report.md` — a hardcoded path, not configurable — whose extension sections are `## Extensions: Blocked (n)`, `Needs review`, `Needs update` and `OK`, empty buckets omitted; it is written on dry runs, on a failed Composer resolution and after a completed or rolled-back run. `shopware-cli project validate` exists and runs PHPStan over the project, but against the Shopware version already installed and with no Shopware-specific removed-API rule set. `[shopware-cli 0.18.4: internal/shop/upgrade/report.go:11-20,105-116,144]` `[shopware-cli 0.18.4: internal/verifier/phpstan.go:58-83,181]`

**Official reference URL:** https://developer.shopware.com/docs/products/tools/cli/project-commands/upgrade.html
<!-- expected:end -->

`shopware-cli` is a separate Go tool (`shopware/shopware-cli`, formerly `FriendsOfShopware/shopware-cli`),
not part of `vendor/shopware/core`, and this project pins no version of it. Every code citation below
names its tag. The case is verified against **0.18.4** (published 2026-09-10, latest release at review
time): it is the first release containing PR #1475, and the `project upgrade` wizard the facts describe
does not exist at all before 0.17.0.

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `project upgrade` exists from 0.17.0 onward | `cmd/project/project_upgrade.go:12-14` @ 0.18.4 | `Use: "upgrade", Short: "Upgrade Shopware to a newer version"` |
| `project upgrade-check` still registered at 0.18.4, but deprecated | `cmd/project/project_upgrade_check.go:27-30` @ 0.18.4 | `Deprecated: "Will be removed in October 2026"` (field absent at 0.17.0 and 0.18.1) |
| The wizard registers exactly three flags | `cmd/project/project_upgrade.go:71-76` @ 0.18.4 | `--target`, `--dry-run`, `--no-audit`; no `--report`/`--output` |
| `--target` is mandatory headless; accepted values are two keywords or an exact catalog version | `internal/shop/upgrade/headless.go:16-35,146-181` @ 0.18.4 | `case "": return nil, fmt.Errorf("--target is required in non-interactive mode; …")`; `TargetRecommended = "recommended"`, `TargetLatestPatch = "latest-patch"` |
| The Composer-management readiness check is blocking | `internal/shop/upgrade/readiness.go:145-170` @ 0.18.4 | `check := ReadinessCheck{ID: "extensions", Label: "Extensions managed through Composer", Blocking: true}` … `check.State = StateFail` |
| Its detail text is the message users see | `internal/shop/upgrade/readiness.go:145-170` @ 0.18.4 | `"Not managed through Composer: " + strings.Join(local, ", ") + "\nRun \`shopware-cli project autofix composer-plugins\` to migrate them."` |
| A failing blocking check aborts the headless run before a target is applied | `internal/shop/upgrade/headless.go:51-62`; `internal/shop/upgrade/types.go:36-38` @ 0.18.4 | `if readiness.Blocked() { return errors.New("the project is not ready to upgrade; fix the failing checks above") }` |
| Since 0.18.4, "managed" means under `vendor/` **or** in `composer.lock` | `internal/shop/upgrade/readiness.go:237` @ 0.18.4 (vs `:230` @ 0.18.1, vendor-only) | `isManaged := underVendor \|\| info.inLock` |
| Post-#1475 an unpublished/path package is classified from its own installed constraint, not blocked outright | `internal/shop/upgrade/compat.go:161,228-249` @ 0.18.4 (vs `compat.go:153` @ 0.18.1) | 0.18.1: `res.Status = ExtBlocked; res.Detail = "The package was not found in any configured Composer repository."` → 0.18.4: `return classifyLocalConstraint(ctx, target, ext)` |
| Report path is hardcoded | `internal/shop/upgrade/report.go:11-20` @ 0.18.4 | `filepath.Join(u.projectRoot, ".shopware-cli", "upgrade")` / `"report.md"` |
| The four report buckets | `internal/shop/upgrade/report.go:105-116,144` @ 0.18.4 | `writeExtensionGroup(&b, "Blocked", …)`, `"Needs review"`, `"Needs update"`, `"OK"`; `"## Extensions: %s (%d)\n\n"` |
| Buckets are derived from a six-value status enum | `internal/shop/upgrade/types.go:114-139` @ 0.18.4 | `BlocksUpgrade() = ExtBlocked \|\| ExtMismatch`; `NeedsAttention() = s != ExtOK && s != ExtNeedsUpdate` |
| `autofix composer-plugins` never moves the directory; it requires from the Store, requires from a resolving repository, or adds a `{"type":"path"}` entry | `internal/shop/pluginmigrate/plan.go:66-94,142-165`; `run.go:163-204` @ 0.18.4 | `case ext.ComposerName != "": planned.Kind = ActionPathRepository; planned.RequireArg = ext.ComposerName + ":*"` |
| The Packages Token is optional at 0.18.4 | `internal/shop/pluginmigrate/headless.go:38-41` @ 0.18.4 (vs `cmd/project/project_autofix_composer.go:38` @ 0.16.10) | `"No SHOPWARE_PACKAGIST_TOKEN set — skipping the Shopware Store; Packagist and configured repositories are still checked."` |
| `project validate` runs PHPStan via the registered tool set | `cmd/project/project_validate.go:18-30,72-108`; `internal/verifier/phpstan.go:58-83,181` @ 0.18.4 | `phpstan analyse --no-progress --no-interaction --error-format=json`; `AddTool(PhpStan{})` |
| The legacy `upgrade-check` never blocked on anything | `cmd/project/project_upgrade_check.go:135-152,161-177`; `internal/account-api/updates.go:32-34` @ 0.16.10 | `Label: "Not available in Store"` with unset `Type`; `IsBlocker()` returns false for `Type == ""`; `hasBlockers` feeds only telemetry, `return nil` |
| `upgrade-check`'s only compatibility decision is a remote, unauthenticated POST | `internal/account-api/updates.go:36-60` @ 0.16.10 | `http.MethodPost, getApiUrl()+"/swplatform/autoupdate"` sent with `http.DefaultClient` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `shopware-cli project upgrade` exists at 0.16.10 (the tag round 1 read) | absent | `cmd/project/project_upgrade.go` returns HTTP 404 at 0.16.10, 200 from 0.17.0 onward |
| The upgrade report path is configurable | absent | `UpgradeDir()`/`ReportPath()` join the literals `.shopware-cli`/`upgrade`/`report.md`; only `--target`, `--dry-run`, `--no-audit` are registered and no config key feeds the paths |
| PHPStan in `project validate` carries a Shopware removed/renamed-API rule set, or checks against a *future* Shopware version | absent | `internal/verifier/phpstan.go` only selects a config file and parses JSON errors; `ToolConfig.CheckAgainst` is not set by `GetConfigFromProject`, so the analysis runs against the installed Shopware |
| `upgrade-check` analyses plugin source or Composer constraints, or has flags to fail on incompatibility | absent | the only decision is the remote POST; `--help` lists only `-h`; the command always `return nil` (@ 0.16.10) |
| A Shopware account login is required for `upgrade-check` | absent | plain `http.NewRequestWithContext` + `http.DefaultClient`, no authenticated request (@ 0.16.10) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The upgrade package ships unit tests beside every unit cited here — buckets, target keywords and readiness blocking are covered by the repo's own suite | `internal/shop/upgrade/` listing @ 0.18.4 (`readiness_test.go`, `compat_test.go`, `report_test.go`, `headless_test.go`) |
| The plan/scan behaviour changed by #1475 is covered | `internal/shop/pluginmigrate/pluginmigrate_test.go` @ 0.18.4 |
| No test for the legacy command | `cmd/project/project_upgrade_check_test.go` does not exist @ 0.16.10 |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| On Shopware 6.7.3 with shopware-cli 0.18.1, `project upgrade` marks two locally installed plugins incompatible with result "none" and blocks; run ends with `composer require: exit status 1` | 6.7 | closed | https://github.com/shopware/shopware-cli/issues/1463 |
| PR fixing it: path/unpublished packages classified from the installed `composer.json`/lock `require`; `autofix composer-plugins` skips Composer-managed packages | 6.7 | merged | https://github.com/shopware/shopware-cli/pull/1475 |
| Shopware's upgrade guide points users at `project autofix composer-plugins` when locally managed plugins are found | 6.7 | open | https://developer.shopware.com/docs/guides/upgrades-migrations/upgrade-shopware.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which `project` subcommand checks extension compatibility, and at which tag? | deep pass | `project upgrade` (from 0.17.0); `upgrade-check` survives at 0.18.4 but deprecated. Case verified at 0.18.4 |
| Does the wizard treat `custom/plugins` as a hard readiness block? | deep pass | Yes — `checkExtensionsComposerManaged` is `Blocking: true`, and the headless run aborts |
| Does the check treat `custom/plugins` and `custom/static-plugins` differently? | deep pass | Only via `composer.lock`: a lock-recorded path plugin is managed since 0.18.4; a plain copy is not, wherever it sits |
| After #1475, what still makes a local plugin blocking? | deep pass | Either not Composer-managed at all (readiness), or a `shopware/core` constraint that excludes the target (`classifyLocalConstraint` → `ExtBlocked`) |
| Which release first contains #1475? | deep pass | 0.18.4 (merged 2026-09-01, released 2026-09-10); 0.18.0–0.18.3 are pre-fix |
| What does `autofix composer-plugins` do to a plugin in `custom/plugins`? | deep pass | Store require, plain require, or a path repository — never a directory move; the local copy is deleted only after a successful require |
| Does the wizard write `.shopware-cli/upgrade/report.md`, and is the path configurable? | deep pass | Yes; not configurable |
| Does `project validate` detect removed/renamed PHP types via PHPStan? | deep pass | It runs PHPStan, but only against the installed Shopware and with no Shopware-specific rule set |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `project upgrade` runs a local-first upgrade, analyzes Composer-managed extensions, verifies with Composer, writes a report | see quote | upgrade.md:9 | yes — `headless.go`, `report.go` @ 0.18.4 |
| Readiness prerequisite: all discovered extensions are Composer-managed | "- All discovered extensions are managed through Composer." | upgrade.md:22 | yes — `readiness.go:145-170` |
| Extensions outside `vendor/`, e.g. in `custom/plugins`, block the readiness check | see quote | upgrade.md:33 | partly — blocking confirmed, but since 0.18.4 the test is `underVendor \|\| inLock`, not `vendor/` alone |
| The remedy is `shopware-cli project autofix composer-plugins` | see quote | upgrade.md:39 | yes — that exact string is the check's detail text |
| Two compatibility sources; Composer resolution is the final gate | see quote | upgrade.md:68-71 | yes — repository metadata classification plus the Composer dry run in the preflight |
| Extension queue classes: ready / needs update / needs review / blocking | see quote | upgrade.md:73 | yes — the four derived report buckets |
| `--target` required non-interactively; accepts exact version, `recommended`, `latest-patch` | see quote | upgrade.md:105-109 | yes — `headless.go:16-35,146-181` |
| `--dry-run` stops before changing files | see quote | upgrade.md:111 | yes — `headless.go:99-116` |
| Report written to `.shopware-cli/upgrade/report.md` | `.shopware-cli/upgrade/report.md` | upgrade.md:128 | yes — `report.go:11-20` |
| Run `project validate` first to find removed/renamed PHP types | see quote | upgrade.md:29 | partly — PHPStan runs, but resolves against the installed Shopware version |
| Validation can check a not-yet-installed target by pointing the `shopware/core` constraint at it | see quote | validation.md:305 | not confirmed — `ToolConfig.CheckAgainst` is never set on the project path |
| `autofix composer-plugins` migrates locally cloned plugins and needs a Shopware Packages Token | see quote | autofix.md:43 | no — true only at 0.16.10; at 0.18.4 the token is optional |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| upgrade.md:33 — extensions "living outside `vendor/`" cannot participate in Composer resolution and therefore block the readiness check | Since 0.18.4 the criterion is `isManaged := underVendor \|\| info.inLock`: a path-repository plugin outside `vendor/` but recorded in `composer.lock` is managed and does not block. Only an extension Composer neither requires nor locks blocks | `internal/shop/upgrade/readiness.go:237` @ 0.18.4 |
| autofix.md:43 — "You need a Shopware Packages Token" | Optional at 0.18.4: read from `SHOPWARE_PACKAGIST_TOKEN`; when absent the Store is skipped and plugins fall back to a path repository. The hard requirement existed at 0.16.10, where the command refused to run non-interactively and errored on an empty token | `internal/shop/pluginmigrate/headless.go:38-41` @ 0.18.4; `cmd/project/project_autofix_composer.go:38` @ 0.16.10 |
| validation.md:305 — `project validate` installs the dependency set for the target constraint so PHPStan resolves types from the target Shopware version | `ToolConfig.CheckAgainst` exists but `GetConfigFromProject` does not set it, so the project path analyses whatever Shopware is installed in the tree; there is no Shopware removed-API rule set in the tool | `internal/verifier/phpstan.go:18-22,58-83`; `internal/verifier/tool.go:24-46`; `internal/verifier/project.go` @ 0.18.4 |
| The docs describe compatibility as metadata plus a Composer dry run | True of `project upgrade`; the deprecated `upgrade-check` instead POSTs `(name, version)` pairs unauthenticated to `api.shopware.com/swplatform/autoupdate` and blocks on nothing | `internal/account-api/updates.go:32-34,36-60` @ 0.16.10 |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| All extensions must be managed through Composer; extensions living outside `vendor/` block the readiness check, and `custom/plugins`-style local extensions must be migrated first with `shopware-cli project autofix composer-plugins`. | rewritten | the blocking is confirmed, but the criterion is wrong post-#1475: `isManaged := underVendor \|\| info.inLock`, so a lock-recorded path plugin outside `vendor/` does **not** block. Rewritten to name the readiness check, its `Blocking: true` flag, the abort message and the real criterion, and to separate it from the extension-compatibility classification the query's symptom is often blamed on |
| Non-interactive preflight is `shopware-cli project upgrade --no-interaction --target latest-patch --dry-run`; `--target` is required in non-interactive mode and accepts an exact version, `recommended`, or `latest-patch`. | rewritten | confirmed verbatim by `headless.go:146-181`, and kept — extended with the command-surface point the query needs: the wizard only exists from 0.17.0, and the `upgrade-check` command a 6.7-era answer might still name is deprecated at 0.18.4 ("Will be removed in October 2026") |
| The run writes `.shopware-cli/upgrade/report.md` with source/target versions, planned Composer changes and per-extension results (blocked / needs review / needs update / OK); run `shopware-cli project validate` beforehand to find references to removed or renamed Shopware PHP types. | rewritten | the path and the four buckets are confirmed exactly (and the path is hardcoded, worth stating). The `validate` clause overstated: PHPStan resolves against the Shopware version already installed and carries no Shopware removed-API rule set, so it does not by itself report what the *target* version removes |
