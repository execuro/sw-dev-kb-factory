---
id: platform/dev/6.7/guides/plugins/apps/gateways/_index.md
title: Gateways
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/
sourceHash: d02d1b8714e88029f4a46930e143172f3ea36122
codeCheckedAgainst: "6.7.15.1"
keywords: ["gateways", "checkout gateway", "context gateway", "in-app purchase gateway", "inAppPurchases", "manifest.xml", "app server", "app system", "runtime decisions", "commands"]
summary: Overview of app gateways (checkout, context, in-app purchases) that delegate runtime decisions to an external app server via manifest <gateways> URLs.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md", "platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md", "platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md"]
---
## What it is

Gateways let an app shape Shopware behaviour at runtime by handing a decision to the app's external server. Shopware sends contextual data to that server, and the server replies with commands from a fixed set that each gateway supports.

## When to use

Use a gateway when the business logic depends on context and cannot run inside the Shopware instance alone:

- restricting or modifying checkout behaviour
- changing the customer context dynamically
- controlling In-App Purchase availability
- applying external business logic or secure server-side decisions at runtime

## Key steps / config

- Register a gateway with a URL under `<gateways>` in the app's `manifest.xml`. The installed schema allows the optional children `<checkout>`, `<context>` and `<inAppPurchases>`.
- Available gateways:
  - [Checkout](platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md)
  - [Context](platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md)
  - [In-App Purchases](platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md)

## Gotchas

- The app server must be reachable and properly secured, because Shopware forwards sensitive contextual data to it while the gateway runs.

## Code check (6.7.15.1)
- confirmed `gateways` — optional manifest element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:143
- confirmed `gateways.checkout` — anyURI, optional — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:528
- confirmed `gateways.context` — anyURI, optional — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:529
- confirmed `gateways.inAppPurchases` — anyURI, optional — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:530
- confirmed `CheckoutGateway` — manifest gateway element class — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/CheckoutGateway.php:11
- confirmed `ContextGateway` — manifest gateway element class — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/ContextGateway.php:11
- confirmed `InAppPurchasesGateway` — manifest gateway element class — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/InAppPurchasesGateway.php:11
