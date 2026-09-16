---
id: "platform/dev/6.6/products/cli/automatic-refactoring.md"
title: "Automatic refactoring"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/cli/automatic-refactoring.html"
sourceHash: "a1767a42c33ab7dbaea657ecc0196d5c0810365e"
keywords: ["shopware-cli extension fix", "shopware-cli project fix", "Rector", "ESLint", "Admin Twig refactoring", "twig-upgrade", "GEMINI_API_KEY", "OPENROUTER_API_KEY", "OLLAMA_HOST", "extension verifier", "LLM twig upgrade", "automatic refactoring"]
summary: "Shopware-CLI's automatic refactoring tool runs Rector, ESLint and custom Twig rules to fix extensions or projects, plus an experimental LLM Twig upgrade."
lastBuilt: "2026-09-15"
---
## What it is
Documents the Shopware-CLI automatic refactoring tool, which uses Rector for PHP, ESLint for JavaScript, and custom rules for Admin Twig files to refactor an extension or an entire project.

## When to use
Use this when upgrading a plugin or a whole project to a newer Shopware core version and wanting an automated first pass at required code changes, or when experimenting with an LLM-assisted Twig template upgrade.

## Key steps / config
Refactor a single extension:

```shell
shopware-cli extension fix /path/to/your/extension
```

or via Docker:

```shell
docker run --rm -v $(pwd):/ext shopware/shopware-cli extension fix /ext
```

Refactor an entire project:

```shell
shopware-cli project fix /path/to/your/project
```

or via Docker:

```shell
docker run --rm -v $(pwd):/ext shopware/shopware-cli project fix /project
```

Both commands run Rector and ESLint against the code; changes should be reviewed before keeping them. The `shopware/core` requirement in the extension's `composer.json` must be adjusted to the target version first — the tool uses the lowest supported version compatible with that Composer constraint.

An experimental Extension Verifier feature can upgrade Twig templates using a Large Language Model, and should only be run on code tracked in Git or similar:

```shell
shopware-cli extension ai twig-upgrade /ext 6.6.0.0 6.7.0.0-rc1 --provider gemini --model gemini-2.5-pro-exp-03-25
```

Supported `--provider` values are `gemini` (Google Gemini, requires the `GEMINI_API_KEY` environment variable), `openrouter` (OpenRouter API, requires the `OPENROUTER_API_KEY` environment variable), and `ollama` (local Ollama, uses localhost by default; `OLLAMA_HOST` can point to a different host). The documented recommendation is Google Gemini 2.5 Pro for best results.

## Essential identifiers
- `shopware-cli extension fix <path>` — refactors a single extension
- `shopware-cli project fix <path>` — refactors an entire project
- `shopware-cli extension ai twig-upgrade <path> <from> <to> --provider <name> --model <name>` — experimental LLM-based Twig upgrade
- `GEMINI_API_KEY` / `OPENROUTER_API_KEY` / `OLLAMA_HOST` — provider environment variables

## Gotchas
Make a copy of the extension/project before running the fix commands, since they modify files in place; the Twig LLM upgrade should only run on code already versioned in Git.
