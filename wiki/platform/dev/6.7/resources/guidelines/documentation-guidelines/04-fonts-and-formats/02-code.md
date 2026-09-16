---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.md
title: Code
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/04-fonts-and-formats/02-code.html
sourceHash: ff45c56f6af71dac923af60a43dfa9c5312cccc6
codeCheckedAgainst: "6.7.13.0"
keywords: ["code formatting", "inline code", "code blocks", "code fence", "language identifier", "http status codes", "placeholders", "PLACEHOLDER_NAME", "command prompt", "blockquote", "api reference", "deprecations", "documentation guidelines"]
summary: "Shopware docs code formatting rules: inline code, fenced blocks with language ids, status codes, CLI prompts, placeholders, API reference and deprecations."
lastBuilt: 2026-09-15
---
## What it is

The code part of the Shopware documentation guidelines on fonts and formats: how to format inline code, code blocks, blockquotes, API reference text, class and method descriptions and deprecation notices in Markdown documentation.

## When to use

When writing or reviewing Shopware developer documentation that contains code, commands, identifiers or API descriptions.

## Key steps / config

### Inline code (backticks)

Put in code font: attribute names and values, CLI utility names, class/method/function names, enum names, command output, data types, environment variable names, file names and paths, folders, HTTP methods and status codes, alias names, parameter values.

- HTTP status codes: number and name in code font, e.g. HTTP `400 Bad Request` status code.
- A class of codes: `HTTP 2xx` or `200` status code; an exact range: status code in the `400-499` range.

### Command prompt

- Start each input line of CLI instructions with the `$` prompt symbol.
- Never show the current directory before the prompt, even when the instruction changes directories.

### Placeholders

- Explain every placeholder the first time it appears in sample output.
- Write placeholders in capitals, italic code font; in Markdown wrap them in asterisks and backticks: `(*`PLACEHOLDER_NAME`*)`.
- Do not use *X*; choose an informative name.

### Code blocks

- Use a code fence for multi-line snippets or commands with sample output, and always add a language identifier for syntax highlighting.
- Inside lists, indent the fenced block to the list item so the list does not break.
- Indent with two spaces, never tabs.
- Mark omitted output with `...` on its own line.

### Blockquotes

`>` for a blockquote, `>>` for a nested one.

### Not in code font

Email addresses, domain names, URLs, and names of products, services and organizations.

### API reference

- Describe every class, interface, struct, constant, field, enum and method, with a description per parameter and the status codes.
- Capitalize HTTP method names (`GET`, `PUT`, `PATCH`).
- Give meaningful parameter information, link to related docs, and end the parameter description with valid and default values (*Valid values are `true` and `false`. The default is `false`.*).
- Detailed docs cover invocation or instantiation, key features, best practices and pitfalls.

### Classes and methods

- Describe the class briefly, adding only what cannot be deduced from its name and signature.
- Describe what a method does, its prerequisites, why and how to use it, possible exceptions and related APIs.
- Follow method names with `()`.
- Cross-linking parameters, classes and methods is allowed.

### Deprecations

State the replacement or the change needed, in a warning container:

```markdown
::: warning
**Deprecated** - Access it using this getProd() method instead.
:::
```

## Gotchas

- A code block inside a list that is not indented breaks the list; the source shows this as the "danger" example.
- `getProd()` in the deprecation example is illustrative only, not a Shopware API.

## Code check (6.7.13.0)
- unverified `getProd()` — illustrative method name in a docs style example, not a Shopware API claim
- unverified `PLACEHOLDER_NAME` — documentation placeholder convention, no installed-code counterpart
- unverified `400 Bad Request` — status-code formatting example, no normative code claim
