---
id: platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md
title: Extending Webpack
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.html
sourceHash: 6bb7fb0d4af4c44105189a75b990c1b3002589d1
keywords: ["webpack", "webpack.config.js", "webpackMerge", "administration build", "module bundler", "extending webpack configuration", "resolve.alias", "plugin webpack configuration"]
summary: "Explains how to extend the Shopware Administration's Webpack build via a plugin's webpack.config.js, merged with webpackMerge."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to customize the Webpack configuration used to build the Shopware 6 Administration.

## When to use
Use when a plugin needs to change the Administration's build configuration, for example adding a module alias.

## Key steps / config
Create `<plugin root>/src/Resources/app/administration/build/webpack.config.js` exporting a function that returns a webpack configuration object:
```javascript
const path = require('path');

module.exports = () => {
    return {
        resolve: {
            alias: {
                SwagBasicExample: path.join(__dirname, '..', 'src')
            }
        }
    };
};
```
This configuration is automatically loaded and merged with the Shopware-provided webpack configuration using the `webpackMerge` library.

## Essential identifiers
- `<plugin root>/src/Resources/app/administration/build/webpack.config.js`
- `webpackMerge`

## Gotchas
- Plugin webpack configurations are not merged into each other — each is only merged individually into the base Shopware configuration.
