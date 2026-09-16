---
id: platform/dev/6.7/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.md
title: Make Core mail templates independent from Storefront urls
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.html
sourceHash: 935d8c1e31f1e3fe5459dbc9a884c59bb731de34
codeCheckedAgainst: "6.7.13.0"
keywords: ["mail templates", "headless", "rawUrl", "raw_url", "domain", "core.newsletter.subscribeUrl", "core.loginRegistration.pwdRecoverUrl", "core.loginRegistration.confirmationUrl", "NewsletterSubscribeUrlEvent", "deepLinkCode", "double opt-in", "password recovery", "email links", "adr"]
summary: "ADR: core mail links should be built in templates from a domain variable and fixed public paths, not rawUrl; 6.7 still uses system-config URL templates."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-09-06) about making core mail templates (newsletter, registration, password recovery, order status) work without the Storefront bundle, i.e. in headless setups, by defining a fixed set of public URL paths.

## When to use

When building a custom frontend (e.g. PWA/headless) that must handle links in Shopware's core mails, or when customising the URLs those mails contain.

## Key steps / config

Problem: some core mails depend on Storefront routes, which do not exist headless. The newsletter subscription, double opt-in and password recovery URLs were made configurable via system config and the Administration, with Storefront paths as defaults; this does not scale and it is unclear where to apply them since mails can be triggered from different entry points (business events, Flow Builder).

Decision (planned):
- Generate links in the mail templates by string concatenation instead of PHP-side generation or Twig URL functions, so links work even when the route is not registered.
- Add a domain variable to the Twig mail context (domain of the sales channel context, order, etc.).
- The paths used in core mail templates become public API; custom frontends provide the same paths or redirects, or override the mail templates.
- Deprecate the system-config values and URL events for PHP-side link generation.

Default public paths:

```
/account/order/{deepLinkCode}
/account/recover/password?hash={recoverHash}
/newsletter-subscribe?em={emailHash}&hash={subscribeHash}
/registration/confirm?em={emailHash}&hash={subscribeHash}
```

What the installed 6.7 code does: the URLs are still built PHP-side from system-config templates with placeholders, and the newsletter URL passes through `NewsletterSubscribeUrlEvent`:
- `core.newsletter.subscribeUrl` — default `/newsletter-subscribe?em=%%HASHEDEMAIL%%&hash=%%SUBSCRIBEHASH%%`
- `core.loginRegistration.pwdRecoverUrl` — default `/account/recover/password?hash=%%RECOVERHASH%%`
- `core.loginRegistration.confirmationUrl` — default `/registration/confirm?em=%%HASHEDEMAIL%%&hash=%%SUBSCRIBEHASH%%`

Third-party clients either adhere to the default paths, add their own mail templates, or extend the core template and branch per sales channel or domain.

## Essential identifiers

- `core.newsletter.subscribeUrl`, `core.loginRegistration.pwdRecoverUrl`, `core.loginRegistration.confirmationUrl`
- `NewsletterSubscribeUrlEvent`
- Twig function `rawUrl`; route `frontend.account.order.single.page` with `deepLinkCode`

## Gotchas

- The ADR calls the Twig function `raw_url`; the registered name is `rawUrl`.
- The planned deprecation was not carried out as of 6.7.13.0: the config keys and the URL event are active and not marked deprecated, and the order-state mail fixtures in core still call `rawUrl('frontend.account.order.single.page', ...)`.
- No `{{ domain }}` mail variable was found in the core mail code checked.

## Code check (6.7.13.0)
- corrected `core.newsletter.subscribeUrl` — docs: to be deprecated; still read with this default path — vendor/shopware/core/Content/Newsletter/SalesChannel/NewsletterSubscribeRoute.php:363
- confirmed `NewsletterSubscribeUrlEvent` — still dispatched when building the subscribe URL — vendor/shopware/core/Content/Newsletter/SalesChannel/NewsletterSubscribeRoute.php:370
- corrected `core.loginRegistration.pwdRecoverUrl` — docs: to be deprecated; still read — vendor/shopware/core/Checkout/Customer/SalesChannel/SendPasswordRecoveryMailRoute.php:242
- corrected `core.loginRegistration.confirmationUrl` — docs: to be deprecated; still read by double opt-in — vendor/shopware/core/Checkout/Customer/Service/DoubleOptInService.php:118
- confirmed `/newsletter-subscribe?em=` — default path in system config — vendor/shopware/core/System/Resources/config/newsletter.xml:12
- confirmed `/account/recover/password?hash=` — default path in system config — vendor/shopware/core/System/Resources/config/loginRegistration.xml:200
- corrected `rawUrl` — docs: `raw_url`; registered Twig function name — vendor/shopware/core/Framework/Adapter/Twig/Extension/RawUrlFunctionExtension.php:29
- corrected `deepLinkCode` — docs: templates avoid URL functions; order mail fixture still uses rawUrl — vendor/shopware/core/Migration/Fixtures/mails/order.state.cancelled/de-html.html.twig:9
- unverified `{{ domain }}` — no mail-context domain variable found in core
