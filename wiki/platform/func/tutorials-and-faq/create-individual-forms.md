---
id: platform/func/tutorials-and-faq/create-individual-forms.md
title: Create Individual Forms
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/create-individual-forms
sourceHash: 5ae6b8c55c538111314bafcc1a577566a8775a46d973a21239edb8a81ae69ec7
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["custom form", "CMS extensions", "shopping experience", "form block", "form settings", "recipient address", "e-mail template", "field group", "required field", "form template", "text field", "number field", "selection field", "text area"]
summary: "How to build a custom form via the CMS extensions form block in Shopping Experiences: settings, field groups/types, and saving as a reusable template."
lastBuilt: "2026-09-15"
---
## What it is
Describes building an individual form in a Shopping Experience using the "CMS extensions" extension (part of the Shopware Evolve plan), including form settings and field configuration.

## When to use
When a store needs a custom form (beyond the default contact form) added to a Shopping Experience layout, with configurable recipients, confirmation text, and field types.

## Key steps / config
1. Open **Contents > Shopping Experience worlds**, select or create the target experience world/layout.
2. Click the **+** button to add a block, choose the **form** block category, and drag the form block into the layout.
3. In the form settings **Options** tab, configure: **Name (internal)** (used e.g. when saved as a template), **Headline** (shown in the frontend), **Confirmation text** (shown after submission), **Recipient address** (one or more emails, entered with Enter between them), and **E-mail template** (used to send the form content to recipients).
4. In the **Fields** tab, organize fields into groups (drag to reorder via the left-side dots); each group/field has a context menu to move, duplicate or delete it, and an internal name plus a frontend-visible heading/title.
5. Field-level options common to every type: **Name** (internal, usable as a variable e.g. in e-mail templates), **Title** (frontend label), **Type**, **Width** (fields totalling ≤100% width display side by side), **Required field**, and **Error message** (shown when a required field is empty).
6. Type-specific options: Text/E-mail fields support a placeholder; Number fields support min/max and a step value (e.g. step 3 allows only 3, 6, 9, ...); Selection (checkbox) fields support a default activation state; the Selection type offers `entity`-based or user-defined (`user-defined`) content, the latter entered as free values; Text area supports placeholder text plus line-count and resizability options.
7. Use **Save as template** to reuse the form elsewhere, and **Done** to save the form.

## Essential identifiers
Admin paths: **Contents > Shopping Experience worlds**, form block **Options** tab, form block **Fields** tab, **Save as template**.

## Gotchas
Creating individual forms requires the "CMS extensions" extension, part of the Shopware Evolve plan — it is not available by default in every plan.
