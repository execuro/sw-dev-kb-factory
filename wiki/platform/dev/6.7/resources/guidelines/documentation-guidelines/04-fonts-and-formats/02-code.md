---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.md
sourceHash: ff45c56f6af71dac923af60a43dfa9c5312cccc6
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.html
title: Code
version: "6.7"
versions:
  - "6.7"
keywords: ["inline code", "code block", "code fence", "backticks", "language identifier", "placeholder", "PLACEHOLDER_NAME", "command prompt", "http status codes", "blockquote", "api reference", "deprecation notice", "documentation style guide", "code font"]
summary: Shopware docs style rules for inline code, fenced code blocks, placeholders, CLI prompts, HTTP status codes, API reference, methods and deprecations.
lastBuilt: 2026-10-21
---
## What it is

The Shopware documentation guideline for formatting code-related content: inline code, fenced code blocks, blockquotes, items that stay in ordinary font, API reference text, classes and methods, and deprecation notices.

## When to use

When writing or reviewing a Shopware developer documentation article and deciding whether something goes in code font, how to format a code block, or how to describe an API, method or deprecation.

## Key steps / config

**Inline code** — wrap single-line code in backticks. Use code font for: attribute names and values, CLI utility names, class/method/function names, enum names, command output, data types, environment variable names, file names and paths, folders and directories, HTTP methods and status codes, alias names, parameter values.

- HTTP status codes: put number and name in code font, e.g. HTTP `400 Bad Request` status code. A range: `HTTP 2xx` or `200` status code; an exact range: HTTP status code in the `400-499` range.
- Command prompt: start each line of CLI input with the `$` prompt symbol; never show the current directory path before the prompt, even when the instruction changes directories.
- Placeholders: explain each placeholder in sample output the first time it appears; write it in all capitals, italic code font. In markdown: `(*`PLACEHOLDER_NAME`*)` — backticks wrapped in asterisks. Do not use *X* as a placeholder; use an informative name.

**Code blocks**

- Use for snippets longer than one line, or terminal commands with sample output.
- Use a code fence (three backticks) and always give a language identifier for syntax highlighting (e.g. `markdown`, `jsx`, `text`).
- Inside lists, indent the fence to the list item's level, otherwise the list breaks.
- Indent with two spaces, never tabs.
- Mark omitted output lines with three dots (`...`) on a separate line.

**Blockquote** — `>` for a quote, `>>` for a quote nested within a blockquote.

**Ordinary (non-code) font** — email addresses, domain names, URLs, and names of products, services and organizations.

**API reference**

- Describe every class, interface, struct, constant, field, enum and method, with a description of each parameter and the status codes.
- Write API method names capitalized: `GET`, `PUT`, `PATCH`.
- Give meaningful information on request parameters and link to further explanations.
- End a parameter description with valid and default values, e.g. *Valid values are `true` and `false`. The default is `false`.*
- In detailed documentation, cover how to invoke/instantiate the API, key features, best practices and pitfalls.

**Classes and methods**

- Describe a class briefly, stating its intended function beyond what the name and signature show.
- Describe what a method does, then prerequisites before calling it, why and how to use it, possible exceptions, and related APIs.
- Follow method names with `()`.
- Cross-link parameters, classes and methods where useful.

**Deprecations** — always tell the reader what to use instead or what to change, e.g. a warning container reading "**Deprecated** - Access it using this getProd() method instead."

## Gotchas

- A fenced block inside a list item that is not indented to the item level breaks the list (the source contrasts a correctly indented example with a broken one).
- The `getProd()` method in the deprecation example is illustrative only, not a Shopware API.

## Code check (6.7.15.1)
- unverified `PLACEHOLDER_NAME` — documentation formatting convention, not a Shopware code identifier
- unverified `getProd()` — illustrative example in a style guide, not checked against the Shopware code roots
