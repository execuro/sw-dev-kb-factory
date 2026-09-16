---
id: platform/func/shopware-services/recommendation-preview.md
title: Recommendation Preview
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/recommendation-preview
sourceHash: 78328d357fbbe0d7ef8402790f8510201f43dbef6a4567b240d53c8ab10cdc80
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["recommendation preview", "recommendation preview service", "admin recommendations", "context-related recommendations", "Shopware plan", "context menu", "hide recommendation", "retailer notifications", "extension recommendations"]
summary: "The recommendation preview service shows contextual, dismissible feature/extension recommendations directly in the Shopware admin interface."
lastBuilt: "2026-09-15"
---
## What it is

The recommendation preview service displays intelligent, context-related recommendations directly in the Shopware 6 administration interface, proactively informing retailers about functions and enhancements that can improve store operations without interrupting the workflow.

## When to use

Applies whenever the admin surfaces contextual suggestions about relevant features or extensions in appropriate places within the admin area.

## Key steps / config

Each recommendation contains an icon, a short title, a description, and a link to further information or direct installation. Users with an active Shopware plan can hide individual recommendations via a context menu; once hidden, no further recommendations for that extension are shown.

## Essential identifiers

- Recommendation preview service (admin-embedded contextual recommendations)
- Context menu action: hide recommendation

## Gotchas

- Hiding a recommendation via the context menu requires an active Shopware plan.
- Hiding a recommendation stops further recommendations for that specific extension, not all recommendations.
