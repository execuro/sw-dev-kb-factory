---
id: platform/func/tutorials-and-faq/creation-of-robots-txt.md
title: Creation Of Robots Txt
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/creation-of-robots-txt
sourceHash: fba8b5fff530fd3cfb28cb3c7d52069a10d023ce32888cdc0c756d74d54200c1
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["robots.txt", "search engine crawlers", "sitemap", "disallow", "user-agent", "htaccess", "RewriteRule", "nginx rewrite", "public directory", "multi-domain robots", "6.7.1.0", "basic information"]
summary: "How to create a robots.txt in Shopware's public directory (or per-domain via .htaccess/NGINX rewrites), plus the 6.7.1.0 admin rules option."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to create and customize the `robots.txt` file for a Shopware shop to control search-engine crawler access, and how to serve different robots files per domain.

## When to use
When optimizing a shop for search engines, blocking crawler access to specific paths, or running multiple domains/subshops that each need their own robots rules.

## Key steps / config
- As of Shopware 6.7.1.0, individual robots.txt rules per domain can be defined in the Admin under **Settings > General > Basic information**.
- Otherwise, the robots file is not generated automatically — create `robots.txt` manually as a text file in the public directory. Example content:
```
User-agent: *
Allow: /
Disallow: */?
Disallow: */account/
Disallow: */checkout/
Disallow: */widgets/
Disallow: */navigation/
Disallow: */bundles/
Disallow: */imprint$
Disallow: */privacy$
Disallow: */gtc$
Sitemap: https://YOUR_DOMAIN/sitemap.xml
```
- To serve multiple robots.txt files (one per domain), extend `~/public/.htaccess` at the top with: `RewriteRule ^robots\.txt$ robots/%{HTTP_HOST}.txt [NS]`. For NGINX, use `rewrite ^/robots\.txt$ /robots/$host.txt` inside the relevant server block (NGINX does not use `.htaccess`).
- Create a `public/robots/` folder and add one `.txt` file per domain named after the hostname, e.g. `~/public/robots/domain.tld.txt`, `~/public/robots/subshop.domain.tld.txt`. Once this is set up, the plain `public/robots.txt` is no longer used.

## Essential identifiers
`robots.txt`, `public/robots/`, `.htaccess` `RewriteRule ^robots\.txt$ robots/%{HTTP_HOST}.txt [NS]`, NGINX `rewrite ^/robots\.txt$ /robots/$host.txt`, Admin **Settings > General > Basic information**.

## Gotchas
Once per-domain robots files are configured via the rewrite rule, the shop's top-level `public/robots.txt` is ignored.

## Version notes
As of Shopware 6.7.1.0, per-domain robots.txt rules can be managed directly in the Admin instead of via manual file creation.
