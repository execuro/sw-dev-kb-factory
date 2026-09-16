---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.md
title: Embedding external repositories
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.html
sourceHash: 836d760a9ba35e60c38db944b7dbe2c5b9bb3a05
keywords: ["Docs CLI", "developer-portal", "vitepress-shopware-docs", "docs-cli manage", "portal.json", "navigation.ts", "Algolia search", "mount.sh", "docs:env", "docs:link", "docs:preview", "embedding external repositories"]
summary: "How to embed an external repository's docs into the Shopware Developer Portal using the Docs CLI and Vitepress config."
lastBuilt: "2026-09-15"
---
## What it is
Guide for embedding project documentation from an external repository into the Shopware Developer Portal (built on the `shopware/developer-documentation-vitepress` package, `vitepress-shopware-docs`), integrated via the Docs CLI.

## When to use
When a repository maintainer wants their repo's docs to appear inside the Developer documentation site, managed independently via the Docs CLI rather than merged directly into the portal repository.

## Key steps / config
- Clone and set up the portal: `git clone https://github.com/shopware/developer-portal.git`, `pnpm i`, then create a feature branch, e.g. `git checkout -b feature/embed-meteor-icon-kit`.
- Register the repository: add an entry to the `repositories` array in `.vitepress/portal.json`, then run `./docs-cli manage` and select the repo; preview locally with `pnpm dev`.
- Sidebar/navigation: edit `.vitepress/navigation.ts` (`sublinks`, `ignore`) to auto-build the sidebar, and update `navigation` for the top-bar menu.
- Algolia search: group content under a section by editing `sections: SwagSectionsConfig[]` (regex `matches` plus a `title`).
- Edit links: point "Edit this page on GitHub" correctly via `const embeds: SwagEmbedsConfig[]` (`repository`, `points`, `folder`).
- Optional settings: `themeConfig.swag.similarArticles.filter` (Copilot AI recommendations), `themeConfig.swag.versionSwitcher` (multi-version repos), `themeConfig.swag.colorCoding` (breadcrumb colors), and copying static assets (e.g. `.pdf`/`.zip`) in the `buildEnd` hook.
- Production activation: enable the repository in `.github/scripts/mount.sh`, which sets `BRANCH_<REPO>`/`ORG_<REPO>` env vars used by `./docs-cli.cjs clone`.
- In the source repository, add three `package.json` scripts: `docs:env`, `docs:link`, `docs:preview`, wrapping `../developer-portal/docs-cli.cjs pull|link|preview`.
- Workflow: preview from a feature branch by editing the branch variable in `mount.sh`, then switch back to `main` before merging; new repositories must be added to the "Shopware Dev Docs connector" GitHub app for status checks and deployment triggers.

## Essential identifiers
- `./docs-cli manage`, `./docs-cli.cjs clone`, `./docs-cli.cjs pull|link|preview`
- `.vitepress/portal.json`, `.vitepress/navigation.ts`
- `.github/scripts/mount.sh`
- `docs:env`, `docs:link`, `docs:preview` package.json scripts
