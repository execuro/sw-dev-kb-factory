# `dev-57` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-57` · `dev` · `Platform upgrade` |
| Version | `6.7` |
| Status | **contradictory** — signals mixed; facts below are retained unverified, human audit pending |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` (core on disk; `shopware/commercial` not installed and not publicly reachable) |

**Query:** B2B Suite support ends with 6.8 — how do I run the B2B Suite Migration to B2B Components and check that it finished?

**Expected answer — every fact an answer must contain:**

1. The migration is started with `bin/console b2b:migrate:commercial`, optionally with component technical names and `--batch-size=100`.
2. The `employee_management` component is a prerequisite for all others and always migrates first regardless of the order given on the command line; the remaining order follows the configurator priority in the service definition.
3. The command returns while the migration continues in the background through the message queue — real completion is tracked with `bin/console b2b:migrate:progress` / `--watch`, whose status values are `Complete`, `Pending`, `In progress`, `Complete with error`, `Has new records`.

**Official reference URL:** https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html
<!-- expected:end -->

_The three facts above are the suite's original documentation-derived text, retained verbatim and
**unverified**. Two rounds of code investigation found no tier-1 artefact for any of them; the command
name itself is disputed between two Shopware-authored sources. See **Open for human audit**._

## Evidence — code (decisive)

Code lane status: **`source-missing`** in both rounds. Verified against shopware/core 6.7.13.0, which
contains no B2B implementation; the migration ships in `shopware/commercial`, which is not installed,
not a public GitHub repository and not on Packagist.

| fact | citation | excerpt |
| --- | --- | --- |
| `b2b` is a first-class package namespace in the platform's `Package` attribute type list, i.e. B2B code ships as a separate commercial package, not inside core | `Framework/Log/Package.php:8` | `@phpstan-type PackageString 'inventory'\|'checkout'\|…\|'b2b'\|…` |
| The only concrete trace of B2B Components in the open tree is the usage-data allow list, naming the suite's target entities | `System/UsageData/usage-data-allow-list.json:2084-2106` | `"b2b_employee": […], "b2b_components_role": […], "b2b_components_shopping_list": […], "b2b_components_organization": […], "quote": […], "b2b_components_approval_rule": […]` |
| The migration package is unreachable from every channel the deep pass tried | `https://api.github.com/repos/shopware/commercial` → 404; `https://repo.packagist.org/p2/shopware/commercial.json` → 404; `src/Commercial` absent from `shopware/shopware@trunk` | `404 not found, no packages here` |
| Scope, as stated by Shopware in the epic's acceptance criteria (intent, not shipped code): three modules | `https://github.com/shopware/shopware/issues/7982` | `These modules will be migrated: Employee Management, Quote Management, Shopping List` |
| The implementation story is a future-tense planning artefact with acceptance criteria literally `TBD`, zero comments and no linked PR or commit in its timeline | `https://api.github.com/repos/shopware/shopware/issues/8559` (body, timeline, comments) | `Named bin/console commercial:b2b:migrate, with: --use-queue … --reset … --features` / `### Acceptance criteria\n\nTBD` |
| A progress command was planned under a different name and with a different flag than the docs describe | `https://github.com/shopware/shopware/issues/8561` | `Add B2BProgressCommand, named commercial:b2b:progress. Show per-entity stats (to migrate, migrated, remaining, errors). Lists failed records if having --list-errors.` |
| A status display exists and could misreport in 6.7.0.0 — independent corroboration that *some* progress output ships, naming neither command nor columns | `https://github.com/shopware/shopware/issues/10713` (area `Extension:Commercial`) | `The migration status incorrectly reported some entities as complete, despite some records still remaining to be migrated.` … `The status should be displayed as "Pending" if there are still records remaining.` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A console command named `b2b:migrate:commercial` exists in a readable Shopware artefact | unverifiable — documentation-only | A GitHub-wide code search for the literal string returns 3 hits, **all** in `shopware/docs` (the documentation under test): `products/extensions/b2b-suite-migration/{execution/running-migration.md, development/validation-and-run.md, references/references.md}`. No `#[AsCommand]`, no service definition, no test, no changelog entry anywhere names it |
| A console command named `commercial:b2b:migrate` exists | unverifiable — story-only | GitHub-wide code search → 0 hits. `B2BMigrationCommand` / `B2BProgressCommand` → 0 hits. The only source is planning story #8559, acceptance criteria `TBD`, no linked PR |
| The B2B Suite Migration tool can be verified from source in this installation | absent | `grep -rli 'b2b'` over `vendor/shopware/{core,storefront,administration}` returns only `Framework/Log/Package.php` and a 6.4 mail-template migration; `vendor/shopware` holds only administration, core, deployment-helper, storefront; `custom/plugins` and `custom/static-plugins` are empty |
| The remaining migration order follows "the configurator priority in the service definition" | unverifiable — no code behind a code-shaped claim | No configurator class, service definition or DI tag from the migration package is readable from any reachable source |
| Shopware announces outside the migration documentation that B2B Suite support ends with 6.8 | absent | `UPGRADE-6.7.md` (163,112 bytes) and `UPGRADE-6.8.md` (155,771 bytes) on `shopware/shopware@trunk` each contain **zero** case-insensitive occurrences of `b2b`; the five b2b changelog entries are unrelated bug fixes. Epic #7982 states the intent to end support but names **no version** |
| Anything technically blocks an installed B2B Suite on 6.8 | absent / unverifiable | B2B Suite is not part of `shopware/core`, so nothing in the installed tree could block it; the code that would (`shopware/commercial`, `swag/b2b-suite`) is unreachable |
| Budget management is in scope of the migration | absent from every non-documentation source | Epic #7982's acceptance criteria name only Employee Management, Quote Management and Shopping List; none of the 18 `[B2B-Migration]` stories mentions budget |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none — no B2B source is present in any readable artefact_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The implementation story names the command `bin/console commercial:b2b:migrate` with `--use-queue`, `--reset`, `--features`, while docs and third-party write-ups use `bin/console b2b:migrate:commercial <component> …` plus `b2b:migrate:progress` — the namings disagree | 6.7 | closed | https://github.com/shopware/shopware/issues/8559 |
| Sibling story proposes `commercial:b2b:progress` with `--list-errors` — the whole story series uses the `commercial:b2b:*` prefix while the whole documentation set uses `b2b:migrate:*` | 6.7 | closed | https://github.com/shopware/shopware/issues/8561 |
| Merchant reports the migration was outright broken on 6.7.2.2: malformed SQL in the SwagCommercial `B2BSuiteMigration` transformers made employee-order and quote migration fail with an unknown-column error | 6.7 | closed | https://github.com/shopware/shopware/issues/12814 |
| Bug: the migration status reported entities as complete while records remained; reporter expected `Pending` | 6.7.0.0 | closed | https://github.com/shopware/shopware/issues/10713 |
| Epic "Support Migration from B2B Suite": the tool is CLI-based and covers Employee Management, Quote Management and Shopping List, reporting migrated/failed counts; it lives in the Commercial plugin, not the open-source repo | 6.7 | closed | https://github.com/shopware/shopware/issues/7982 |
| Third-party report of the documented procedure: `employee_management` is forced first, and `b2b:migrate:progress` is meant to run concurrently | 6.7 | open | https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html |
| An issue titled "Drop migration cli commands" exists in the same work stream — CLI commands in this area may have been removed or reshaped during development | unclear | closed | https://github.com/shopware/shopware/issues/10825 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the B2B Suite migration code present in this repository at all? | code lane, round 1 | Settled: no — and the deep pass extended this to every public channel (GitHub 404, Packagist 404, `src/Commercial` absent from trunk) |
| Exact command name: `b2b:migrate:commercial` (docs) or `commercial:b2b:migrate` (story #8559)? | **unresolved after the deep pass** | The docs string exists only inside `shopware/docs`; the story string exists nowhere in code at all. Neither candidate has a tier-1 artefact. → human audit |
| Are components positional arguments or a `--features` flag; do `--use-queue`/`--reset`/`--batch-size` exist? | **unresolved** | The docs and the story describe mutually exclusive designs for the same job (positional component names vs `--features`), and the two sets do not overlap on a single flag. No readable `InputDefinition` exists → human audit |
| Is there a separate progress command, and what does it emit? | **partially** — existence corroborated, specifics not | A progress command was planned (#8561) as `commercial:b2b:progress` with `--list-errors`, not `--watch`; bug #10713 confirms a status display ships and can misreport. The six-column table and the five status values are two different doc passages, and neither, nor `--watch` nor the 5-second refresh, is verifiable → human audit |
| Is `employee_management` enforced first in code regardless of the given order? | **unresolved** | Enforced-vs-recommended is exactly the distinction only the command's code could settle; the "configurator priority in the service definition" clause has no code behind it |
| Which components does the migration cover? | **partially** | The only Shopware-authored non-documentation scope statement is epic #7982: Employee Management, Quote Management, Shopping List — and that is an acceptance criterion (intent), not a read of shipped code. Budget management appears only in the docs |
| Does any source state that B2B Suite support ends with 6.8? | docs only | `UPGRADE-6.7.md` and `UPGRADE-6.8.md` contain no `b2b` at all; epic #7982 states the intent to end support but names no version. The `6.8` cutoff — the case premise — is documentation-only |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Migration is started with `bin/console b2b:migrate:commercial` | `bin/console b2b:migrate:commercial` | `…/b2b-suite-migration/execution/running-migration.html` | **no — unverifiable**, and contradicted in name by stories #8559/#8561 |
| Individual components are passed as arguments | `bin/console b2b:migrate:commercial component_name_1 component_name_2` | same page | no — unverifiable; story #8559 proposes a `--features` flag instead |
| `--batch-size` controls records per batch | `bin/console b2b:migrate:commercial --batch-size=100` | same page | no — unverifiable |
| `employee_management` is a prerequisite and migrates first; sequence follows configurator priority, not CLI order | "employee_management component is a prerequisite for all other B2B components and is migrated first by default" | same page | no — unverifiable; the "configurator priority" half is a code-shaped claim with no readable code |
| Progress is checked with `bin/console b2b:migrate:progress`, showing Total, Valid, Newly, Migrated, Pending and Error records | `bin/console b2b:migrate:progress` | same page | no — unverifiable; story #8561 proposes `commercial:b2b:progress` |
| `--watch` refreshes every 5 seconds | `bin/console b2b:migrate:progress --watch` | same page | no — unverifiable; the planned flag was `--list-errors` |
| Status values are Complete, Pending, In progress, Complete with error, Has new records | running-migration.html status list | same page | partially corroborated only in that bug #10713 shows a status display with at least "complete" and "Pending" exists |
| The migration runs in the background via the message queue; run both commands in separate terminals | "running both commands simultaneously in separate terminal windows" | same page | no — unverifiable; story #8568 "[B2B-Migration] Integrate Queue Processing" makes queue involvement plausible but names nothing |
| The message queue worker must be running | "The message queue worker must be actively running to handle migration tasks." | `…/execution/prerequisites.html` | no — unverifiable |
| B2B Suite version must be 4.9.3 or above | "Ensure your B2B Suite version is `4.9.3` or above." | `…/execution/prerequisites.html` | no — unverifiable |
| Budget management needs B2B Commercial 7.6.0+; the Organization Unit field is empty post-migration | "This component requires B2B Commercial version 7.6.0 or higher." | `…/execution/prerequisites.html` | no — and budget management is absent from every non-documentation source |
| Back up the database if B2B Commercial already holds data | "you should back up your Database before initiating the migration" | `…/execution/prerequisites.html` | intent/business context; no code expression |
| B2B Suite support ends with 6.8 | "B2B Suite will no longer be supported starting Shopware 6.8." | `…/b2b-suite-migration/` | no — neither upgrade guide mentions b2b at all; the epic states the intent without a version |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| Every operational claim on the B2B Suite Migration pages (command names, options, progress columns and states, ordering) | Nothing — the implementation is not in the open tree, not on GitHub and not on Packagist, so no code finding either confirms or refutes them. The docs string `b2b:migrate:commercial` occurs nowhere on GitHub outside `shopware/docs` itself | `vendor/shopware/` (administration, core, deployment-helper, storefront only); GitHub code search `"b2b:migrate:commercial"` → 3 hits, all `shopware/docs`; `https://api.github.com/repos/shopware/commercial` → 404 |
| The docs name the command `b2b:migrate:commercial` / `b2b:migrate:progress` | Shopware's own implementation stories name `commercial:b2b:migrate` / `commercial:b2b:progress` — a conflict between two Shopware-authored sources, neither corroborated by an artefact of the other kind | https://github.com/shopware/shopware/issues/8559, /8561; GitHub code search `"commercial:b2b:migrate"` → 0 hits |
| The prerequisites page discusses budget management as a migratable component | Epic #7982's acceptance criteria name only Employee Management, Quote Management and Shopping List; no story mentions budget | https://github.com/shopware/shopware/issues/7982 |
| "B2B Suite will no longer be supported starting Shopware 6.8" | `UPGRADE-6.7.md` and `UPGRADE-6.8.md` contain zero occurrences of `b2b`; no changelog entry announces an end of support; the epic states the intent without naming a version. The installed 6.7 core carries no `#[Package('b2b')]` usage, no b2b deprecation and no 6.8 gate | `https://raw.githubusercontent.com/shopware/shopware/trunk/UPGRADE-6.8.md` (`grep -ic b2b` → 0); `vendor/shopware/{core,storefront,administration}` |
| The docs name the target product "B2B Components" (overview) and "B2B Commercial" (prerequisites) without defining the relationship | The only in-tree trace is the usage-data allow list naming `b2b_components_*` entities plus `quote` | `System/UsageData/usage-data-allow-list.json:2084-2106` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| — | none | Round-2 verdict is `contradictory`. All three facts are retained verbatim and unverified: no tier-1 artefact exists for any of them, and the command name they rest on is disputed between two Shopware-authored sources |

## Open for human audit

The entire operational content of this case rests on a single source — the B2B Suite Migration
documentation — and that source conflicts with Shopware's own implementation stories on the one thing
the case most depends on, the command name. The docs say `bin/console b2b:migrate:commercial` with
positional component names and `--batch-size`, plus `bin/console b2b:migrate:progress --watch`
refreshing every 5 seconds; stories #8559 and #8561 say `commercial:b2b:migrate` with `--use-queue`,
`--reset` and `--features`, plus `commercial:b2b:progress` with `--list-errors`. A GitHub-wide code
search finds the docs string only inside `shopware/docs` itself and the story string nowhere at all,
and the story is a future-tense planning artefact with acceptance criteria `TBD` and no linked pull
request — so neither candidate is evidence of what shipped. Every flag is therefore unverified, and
the two designs are mutually exclusive (positional component arguments versus a `--features` flag).
Fact 2's clause "the remaining order follows the configurator priority in the service definition"
asserts a specific DI mechanism with no readable code behind it, and enforced-versus-recommended
ordering for `employee_management` cannot be distinguished without the command class. Fact 3 conflates
two separate doc passages: the progress command's **columns** (Total, Valid, Newly, Migrated, Pending,
Error) and its **status values** (Complete, Pending, In progress, Complete with error, Has new
records); only that *some* status display exists, with at least "complete" and "Pending", is
corroborated, by bug #10713. Separately, the case premise "support ends with 6.8" is documentation-only:
`UPGRADE-6.7.md` and `UPGRADE-6.8.md` contain no occurrence of `b2b`, and epic #7982 states the intent
to end support without naming any version. A human with access to `shopware/commercial` must read the
migration and progress command classes and decide: the real command names, the real argument/option
definitions, whether `employee_management` ordering is enforced or merely recommended, what the
progress command actually prints, whether budget management is in scope (the epic names only Employee
Management, Quote Management and Shopping List), and whether the 6.8 cutoff should be stated as a
documented intent rather than as a fact. Until then this case must not be scored as if its command
signature were known.
