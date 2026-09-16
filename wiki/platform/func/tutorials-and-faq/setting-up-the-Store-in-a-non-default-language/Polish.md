---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md
title: Polish
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish"
sourceHash: "7168d8bd6c1765610c373bb0465359da30bb423f588f1236c7e8e1fc1d349ff2"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["polish", "poland", "language pack", "store language", "admin language", "sales channel", "user interface language", "domain", "tax rate", "footer navigation", "shopping experiences", "demo data translation"]
summary: "Guide to setting up a Shopware 6 store in Polish, covering installer language, admin language, sales-channel language and demo-data translation."
lastBuilt: "2026-09-15"
---

## What it is

A walkthrough for configuring a Shopware 6 store for Poland with a Polish storefront and
admin, using the individual (per-language) language pack. It is valid only for Shopware
6.2.0 up to 6.3.5.3; later versions use a different, unified Shopware language pack
mechanism described in a separate guide.

## When to use

When installing or migrating a Shopware 6.2.0-6.3.5.3 instance and the storefront/admin
need to be presented in Polish, with Poland set as the default sales-channel country.

## Key steps / config

- During installation, pick the desired language from the installer's language drop-down;
  this only affects the installer UI, not the shop itself.
- Prefer **English** or **German** as the system default language; if using another
  language, install and activate the matching language plug-in during the first run
  wizard.
- Set the **default currency** during installation, since it is used as the base for
  currency conversion.
- After installation, log in to the admin (`www.mystore.com/admin` if the login screen
  does not appear automatically) and run the first run wizard, installing the required
  **language pack**. Verify it is **installed** and **activated** under
  **Settings > System > Plugins**.
- Change the admin's own UI language under the administrator's profile: set
  **User interface language** and **Save**.
- Change the storefront language per sales channel: open the sales channel, add the
  relevant **countries**, set the **default country** (Poland), add **currencies** and set
  the **default currency**, add the desired **languages**, and set the channel's
  **default language** to Polish.
- Adjust the sales channel's **Domains**: edit the domain and set its **Currency**,
  **Language** and **Snippet** set; these settings only apply to that one domain. Extra
  languages need their own sub-domain (e.g. a `/de` style sub-domain) within the same
  sales channel.
- Update tax rates for the country under **Settings > Tax**: edit a tax rate, set its
  **Default tax rate**, and optionally add per-country rates via **Add country** (the
  guide uses 23% for Poland).
- Add localized content: create categories under **Catalogues > Categories** for a
  footer navigation structure, assign shop pages built under **Content > Shopping
  Experiences** to those categories, and set a sales channel's **Entry point footer
  navigation** and **Entry point main navigation** to route customers to the translated
  pages.
- Translate any default snippets that don't match expectations under
  **Settings > Snippet**.
- If demo data was installed, translate categories and products (which otherwise fall
  back to English) and translate **Properties** and **Property values** individually,
  since these do not inherit automatically.

## Essential identifiers

- **User interface language** (admin profile setting)
- **Sales Channel** > Domains > **Edit domain** (Currency / Language / Snippet)
- **Settings > System > Plugins** (language pack install/activate)
- **Settings > Tax** > **Default tax rate**, **Add country**
- **Content > Shopping Experiences** (shop pages, landing pages)
- **Catalogues > Categories** (footer navigation entry point)
- **Settings > Snippet**

## Gotchas

- The installer language selection only affects the installer, not the running shop.
- English and German are the only languages with in-house translations; other admin
  languages require installing the corresponding language plug-in first.
- A category name shown in grey/lighter tone means it has not been translated and is
  falling back to the default store language — this applies to categories, products,
  properties, and property values alike.
- Domain-level Currency/Language/Snippet settings are mandatory and apply only to that
  specific domain, not the whole sales channel.

## Version notes

Valid only for Shopware 6.2.0 through 6.3.5.3 using the individual per-language language
pack; from 6.3.5.3 onward and in Shopware 6.4+, a newer, unified Shopware language pack
is used instead, described in a separate guide.
