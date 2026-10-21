---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/aws.md
title: AWS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/aws.html
sourceHash: 2648a40ad97c77638fe1fe270cacf35e814197b6
codeCheckedAgainst: "6.7.15.1"
keywords: ["aws amplify", "aws", "digital sales rooms", "dsr", "dsr-frontends", "SHOPWARE_STORE_API", "SHOPWARE_ADMIN_API", "SHOPWARE_STORE_API_ACCESS_TOKEN", "SHOPWARE_STOREFRONT_URL", "ORIGIN", "environment variables", "custom domain", "sales channel domain"]
summary: Deploy the Digital Sales Rooms frontend to AWS Amplify from Git, set the SHOPWARE_* and ORIGIN env vars, then add the sales channel domain.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is

How to deploy the Digital Sales Rooms (DSR) frontend source code to AWS Amplify Hosting. Amplify builds from a connected Git repository and redeploys automatically when the main branch changes.

## When to use

Use this when you host the DSR frontend on AWS instead of Cloudflare Pages or a self-managed Node.js server.

## Key steps / config

Prerequisites:

1. Register an AWS account.
2. Get the frontend source. Download the DSR plugin zip and extract it. The frontend is in `/templates/dsr-frontends`.
3. Push that source to your Git repository (for example GitHub).

Deploy:

1. Log in to the AWS Amplify Hosting Console and create a new app.
2. Select your Git provider, authorize access, and pick the main branch. Amplify auto-deploys when that branch changes.
3. Name the app and check that the build settings are auto-detected.
4. Under **Advanced Settings**, set these environment variables:
   - `SHOPWARE_STORE_API`
   - `SHOPWARE_ADMIN_API`
   - `SHOPWARE_STORE_API_ACCESS_TOKEN`
   - `SHOPWARE_STOREFRONT_URL`
   - `ORIGIN`
5. Confirm the configuration and click **Save and Deploy**.

After deployment:

- Custom domain: point a custom domain or subdomain at the Amplify app by following the AWS custom-domain guide (`https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html`).
- Sales channel domain: register the frontend app's domain as a sales channel domain. See [sales channel domain configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md).

## Essential identifiers

- `/templates/dsr-frontends`: location of the frontend source inside the plugin zip
- `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`: environment variables the frontend build needs

## Gotchas

- Amplify deploys on every change to the selected main branch.
- After deployment, the frontend app's domain still has to be configured as a sales channel domain.

## Code check (6.7.15.1)
- unverified `SHOPWARE_STORE_API` — env var read by the DSR Nuxt frontend, not by vendor/shopware code
- unverified `SHOPWARE_ADMIN_API` — DSR frontend env var, not referenced in vendor/shopware
- unverified `SHOPWARE_STOREFRONT_URL` — DSR frontend env var, not referenced in vendor/shopware
- unverified `ORIGIN` — DSR frontend env var, out of scope for vendor/shopware
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — the Store API access token is sent as the `sw-access-key` header — vendor/shopware/core/PlatformRequest.php:19
- confirmed `SalesChannelDomainDefinition::ENTITY_NAME` — the sales channel domain is the `sales_channel_domain` entity — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
