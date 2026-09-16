---
id: "platform/func/features/webhook-actions-in-flow-builder.md"
title: "Webhook Actions In Flow Builder"
docType: "functional"
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/features/webhook-actions-in-flow-builder"
sourceHash: "78154ccdfa475289a08137b471a33a09cad794dd55add9019238f7afd5bb2896"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["webhook actions", "flow builder", "webhook", "flow trigger", "third-party provider", "API notification", "new order event", "data forwarding"]
summary: "Webhook actions in Flow Builder forward flow data to API-based third-party providers when a trigger fires."
lastBuilt: "2026-09-15"
---
## What it is
Webhook actions let a flow created in the flow builder transfer data to API-based third-party providers via a webhook when a trigger occurs.

## When to use
Use it when you want to forward data based on a specific trigger — for example, telling a server that a new order has occurred, as a notification or a request for the server to act on that information.

## Key steps / config
Create a flow using the flow builder, then add a webhook action to transfer data to a third-party provider.

## Essential identifiers
- `flow builder`
- `webhook actions`
