---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/aws.md
title: AWS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/aws.html
sourceHash: 2648a40ad97c77638fe1fe270cacf35e814197b6
codeCheckedAgainst: "6.7.13.0"
keywords: ["aws amplify", "digital sales rooms", "dsr", "dsr-frontends", "SHOPWARE_STORE_API", "SHOPWARE_ADMIN_API", "SHOPWARE_STORE_API_ACCESS_TOKEN", "SHOPWARE_STOREFRONT_URL", "ORIGIN", "frontend deployment", "hosting", "custom domain", "sales channel domain"]
summary: Deploy the Digital Sales Rooms Nuxt frontend (templates/dsr-frontends) to AWS Amplify from Git, with the required SHOPWARE_* and ORIGIN env vars.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is

A deployment recipe for the Digital Sales Rooms (DSR) frontend app on AWS Amplify Hosting: the app is connected to a Git repository, built with auto-detected settings, and redeployed automatically on every change to the main branch.

## When to use

You run the DSR plugin and want to host its frontend app on AWS Amplify instead of a self-managed Node.js server or another host.

## Key steps / config

Prerequisites:

1. Register an AWS account.
2. Get the frontend source: download the DSR plugin zip, extract it, and take the app from `/templates/dsr-frontends`.
3. Push that source code to your own Git (e.g. GitHub) repository.

Deploy:

1. Log in to the AWS Amplify Hosting Console and create a new app.
2. Select and authorize access to your Git repository provider and select the main branch (changes on it trigger automatic deploys).
3. Choose a name for the app; make sure the build settings are auto-detected.
4. Under the **Advanced Settings** section, set these environment variables with values for your shop:
   - `SHOPWARE_STORE_API`
   - `SHOPWARE_ADMIN_API`
   - `SHOPWARE_STORE_API_ACCESS_TOKEN`
   - `SHOPWARE_STOREFRONT_URL`
   - `ORIGIN`
5. Confirm the configuration and click **Save and Deploy**.

After deploying:

- Optionally point a custom domain or subdomain at the site; AWS Amplify's own custom-domain guide covers this.
- Use the resulting frontend app domain to configure the sales channel domain in Shopware, see [sales channel domain configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md). In core, such a domain is a `sales_channel_domain` record of the sales channel.

## Essential identifiers

- `/templates/dsr-frontends` — location of the frontend app inside the extracted plugin zip
- `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN` — environment variables set in Amplify's Advanced Settings
- `sales_channel_domain` — the Shopware entity holding the frontend domain registered afterwards

## Gotchas

- The environment variables are consumed by the DSR frontend app, not by Shopware core; they do not exist in the installed Shopware packages.
- Deployment is not the last step: the frontend domain still has to be configured as a sales channel domain.

## Code check (6.7.13.0)
- unverified `SHOPWARE_STORE_API` — DSR frontend app env var, not present in vendor/shopware core/storefront/administration
- unverified `SHOPWARE_ADMIN_API` — DSR frontend app env var, outside the installed Shopware packages
- unverified `SHOPWARE_STORE_API_ACCESS_TOKEN` — DSR frontend app env var, outside the installed Shopware packages
- unverified `SHOPWARE_STOREFRONT_URL` — DSR frontend app env var, outside the installed Shopware packages
- unverified `ORIGIN` — Nuxt/DSR app env var, out of scope
- unverified `/templates/dsr-frontends` — ships inside the DSR plugin zip, not in vendor/shopware
- confirmed `sales_channel_domain` — entity name of SalesChannelDomainDefinition — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:31
