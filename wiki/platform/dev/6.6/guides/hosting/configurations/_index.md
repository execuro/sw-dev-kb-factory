---
id: platform/dev/6.6/guides/hosting/configurations/_index.md
title: Configurations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/
sourceHash: dd53d1c58a5545547b7a3ff0fb03599b56fe3736
keywords: ["configurations", "shopware.yaml", "config packages", "environment configuration", "dev environment", "prod environment", "symfony configuration environments", "mailer.yaml"]
summary: "Overview of Shopware 6 config file layout under config/packages, including environment-specific overrides."
lastBuilt: "2026-09-15"
---
## What it is

This index page introduces the configuration options available when running Shopware 6, and where the configuration files live in a project.

## Key steps / config

The general bundle configuration for Shopware 6 resides in:

```text
<project root>
└── config
   └── packages
      └── shopware.yaml
```

To target a specific environment, create an environment-scoped file, e.g.:

```text
<project root>
└── config
   └── packages
      └── dev
         └── mailer.yaml
```

```text
<project root>
└── config
   └── packages
      └── prod
         └── mailer.yaml
```

For more on environment-specific configuration, the page points to Symfony's configuration environments documentation.

## Essential identifiers

- `config/packages/shopware.yaml`
- `config/packages/<env>/mailer.yaml`
