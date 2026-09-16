---
id: platform/func/saas/domains.md
title: Domains
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/domains"
sourceHash: "a2c3d7f4bd2ae29f18b7983e30c572461f661c677d22c07db60ad5e66f67b6a5"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["custom domain", "default domain", "canonical domain", "Settings > System > Domains", "DNS record", "A-Record", "CNAME record", "routing", "email sending", "redirect", "domain verification", "sender email", "shops.shopware.store"]
summary: "Connecting, routing, verifying and troubleshooting custom domains for a SaaS shop under Settings > System > Domains."
lastBuilt: "2026-09-15"
---
## What it is
This page documents how default and custom domains work for a Shopware 6 SaaS shop, and how to connect, route, redirect, and troubleshoot them under **Settings > System > Domains**.

## When to use
Use this when connecting a custom domain to a sales channel, setting up domain-based email sending, redirecting between domains, or diagnosing a domain that is not resolving correctly.

## Key steps / config
- Every SaaS shop has a **default domain** (canonical domain), e.g. `my-shop.shopware.store`, which cannot be removed or changed, and email is initially sent from an address like `store+12345678@mail.shopware.store`.
- Manage domains under **Settings > System > Domains**.
- **Connect a domain**: click a *Connect domain* button, enter the domain, then verify ownership by creating a DNS record with the given verification value (can take up to 48 hours to propagate; the value does not change).
- **Routing**: for a Storefront sales channel, create the routing DNS records; a Headless sales channel used with Shopware Frontends does not require routing DNS.
- **Email sending**: in the domain's **Email sending** tab, click *Enable email sending*, then set up the required DNS records (checked automatically, up to 24 hours to validate). Once valid, go to **Settings > Basic information**, pick the domain under *Sender email*, and enter the local part (e.g. `no-reply` or `info`).
- **Redirect**: choose a temporary redirect (307) or permanent redirect (308) to another connected domain. A domain that is already a redirect target cannot itself be redirected, and path redirects are not supported.
- **Removing a domain** requires it to not be assigned to any sales channel, not be a redirect target, and not used for email sending.
- Example DNS-panel locations by hoster: Profihost (*My Products > Webhosting & Domains*, A-Record type "A", CNAME type "CNAME"), Mittwald (*Domains > DNS-Editor*, tab *Host Address/Alias*), Strato (package overview "..." menu > *Manage Domains*, or *Domains > Domain Administration*), All-inkl (*Tools > DNS Settings* in KAS), 1&1/IONOS (control center), Hostpoint (Control Panel > *Domains > Edit DNS Zone*).

## Gotchas
- A certificate error (`NET::ERR_CERT_COMMON_NAME_INVALID` / `SSL_ERROR_BAD_CERT_DOMAIN`) means the DNS record is set but the domain has not yet been added under **Settings > System > Domains**.
- "The shop domain is not available at the moment" means the domain is connected but not yet assigned to a sales channel — add it via the sales channel's Domains section, then configure language, currency and snippets.
- A valid DNS lookup for the domain must resolve to one of the shop's IP addresses (151.101.2.196, 151.101.66.196, 151.101.130.196, 151.101.194.196) or the CNAME `shops.shopware.store`, and must not contain any other IP or CNAME.
- Domains without a secure HTTPS scheme are automatically redirected to HTTPS.
