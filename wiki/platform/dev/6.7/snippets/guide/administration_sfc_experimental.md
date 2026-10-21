---
id: platform/dev/6.7/snippets/guide/administration_sfc_experimental.md
title: Administration Sfc Experimental
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/snippets/guide/administration_sfc_experimental.html
sourceHash: 71a87511288c0fa034fe87b49aa79460fc0341f7
codeCheckedAgainst: "6.7.15.1"
keywords: ["single file component", "sfc", "vue sfc", "administration extension", "experimental", "6.7.16.0", "6.9", "shopware store", "admin plugin", "unstable api"]
summary: Warning - Administration Single File Component (SFC) support is experimental since 6.7.16.0; API may change until stable in 6.9.
lastBuilt: 2026-10-21
---
## What it is

A reusable warning block stating that Single File Component (SFC) support for Administration extensions is experimental. It is available since Shopware 6.7.16.0, and the APIs it covers can still change without a deprecation notice.

## When to use

Before building an Administration extension with Vue single file components: the snippet marks the feature as try-out only, with feedback welcome.

## Gotchas

- Do not ship an extension built on SFC support to customers or to the Shopware Store until the API is declared stable, which is planned for 6.9.
- Breaking changes can land without a deprecation period while the feature is experimental.

## Version notes

- 6.7.16.0: SFC support for Administration extensions introduced as experimental.
- 6.9 (planned): API to be declared stable.

## Code check (6.7.15.1)
- unverified `6.7.16.0` — stated release is newer than the checked 6.7.15.1 core; availability not checkable here
- confirmed `registerOverrideComponent` — the 6.7.15.1 Administration already contains a `@private` mounting hook for generated override SFCs, "not for author use" — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:159
- confirmed `createExtendableSetup` — exposed on the global Shopware component API — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:147
