---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/administration/_index.md
sourceHash: 9cf5151dbc248b14a8c23fc081218daff43154e9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/
title: Administration
version: "6.7"
versions:
  - "6.7"
keywords: ["app administration", "admin extension", "manifest.xml", "admin", "action-button", "module", "custom-fields", "Resources/administration", "Resources/cms.xml", "cms blocks", "custom modules", "action buttons"]
summary: Apps extend the Administration only via defined points - manifest modules, action buttons, custom fields, CMS blocks - not component overrides.
lastBuilt: 2026-10-21
---
## What it is

The entry page for extending the Shopware Administration from an app. Apps cannot freely override or extend Administration components: any JS files provided in the `Resources/administration` namespace of an app are ignored. Instead, apps use defined extension points.

## When to use

When an app needs to add something to the Administration and you need to know which mechanism is available instead of plugin-style component overrides.

## Key steps / config

Extension points available to apps:

- **Custom modules** — declared in `manifest.xml` under `<admin>` as `<module>` elements.
- **Action buttons** — declared in `manifest.xml` under `<admin>` as `<action-button>` elements.
- **Custom fields** — declared in `manifest.xml` in the `<custom-fields>` element.
- **Custom CMS blocks** — declared in the app's `Resources/cms.xml`.

Skeleton of the manifest parts involved (attributes and children elided):

```xml
<manifest>
    <admin>
        <action-button .../>
        <module .../>
    </admin>
    <custom-fields>...</custom-fields>
</manifest>
```

## Essential identifiers

- `manifest.xml` elements `admin`, `action-button`, `module`, `custom-fields`
- `Resources/cms.xml`

## Gotchas

- JS placed in `Resources/administration` of an app is ignored — this is plugin-only territory.

## Version notes

- Custom CMS blocks for apps are available starting with Shopware 6.4.2.0.

## Code check (6.7.15.1)
- confirmed `admin` — optional manifest element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:22
- confirmed `action-button` — child of `admin` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:219
- confirmed `module` — child of `admin` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:220
- confirmed `custom-fields` — optional manifest element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:69
- confirmed `Resources/cms.xml` — read by the CMS block lifecycle handler when present — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- unverified `Resources/administration` — "ignored for apps" is a build/loader behavior not located in a single code line
- unverified `6.4.2.0` — historical version claim, not checkable in the 6.7 code
