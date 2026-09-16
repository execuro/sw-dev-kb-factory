---
id: platform/dev/6.7/guides/development/testing/unit/jest-storefront.md
title: "Jest Unit Tests in Shopware's Storefront"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html
sourceHash: 22c7ed47eed56c0a181b2321520440fef003afc3
codeCheckedAgainst: "6.7.13.0"
keywords: ["jest", "storefront unit test", "javascript test", "feature.helper", "Feature.init", "Feature.isActive", "PluginManager", "getPluginInstancesFromElement", "plugin.class", "@jest-environment jsdom", "storefront:unit", "mock js plugin", "jest.config.js"]
summary: Writing Jest unit tests for Storefront helpers and JS plugins, mocking window.PluginManager, test folder layout and running storefront unit tests.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/development/testing/unit/jest-admin.md"]
---
## What it is

How to write Jest unit tests for Storefront JS code, covering plain helpers (example `feature.helper`) and Storefront JS plugins extending `src/plugin-system/plugin.class`, including the mock of the global `window.PluginManager` that plugin instantiation needs.

## When to use

- Adding or changing Storefront JS (helpers, services, ES modules, JS plugins) and covering it with unit tests.
- A plugin test fails with `TypeError: Cannot read property 'getPluginInstancesFromElement' of undefined`.

Unlike Administration Jest tests (see [Jest in the Administration](platform/dev/6.7/guides/development/testing/unit/jest-admin.md)), Storefront helpers and services can be imported directly without mocking dependencies. Building a JS plugin itself is covered in [add custom JS](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## Key steps / config

1. **Test location.** Place tests under `Resources/app/storefront/test/`, mirroring the source path (e.g. `test/helper/feature.helper.test.js` for `src/helper/feature.helper.js`). The core layout lives in `src/Storefront/Resources/app/storefront/test` in the platform repository. The folder is free to choose, but must match what your Jest / `package.json` config scans. The core `jest.config.js` matches `**/test/**/*.test.js` and maps `^src/(.*)$` to `<rootDir>/src/$1`, so `import Feature from 'src/helper/feature.helper'` resolves.
2. **Basic helper test.** Use `describe`/`test`, set fixtures in `beforeEach`:
   ```javascript
   import Feature from 'src/helper/feature.helper';
   const default_flags = { test1: true, test2: false };
   describe('feature.helper.js', () => {
       beforeEach(() => { Feature.init(default_flags); });
       test('checks the flags', () => {
           expect(Feature.isActive('test1')).toBeTruthy();
           expect(Feature.isActive('test3')).toBeFalsy();
       });
   });
   ```
3. **JS plugin test.** Add the `@jest-environment jsdom` docblock, create a DOM element, mock `window.PluginManager` before instantiating (the `Plugin` constructor calls `_registerInstance()`, which uses `getPluginInstancesFromElement(this.el)` and `getPlugin(name, false)`), and null the instance in `afterEach`:
   ```javascript
   /** @jest-environment jsdom */
   import HelloWorldPlugin from 'src/plugin/hello-world/hello-world.plugin';
   let plugin;
   beforeEach(() => {
       window.PluginManager = {
           getPluginInstancesFromElement: () => new Map(),
           getPlugin: () => ({ get: () => [] }),
       };
       plugin = new HelloWorldPlugin(document.createElement('div'));
   });
   afterEach(() => { plugin = null; });
   test('can be instantiated', () => { expect(plugin).toBeInstanceOf(HelloWorldPlugin); });
   ```
4. **Run.** Install Storefront dependencies with `composer run build:js:storefront`, then run all Storefront unit tests with coverage via `composer run storefront:unit` (development template / platform repository scripts). Inside the Storefront app directory the npm script is `unit` (`jest --config jest.config.js --ci`), and `unit-watch` for watch mode.

## Essential identifiers

- `src/helper/feature.helper` with `Feature.init(flagConfig)` and `Feature.isActive(flag)`
- `src/plugin-system/plugin.class`, the base `Plugin` class for Storefront JS plugins
- `window.PluginManager.getPluginInstancesFromElement`, `window.PluginManager.getPlugin`
- `@jest-environment jsdom`, `beforeEach`, `afterEach`
- `composer run build:js:storefront`, `composer run storefront:unit`
- `Resources/app/storefront/jest.config.js`, `test/**/*.test.js`

## Gotchas

- The `composer run storefront:unit` script only covers the Shopware-provided Storefront; plugins need their own Jest setup and scripts.
- The docs' folder tree shows a file named `js-plugin-test.spec.js`, but the core Jest config only picks up `*.test.js` files under `test/`; use `.test.js` or adjust `testMatch`.
- Always reset the plugin (`plugin = null`) in `afterEach` to keep tests isolated.
- Without the `PluginManager` mock, constructing any plugin throws in `_registerInstance()`.
- The core config sets `testEnvironment: 'jsdom'`, `collectCoverage: true`, and an 85% coverage threshold for `./src/helper`.

## Code check (6.7.13.0)
- confirmed `Feature.init` — static method on the Storefront feature helper — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:60
- confirmed `Feature.isActive` — static method returning flag state — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:71
- confirmed `_registerInstance()` — called from the Plugin constructor — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:29
- corrected `getPluginInstancesFromElement` — docs: error trace shows line 121; installed at line 157 in `_registerInstance()` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:157
- confirmed `getPlugin` — `getPlugin(this._pluginName, false)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:160
- corrected `testMatch` — docs: tree shows `js-plugin-test.spec.js`; core config matches `**/test/**/*.test.js` — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:88
- confirmed `moduleNameMapper` — `^src/(.*)$` mapped to `<rootDir>/src/$1` — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:74
- confirmed `testEnvironment` — core default is `jsdom` — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:25
- confirmed `unit` — npm script `jest --config jest.config.js --ci` — vendor/shopware/storefront/Resources/app/storefront/package.json:27
- unverified `composer run storefront:unit` — composer script lives in the platform/template root, outside the vendor/shopware package roots
