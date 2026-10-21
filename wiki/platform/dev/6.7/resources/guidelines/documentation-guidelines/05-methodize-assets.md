---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/05-methodize-assets.md
sourceHash: ee9d518f9ab751162fcac518ce63666c1ccc86f4
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/05-methodize-assets.html
title: Methodize Assets
version: "6.7"
versions:
  - "6.7"
keywords: ["documentation assets", "images", "screenshots", "diagrams", "gif", "video", "mermaid", "meteor diagram kit", "image naming convention", "alt text", "file naming", "svg", "png"]
summary: Shopware docs rules for images, diagrams, screenshots, GIFs, videos and files - formats, size limits, alt text and naming conventions.
lastBuilt: 2026-10-21
---
## What it is

The Shopware documentation guideline for managing documentation assets (images, diagrams, screenshots, GIFs, videos, files): quality specifications, placement, tools and naming conventions. For a new visual, contact the Shopware design team or file a request in the `shopware/docs` GitHub issues.

## When to use

When adding an image, diagram, screenshot, GIF, video or new file to the Shopware documentation repository.

## Key steps / config

**Visual specifications**

| Attribute | Rule |
|---|---|
| File type | only `.png`, `.svg`, `.gif` — PNG (lossless) for screenshots, SVG for diagrams, charts, logos |
| File size | max. 5 MB; upload high-quality images |
| Image size | width max 768px, height max 576px (handled automatically by the docs build) |
| Aspect ratio | 4:3 (handled automatically) |
| Copyright | obtain permission and credit protected images |
| PII | mask, modify or remove passwords, logins, account details |
| Alt tags | always include alt text: `![Alt](/path/to/img.jpg “image title”)` |
| Borders | none |

**Placement**

- One image for a whole procedure: at the end of the procedure, or aligned with the lead-in paragraph.
- One image per step: at the end of the step it illustrates.
- Precede most images with an introductory sentence.
- Store all media in the `assets` directory of the `shopware/docs` repository, copy the reference into the Markdown file, and test the images in a local build.

**Image naming**

- `<topicName>-<meaningfulImageName>.svg`, e.g. `storefront-pages.svg`
- with subtopic: `<topicName>-<subtopicName>-<meaningfulImageName>.svg`, e.g. `storefront-dataHandling-pages.svg`
- serialized under one topic: `storefront-dataHandling-pages_01.svg`
- letters and hyphens only.

**Diagrams** — create them to show architecture, complex relationships, or a complex workflow. Use Mermaid for flowcharts, sequence, state machine and class diagrams, embedding the code in a fenced block with the `mermaid` language identifier. Use the Meteor Diagram Kit (Figma) for other, non-UML diagrams; it follows Shopware design standards.

**Screenshots** — use them for example visualizations, panels populated with query and settings, configurations, or new features. Rules:

- Crop to the relevant portion; no distracting content or whitespace.
- Desktop application UIs: use the latest OS version supported by the solution.
- In focus, showing an active window, wizard or dialog box; avoid scroll bars.
- Real-world or near-realistic data; consistent across screenshots.
- Any tool works (GIMP, Snipping tools, ...).
- Never screenshot code samples — use code blocks.
- Do not screenshot pages likely to change frequently.

**GIFs** — to demonstrate procedure flows, highlight functionality visually, or guide setup and initial tasks.

**Files** — name files in a folder `<two_digit_number>-<meaningful_image_name>.md`, e.g. `01-doc-process.md`.

**Videos** — provide captions and transcripts; follow the image naming pattern.

## Gotchas

- The specification table gives the file-name pattern as `<topicName>-<subtopicName>-<meaningfulImageName>.md.` while the naming section uses `.svg`; use the image's actual extension.

## Code check (6.7.15.1)
- unverified `<topicName>-<meaningfulImageName>.svg` — documentation asset naming convention, not part of the Shopware code roots
- unverified `mermaid` — docs-site code block language, outside the Shopware code roots
