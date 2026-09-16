---
id: platform/dev/6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md
title: Providing the admin extension SDK
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.html"
sourceHash: 5380d419b44f6f1fd1b14e2ca59b4408662c102d
keywords: ["Admin Extension SDK", "Meteor Extension SDK", "PostMessage API", "iFrame", "separate repository", "independent deployment", "independent documentation", "monorepo", "Lerna", "administration"]
summary: "Documents why the Admin Extension SDK (now Meteor Extension SDK) lives in its own repository instead of the platform monorepo."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the decision to build the Admin Extension SDK (since renamed to the Meteor Extension SDK) — a toolkit letting plugin and app developers extend or modify the administration via the PostMessage API for iFrames — in its own GitHub repository rather than inside the `platform` monorepo.

## When to use

Relevant when contributing to, or understanding the release/versioning model of, the SDK that plugin and app developers use to interact with the Shopware administration from an iFrame.

## Key steps / config

- Context: the SDK is a toolkit for plugin/app developers to extend or modify the administration via the PostMessage API for iFrames, working in the background from the developer's perspective.
- Decision: the SDK was created in a separate repository rather than the `platform` repository, for several documented reasons:
  - Faster development: the SDK's own pipeline is much smaller/faster than the full platform pipeline, while still providing testing and documentation generation.
  - Independent deployment: the SDK is not hard-bound to a specific Shopware version the way plugins are; it can be released and fixed independently and much faster than a platform release.
  - The SDK is described as "just a convenience layer for the PostMessage API" — keeping it out of the monorepo avoids binding its release cadence to the Shopware release cycle.
  - Independent documentation: documentation lives in the same repository as the SDK code, so a feature cannot be merged without accompanying docs.
  - Mixing a PHP monorepo with JS packages was judged difficult: nested JS packages, `node_modules` traversal and dependency resolution behavior caused problems in the existing component library.
  - No monorepo tool like Lerna is needed: past experience with Lerna produced broken lockfiles and complex dependency resolution; a separate repo just needs a version bump in `package.json` when consumers need new changes.

## Essential identifiers

- Admin Extension SDK (renamed to Meteor Extension SDK)
- PostMessage API (iFrame communication)

## Gotchas

The SDK's name changed after this ADR was written — it is called the Meteor Extension SDK, not the Admin Extension SDK, per the warning in the source. Because the SDK ships from its own repository, a change relevant to the administration side must be published in the SDK repository first, and the administration's dependency on it bumped separately afterwards.
