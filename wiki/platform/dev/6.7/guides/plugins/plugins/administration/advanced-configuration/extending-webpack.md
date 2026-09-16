---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md
title: Extending Webpack
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.html
sourceHash: 6bb7fb0d4af4c44105189a75b990c1b3002589d1
codeCheckedAgainst: "6.7.13.0"
keywords: ["webpack", "webpack.config.js", "build configuration", "bundler", "resolve.alias", "webpack-merge", "webpackMerge", "administration build", "vite", "plugins.vite.ts", "module.exports", "alias"]
summary: Extend the Administration bundler config from a plugin by exporting a function from build/webpack.config.js; result is merged per plugin via webpack-merge.
lastBuilt: 2026-09-15
---
## What it is

The Shopware 6 Administration documentation describes how a plugin can extend the Webpack (static module bundler) configuration used to build its Administration code. Changing it is normally unnecessary; the page covers the case where you must.

## When to use

Your plugin's Administration sources need extra bundler configuration, for example a `resolve.alias` so imports like `SwagBasicExample/...` resolve to the plugin's `src` directory.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/build/webpack.config.js`.
2. Export a function (`module.exports = () => { ... }`) that returns a webpack configuration object:

```javascript
const path = require('path');
module.exports = () => {
    return {
        resolve: {
            alias: { SwagBasicExample: path.join(__dirname, '..', 'src') }
        }
    };
};
```

3. The file is loaded automatically during the Administration build and merged into the Shopware-provided configuration.

## Essential identifiers

- `<plugin root>/src/Resources/app/administration/build/webpack.config.js`
- `module.exports` function returning a config object
- `resolve.alias`
- webpackMerge (`webpack-merge` library) — performs the merge

## Gotchas

- Plugin configurations are **not** merged into each other; each plugin's config is merged only with the Shopware base configuration.
- The installed 6.7 Administration source describes its boot as a Vite application and references both `webpack.config.js` and `plugins.vite.ts` as producers of the dev-mode plugin list (`sw-plugin-dev.json`). Whether a plugin's `build/webpack.config.js` is still honoured by the installed build could not be verified from the Administration `src` tree, since the build tooling lives outside it; check the build setup before relying on this file.

## Code check (6.7.13.0)
- confirmed `webpack.config.js` — referenced in a comment as source of the dev plugin metadata, alongside `plugins.vite.ts` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:620
- confirmed `sw-plugin-dev.json` — plugin list fetched in development mode — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:617
- confirmed `vite` — application boot documented as "Boot the whole vite application" — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:402
- unverified `build/webpack.config.js` — plugin config loading lives in Administration build tooling outside the checked `src` root
- unverified `webpackMerge` — third-party build dependency, out of scope
