---
id: platform/dev/6.6/guides/plugins/plugins/framework/filesystem/_index.md
title: Filesystem
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/filesystem/"
sourceHash: "c5f8e20a8a8f7b21080b5ac04c48c5acf9d2d20e"
keywords: ["filesystem", "Flysystem", "file storage", "read and write files", "local filesystem", "cloud storage", "Amazon cloud", "plugin files", "filesystem configuration"]
summary: "Landing page for plugin filesystem access: Shopware uses Flysystem so read/write works the same on local disk or cloud storage."
lastBuilt: "2026-09-15"
---
## What it is

This is the landing page for the "Filesystem" section of the plugin guides. Plugins often
need to read and write files, and Shopware manages this through the
[Flysystem](https://flysystem.thephpleague.com/docs/) library.

## When to use

Use this when a plugin needs file read/write access and should not care whether the files end
up on the local filesystem or with a cloud provider — the read and write access stays the
same either way. In a plugin, there is no need to worry about the filesystem's own
configuration; the plugin can use Flysystem's abstraction directly.

## Key steps / config

The source points to the filesystem hosting guide for configuration details, including how to
outsource the filesystem to the Amazon cloud, but the configuration itself is out of scope for
a plugin — plugins simply use Flysystem's read/write access.

## Essential identifiers

- Flysystem — the library Shopware uses to abstract local and cloud file storage.
