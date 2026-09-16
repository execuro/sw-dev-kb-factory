---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.md
title: Embedding external repositories
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/07-embedding-external-repositories.html
sourceHash: 836d760a9ba35e60c38db944b7dbe2c5b9bb3a05
codeCheckedAgainst: "6.7.13.0"
keywords: ["developer-portal", "docs-cli", "vitepress", ".vitepress/portal.json", "SwagSectionsConfig", "SwagEmbedsConfig", "mount.sh", "docs:link", "docs:preview", "docs:env", "algolia search", "embed documentation", "Shopware Dev Docs connector"]
summary: "Embed a repository's docs into the Shopware Developer Portal: docs-cli manage, portal.json, sidebar, Algolia sections, edit links, mount.sh."
lastBuilt: 2026-09-15
---
## What it is

A guide for mounting documentation from another repository into the Shopware Developer Portal (`shopware/developer-portal`), which is built on `shopware/developer-documentation-vitepress` (`vitepress-shopware-docs` package) and aggregates content from multiple repositories via the Docs CLI.

## When to use

When a repository (e.g. `shopware/meteor`) maintains its own docs and they should appear on developer.shopware.com with sidebar, search section, correct edit links and production deployment.

## Key steps / config

**In `shopware/developer-portal`:**

1. Clone the portal, `pnpm i`, create a feature branch.
2. Add an entry to the `repositories` array in `.vitepress/portal.json`, then run `./docs-cli manage`, select the repository and confirm defaults. Preview with `pnpm dev`.
3. Sidebar: in `.vitepress/navigation.ts` update `sublinks` and `ignore`; add to `navigation` for the top-bar menu.
4. Algolia search sections (default group is `General`):

```javascript
const sections: SwagSectionsConfig[] = [
    { title: 'Meteor Icon Kit', matches: ['/resources/meteor-icon-kit/'] },
];
```

5. Edit links ("Edit this page on GitHub"):

```javascript
const embeds: SwagEmbedsConfig[] = [
    { repository: 'meteor', points: { '/resources/meteor-icon-kit/': 'main' }, folder: 'packages/icon-kit/docs' },
]
```

6. Optional: `themeConfig.swag.similarArticles.filter` (Copilot AI, multi-branch embeds), `themeConfig.swag.versionSwitcher` (multiple versions), `themeConfig.swag.colorCoding` (breadcrumb colors), and `copyAdditionalAssets([{ src, dst }])` inside the `buildEnd` hook for `.pdf`/`.zip` assets.
7. Production: activate the repository in `.github/scripts/mount.sh`:

```sh
BRANCH_METEOR_ICON_KIT=main
ORG_METEOR_ICON_KIT=shopware
./docs-cli.cjs clone --ci --repository shopware/meteor \
 --branch ${BRANCH_METEOR_ICON_KIT:-main} --src packages/icon-kit/docs \
 --dst resources/meteor-icon-kit --org ${ORG_METEOR_ICON_KIT:-shopware} --root ../..
```

**In your repository:** add three `package.json` scripts:

- `docs:env` — clones the portal into `../developer-portal` (or runs `../developer-portal/docs-cli.cjs pull`) and installs dependencies with `pnpm i -C ../developer-portal`.
- `docs:link` — `../developer-portal/docs-cli.cjs link --src . --dst docs --symlink`
- `docs:preview` — `../developer-portal/docs-cli.cjs preview`

Add the repository to the `Shopware Dev Docs connector` GitHub app in the `shopware` organization; it creates PR status checks, triggers the integration check in `developer-portal`, updates the status with a preview URL, and triggers production deployment on `main` updates. Custom GitHub workflows are no longer needed.

**Rollout:** set `BRANCH_METEOR_ICON_KIT` in `mount.sh` to your feature branch, open PRs in both repositories, merge your repository's branch once the Vercel preview is correct, then switch the variable back to `main` and merge the portal PR — production build follows.

## Gotchas

- Adding a repository via Docs CLI does not include it in the production build; it must also be activated in `.github/scripts/mount.sh`.
- Statically linked images in articles need no `buildEnd` copy; only extra static assets do.

## Code check (6.7.13.0)
- unverified `docs-cli` — tool of shopware/developer-portal, not in vendor/shopware
- unverified `SwagSectionsConfig` — vitepress-shopware-docs type, out of vendor/shopware scope
- unverified `SwagEmbedsConfig` — vitepress-shopware-docs type, out of vendor/shopware scope
- unverified `.github/scripts/mount.sh` — developer-portal repository file, out of scope
