---
id: platform/func/settings/mailer.md
title: Mailer
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/mailer
sourceHash: e88c4522dfa11978eefce4c292bd106e6925c6c17f883e0f1076c04b24a6ee19
revision:
  current: true
  range: "6.5.0.0 - 6.6.9.0"
  swMin: "6.5.0.0"
  swMax: "6.6.9.0"
keywords: ["mailer", "settings system mailer", "local email agent", "sendmail", "SMTP server", "SMTP OAuth", "SmtpOAuthTransport", "smtp+oauth", "MAILER_DSN", "disable email delivery", "sender address", "delivery address", "symfony mailer"]
summary: How to configure Shopware's Settings > System > Mailer: local sendmail, SMTP (with or without OAuth 2), or the Symfony MAILER_DSN environment setting.
lastBuilt: 2026-09-15
---
## What it is

The mailer, under **Settings > System > Mailer**, controls how the self-hosted store sends outgoing email: via the server's local mail agent (sendmail), an external SMTP server (with Basic Auth or OAuth 2), or the Symfony mailer configured through an environment variable. This page does not apply to Shopware 6 SaaS environments.

## When to use

Use this to switch how a self-hosted store dispatches transactional emails, to connect a third-party SMTP provider, or to temporarily disable email delivery entirely.

## Key steps / config

- **Local e-mail agent**: uses the host's sendmail; you can choose synchronous (`sendmail -bs`, recommended — reports delivery errors) or asynchronous (`sendmail -t`) dispatch, depending on server support.
- **SMTP server (Basic Auth)** fields: Host, Port (25 by default; e.g. 587 for AOL/Gmail), Username/Password, Encryption method (`ssl`, `tls`, or none), Sender address (fallback sender used when no `senderMail` is set on the email template nor an address is configured in Basic information; also used with `SmtpOAuthTransport` when the agent is `smtp+oauth`), Delivery address (test recipient, also BCC'd all outgoing mail), and **Disable email delivery**.
- **SMTP server with OAuth 2**: select it under **Preferred email agent**; fields add OAuth URL, OAuth Scope, Client ID, and Client Secret alongside Host/Port/Encryption/Sender/Delivery address/Disable email delivery.
- **Use environment configuration** (third option): set the connection string in the project's `.env` file, e.g.:

```
MAILER_DSN=null://localhost
```

set to a pattern like:

```
MAILER_DSN=smtp://username:password@mailserveraddress:port
```

## Essential identifiers

- Admin path: **Settings > System > Mailer**.
- Env var: `MAILER_DSN`.
- OAuth transport name: `SmtpOAuthTransport`; email agent value `smtp+oauth`.
- sendmail flags: `-bs` (synchronous), `-t` (asynchronous).

## Gotchas

- With some providers (e.g. Office365), sending can fail if the configured sender address differs from the account's master-data address — these should match.
- The **Disable email delivery** switch fully stops mail dispatch regardless of which of the three configuration methods is active; storefront snippets (e.g. the checkout's "order confirmation sent" notice) are unaffected by this and may still be shown.
