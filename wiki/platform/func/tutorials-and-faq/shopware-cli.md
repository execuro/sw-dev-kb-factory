---
id: platform/func/tutorials-and-faq/shopware-cli.md
title: Shopware Cli
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/shopware-cli"
sourceHash: "a168a5ea268373cdb15a1a72d3c29aa752efeb4a49ca0af6a849f3071f550dbf"
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.6"
  swMax: "6.6.10.6"
  swMin: "6.6.0.0"
keywords: ["cli", "command line interface", "console commands", "ssh", "putty", "commands reference", "server console", "bulk data processing", "terminal", "windows ssh"]
summary: "Introduces Shopware's console commands, run over SSH, for tasks not limited by browser execution time."
lastBuilt: "2026-09-15"
---

## What it is

A short introduction to Shopware's command-line interface (CLI): console commands run
directly on the server, useful for processing large amounts of data without the
execution-time limits of browser-triggered scripts.

## When to use

When a task needs to run on the server console rather than through the admin UI —
particularly bulk data processing that would otherwise hit browser or script execution
limits.

## Key steps / config

Commands are run in the server console, for example over an SSH connection: Windows
users can use a tool like PuTTY, while macOS and Linux users can connect via the
terminal directly. A complete list of available commands is maintained in the developer
documentation's commands reference.

## Essential identifiers

- Shopware CLI (console commands executed via SSH on the server)
