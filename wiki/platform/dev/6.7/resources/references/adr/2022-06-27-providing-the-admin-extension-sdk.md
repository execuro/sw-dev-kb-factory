---
id: platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md
title: Providing the admin extension SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.html
sourceHash: 5380d419b44f6f1fd1b14e2ca59b4408662c102d
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin extension sdk", "meteor extension sdk", "@shopware-ag/meteor-admin-sdk", "postmessage api", "iframe", "administration", "app development", "plugin development", "adr", "separate repository", "monorepo", "extension-api.ts"]
summary: ADR explaining why the Admin Extension SDK (now Meteor Extension SDK) lives in its own repository, released independently of Shopware versions.
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2022) explaining why the Admin Extension SDK — a toolkit for plugin and app developers to extend or modify the Administration — was created in a separate GitHub repository instead of inside the Shopware platform monorepo. The SDK has since been renamed to **Meteor Extension SDK**. It is a convenience layer whose methods talk to the Administration in the background via the PostMessage API for iFrames.

## When to use

Read this when you need to understand where the SDK is developed and released, why its version is not tied to a Shopware release, or what it takes to change SDK behaviour that the Administration also depends on.

## Key steps / config

Reasons given for the separate repository:

- **Faster development** — the SDK pipeline (tests, documentation generation) runs quickly; small changes do not trigger the large platform pipeline.
- **Independent deployment** — the SDK is not hard-bound to a Shopware version; apps include it directly as a dependency, and it supports newer Shopware versions. Bug fixes can be released in minutes.
- **Convenience layer only** — it wraps the PostMessage API, so being bound to the monorepo release cycle brings no benefit.
- **Independent documentation** — docs live in the same repository, so features without documentation are not merged.
- **JS packages in a PHP monorepo are difficult** — nested packages and traversal `node_modules` resolution caused differing dependency versions (already seen in the component library).
- **No monorepo tooling (Lerna)** — past experience produced broken package-lock files and failing npm installs; with multiple repositories you change the SDK repo and bump the version in `package.json`.

Consequence / workflow for changing the SDK:

1. Check out the SDK GitHub repository and publish the change there.
2. If the change is also relevant to the Administration side, bump the SDK dependency version in the Administration as well.

In the installed Administration the SDK is consumed as the npm package `@shopware-ag/meteor-admin-sdk` (e.g. its `channel` module's `handle` is used by the Administration's extension API bridge).

## Essential identifiers

- Admin Extension SDK / Meteor Extension SDK
- `@shopware-ag/meteor-admin-sdk`
- PostMessage API (iFrame communication)

## Gotchas

- The name "Admin Extension SDK" is outdated; search for "Meteor Extension SDK" / `meteor-admin-sdk`.
- An SDK change needed by the Administration requires two steps: a release in the SDK repository and a version bump in the Administration.

## Code check (6.7.13.0)
- confirmed `@shopware-ag/meteor-admin-sdk` — Administration imports the renamed package for global types — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:10
- confirmed `@shopware-ag/meteor-admin-sdk/es/channel` — Administration uses the SDK channel `handle` (PostMessage bridge) — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:8
