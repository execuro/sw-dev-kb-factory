---
id: platform/dev/6.7/guides/plugins/apps/administration/_index.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/
sourceHash: 9cf5151dbc248b14a8c23fc081218daff43154e9
codeCheckedAgainst: "6.7.13.0"
keywords: ["app administration", "admin extension", "manifest.xml", "admin module", "action button", "action-button", "module", "custom-fields", "custom fields", "Resources/administration", "Resources/cms.xml", "cms blocks"]
summary: Apps extend the Shopware Administration only via manifest modules, custom fields, action buttons and CMS blocks; app admin JS files are ignored.
lastBuilt: 2026-09-15
---
## What it is

Overview of how apps (not plugins) extend the Shopware Administration. Apps cannot freely override or extend Administration components: all JS files provided in the `Resources/administration` namespace are ignored. Instead, apps use defined extension points.

## When to use

When an app needs Administration UI: its own modules, custom fields or action buttons, or custom CMS blocks.

## Key steps / config

Extension points available to apps:

- Own Administration modules — declared in `manifest.xml` inside `<admin>` (`<module>`, `<main-module>`).
- Action buttons — `<action-button>` inside `<admin>` in `manifest.xml`.
- Custom fields — `<custom-fields>` in `manifest.xml`.
- Custom CMS blocks — `Resources/cms.xml` in the app.

```xml
<manifest>
    <admin>
        <action-button .../>
        <module .../>
        <main-module .../>
    </admin>
    <custom-fields>...</custom-fields>
</manifest>
```

## Essential identifiers

- `manifest.xml` elements `admin`, `module`, `main-module`, `action-button`, `custom-fields`
- `Resources/cms.xml`

## Gotchas

- JS placed in `Resources/administration` of an app is not loaded; there is no component override mechanism for apps.
- `<main-module>` may appear only once inside `<admin>`.

## Version notes

- Custom CMS blocks for apps are available since Shopware 6.4.2.0.

## Code check (6.7.13.0)
- confirmed `action-button` — parsed from the manifest admin element — vendor/shopware/core/Framework/App/Manifest/Xml/Administration/Admin.php:88
- confirmed `module` — admin modules parsed from the manifest — vendor/shopware/core/Framework/App/Manifest/Xml/Administration/Admin.php:93
- confirmed `main-module` — must only appear once, else exception — vendor/shopware/core/Framework/App/Manifest/Xml/Administration/Admin.php:83
- confirmed `custom-fields` — manifest custom fields element — vendor/shopware/core/Framework/App/Manifest/Manifest.php:302
- confirmed `Resources/cms.xml` — read by the CMS block lifecycle handler — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- unverified `Resources/administration` — "ignored for apps" claim not traced to a specific code path
- unverified `6.4.2.0` — historical version claim, not checkable in installed code
