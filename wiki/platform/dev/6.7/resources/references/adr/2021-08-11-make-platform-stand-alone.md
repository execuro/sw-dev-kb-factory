---
id: platform/dev/6.7/resources/references/adr/2021-08-11-make-platform-stand-alone.md
title: Make shopware/shopware stand-alone for development and testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-11-make-platform-stand-alone.html
sourceHash: a56109b091ead58281e083af84b3ca7bc54742a8
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/shopware", "shopware/development", "shopware/production", ".env.dist", ".env", "docker-compose.yml", "docker-compose.override.yml", "composer scripts", "platform repository", "development setup", "ci pipeline", "adr"]
summary: "ADR: shopware/shopware runs stand-alone for dev/tests (entrypoints, composer scripts, .env.dist, docker-compose.yml); projects start from shopware/production."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-08-11) that makes the `shopware/shopware` platform repository usable on its own for development, testing and CI, instead of requiring the `shopware/development` or `shopware/production` template as the root project.

## When to use

When setting up a local checkout of `shopware/shopware` to contribute to the platform, or when deciding which repository a new project should start from.

## Key steps / config

Problems with the template-as-root approach (context):
- `shopware/development` and `shopware/shopware` had to be updated in lockstep.
- Some IDEs struggle with multi-repository projects.
- Updating development tooling broke everything.
- Git revision/diff auto-detection broke because the template was the root.
- Each release branch needed an additional template branch.

Decisions:
- The pipeline uses `shopware/shopware` directly; the development tooling moves into the platform repository.
- Add CLI and web entrypoints to the platform so it can run and be tested.
- Add small composer scripts for common tasks; essential logic lives in npm scripts or Symfony commands, and scripts should accept arguments where possible.
- Follow standard conventions:
  - `.env.dist` provides default environment variables.
  - `.env` defines a custom environment (e.g. a native setup).
  - `docker-compose.yml` provides a working environment.
  - `docker-compose.override.yml` holds local overrides, e.g. exposed ports.
- Defaults must work out of the box; `docker-compose.yml` must not expose hard-coded ports, since that cannot be undone and may block the app service from starting.
- This is advertised only as the `shopware/shopware` development setup; projects should still start from `shopware/production`, and `shopware/development` keeps working.

## Gotchas

- Consequences named by the ADR: simpler CI and local setup, no setup-specific custom scripts, but projects may try to use `shopware/shopware` directly and there is one more setup to choose from.

## Code check (6.7.13.0)
- confirmed `.env.dist` — core's PHPStan bootstrap still loads `.env`/`.env.dist` from the project dir — vendor/shopware/core/DevOps/StaticAnalyze/phpstan-bootstrap.php:64
- confirmed `.env.dist` — checked alongside `.env` when detecting the project root — vendor/shopware/core/DevOps/StaticAnalyze/phpstan-bootstrap.php:22
- confirmed `shopware/production` — referenced as the project template whose htaccess hashes the updater knows — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:21
- unverified `docker-compose.yml` — repository-root file of shopware/shopware, not part of the installed vendor packages
- unverified `docker-compose.override.yml` — repository-root file, out of scope of the vendor packages
- unverified `shopware/development` — template repository, not referenced in the installed core code
- unverified `composer scripts` — defined in the shopware/shopware root composer.json, not in the installed packages
