---
id: platform/dev/6.7/resources/references/adr/2021-08-11-make-platform-stand-alone.md
title: Make shopware/shopware stand-alone for development and testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-11-make-platform-stand-alone.html
sourceHash: a56109b091ead58281e083af84b3ca7bc54742a8
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/shopware", "shopware/development", "shopware/production", ".env.dist", ".env", "docker-compose.yml", "docker-compose.override.yml", "composer scripts", "stand-alone platform", "core development setup", "ci pipeline", "entrypoints", "adr"]
summary: "ADR 2021-08-11: shopware/shopware runs stand-alone for core dev and CI (.env.dist, docker-compose.yml); projects still start from shopware/production."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: product-operations, 2021-08-11) that makes the `shopware/shopware` repository usable on its own for development and testing, instead of requiring the `shopware/development` or `shopware/production` template to provide config, console/web entrypoints and development tooling.

## When to use

When setting up a checkout of `shopware/shopware` to work on the core itself or to run its tests/CI, and when deciding which repository a new project should start from.

## Key steps / config

- `shopware/shopware` is used directly in the pipeline; development tooling lives in the platform repository, and CLI and web entrypoints exist so it can be tested without a template.
- Composer scripts ease common tasks. They stay small and simple; essential functionality belongs in npm scripts or Symfony commands (improve those if too complicated), and scripts should accept arguments where possible.
- Standard environment convention:
  - `.env.dist` — default environment variables
  - `.env` — custom environment, e.g. for a native setup
  - `docker-compose.yml` — a working environment
  - `docker-compose.override.yml` — local overrides, for example exposing ports
- Defaults should work out of the box; `docker-compose.yml` exposes no hard-coded ports, since that cannot be undone and may prevent the app service from starting.

## Gotchas

- This is advertised only as the `shopware/shopware` development setup. Projects should still start from `shopware/production` as a template; `shopware/development` should keep working.
- The problems it removes: the template and `shopware/shopware` had to be updated in lockstep, IDEs struggled with multi-repository projects, tooling updates broke everything, git revision/diff auto-detection failed because the template was the root, and every release branch needed an extra template branch.
- Stated downsides: projects may try to use `shopware/shopware` directly, and it is one more setup to choose from. Upsides: simpler CI (errors easier to reproduce locally), simpler local setup, no custom scripts missing from some setups.

## Code check (6.7.15.1)
- confirmed `.env.dist` — platform tooling falls back to `.env.dist` when locating the project root — vendor/shopware/core/DevOps/StaticAnalyze/phpstan-bootstrap.php:22
- confirmed `.env` — booted via Dotenv when `.env`/`.env.dist` exist — vendor/shopware/core/DevOps/StaticAnalyze/phpstan-bootstrap.php:64
- unverified `docker-compose.yml` — repository-root file, outside the checked package roots
- unverified `docker-compose.override.yml` — repository-root file, outside the checked package roots
- unverified `shopware/production` — separate template repository, out of scope
