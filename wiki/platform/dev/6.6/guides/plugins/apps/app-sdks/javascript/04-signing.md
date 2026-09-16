---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/04-signing.md
title: Signing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/04-signing.html
sourceHash: e86ed24568819693116747174e2e38fd12fa78d8
keywords: ["signing", "signResponse", "app.signer", "shop", "authenticity", "response signing", "AppServer", "getShopById"]
summary: "JS App SDK signing guide: call app.signer.signResponse(response, shop) to sign responses sent back to the Shopware server."
lastBuilt: "2026-09-15"
---
## What it is

Explains that the Shopware App System requires apps to sign every response sent back to the Shopware server, so the server can verify authenticity and detect tampering.

## Key steps / config

Resolve the shop, build the response, then sign it with `app.signer.signResponse`:

```javascript
const shop = await app.repository.getShopById('shop-id');

const response = new Response('Hello World', {
    headers: {
        'Content-Type': 'text/plain',
    },
});

const signedResponse = await app.signer.signResponse(response, shop);
```

## Essential identifiers

- `app.signer.signResponse(response, shop)`
- `app.repository.getShopById(id)`
