---
id: platform/dev/6.7/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.md
title: Make Core mail templates independent from Storefront urls
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-06-make-core-mail-templates-independent-from-storefront-urls.html
sourceHash: 935d8c1e31f1e3fe5459dbc9a884c59bb731de34
codeCheckedAgainst: "6.7.15.1"
keywords: ["mail templates", "headless", "storefront urls", "rawUrl", "raw_url", "domain twig variable", "core.loginRegistration.pwdRecoverUrl", "core.loginRegistration.confirmationUrl", "core.newsletter.subscribeUrl", "PasswordRecoveryUrlEvent", "NewsletterSubscribeUrlEvent", "CustomerConfirmRegisterUrlEvent", "double opt-in", "deepLinkCode"]
summary: "ADR: core mail templates build links via string concatenation and public default URLs, not storefront routes, so mails work headless."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2021-09-06, area storefront) deciding that core mail templates (newsletter, registration, password recovery, order status mails) must not depend on Storefront routes, because those routes do not exist when Shopware runs headless without the Storefront bundle.

## When to use

Read this when building a custom/headless frontend (e.g. PWA) that must handle links contained in Shopware's core mails, or when overriding mail templates to point to custom URLs.

## Key steps / config

Decisions in the ADR:

1. No links should be generated on the PHP side (hard to override per sales channel, not changeable by apps). Links are built inside mail templates by string concatenation instead of the `raw_url` Twig function, so they render even if the route is not registered.
2. A `{{ domain }}` variable is to be added to the Twig context, holding the domain of the current sales channel context / order.
3. The URLs used in core mail templates become public API. Custom frontends should serve the same paths or redirect them:

```
/account/order/{deepLinkCode}
/account/recover/password?hash={recoverHash}
/newsletter-subscribe?em={emailHash}&hash={subscribeHash}
/registration/confirm?em={emailHash}&hash={subscribeHash}
```

4. Frontends that cannot use these defaults override the mail templates, or extend a core template and branch with `IF/ELSE` on sales channel or domain.

What the installed code (6.7.15.1) does today: the password recovery, double opt-in and newsletter links are still built in PHP. Each route reads a system config URL template (`core.loginRegistration.pwdRecoverUrl`, `core.loginRegistration.confirmationUrl`, `core.newsletter.subscribeUrl`), falls back to the default path above with `%%RECOVERHASH%%` / `%%HASHEDEMAIL%%` / `%%SUBSCRIBEHASH%%` placeholders, dispatches a URL event, and prefixes the storefront URL.

## Essential identifiers

- `core.loginRegistration.pwdRecoverUrl`, `core.loginRegistration.confirmationUrl`, `core.newsletter.subscribeUrl` (system config URL templates)
- `PasswordRecoveryUrlEvent`, `CustomerConfirmRegisterUrlEvent`, `NewsletterSubscribeUrlEvent` (PHP-side URL events)
- `rawUrl` Twig function (`raw_url` in the ADR)
- `deepLinkCode` (order deep link)

## Gotchas

- The listed URLs are public API and are maintained backward compatibly; a custom frontend must keep them reachable or override templates.
- The ADR plans unit tests asserting no `raw_url` functions in default templates. In the installed fixtures the order mails still call `rawUrl('frontend.account.order.single.page', { 'deepLinkCode': order.deepLinkCode }, salesChannel.domains|first.url)`, so order-link mails still depend on the Storefront route name.
- The `{{ domain }}` variable could not be located in the installed code by search; do not rely on it without checking your version.

## Version notes

The ADR announced deprecating the system-config URL values and the PHP-side URL events and removing them in the next major. In 6.7.15.1 the config keys and the three events are still used and their classes carry no `@deprecated` marker.

## Code check (6.7.15.1)
- confirmed `rawUrl` — Twig function still registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/RawUrlFunctionExtension.php:28
- corrected `frontend.account.order.single.page` — docs: core templates use string concatenation, no raw_url; order mail fixture still calls rawUrl with this route — vendor/shopware/core/Migration/Fixtures/mails/order_confirmation_mail/en-plain.html.twig:10
- confirmed `core.loginRegistration.pwdRecoverUrl` — still read on PHP side for the recovery link — vendor/shopware/core/Checkout/Customer/SalesChannel/SendPasswordRecoveryMailRoute.php:242
- confirmed `PasswordRecoveryUrlEvent` — still dispatched — vendor/shopware/core/Checkout/Customer/SalesChannel/SendPasswordRecoveryMailRoute.php:249
- confirmed `core.loginRegistration.confirmationUrl` — double opt-in confirm URL template — vendor/shopware/core/Checkout/Customer/Service/DoubleOptInService.php:120
- confirmed `CustomerConfirmRegisterUrlEvent` — still dispatched — vendor/shopware/core/Checkout/Customer/Service/DoubleOptInService.php:126
- confirmed `core.newsletter.subscribeUrl` — newsletter subscribe URL template — vendor/shopware/core/Content/Newsletter/SalesChannel/NewsletterSubscribeRoute.php:366
- confirmed `NewsletterSubscribeUrlEvent` — still dispatched — vendor/shopware/core/Content/Newsletter/SalesChannel/NewsletterSubscribeRoute.php:373
- unverified `domain` — Twig context variable not found by search in the installed code
