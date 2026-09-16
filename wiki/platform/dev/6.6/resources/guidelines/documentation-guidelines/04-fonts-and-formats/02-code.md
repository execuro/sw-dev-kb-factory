---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.md
title: Code
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.html
sourceHash: ff45c56f6af71dac923af60a43dfa9c5312cccc6
keywords: ["code formatting", "inline code", "code blocks", "backticks", "placeholders", "HTTP status codes", "command prompt", "API reference", "deprecation", "documentation guidelines", "code fence", "blockquote"]
summary: "Style rules for inline code, code blocks, placeholders, API references, and deprecation notices in Shopware docs."
lastBuilt: "2026-09-15"
---
## What it is
Style guide for formatting code-related content in Shopware developer documentation: inline code, code blocks, blockquotes, non-code items, API references, classes/methods, and deprecation notices.

## When to use
When writing or reviewing documentation that includes code snippets, CLI commands, API reference material, or references to classes, methods, or config values.

## Key steps / config
- Inline code: wrap in backticks. Applies to attribute names/values, CLI utility names, class/method/function names, enum names, command output, data types, environment variable names, file names/paths, folders/directories, HTTP methods and status codes, alias names, and parameter values.
- HTTP status codes: write the number and name in code font, e.g. `400 Bad Request`; ranges as `HTTP 2xx` or an explicit range like the `400-499` range.
- Command prompt: prefix each input line with `$`; never show the current directory path before the prompt.
- Placeholders: explain on first use, write in uppercase italic code font, wrap as (*`PLACEHOLDER_NAME`*); never use `X` as a placeholder name.
- Code blocks: use fenced code blocks with a language identifier for syntax highlighting; indent two spaces (never tabs) inside lists; use `...` on its own line to mark omitted sample output.
- Blockquotes use `>`; nested blockquotes use `>>`.
- Non-code (ordinary font): email addresses, domain names, URLs, and names of products/services/organizations.
- API reference: describe every class, interface, struct, constant, field, enum, and method plus parameter descriptions and status codes; capitalize HTTP method names (`GET`, `PUT`, `PATCH`); state valid/default values, e.g. "Valid values are `true` and `false`. The default is `false`."
- Classes/methods: describe purpose beyond what's obvious from the signature; append `()` to method names; cross-link related APIs.
- Deprecations: state the replacement, e.g. "Deprecated - Access it using this getProd() method instead."

## Essential identifiers
- Fenced code blocks (triple backtick) with a language identifier
- `$` command-prompt symbol
- (*`PLACEHOLDER_NAME`*) placeholder convention
