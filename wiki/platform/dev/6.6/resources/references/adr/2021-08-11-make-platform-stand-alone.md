---
id: platform/dev/6.6/resources/references/adr/2021-08-11-make-platform-stand-alone.md
title: Make shopware/shopware stand-alone for development and testing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-11-make-platform-stand-alone.html
sourceHash: a56109b091ead58281e083af84b3ca7bc54742a8
keywords: ["shopware/shopware", "shopware/development", "shopware/production", ".env.dist", ".env", "docker-compose.yml", "docker-compose.override.yml", "composer scripts", "standalone development", "cli entrypoint"]
summary: "ADR: shopware/shopware gets its own dev tooling and cli/web entrypoints so it no longer needs shopware/development to run standalone."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record moving development tooling directly into `shopware/shopware`, removing the cyclic dependency on `shopware/development`/`shopware/production` templates for development and testing.

## When to use

Relevant when setting up or reasoning about local development/CI for the `shopware/shopware` repository itself, as opposed to a merchant project built from `shopware/production`.

## Key steps / config

- `shopware/shopware` is used directly in the pipeline; development without a template becomes possible by moving development tooling into the platform repo.
- This setup is only advertised for `shopware/shopware` development; projects should still start from the `shopware/production` template. `shopware/development` continues to work.
- CLI and web entrypoints are added to allow testing; composer scripts are added for common tasks, kept small, with core logic in npm scripts or Symfony commands, and arguments allowed where possible.
- Standard convention: `.env.dist` provides default environment variables, `.env` allows a custom environment, `docker-compose.yml` provides a working environment, `docker-compose.override.yml` is for local overrides (e.g. exposing ports).
- Defaults should work out of the box: `docker-compose.yml` must not hard-code exposed ports, since that can't be undone and may block app-service startup.

## Essential identifiers

- `shopware/shopware`, `shopware/development`, `shopware/production`
- `.env.dist`, `.env`, `docker-compose.yml`, `docker-compose.override.yml`

## Gotchas

The change is meant to simplify CI and local setup without introducing custom scripts unavailable in other setups, but it also adds "yet another shopware setup to choose from".
