---
id: platform/dev/6.7/products/paas/shopware/resources/object-storage.md
title: Object Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/resources/object-storage.html
sourceHash: e096080dec2cbd3982b2bceb9a5485c21c46a1ca
codeCheckedAgainst: "6.7.13.0"
keywords: ["object storage", "s3-compatible", "public bucket", "private bucket", "shopware filesystem", "media manager", "build step", "migration step", "setup step", "exec", "worker", "paas native"]
summary: Shopware PaaS Native apps get a public and a private S3-compatible bucket; no direct S3 access; filesystem unavailable in the build step.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

Every Shopware PaaS Native application is created with two S3-compatible object storage buckets, one public and one private. The Shopware filesystem of new applications is configured to use this S3-compatible storage by default.

## When to use

When you need to write media or other files to the Shopware filesystem on PaaS Native, or need to know in which runtime contexts the filesystem is mounted.

## Key steps / config

- To add media or write files, use one of:
  - the media manager in Shopware Admin,
  - the Shopware API,
  - a PHP script run from an environment that has the filesystem mounted.
- The Shopware filesystem is available in: `storefront`, `admin`, `worker`, `exec` sessions, the `migration` step, and the `setup` step.
- It is **not** available in the `build` step.

Background on the Shopware filesystem configuration: [filesystem](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md).

## Essential identifiers

- Contexts: `storefront`, `admin`, `worker`, `exec`, `migration`, `setup`, `build`

## Gotchas

- The S3 storage setup is part of the platform design and should not be changed later.
- The underlying S3 buckets cannot be accessed or modified directly from outside the container environment.
- Do not rely on filesystem access during the `build` step.

## Code check (6.7.13.0)
- confirmed `shopware.filesystem.private` — Shopware's private filesystem (default type local) maps to the private bucket — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:177
- confirmed `shopware.filesystem.public` — public filesystem (default type local) maps to the public bucket — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:182
- confirmed `AwsS3v3Factory` — core S3 adapter factory used for S3-compatible storage — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:13
- confirmed `amazon-s3` — adapter type string returned by the S3 factory — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- unverified `build` — PaaS step contexts (build, migration, setup, exec) are platform runtime, outside vendor/shopware
