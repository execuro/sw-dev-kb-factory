---
id: platform/dev/6.7/products/paas/shopware/cdn/custom-domains.md
title: Custom Domains
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/custom-domains.html
sourceHash: 5d6871740f198183f793b690676d2bf3b7bf0984
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom domain", "sw-paas domain create", "sw-paas org list", "cdn.shopware.shop", "_shopware-challenge", "dns records", "cname", "apex domain", "txt record", "fastly", "sw-paas application deploy create", "sales_channel_domain", "paas native"]
summary: Add a custom domain to Shopware PaaS Native - CNAME or Fastly A/AAAA records, _shopware-challenge TXT, sw-paas domain create, deploy, assign in admin.
lastBuilt: 2026-10-21
---
## What it is

Setup guide for serving a Shopware PaaS Native shop on your own domain through the Fastly CDN. The platform actively validates DNS in real time during domain creation, so records must be configured and fully propagated before you create the domain.

## When to use

When attaching a branded apex domain (`example.com`) or subdomain (`shop.example.com`) to a PaaS Native shop, or troubleshooting a failed `sw-paas domain create`.

## Key steps / config

Prerequisites: `sw-paas` CLI installed and configured, your organization ID (`sw-paas org list`), DNS management access for a registered domain, permission to deploy.

| Record | Apex | Non-apex | Target | Count |
|---|:-:|:-:|---|:-:|
| `CNAME` | no | yes | `cdn.shopware.shop` | 1 |
| `A` | yes | no | Fastly IPv4 | 4 |
| `AAAA` | yes | no | Fastly IPv6 | 4 |
| `TXT` | yes | yes | ownership proof | 1 |

1. **DNS records.** Non-apex: `shop.example.com.  IN  CNAME  cdn.shopware.shop.` Apex: all four `A` records `151.101.3.52`, `151.101.67.52`, `151.101.131.52`, `151.101.195.52` and all four `AAAA` records `2a04:4e42::820`, `2a04:4e42:200::820`, `2a04:4e42:400::820`, `2a04:4e42:600::820`.
2. **Ownership.** Add a TXT record in your zone (example: domain `shop.example.com`, zone `example.com`, org `abc123`):
   ```dns
   _shopware-challenge.<domain> IN TXT "shopware-challenge=<organization id>"
   _shopware-challenge.example.com.  IN  TXT  "shopware-challenge=abc123"
   ```
3. **Verify propagation** (15-30 min typical, up to 48 h): `dig shop.example.com CNAME`, `dig example.com A`, `dig example.com AAAA`, `dig _shopware-challenge.example.com TXT`; query other resolvers with `dig @8.8.8.8 example.com A`.
4. **Create the domain:** `sw-paas domain create` - run once per domain; multiple domains per shop are allowed.
5. **Deploy** to activate: `sw-paas application deploy create` (or `sw-paas application update`); the same commit may be reused.
6. **In Shopware Administration**, associate the domain with the desired storefront (sales channel domain configuration).

## Essential identifiers

- `sw-paas domain create`, `sw-paas org list`, `sw-paas application deploy create`, `sw-paas application update`, `sw-paas application deploy get`
- `cdn.shopware.shop` (CNAME target), `_shopware-challenge.<domain>` / `shopware-challenge=<organization id>` (TXT)
- Sales channel domain entity `sales_channel_domain`

## Gotchas

- Creating the domain before DNS has propagated fails: checks are A/AAAA to the Fastly addresses plus TXT matching the org ID (apex), CNAME to `cdn.shopware.shop` (non-apex), and resolvability via public DNS.
- The TXT challenge record is required for all root domains and must stay as long as the custom domain is configured.
- Validation failures: ensure all 4 A, all 4 AAAA and the TXT record exist, the TXT value exactly matches `shopware-challenge=<your-org-id>`, and there are no typos or stray spaces.
- Domain created but no traffic / TLS errors / timeouts: confirm the deployment finished (`sw-paas application deploy get`), the domain is assigned to a storefront and the sales channel is configured, clear browser and Shopware caches, and allow more propagation time.
- For support, provide domain, organization ID, exact error text, `dig` output, a timeline, and DNS provider screenshots.

## Code check (6.7.15.1)
- confirmed `sales_channel_domain` — the storefront/domain association made in step 6 is a sales channel domain entity — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
- unverified `sw-paas domain create` — PaaS CLI, not part of Shopware code
- unverified `cdn.shopware.shop` — PaaS DNS/Fastly infrastructure, out of scope
- unverified `_shopware-challenge` — PaaS platform domain validation, out of scope
