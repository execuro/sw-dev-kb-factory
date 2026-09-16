---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.md
title: Text
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/04-fonts-and-formats/01-text.html"
sourceHash: "097258cb1edf72deb5e3d18594060b8820addb48"
keywords: ["fonts and formats", "text formatting", "bold", "italic", "underline", "numbered list", "bulleted list", "description list", "date and time", "tables", "hyperlinks", "heading levels"]
summary: "Text formatting rules for Shopware docs: bold/italic usage, list types, date/number formatting, table conventions, hyperlink text, and heading hierarchy."
lastBuilt: "2026-09-15"
---
## What it is
Formatting rules for textual elements (bold, italic, lists, dates, numbers, tables, hyperlinks, headings) in Shopware documentation.

## Key steps / config
- **Bold** (`**bold**`) — for UI elements, notices (warning, notice, important declaration), API response status codes, and titles in description lists. **Italic** (`*italic*`) — for a specific word/phrase, parameter values, classes, methods, product versions, and key terms like SQL Database. **Underline** — never used; don't override global styles.
- **Numbered list** — for a fixed number of entities or sequential steps, e.g.:
  ```markdown
  1. Create a docker-compose.yml file
  2. Start the Docker
  3. Prepare Development
  ```
- **Regular bulleted list** — general enlisting with `*`; regular bulleted lists inside tables use HTML `<ul><li>` tags instead.
- **Description list** — bolded title followed by a hyphen or new line and a description; can itself be numbered or bulleted.
- Date/time: 12-hour clock (24-hour only when documenting a 24-hour-time feature); capitalize AM/PM with one space before the time; avoid time zones unless necessary (spell out region + UTC/GMT); spell out months, e.g. `January 19, 2017`; numerical format is `MM-DD-YYYY` with hyphens.
- Numbers: spell out ordinal numbers (*first, fourth, twelfth, twenty-third*) except for prices, weight, and quantity.
- Tables: don't embed mid-sentence; use headings for the first column and first row only; use only for more than one row and column; no ending punctuation in cells; sentence case throughout; introduce with a full sentence referencing "the following/preceding table".
- Hyperlinks: use meaningful link text, never "click here"/"read this document"; introduce with "For more information, see..."; keep link text short, place important words first; don't reuse the same link text for different targets in one document; include both long form and abbreviation if the link text has one.
- Headings: use `#` for heading levels; don't skip levels (an H3 must fall under an H2); H1 headings use camel case (e.g. *Flow Sequence Evaluation*), sub-headings use sentence case (e.g. *Flow sequence evaluation*).

## Essential identifiers
- `**bold**`
- `*italic*`
