---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/05-methodize-assets.md
title: Methodize Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/05-methodize-assets.html
sourceHash: ee9d518f9ab751162fcac518ce63666c1ccc86f4
codeCheckedAgainst: "6.7.13.0"
keywords: ["methodize assets", "documentation assets", "images", "screenshots", "diagrams", "mermaid", "meteor diagram kit", "gifs", "videos", "image naming convention", "alt text", "svg", "png", "documentation guidelines"]
summary: "Shopware docs asset rules: image types, size and naming (topic-subtopic-name.svg), alt text, Mermaid diagrams, screenshots, GIFs, file and video naming."
lastBuilt: 2026-09-15
---
## What it is

The Shopware documentation guideline for managing documentation assets (images, diagrams, screenshots, GIFs, videos and files): quality specifications, placement and naming conventions. New visuals can be requested from the Shopware design team or via the Issues section of `https://github.com/shopware/docs/issues`.

## When to use

When adding images, diagrams, screenshots, GIFs, videos or new Markdown files to the Shopware documentation repository.

## Key steps / config

### Visual specifications

| Attribute | Rule |
| --- | --- |
| File type | Only `.png`, `.svg`, `.gif` (PNG for screenshots, SVG for drawings, charts, logos) |
| File size | max. 5 MB |
| File name | letters and hyphens only |
| Image size | width max 768px, height max 576px (handled by docs build) |
| Aspect ratio | 4:3 (handled by docs build) |
| Copyright | obtain permission and credit protected images |
| PII | mask or remove passwords, logins, account details |
| Alt text | required on every image: `![Alt](/path/to/img.jpg "image title")` |
| Borders | none |

### Placement

- One image for a whole procedure: at the end of the procedure or aligned with the lead-in paragraph.
- One image per step: at the end of each step.
- Precede most images with an introductory sentence.
- Store all media in the repository's assets directory (`https://github.com/shopware/docs/tree/main/assets`), copy the reference into the Markdown file and test in a local build.

### Naming

- Images: `<topicName>-<meaningfulImageName>.svg` (e.g. `storefront-pages.svg`).
- With sub-topic: `<topicName>-<subtopicName>-<meaningfulImageName>.svg` (e.g. `storefront-dataHandling-pages.svg`).
- Series under one topic: numeric suffix, `storefront-dataHandling-pages_01.svg`.
- Documentation files: `<two_digit_number>-<meaningful_image_name>.md` (e.g. `01-doc-process.md`).
- Videos follow the image naming pattern.

### Diagrams

- Use for architecture, complex relationships and complex workflows.
- Mermaid for flowcharts, sequence, state machine and class diagrams, embedded in a fenced code block with language `mermaid`.
- Meteor Diagram Kit (Figma) for other, non-UML diagrams following Shopware design standards.

### Screenshots

- Use to show a visualization, populated panels, configurations and settings, or a new feature; crop to the relevant part.
- Latest supported OS version for desktop UIs; focused, active window, wizard or dialog; avoid scroll bars.
- Realistic data, consistent style across screenshots; any capture tool (GIMP, Snipping tool).
- Never screenshot code (use code blocks) or pages that change frequently.

### GIFs and videos

- GIFs: demonstrate procedure flow, highlight functionality, guide setup tasks.
- Videos: provide captions and transcripts.

## Gotchas

- The specification table's file-name example ends in `.md.` while the naming section uses `.svg`; the `.svg` pattern is the image convention.
- Width, height and aspect ratio are enforced by the docs build, not by the author.

## Code check (6.7.13.0)
- unverified `<topicName>-<subtopicName>-<meaningfulImageName>.svg` — docs repository naming rule, no installed-code counterpart
- unverified `mermaid` — docs code-block language for diagrams, not a Shopware code identifier
- unverified `max. 5 MB` — docs asset limit, no normative claim about installed code
