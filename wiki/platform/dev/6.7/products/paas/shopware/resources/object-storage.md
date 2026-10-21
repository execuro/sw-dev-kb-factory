---
id: platform/dev/6.7/products/paas/shopware/resources/object-storage.md
title: Object Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/resources/object-storage.html
sourceHash: e096080dec2cbd3982b2bceb9a5485c21c46a1ca
codeCheckedAgainst: "6.7.15.1"
keywords: ["object storage", "s3", "s3-compatible", "bucket", "public bucket", "private bucket", "shopware filesystem", "shopware.filesystem", "amazon-s3", "media manager", "shopware paas native", "build step"]
summary: Shopware PaaS Native apps get public and private S3-compatible buckets as the default Shopware filesystem; no direct access, not mounted in the build step.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

Every application in Shopware PaaS Native is created with two S3-compatible object storage buckets: a public bucket and a private bucket. The Shopware filesystem of new applications is configured to use this S3-compatible storage by default. This setup is part of the platform design and should not be changed later.

## When to use

When you need to add media or other files to the Shopware filesystem of a PaaS Native application, or need to know in which runtime contexts the filesystem is available.

## Key steps / config

You cannot access or modify the S3 storage directly from outside the container environment. To write to the Shopware filesystem, use one of:

1. the media manager in the Shopware Administration,
2. the Shopware API,
3. a PHP script run from an environment that has the filesystem mounted.

The Shopware filesystem is available in these contexts: `storefront`, `admin`, `worker`, `exec` sessions, the `migration` step and the `setup` step.

In Shopware itself, the two buckets correspond to the `public` and `private` filesystems under `shopware.filesystem`, which an S3 setup configures with adapter type `amazon-s3` (see [filesystem](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md)).

## Essential identifiers

- `shopware.filesystem.public` / `shopware.filesystem.private`
- adapter type `amazon-s3`
- contexts: `storefront`, `admin`, `worker`, `exec`, `migration`, `setup`

## Gotchas

- The Shopware filesystem is **not** available in the `build` step — do not write media or files there.
- Do not reconfigure the storage away from the default S3 setup; the platform relies on it.

## Code check (6.7.15.1)
- confirmed `shopware.filesystem.private` — default private filesystem config block — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:188
- confirmed `shopware.filesystem.public` — default public filesystem config block — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:193
- confirmed `amazon-s3` — S3 adapter type returned by AwsS3v3Factory::getType() — vendor/shopware/core/Framework/Adapter/Filesystem/Adapter/AwsS3v3Factory.php:43
- unverified `storefront`/`admin`/`worker`/`exec` contexts — PaaS runtime contexts, not part of the vendor roots
