---
id: platform/dev/6.6/concepts/extensions/plugins-concept.md
title: Plugins
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/extensions/plugins-concept.html
sourceHash: ac7b46e000a68a1e9cfb1b028a56405e95c43ffa
keywords: ["plugin", "symfony bundle", "plugin base class", "composer package", "dependency injection", "shopware cloud", "extension", "custom search engine", "user provider"]
summary: "Plugins extend Symfony bundles, run inside the Core process, and are packaged as Composer packages; not usable on Shopware cloud."
lastBuilt: "2026-09-15"
---
## What it is

Plugins in Shopware are an extension of Symfony bundles, providing their own resources like assets, controllers, services, or tests, and running inside the Shopware Core process.

## When to use

Use plugins (rather than apps) when deep integration is needed — direct database access, overriding services, or custom search engines/user providers — on a self-hosted shop.

## Key steps / config

Every plugin extends an abstract plugin base class, which provides helper methods to initialize parameters like the plugin's name and root path in the dependency injection container. Each plugin is also represented as a Composer package, which may define dependencies.

## Gotchas

Plugins are not compatible with Shopware cloud stores; to extend a Shopware cloud store, use an App instead.
