---
id: platform/dev/6.7/resources/guidelines/code/core/ci-workflows.md
title: CI workflows
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/ci-workflows.html
sourceHash: 45da191eddc213db7e560b331ae92147f3795eb0
codeCheckedAgainst: "6.7.15.1"
keywords: ["ci workflows", "github actions", "CompletionGuard", "TestBootstrapper", "setAutoExit", "continue-on-error", "|| true", "set -euo pipefail", "!cancelled()", "zizmor", "composer lint:actions", "action hash pinning", "phpunit exit code", "ci review"]
summary: Rationale behind Shopware's .github CI rules - guards at the lowest layer (CompletionGuard), strict failure suppression, zizmor pinning and review checks.
lastBuilt: 2026-10-21
---
## What it is

A core guideline (mirrored from `coding-guidelines/core/ci-workflows.md`) that explains why the CI rules in the Shopware repository's `.github/AGENTS.md` are shaped as they are, with concrete examples. The rules themselves live in `.github/AGENTS.md`; this page holds the reasoning. Read it when reviewing a CI change or before changing one of the rules.

## When to use

When you write or review a GitHub Actions workflow or CI step in the Shopware repository, add a test guard, or are tempted to make a job green with `|| true`, `continue-on-error` or a retry.

## Key steps / config

**Fix it at the lowest layer that covers everyone.** A unit test ran a Symfony console `Application` through `ApplicationTester` without `setAutoExit(false)`; `Application::run()` called `exit(0)`, PHPUnit died mid-suite, no report was written and the job reported success (issue #18661). A first fix asserted `junit.xml` existed after the run, but that had to be repeated per job and missed nightly jobs with no JUnit report. The guard now sits in the bootstrapper: `TestBootstrapper` registers `CompletionGuard` (`Shopware\Core\Test\PHPUnit\CompletionGuard\CompletionGuard`), so core suites, plugins and downstream projects are covered without `phpunit.xml` wiring. In the installed code it subscribes to PHPUnit's execution-started/finished events and, from a shutdown function, forces `exit(1)` when the run started but did not finish, keeping an existing fatal-error exit code.

- In a job, assert what the run **produces**, not what the runner set up, and never assert on an artifact some matrix legs legitimately never create.
- Test guards by extracting the decision into a pure function and unit-testing both branches (`CompletionGuardTest` is the pattern).

**Treat suppression strictly.** `continue-on-error`, `|| true`, `set +e`, `if: always()` and retries each need a comment. Replace `|| true` with a captured exit code:

```bash
set +e
some-check
status=$?
set -e
if [ "$status" -ne 0 ] && [ "$status" -ne 1 ]; then
  exit "$status"
fi
```

Retries are for network and infrastructure only; a retry around tests hides the flake rate. Do not make a job green by suppressing information — skip a job with a documented `if:` condition instead.

**Review checklist** for a CI change:

1. If this step did nothing, would the job still be green?
2. Does every new `continue-on-error`, `|| true`, `set +e`, `if: always()` or retry carry a comment?
3. Is there `run:` logic a unit test could cover?
4. Are new third-party actions pinned to a hash?
5. Has the change actually run, and for a guard, been seen to fail?
6. Does it belong in `shopware-private`, and does the octo-sts identity or a `github.repository` guard say so?

## Essential identifiers

- `CompletionGuard::register()`, `TestBootstrapper`, `CompletionGuardTest`
- `setAutoExit(false)`, `ApplicationTester`
- `.github/AGENTS.md`, `.github/actions/phpunit-upload`, `.github/zizmor.yml`, `composer lint:actions`, `zizmor-collection-guard.ts`, `sync.yml`, `link-private-pr.yml`

## Gotchas

- `set -euo pipefail` is required, but `pipefail` turns an early-exiting downstream command into a `SIGPIPE` failure (fixed in commit `04d02efd2eb` for markdown-only change detection).
- `.github/actions/phpunit-upload` expects callers to use `if: !cancelled()`, not `always()`, so cancelled runs stop; prefer `!cancelled()` generally.
- Hash pinning is enforced by zizmor's `unpinned-uses` audit, configured in `.github/zizmor.yml` and run via `composer lint:actions`. Other zizmor audits are disabled and report a few hundred findings.
- zizmor cannot parse a workflow whose `strategy:` is a dynamic `${{ fromJson(...) }}` matrix and warns but exits 0. `zizmor-collection-guard.ts` reconciles those warnings against a known list, so new ones fail the lint and stale entries are reported.
- Workflows are mirrored to `shopware/shopware-private` by `sync.yml` and run there too. `link-private-pr.yml` failed in the mirror at octo-sts (the `ShopwareLinkClosingPR` identity only trusts `repo:shopware/shopware:ref:refs/heads/trunk`); fixed by a `github.repository` guard on the job.
- The docs name the pure decision function `CompletionGuard::shouldForceFailure()`; the Tier 0 index reports it absent, though the 6.7.15.1 `CompletionGuard` class in the core test-support code does declare it. Rely on `CompletionGuard::register()` as the entry point.

## Code check (6.7.15.1)
- absent `shouldForceFailure` — flagged absent by the Tier 0 code index; a read of the checkout's CompletionGuard class shows a public static method of that name in test-support code
- confirmed `CompletionGuard::register()` — subscribes to PHPUnit execution events and arms the shutdown guard — vendor/shopware/core/Test/PHPUnit/CompletionGuard/CompletionGuard.php:37
- confirmed `CompletionGuard` — `@internal` class forcing a non-zero exit when PHPUnit terminates early — vendor/shopware/core/Test/PHPUnit/CompletionGuard/CompletionGuard.php:29
- confirmed `TestBootstrapper` — calls `CompletionGuard::register()` during bootstrap — vendor/shopware/core/TestBootstrapper.php:23
- unverified `CompletionGuardTest` — lives in the repository's tests directory, outside vendor/shopware packages
- unverified `setAutoExit` — Symfony Console API, vendor/symfony out of scope
- unverified `zizmor` — `.github/` tooling, not part of the installed packages
