---
id: platform/dev/6.7/guides/installation/legacy-setups/_index.md
title: Legacy Setups
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/
sourceHash: 18443e261913655959f8e166391aee0ded423b08
codeCheckedAgainst: "6.7.13.0"
keywords: ["legacy setups", "legacy installation", "devenv", "symfony cli", "docker setup", "local development environment", "not recommended", "migration", "shopware cli"]
summary: "Index of legacy local dev setups (Devenv, Symfony CLI), kept for reference only; Docker setup or the Shopware CLI is recommended for new projects."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md", "platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md"]
---
## What it is

An index of older local development setups for Shopware 6, documented for reference only and no longer recommended for new projects:

- [Devenv](platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md)
- [Symfony CLI](platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md)

The recommended alternative is [Install Shopware with Docker](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md), and installation is now largely achievable more simply with the Shopware CLI.

## When to use

Only for existing long-lived projects, teams with established local workflows built on these tools, or migration scenarios away from them.

## Gotchas

- Legacy setups may not receive the same level of updates or optimization as the recommended Docker/Shopware CLI setup.

## Code check (6.7.13.0)
- unverified `Devenv` — external local tooling, not part of the checked vendor roots
- unverified `Symfony CLI` — external local tooling, not part of the checked vendor roots
- unverified `Shopware CLI` — separate shopware-cli tool, out of scope
