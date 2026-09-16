---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/using-npm-dependencies.md
title: Adding NPM dependencies
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/using-npm-dependencies.html
sourceHash: 79249366e35b2266f225e648ed62bf70725574fd
keywords: ["npm dependencies", "package.json", "webpack.config.js", "npm install", "npm init", "node_modules", "webpack", "resolve.modules", "build-storefront.sh", "build-administration.sh", "PluginManager.register", "missionlog"]
summary: How to add and register an NPM package for a plugin's Administration or Storefront build via package.json and a custom webpack.config.js.
lastBuilt: 2026-09-15
---
## What it is

This guide explains how to add third-party NPM dependencies to a Shopware 6 plugin's Administration or Storefront JavaScript, and register them so Webpack bundles them correctly.

## When to use

Use this when your plugin's frontend JavaScript needs an external npm package (e.g. a logging library) rather than only Shopware's own bundled modules.

## Key steps / config

1. Run `npm init -y` in `<plugin root>src/Resources/app/administration/` or `<plugin root>src/Resources/app/storefront/` to create a `package.json` there.
2. Install a package with `npm install`, e.g. `npm install missionlog`.
3. Register the dependency with Webpack: create a `build` folder under `Resources/app/storefront` (or `administration`) containing a `webpack.config.js` that extends the config:

```javascript
module.exports = (params) => {
    return {
        resolve: {
            modules: [
                `${params.basePath}/Resources/app/storefront/node_modules`,
            ],
       }
   };
}
```

`resolve.modules` tells Webpack which directories to search when resolving modules; by default only the platform's `node_modules` is considered, so `params.basePath` (the absolute path to the extension) plus `node_modules` must be added explicitly.

4. Import and use the package in plugin JavaScript, then register the plugin in `main.js` via `PluginManager.register('ExamplePlugin', ExamplePlugin)`.
5. Rebuild so Webpack picks up the changes:

```bash
./bin/build-storefront.sh
./bin/build-administration.sh
```

## Essential identifiers

- `package.json` — created per app folder (`administration`/`storefront`)
- `webpack.config.js` — under a `build` folder, exports a config-extending function
- `resolve.modules` — Webpack module resolution setting
- `params.basePath` — absolute path to the extension inside the webpack function
- `./bin/build-storefront.sh`, `./bin/build-administration.sh`

## Gotchas

The referenced tutorial video resolves the NPM package name as an alias, but the documentation instead recommends resolving the whole `node_modules` folder as shown in the `webpack.config.js` example.
