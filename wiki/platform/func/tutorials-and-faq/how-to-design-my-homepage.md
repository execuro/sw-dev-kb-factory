---
id: platform/func/tutorials-and-faq/how-to-design-my-homepage.md
title: How To Design My Homepage
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/how-to-design-my-homepage
sourceHash: fd2e6b109d622093b443c10de9679f5c936b0afb929706bfbe072e759048e289
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["shopping experiences", "layout", "listing page", "layout editor", "category layout", "assign layout", "duplicate layout", "block element", "sidebar block", "product filter block"]
summary: "How to create a Shopping Experience listing-page layout, add blocks/elements, and assign or duplicate it for a category."
lastBuilt: "2026-09-15"
---
## What it is
A walkthrough of creating a category/listing-page layout in Shopping Experiences and assigning it to a category, including duplicating a layout for reuse with different content.

## When to use
When designing or varying the layout of the shop's category/listing pages using the Shopping Experiences layout editor.

## Key steps / config
1. Go to **Content > Shopping Experiences** and click **Create new layout**.
2. Select the layout type **Listing page** (needed for category/listing pages).
3. Choose the layout structure (changeable later), then add elements via the **+** button — e.g. a sidebar block, or other block categories/objects such as a product filter.
4. Drag the selected block element into place in the layout.
5. Save the layout with the **Save** button.
6. To assign it: go to **Catalogues > Categories**, select the category, open its **Layout** tab, and under **Assign Layout** pick the created layout (or jump directly to the Shopping Experiences editor via **Create New Layout**).
7. Once assigned, the layout's blocks appear as adjustable block groups directly in the category, without needing to open Shopping Experiences separately.
8. To reuse a layout with different content on multiple landing pages, go to **Content > Shopping Experiences**, open the layout's context menu (three dots) and choose **Duplicate**, then customize the copy independently.

## Essential identifiers
Admin path **Content > Shopping Experiences**; layout type **Listing page**; category **Layout** tab / **Assign Layout**; **Duplicate** action.

## Gotchas
The type and number of editable blocks shown on a category's Layout tab vary depending on the assigned layout's structure.
