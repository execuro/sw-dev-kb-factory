---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.md
sourceHash: 836d760a9ba35e60c38db944b7dbe2c5b9bb3a05
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.html
title: Embedding external repositories
version: "6.7"
versions:
  - "6.7"
keywords: ["developer-portal", "docs-cli", "vitepress", "vitepress-shopware-docs", ".vitepress/portal.json", "SwagSectionsConfig", "SwagEmbedsConfig", "mount.sh", "docs:link", "algolia search", "embed external docs", "Shopware Dev Docs connector", "copyAdditionalAssets"]
summary: Embed docs from another repo into the Shopware Developer Portal via docs-cli, portal.json, navigation, Algolia, embeds, mount.sh and package.json scripts.
lastBuilt: 2026-10-21
---
## What it is

How to mount project documentation from a separate repository into the Shopware Developer Portal (`shopware/developer-portal`), which is built on Vitepress using the `shopware/developer-documentation-vitepress` repository (`vitepress-shopware-docs` package). Content stays in each repository and is integrated with the Docs CLI, so maintainers manage it independently.

## When to use

When a Shopware repository (example used throughout: the Meteor Icon Kit in `shopware/meteor`) should publish its docs on the Developer Portal, including sidebar, search section, edit links and production build.

## Key steps / config

**1. Set up the portal locally**

```bash
git clone https://github.com/shopware/developer-portal.git
cd developer-portal
pnpm i
git checkout -b feature/embed-meteor-icon-kit
```

**2. Register the repository** — add an entry to the `repositories` array in `.vitepress/portal.json`, run `./docs-cli manage`, select the repository and confirm defaults. Preview with `pnpm dev`.

**3. Sidebar / navigation** — in `.vitepress/navigation.ts` update `sublinks` and `ignore` to auto-build the sidebar from the directory structure and frontmatter; update `navigation` for the top-bar menu.

**4. Algolia search section** (default group is `General`) and **edit links** (`Edit this page on GitHub`):

```javascript
const sections: SwagSectionsConfig[] = [
    { title: 'Meteor Icon Kit', matches: ['/resources/meteor-icon-kit/'] },
];
const embeds: SwagEmbedsConfig[] = [
    { repository: 'meteor',
      points: { '/resources/meteor-icon-kit/': 'main' },
      folder: 'packages/icon-kit/docs' },
];
```

**5. Optional theme settings**

- `themeConfig.swag.similarArticles.filter` — Copilot AI recommendations; needed only when embedding multiple branches (versions).
- `themeConfig.swag.versionSwitcher` — version switching across embedded branches.
- `themeConfig.swag.colorCoding` — breadcrumb color coding (currently Plugins and Apps in `docs`).
- Static assets (`.pdf`, `.zip`, not images linked in articles): copy them in the `buildEnd` hook via `copyAdditionalAssets([{ src, dst }])`.

**6. Production build** — activate the repository in `.github/scripts/mount.sh`:

```sh
BRANCH_METEOR_ICON_KIT=main
ORG_METEOR_ICON_KIT=shopware
./docs-cli.cjs clone --ci --repository shopware/meteor \
 --branch ${BRANCH_METEOR_ICON_KIT:-main} --src packages/icon-kit/docs \
 --dst resources/meteor-icon-kit --org ${ORG_METEOR_ICON_KIT:-shopware} --root ../..
```

**7. Your repository** — add three `package.json` scripts:

- `docs:env` — clone `developer-portal` into `../developer-portal` (or `docs-cli.cjs pull`) and install dependencies.
- `docs:link` — `../developer-portal/docs-cli.cjs link --src . --dst docs --symlink`.
- `docs:preview` — `../developer-portal/docs-cli.cjs preview`.

**8. CI** — no custom workflows; add the repository to the `Shopware Dev Docs connector` GitHub app in the `shopware` organization. It creates a PR status check, triggers the integration check in `developer-portal`, updates the status with a preview URL, and triggers production deployment on `main` updates.

**9. PR flow** — in `developer-portal`, temporarily set `BRANCH_METEOR_ICON_KIT=<your feature branch>` in `mount.sh`, open PRs in both repositories, check the Vercel preview, merge your repository's feature branch to `main`, then switch `mount.sh` back to `main` and merge the portal PR; the production build then publishes the changes.

## Gotchas

- Adding a repository via `./docs-cli manage` does not include it in the production build — it must also be activated in `.github/scripts/mount.sh`.
- Revert the branch variable in `mount.sh` to `main` before merging the portal PR.

## Code check (6.7.15.1)
- unverified `docs-cli` — developer-portal tooling, outside the Shopware code roots
- unverified `SwagSectionsConfig` — vitepress-shopware-docs type, outside the Shopware code roots
- unverified `SwagEmbedsConfig` — vitepress-shopware-docs type, outside the Shopware code roots
- unverified `.github/scripts/mount.sh` — developer-portal repository file, outside the Shopware code roots
