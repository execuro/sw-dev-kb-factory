---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md
title: Extending Webpack
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.html
sourceHash: 6bb7fb0d4af4c44105189a75b990c1b3002589d1
codeCheckedAgainst: "6.7.15.1"
keywords: ["webpack.config.js", "webpack", "webpack-merge", "webpackMerge", "build config", "resolve.alias", "BundleConfigGenerator", "administration build", "bundler configuration", "module.exports", "plugin build customization"]
summary: Extend the Administration webpack config per plugin via build/webpack.config.js exporting a function; merged with the core config, not across plugins.
lastBuilt: 2026-10-21
---
## What it is

The Administration build uses webpack as a module bundler. A plugin can extend the webpack configuration with its own file, which is loaded automatically and merged into the Shopware-provided configuration.

## When to use

Rarely needed — for example to add a `resolve.alias` for your plugin's sources or other webpack options the default build does not provide.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/build/webpack.config.js`.
2. Export a function that returns a webpack configuration object:

```javascript
const path = require('path');

module.exports = () => {
    return {
        resolve: {
            alias: {
                SwagBasicExample: path.join(__dirname, '..', 'src'),
            },
        },
    };
};
```

3. The file is detected per bundle by the bundle config generator (only for active plugins) and its path is passed to the build as the bundle's `administration.webpack` entry; the build merges it with the core configuration using webpack-merge.

## Essential identifiers

- `src/Resources/app/administration/build/webpack.config.js`
- `module.exports = () => ({ ... })`
- `BundleConfigGenerator` (`administration.webpack` / `storefront.webpack` bundle config keys)

## Gotchas

- Configurations of different plugins are **not** merged into each other — each is merged only with the Shopware configuration.
- The generator also accepts `build/webpack.config.ts`, `.cts` and `.cjs`; the first match in the order `.ts`, `.cts`, `.js`, `.cjs` wins.
- Apps only get a `storefront.webpack` entry; an Administration webpack config is collected for plugins/bundles, not apps.

## Code check (6.7.15.1)
- confirmed `BundleConfigGenerator::getWebpackConfig()` — resolves `<component>/build/webpack.config.*` per bundle — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:141
- confirmed `webpack.config.js` — accepted file name — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:149
- confirmed `webpack.config.ts` — checked first, then .cts, .js, .cjs — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:147
- confirmed `'webpack'` — administration entry built from Resources/app/administration — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:80
- confirmed `generateAppConfigs()` — apps only get a storefront webpack entry — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:98
- confirmed `$activePlugins` — deactivated plugins are skipped — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:62
- unverified `webpackMerge` — merge step lives in the Administration build tooling, outside the checked package roots
