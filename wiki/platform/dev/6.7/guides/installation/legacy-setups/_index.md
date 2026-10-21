---
id: platform/dev/6.7/guides/installation/legacy-setups/_index.md
title: Legacy Setups
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/
sourceHash: 18443e261913655959f8e166391aee0ded423b08
codeCheckedAgainst: "6.7.15.1"
keywords: ["legacy setups", "devenv", "symfony cli", "docker setup", "local development", "installation", "deprecated setup", "migration", "shopware-cli", "nix"]
summary: Index of legacy local dev setups (Devenv, Symfony CLI) kept for reference; Docker via Shopware CLI is the recommended path for new projects.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md", "platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md"]
---
## What it is

An overview of older local development setups for Shopware 6, kept for reference only and no longer recommended for new projects. The recommended replacement is installing Shopware with Docker (platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md), which is now largely achievable more simply through the Shopware CLI.

## When to use

- Maintaining an existing long-lived project that already uses one of these setups.
- Teams with established local workflows built around them.
- Migration scenarios away from an older setup.

## Key steps / config

Legacy environments documented in this section:

- Devenv — platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md
- Symfony CLI — platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md

For new projects use the Docker setup instead: platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md.

## Gotchas

- Legacy setups may not receive the same level of updates or optimization as the recommended Docker / Shopware CLI setup.

## Code check (6.7.15.1)
- unverified `devenv` — external local tooling, not part of the Shopware core/storefront/administration code
- unverified `Symfony CLI` — external tool, out of scope
- unverified `shopware-cli` — separate CLI project, out of scope
