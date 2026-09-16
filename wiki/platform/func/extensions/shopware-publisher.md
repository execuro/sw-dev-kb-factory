---
id: platform/func/extensions/shopware-publisher.md
docType: functional
title: Shopware Publisher
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-publisher
sourceHash: b95b849e764c5931a27f9ba068688ced721df9adbb3b1ac8a0a992120c576ba7
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["Shopware Publisher", "shopping experience drafts", "save as new draft", "save and publish", "draft badge", "activity feed", "preview draft", "Shopware Evolve plan", "Extensions > My extensions", "layout versioning", "draft layout", "show changes"]
summary: "Shopware Publisher (Evolve plan) lets editors create and preview draft shopping-experience layouts without changing the live version."
lastBuilt: "2026-09-15"
---
## What it is

Shopware Publisher is an extension, available from the Shopware Evolve plan, that lets you create draft versions of a shopping experience layout, preview them unpublished, and see an activity feed of who worked on a layout — all without changing the live version.

## When to use

Use it to edit or redesign a shopping experience layout without affecting what is currently live, then review and publish it when ready.

## Key steps / config

- Install/activate under **Extensions > My extensions** (available under the Apps tab once logged in with a Shopware Account).
- Save the current layout live with **save**, or click the arrow next to Save and choose **save as new draft** to save changes without going live; name the draft and confirm with **save draft**.
- While editing a draft: a **Draft Badge** marks the layout as a draft; a **user abbreviation** shows who last worked on it; **Preview** opens the draft in the storefront in a new tab; **Save** saves without publishing; **Save and publish** (via the arrow next to Save) overwrites the live layout with the draft.
- In the layout overview, click the tile's middle rectangle for the live layout, or click the draft badge/count in the tile's corner to open a draft instead.
- **Activity** panel shows who made which change and when, for both the live layout and drafts; **show changes** expands a change, and hovering a change highlights it in the layout.

## Essential identifiers

- Admin path: **Extensions > My extensions**
- Actions: **save**, **save as new draft**, **save draft**, **Save and publish**
- UI elements: Draft Badge, Activity panel, show changes

## Gotchas

**Save and publish** overwrites the current live layout — there is no separate confirmation step described beyond selecting the action from the Save button's arrow menu.
