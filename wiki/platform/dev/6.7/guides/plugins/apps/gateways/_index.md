---
id: platform/dev/6.7/guides/plugins/apps/gateways/_index.md
title: Gateways
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/
sourceHash: d02d1b8714e88029f4a46930e143172f3ea36122
codeCheckedAgainst: "6.7.13.0"
keywords: ["app gateways", "gateways", "checkout gateway", "context gateway", "in-app purchase gateway", "inAppPurchases", "manifest.xml", "app server", "runtime business logic", "gateway commands", "external decision"]
summary: App gateways (checkout, context, in-app purchases) delegate runtime decisions to an app server that answers with commands; declared in manifest <gateways>.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md", "platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md", "platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md"]
---
## What it is

Gateways let an app influence Shopware behaviour at runtime by delegating decisions to an external app server. Shopware sends contextual data to the app server, which answers with commands from a fixed set defined per gateway.

## When to use

Dynamic, context-aware business logic that cannot live inside the Shopware instance:

- restrict or modify checkout behaviour
- manipulate the customer context dynamically
- control In-App Purchase availability
- apply external business logic or secure server-side decisions at runtime

## Key steps / config

Available gateways, each with its own command set:

- [Checkout](platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md)
- [Context](platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md)
- [In-App Purchases](platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md)

In the installed code, an app opts in through the optional `<gateways>` element of `manifest.xml` (manifest-3.0 schema), with one URL child per gateway:

```xml
<gateways>
    <checkout>...</checkout>
    <context>...</context>
    <inAppPurchases>...</inAppPurchases>
</gateways>
```

## Essential identifiers

- `<gateways>`, `<checkout>`, `<context>`, `<inAppPurchases>` (manifest)

## Gotchas

- Gateways require a reachable and properly secured app server, because Shopware forwards sensitive contextual data during execution.

## Code check (6.7.13.0)
- confirmed `gateways` — optional manifest element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:143
- confirmed `checkout` — URL child of gateways — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:515
- confirmed `context` — URL child of gateways — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:516
- confirmed `inAppPurchases` — URL child of gateways — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:517
- confirmed `GATEWAYS` — parser maps checkout, context, inAppPurchases — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/Gateways.php:17
