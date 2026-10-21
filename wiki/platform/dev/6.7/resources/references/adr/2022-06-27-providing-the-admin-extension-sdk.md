---
id: platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md
title: Providing the admin extension SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.html
sourceHash: 5380d419b44f6f1fd1b14e2ca59b4408662c102d
codeCheckedAgainst: "6.7.15.1"
keywords: ["admin extension sdk", "meteor extension sdk", "@shopware-ag/meteor-admin-sdk", "postmessage api", "iframe", "administration", "separate repository", "monorepo", "lerna", "app development", "plugin development"]
summary: "ADR: the Admin (now Meteor) Extension SDK, a PostMessage convenience layer for apps/plugins, lives in its own GitHub repo with independent releases."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-06-15) explaining why the Admin Extension SDK — renamed to the Meteor Extension SDK — is developed in a separate GitHub repository instead of the Shopware platform monorepo. The SDK is a toolkit for plugin and app developers to extend or modify the Administration; its methods talk to the Administration in the background through the PostMessage API for iFrames.

## When to use

When contributing to the SDK, or when wondering why SDK fixes ship independently of Shopware releases and how a new SDK feature reaches the Administration.

## Key steps / config

Reasons given for the separate repository:

- **Faster development** — the large platform pipeline does not have to run for small changes; the SDK pipeline is fast and covers testing and documentation generation.
- **Independent deployment** — the SDK is not hard-bound to a Shopware version. Apps include it directly as a dependency, and it supports newer Shopware versions, so a bug fix can be released in minutes.
- **Convenience layer only** — the SDK wraps the PostMessage API; putting it in the monorepo would tie it to the Shopware release cycle.
- **Independent documentation** — docs live in the same repository, so a feature without documentation is not merged.
- **PHP monorepo mixed with JS packages is difficult** — nested JS packages inside the platform structure (plugin folder, component library inside the administration package) cause build and dependency-resolution problems, e.g. traversal lookup of a parent `node_modules` loading unexpected dependency versions, which already happened with the component library.
- **No monorepo tool like Lerna** — earlier Lerna experience led to broken package-lock files and failing npm installs; multi-repo means change, bump the version in `package.json`, bump the dependency where it is consumed.
- **No real monorepo advantage** — deployment, separate testing, documentation and independent versions would all be harder.

Workflow consequence: to add something to the SDK, check out its GitHub repository and publish the change there; if the change also matters on the Administration side, bump the SDK version in the Administration too.

## Essential identifiers

- Package `@shopware-ag/meteor-admin-sdk` (imported by the Administration, e.g. `@shopware-ag/meteor-admin-sdk/es/channel`)
- PostMessage API (iFrame communication)

## Gotchas

- The name "Admin Extension SDK" is outdated; current material refers to the Meteor Extension SDK.

## Code check (6.7.15.1)
- confirmed `@shopware-ag/meteor-admin-sdk/es/channel` — Administration imports the SDK channel handle as an external package — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:8
- confirmed `@shopware-ag/meteor-admin-sdk` — SDK consumed as dependency, not in-repo source — vendor/shopware/administration/Resources/app/administration/src/core/telemetry/ServiceTracking.md:21
- unverified `admin-extension-sdk` — old package name not referenced in the Administration source; rename to Meteor stated by docs only
