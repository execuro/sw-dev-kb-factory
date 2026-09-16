---
id: platform/func/saas/extensions.md
title: Extensions
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/extensions"
sourceHash: "22164fd022a2707b7eed96ce008fc6055f8ab9227a3243ed2c1923f504054c63"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["extensions", "apps", "themes", "Store", "My extensions", "install app", "uninstall app", "incompatible apps", "cancel and remove extension", "permissions", "Settings > Account > Company", "Settings > Account > Billing", "upload extension", "MACOSX zip"]
summary: "Buying, installing, deactivating, and removing extensions/apps/themes via the admin Store and My extensions areas."
lastBuilt: "2026-09-15"
---
## What it is
This page documents how extensions (apps and themes) are purchased in the **Store**, managed under **My extensions**, and what data must be maintained before extensions can be added.

## When to use
Use this when purchasing, installing, updating, deactivating, uninstalling, or fully cancelling and removing an extension, or when preparing company/billing data required to add extensions.

## Key steps / config
- **Store**: browse and filter extensions by Sort, Category, Rating, payment type, and Other (support, trial). Open an extension's detail page and click **Add extension**, agree to terms and conditions, confirm required authorisations (**Show authorisations**), then add it — it appears under **My extensions**.
- **My extensions > Apps**: overview with **Hide inactive extensions**, **Sorting**, an **Active** toggle (deactivating preserves app settings, unlike uninstalling), a context menu (**Permissions**, **Update** via zip upload, **Uninstall**), and **Upload extension** for manual add.
- **My extensions > Themes**: overview with the same Hide/Sorting/Active controls, plus context menu items **Open extension** (jumps to Themes area), **Data privacy & safety**, **Privacy policy extensions**, **Permissions**, **Update**, **Uninstall**. Active themes are not auto-assigned to a sales channel — assignment happens in the sales channel.
- **Install extension**: click **Install App** in **My extensions**; if the extension has its own configuration, open it via **Open app**.
- **Cancel and remove extension**: required to end a paid rental (deactivating/uninstalling alone is not sufficient, and it also removes the extension's settings) — use the "..." button > **cancel and remove**, then confirm.
- MacOS zip uploads can fail because macOS adds a `__MACOSX` subfolder; remove it first, e.g. with `zip -d data.zip "__MACOSX/*"` and `zip -d data.zip "*/.DS_Store"`.

## Essential identifiers
- Admin paths: **Store**, **My extensions**, **Extensions > My Extensions**, **Settings > Account > Company**, **Settings > Account > Billing > Payment method**.
- CLI: `zip -d data.zip "__MACOSX/*"`.

## Gotchas
- Apps purchased from the Store should always be installed via the Admin Store, not by uploading a file.
- An app not (yet) marked compatible with an upcoming major version by its manufacturer is flagged incompatible under **Extensions > My Extensions**; if still incompatible at release time, it is automatically disabled.
- Company information (**Settings > Account > Company**) and a billing payment method (**Settings > Account > Billing > Payment method**) must be set up in advance even for free extensions, or the extension cannot be added.
