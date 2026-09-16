---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.md
title: Text
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.html
sourceHash: 097258cb1edf72deb5e3d18594060b8820addb48
codeCheckedAgainst: "6.7.13.0"
keywords: ["text formatting", "bold", "italic", "markdown", "lists", "description list", "date and time", "MM-DD-YYYY", "numbers", "tables", "hyperlinks", "headings", "vitepress", "documentation guidelines"]
summary: "Shopware docs text formatting rules: bold/italic use, list types, date and time, numbers, tables, hyperlink text and heading levels in Markdown."
lastBuilt: 2026-09-15
---
## What it is

The text part of the Shopware documentation guidelines on fonts and formats: how to use emphasis, lists, dates, numbers, tables, links and headings in Markdown (VitePress) documentation pages.

## When to use

When writing or reviewing Shopware developer documentation and deciding how to format prose elements.

## Key steps / config

### Emphasis

- Do not override global styles.
- **Bold** (`**bold**`): UI elements, notices (warning, notice, important declaration), API response status codes, titles in description lists.
- *Italic* (`*italic*`): a specific word or phrase to draw attention to, parameter values, classes, methods, product versions, key terms such as SQL Database.
- Never underline.

### Lists (sentence case for items)

- **Numbered list**: fixed number of entities or sequential steps (`1. Create a docker-compose.yml file`).
- **Bulleted list**: general enumerations, written with `*` in Markdown. Inside tables, bullets use HTML list tags (`<ul><li>...</li></ul>`).
- **Description list**: bold title, then a hyphen or new line and the description; may itself be numbered or bulleted.

```markdown
* **Data management** - The Administration displays entities of the Core component.
```

### Date and time

- 12-hour clock unless the feature uses 24-hour time; capitalize AM/PM with one space before them.
- Avoid time zones; if needed, spell out the region and add the UTC or GMT label.
- Spell out months (`January 19, 2017`) or use the numeric `MM-DD-YYYY` format with hyphens.

### Numbers

Spell out ordinals (first, fourth, twelfth, twenty-third); prices, weight and quantity stay numeric.

### Tables

- Never embed a table mid-sentence; introduce it with a complete sentence referring to its position (*the following table*).
- Headings only for the first row and first column; use tables only with more than one row and column.
- No trailing punctuation (period, ellipsis, colon) in cells; sentence case for contents, headings, labels, captions.

### Hyperlinks

- Meaningful link text; never *click here* or *read this document*.
- Introduce links with *For more information, see ...*; keep link text short with important words first.
- Do not reuse the same link text for different targets in one document.
- If the link text contains an abbreviation in parentheses, include both the long form and the abbreviation.

### Headings

- Use `#` for heading levels and never skip a level (an `<H3>` must sit under an `<H2>`).
- `<H1>` headings in title case (*Flow Sequence Evaluation*); all lower headings in sentence case (*Flow sequence evaluation*).

## Gotchas

- Bulleted lists in tables are the one place where HTML tags replace Markdown list syntax.
- The source calls the H1 style "camel case", but its example is title case with spaces.

## Code check (6.7.13.0)
- unverified `**bold**` — Markdown formatting rule for docs, no counterpart in installed code
- unverified `MM-DD-YYYY` — documentation date style, not a code format claim
- unverified `<H1>` — heading-case rule for docs pages, not a code identifier
