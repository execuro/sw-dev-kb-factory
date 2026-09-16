---
id: platform/func/extensions/social-shopping.md
docType: functional
title: Social Shopping
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/social-shopping
sourceHash: 0f62aba5abc3837a8bbe6ca6d5f01b6d25597d65dd2ed13534f2de8719a03e3a
revision:
  current: true
  range: "3.0.0 - 3.0.0"
  swMax: "3.0.0"
  swMin: "3.0.0"
keywords: ["Social Shopping", "Facebook sales channel", "Instagram sales channel", "Google Shopping sales channel", "Pinterest sales channel", "export feed", "referral code", "dynamic product group", "Generate by Scheduler", "Shopware Rise plan", "socialShoppingSalesChannel.salesChannelId", "Google Product Category ID", "Test template"]
summary: "Social Shopping (Rise plan) adds Facebook, Instagram, Google Shopping and Pinterest sales channels driven by exportable XML feeds and templates."
lastBuilt: "2026-09-15"
---
## What it is

Social Shopping is an extension, part of the Shopware Rise plan, that adds additional sales channels integrating with social media platforms — Facebook, Instagram, Google Shopping and Pinterest — mostly via export feeds.

## When to use

Use it to sell products through social media platforms alongside the regular storefront, by generating XML product feeds those platforms consume.

## Key steps / config

- Install/activate under **Extensions > My Extensions** (requires the Rise plan and a logged-in Shopware Account). To disable Social Shopping, first delete the sales channels it created.
- Adds a "Referral" column to customers/orders in the admin, showing which social shopping sales channel an order/customer came from — requires the referral-code variable in the channel's template.
- Each of Facebook/Instagram/Google Shopping shares a similar **General** configuration: Language selection, Name, Active, Storefront sales channel, Storefront sales channel domain, Currency, Dynamic product group (selects which products are exported).
- **Additional settings**: "Import variants as own products" (variants exported individually vs. collective product), Generation interval ("Live" regenerates on every call, otherwise scheduled), "Generate by Scheduler" (generates via the Message Queue/scheduled task once the interval expires), Default Google Product Category ID (numeric only), Time of last generation.
- **Statistics**, **Unpublished products** (Validate products) and **Integration** tabs (Export-URL) only appear after the general configuration is saved.
- **Template** tab: header/product/footer line structure, **Test template** checks syntax, **Generate preview** shows the generated feed, **Variables** lists available template variables (TWIG). Facebook/Instagram/Google Shopping templates must contain the referral-code variable for statistics to work:

```
{{ socialShoppingSalesChannel.salesChannelId }}
```

Extending it into the SEO URL for new installs looks like:

```
{{ seoUrl('frontend.detail.page', {'productId': product.id}) }}?referralCode={{ socialShoppingSalesChannel.salesChannelId }}
```

- **Google Shopping** additionally requires domain verification via an HTML tag file placed in the shop's public directory (per Google Merchant Center instructions).
- **Pinterest** is not feed-based; it exposes meta data instead, with General/Statistics/Integration tabs and a Rich Pins validator link in the Integration tab.
- Customising: default templates use TWIG and can be adjusted for additional product details.

## Essential identifiers

- Admin path: **Extensions > My Extensions**
- Sales channels: Facebook, Instagram, Google Shopping, Pinterest
- Template variable: `{{ socialShoppingSalesChannel.salesChannelId }}`

## Gotchas

Statistics for a channel cannot be calculated without the referral-code variable present in that channel's template. Deactivating Social Shopping requires deleting its sales channels first. Google Product Category ID accepts only purely numeric values.
