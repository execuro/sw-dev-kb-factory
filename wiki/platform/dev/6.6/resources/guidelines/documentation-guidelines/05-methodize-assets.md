---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/05-methodize-assets.md
title: Methodize Assets
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/05-methodize-assets.html
sourceHash: ce7577fca6d47332ce3412ea733054a4550cbf1d
keywords: ["documentation assets", "image naming convention", "screenshots", "diagrams", "GIFs", "Mermaid", "Meteor Diagram Kit", "alt text", "file naming convention", "video captions", "PII masking", "asset management"]
summary: "Guidelines for naming, sizing, and managing documentation images, diagrams, screenshots, GIFs, files, and videos."
lastBuilt: "2026-09-15"
---
## What it is
Guidelines for organizing, naming, and managing documentation assets (images, diagrams, screenshots, GIFs, files, videos) in the Shopware docs repository.

## When to use
When adding or referencing visual assets, diagrams, screenshots, or files in documentation.

## Key steps / config
- Diagram/screenshot specs: file types `.png`, `.svg`, `.gif` only (PNG for screenshots, SVG for drawings); max file size 5 MB; max image size 768x576px at a 4:3 aspect ratio (auto-handled by the docs build); no borders; mask/remove PII; include alt text, e.g. `![Alt](/path/to/img.jpg "image title")`.
- Image naming: `<topicName>-<meaningfulImageName>.svg`, or with a sub-topic `<topicName>-<subtopicName>-<meaningfulImageName>.svg`; serialize with a numeric suffix for multiple images under one topic (e.g. `storefront-dataHandling-pages_01.svg`).
- Store all media in the assets directory and test images in a local build before publishing.
- Diagram tooling: Mermaid (flowcharts, sequence/state/class diagrams) embedded in a fenced `mermaid` code block; Meteor Diagram Kit for other diagram types following Shopware design standards.
- Screenshots: use the latest supported OS UI, keep the window in focus, avoid scrollbars, use realistic data, stay visually consistent, never use screenshots for code samples.
- File naming: `<two_digit_number>-<meaningful_image_name>.md`, e.g. `01-doc-process.md`.
- Videos: provide captions and transcripts; follow the same naming pattern as images.

## Essential identifiers
- `![Alt](/path/to/img.jpg "image title")` alt-tag syntax
- Fenced `mermaid` code block
- `<topicName>-<subtopicName>-<meaningfulImageName>.svg` naming pattern
- `<two_digit_number>-<meaningful_image_name>.md` file naming pattern

## Gotchas
Images must not include copyrighted material without permission and credit, and personally identifiable information (passwords, logins, account details) must be masked or removed before publishing.
