---
id: platform/dev/6.7/guides/hosting/configurations/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/
sourceHash: 7d64c4b33cea4427cfafa6e82ae92a5629c7c923
codeCheckedAgainst: "6.7.13.0"
keywords: ["framework configuration", "symfony frameworkbundle", "framework", "framework.yaml", "symfony config", "hosting configuration", "config/packages", "routing"]
summary: Overview of Symfony FrameworkBundle (framework:) configuration in Shopware 6; only parts of it, such as custom routes, are documented here.
lastBuilt: 2026-09-15
---
## What it is

Section index for framework configurations: settings that originate in the Symfony FrameworkBundle (the `framework:` configuration key) and are only partially documented in the Shopware guides, e.g. custom routes.

## When to use

When you need to adjust Symfony FrameworkBundle settings for a Shopware installation; for the full option list, the Symfony FrameworkBundle configuration reference applies.

## Essential identifiers

- `framework` (Symfony FrameworkBundle configuration key)

## Code check (6.7.13.0)
- confirmed `framework` — core ships FrameworkBundle defaults under the `framework:` key — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:11
- unverified `FrameworkBundle` — Symfony package, vendor/symfony out of scope
