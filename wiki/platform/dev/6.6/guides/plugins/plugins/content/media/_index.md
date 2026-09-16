---
id: platform/dev/6.6/guides/plugins/plugins/content/media/_index.md
title: Media
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/media/
sourceHash: c2bdb14392a5c9a888f65b58456754b85c7718fb
keywords: ["media", "media file extension", "media deletion", "media plugin", "media management", "file upload", "media purge", "UnusedMediaPurger", "media file types"]
summary: "Overview hub for Shopware plugin guides on adding media file extensions and preventing deletion of used media files."
lastBuilt: "2026-09-15"
---
## What it is

This is the overview page for the Media section of the plugin guides, covering how plugins can add new allowed media file extensions and prevent deletion of media files not directly referenced by foreign keys.

## When to use

Use this section when a plugin needs to accept new file types in the Media module, or must protect media files that its own data structures reference (e.g. JSON blobs) from being purged as unused.

## Key steps / config

The section splits into: registering new media file extensions, and hooking into the unused-media deletion process to mark referenced files as used.
