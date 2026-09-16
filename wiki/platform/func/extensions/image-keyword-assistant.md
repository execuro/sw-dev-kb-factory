---
id: platform/func/extensions/image-keyword-assistant.md
docType: functional
title: Image Keyword Assistant
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/image-keyword-assistant
sourceHash: 3a2e60a35a45a7fdc8bcd9312d4359e6443a7904e5001545d3f9b20e62fdde71
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["Image Keyword Assistant", "AI Copilot", "Shopware Commercial", "alt text", "keyword generation", "media tagging", "Content > Media", "Replace function", "automatic processing", "alt text data handling", "overwrite keywords", "append keywords", "prepend keywords", "commercial plan"]
summary: "AI feature of Shopware Commercial that auto-generates keywords for uploaded media and optionally writes them into image alt text."
lastBuilt: "2026-09-15"
---
## What it is

The Image Keyword Assistant is an AI feature, part of the Shopware Commercial extension, that automatically generates keywords for uploaded media and can add them to the image alt text. It is available to all customers with a commercial plan.

## When to use

Use it to automatically tag and describe uploaded product/media images without manually writing alt text or keywords for each file.

## Key steps / config

- **Use image keyword assistant** — activates the feature.
- Configure the language used for the generated keywords.
- **Add keywords to image alt text** — optional checkbox to also write the generated keywords into the alt text.
- **Alt text data handling** controls how generated keywords affect existing alt text:
  - Overwrite the existing keywords
  - Append the existing keywords
  - Prepend the existing keywords
  - Do not adjust existing keywords

## Essential identifiers

- Feature toggle: **Use image keyword assistant**
- Setting: **Add keywords to image alt text**
- Setting: **Alt text data handling**
- Status display location: **Content > Media**

## Gotchas

The assistant only starts processing media uploaded **after** it is activated; it does not automatically process media that was already uploaded. Existing media is only reprocessed if the file is re-uploaded using the "Replace" function, which re-triggers the tagging process.
