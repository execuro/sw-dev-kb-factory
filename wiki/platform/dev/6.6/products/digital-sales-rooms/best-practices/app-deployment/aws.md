---
id: platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/aws.md
title: AWS
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/best-practices/app-deployment/aws.html
sourceHash: 2648a40ad97c77638fe1fe270cacf35e814197b6
keywords: ["AWS Amplify", "Digital Sales Rooms", "DSR", "frontend deployment", "SHOPWARE_STORE_API", "SHOPWARE_ADMIN_API", "SHOPWARE_STORE_API_ACCESS_TOKEN", "SHOPWARE_STOREFRONT_URL", "ORIGIN", "custom domain", "sales channel domain", "dsr-frontends"]
summary: "Guide to deploying the Digital Sales Rooms frontend to AWS Amplify Hosting, including required environment variables."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is
Steps for deploying the Digital Sales Rooms frontend source code to AWS Amplify Hosting.

## When to use
Use this when you have chosen AWS Amplify as the hosting target for the DSR frontend app and need to connect a Git repository, configure environment variables, and point a domain at the deployed app.

## Key steps / config
1. Register an AWS account.
2. Clone the frontend source code (found inside `/templates/dsr-frontends` after extracting the plugin zip) and push it to your Git repository.
3. In the AWS Amplify Hosting Console, create a new app, authorize access to the Git repository provider, and select the main branch (auto-deploys on changes to it).
4. Choose an app name; build settings are auto-detected.
5. Under Advanced Settings, set environment variables:
   - `SHOPWARE_STORE_API`
   - `SHOPWARE_ADMIN_API`
   - `SHOPWARE_STORE_API_ACCESS_TOKEN`
   - `SHOPWARE_STOREFRONT_URL`
   - `ORIGIN`
6. Confirm the configuration and click "Save and Deploy".
7. Optionally point a custom domain/subdomain at the deployed site (per AWS's own custom-domains guide).
8. Use the resulting frontend app domain to configure the [sales channel domain](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md).

## Essential identifiers
- `SHOPWARE_STORE_API`
- `SHOPWARE_ADMIN_API`
- `SHOPWARE_STORE_API_ACCESS_TOKEN`
- `SHOPWARE_STOREFRONT_URL`
- `ORIGIN`
