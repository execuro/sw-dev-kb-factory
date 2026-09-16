---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/ci-workflows.md
sourceHash: 45da191eddc213db7e560b331ae92147f3795eb0
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/ci-workflows.html
title: CI workflows
version: "6.7"
versions:
  - "6.7"
keywords: ["ci workflows", "github actions", ".github/AGENTS.md", "TestBootstrapper", "CompletionGuard", "setAutoExit", "continue-on-error", "set -euo pipefail", "zizmor", "unpinned-uses", "composer lint:actions", "!cancelled()", "pipeline", "flaky tests"]
summary: Rationale behind Shopware core CI rules - guards at the lowest layer, strict handling of error suppression and retries, zizmor pinning, CI review checklist.
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline explaining the reasoning behind the `.github/` CI rules (the rules themselves live in `.github/AGENTS.md`), with concrete incidents. It targets contributors to the shopware/shopware repository who review or change CI workflows.

## When to use

When reviewing a CI change in the Shopware monorepo, adding an assertion or guard to a job, or considering `|| true`, `continue-on-error` or retries in a workflow.

## Key steps / config

**Fix at the lowest layer that covers everyone.** A test ran a Symfony console `Application` through `ApplicationTester` without `setAutoExit(false)`; `Application::run()` called `exit(0)`, PHPUnit died mid-suite, no report was written and the job was green (issue #18661). Asserting that `junit.xml` exists had to be repeated per job and missed nightly jobs without JUnit output, so the guard was placed in the test bootstrapper instead, covering core suites, plugins and downstream projects without `phpunit.xml` wiring.

- Assert what the run **produces**, not what the runner set up; never assert on an artifact some matrix legs legitimately never create.
- Test guards by extracting the decision into a pure function and unit-testing both branches.

**Suppression is allowed only with a comment** on each `continue-on-error`, `|| true`, `set +e`, `if: always()` or retry. Replace `|| true` with an explicit exit-code check:

```bash
set +e
some-check
status=$?
set -e
if [ "$status" -ne 0 ] && [ "$status" -ne 1 ]; then
  echo "some-check failed unexpectedly (exit $status)" >&2
  exit "$status"
fi
```

Retries are for network/infrastructure only — a retried flaky test hides the flake rate. To not run a job, skip it with a documented `if:` condition rather than suppressing its failure.

**Reviewing a CI change:**

1. If this step did nothing, would the job still be green?
2. Does every new suppression or retry carry an explanatory comment?
3. Is there `run:` logic a unit test could cover?
4. Are new third-party actions pinned to a hash?
5. Has the change been run — and a guard seen to fail?
6. Does it also belong in `shopware-private`, and do the octo-sts identity or a `github.repository` guard reflect that?

## Essential identifiers

- `.github/AGENTS.md`, `TestBootstrapper`, `ApplicationTester`, `setAutoExit(false)`
- `.github/actions/phpunit-upload`, `.github/zizmor.yml`, `composer lint:actions`, `zizmor-collection-guard.ts`
- `sync.yml`, `link-private-pr.yml`

## Gotchas

- `set -euo pipefail` is required, but `pipefail` turns an early-exiting downstream command into a `SIGPIPE` failure (fixed in commit `04d02efd2eb` for markdown-only change detection).
- `.github/actions/phpunit-upload` expects callers to use `if: !cancelled()` instead of `always()`, so cancelled runs stop; prefer `!cancelled()` generally.
- Action hash pinning is enforced by zizmor's `unpinned-uses` audit; other zizmor audits are still disabled with hundreds of findings.
- zizmor cannot parse a workflow with a dynamic `${{ fromJson(...) }}` matrix and warns with exit 0; `zizmor-collection-guard.ts` reconciles those warnings against a known list and reports stale entries.
- Workflows are mirrored to `shopware/shopware-private` via `sync.yml`. `link-private-pr.yml` failed there at octo-sts (identity `ShopwareLinkClosingPR` trusts only `repo:shopware/shopware:ref:refs/heads/trunk`); fixed with a `github.repository` guard on the job.
- The guideline names `CompletionGuard` / `CompletionGuard::shouldForceFailure()` (tested by `CompletionGuardTest`) as the bootstrapper guard, but no such class exists in the installed 6.7.13.0 core package — see Code check.

## Code check (6.7.13.0)
- confirmed `TestBootstrapper` — core test bootstrapper class the guard is attached to — vendor/shopware/core/TestBootstrapper.php:22
- unverified `CompletionGuard` — not found in the installed Shopware packages; likely only on the upstream trunk
- unverified `CompletionGuard::shouldForceFailure()` — not found in the installed Shopware packages
- unverified `setAutoExit` — Symfony Console API, vendor/symfony out of scope
- unverified `zizmor-collection-guard.ts` — monorepo CI tooling, not shipped in packages
- unverified `composer lint:actions` — monorepo composer script, not shipped in packages
