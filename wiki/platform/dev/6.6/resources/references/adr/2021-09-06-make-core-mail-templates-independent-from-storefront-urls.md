---
id: platform/dev/6.6/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.md
title: Make Core mail templates independent from Storefront urls
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.html
sourceHash: 935d8c1e31f1e3fe5459dbc9a884c59bb731de34
keywords: ["mail templates", "headless", "{{ domain }}", "raw_url", "salesChannelContext", "double opt-in", "password recovery", "newsletter subscription", "public API", "deepLinkCode", "order urls", "mail template overrides"]
summary: "ADR: core mail templates build links via string concatenation and a {{ domain }} twig variable instead of PHP-side raw_url, to work headless."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record making core mail templates (Newsletter, Registration, Password Recovery, Order Status) independent from Storefront-generated URLs, so mails work correctly in headless setups without the storefront bundle.

## Key steps / config

- Links are no longer generated on the PHP side; instead they are built inside the mail templates with string concatenation rather than the `raw_url` twig function, so links generate even when the route isn't registered in the system.
- A `{{ domain }}` twig variable is added to the mail context, carrying the domain of the current sales channel context (or the order in question, etc.).
- Default URLs become public API and must be provided by custom frontends (matching path or via redirects):

```
/account/order/{deepLinkCode}
/account/recover/password?hash={recoverHash}
/newsletter-subscribe?em={emailHash}&hash={subscribeHash}
/registration/confirm?em={emailHash}&hash={subscribeHash}
```

- Custom frontends that can't use the default URLs can override the mail templates to generate their own; third-party clients can extend the core mail template and branch on sales channel/domain instead of providing a whole new template.
- The old system-config URL options and PHP-side link-generation events are deprecated and removed in the next major version.

## Essential identifiers

- `{{ domain }}`
- `raw_url` (twig function, now avoided in default templates)
- `/account/order/{deepLinkCode}`, `/account/recover/password`, `/newsletter-subscribe`, `/registration/confirm`

## Gotchas

The listed default URLs are public API and must be kept backward compatible going forward; a unit test verifies default templates avoid `raw_url` and that `{{ domain }}` is present.
