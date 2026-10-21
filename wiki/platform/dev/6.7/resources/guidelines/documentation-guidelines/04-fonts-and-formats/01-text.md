---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.md
sourceHash: 097258cb1edf72deb5e3d18594060b8820addb48
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.html
title: Text
version: "6.7"
versions:
  - "6.7"
keywords: ["fonts and formats", "text formatting", "bold", "italic", "lists", "description list", "date and time", "numbers", "tables", "hyperlinks", "headings", "markdown", "style guide"]
summary: "Shopware docs text formatting rules: bold and italic usage, list types, date and time, numbers, tables, hyperlinks, and heading levels."
lastBuilt: 2026-10-21
---
## What it is

The text part of the "fonts and formats" section of the Shopware documentation guidelines. It defines how to format emphasis, lists, dates and times, numbers, tables, hyperlinks, and headings in Markdown documentation. Global styles must not be overridden.

## When to use

When formatting a Shopware documentation page and you need to decide between bold and italic, choose a list type, write dates, numbers, tables or links, or set heading levels.

## Key steps / config

### Emphasis

- **Bold** (`**bold**`): UI elements, notices (warning, notice, important declaration), API response status codes, and titles in description lists.
- *Italic* (`*italic*`): drawing attention to a word or phrase, parameter values, classes, methods, product versions, and key terms such as SQL Database.
- Never underline content.

### Lists

- Use sentence case for items in all lists.
- **Numbered list** — for a fixed number of entities or sequential steps.
- **Bulleted list** — general enumerations, written with an asterisk `*` in Markdown. Bulleted lists inside tables use HTML list tags (`<ul><li>...</li></ul>`).
- **Description list** — bold title, then a hyphen or new line, then the description; can itself be numbered or bulleted.

```markdown
* **Data management** - The Administration displays entities of the Core component.
* **State management** - Proper state management is key here.
```

### Date and time

- Use the 12-hour clock unless the documented feature uses 24-hour time.
- Capitalize AM and PM with one space before them.
- Avoid time zones; if needed, spell out the region and include the *UTC* or *GMT* label.
- Spell out month names (`January 19, 2017`), or use the numeric `MM-DD-YYYY` format separated by hyphens.

### Numbers

Spell out ordinals in text (first, fourth, twelfth, twenty-third); prices, weight, and quantity are exceptions that stay numeric.

### Tables

- Never embed a table in the middle of a sentence.
- Use table headings for the first row and first column only.
- Use tables only for more than one row and column.
- Do not end table text with punctuation (period, ellipsis, colon).
- Use sentence case for contents, headings, labels, and captions.
- Introduce a table with a complete sentence that refers to its position ("the following table").

### Hyperlinks

- Use meaningful link text; never "click here" or "read this document".
- Introduce links with a complete sentence such as "For more information, see ...".
- Keep link text short and put important words first.
- Do not reuse identical link text for different targets in one document.
- If link text contains an abbreviation in parentheses, include both the long form and the abbreviation.

### Headings

- Set levels with `#`; never skip a level (an H3 must sit under an H2).
- H1 headings use title case ("Flow Sequence Evaluation"); all sub-headings use sentence case ("Flow sequence evaluation").
- See the Vitepress Markdown guide for further syntax.

## Gotchas

- The source calls the H1 style "camel case", but its example ("Flow Sequence Evaluation") is title case with spaces.
- Bulleted lists use `*`, not `-`, except inside tables, where HTML list tags are required.

## Code check (6.7.15.1)
- unverified `**bold**` — Markdown formatting rule, no code identifier in the vendor/shopware roots
- unverified `MM-DD-YYYY` — documentation date format rule, no normative code claim to check
- unverified `Vitepress` — documentation site tooling, not part of the installed Shopware code
