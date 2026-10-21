---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/unit/jest-storefront.md
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/development/testing/unit/jest-admin.md"]
sourceHash: 22c7ed47eed56c0a181b2321520440fef003afc3
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html
title: Jest Unit Tests in Shopware's Storefront
version: "6.7"
versions: ["6.7"]
keywords: ["jest", "storefront unit test", "javascript testing", "feature.helper", "Feature.init", "Feature.isActive", "PluginManager", "getPluginInstancesFromElement", "plugin.class", "jsdom", "composer run storefront:unit", "mocking", "beforeEach", "afterEach"]
summary: Writing Jest unit tests for Storefront JS - test folder layout, testing feature.helper, mocking window.PluginManager for JS plugins, running storefront:unit.
lastBuilt: 2026-10-21
---
## What it is

A guide to writing Jest unit tests for Storefront JavaScript code — helpers/services (imported directly, no mocking) and Storefront JS plugins (which need a mocked global `PluginManager`). Unlike Administration tests (see platform/dev/6.7/guides/development/testing/unit/jest-admin.md), Storefront modules are usually testable in isolation.

## When to use

- Adding tests for a custom Storefront helper or JavaScript plugin (see platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md for building plugins).
- Running the core Storefront Jest suite in a development-template-based setup.

## Key steps / config

Test location: free to choose, but must match what your `package.json`/Jest config picks up. Core Storefront tests live in `platform/src/Storefront/Resources/app/storefront/test`; mirror the source path inside `test/`:

```bash
Resources
  `-- app
    `-- storefront
      `-- test
        `-- plugin
          `-- <plugin-name>
            `-- <name>.plugin.test.js
```

The core `jest.config.js` matches `**/test/**/*.test.js`, uses `testEnvironment: 'jsdom'`, and maps `^src/(.*)$` to `<rootDir>/src/$1` (so `import X from 'src/...'` works).

1. Basic helper test — import the helper, set fixtures in `beforeEach`, assert with matchers:

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

2. JS plugin test — a plugin extends `Plugin` from `src/plugin-system/plugin.class`. Its constructor calls `window.PluginManager.getPluginInstancesFromElement(this.el)` and `window.PluginManager.getPlugin(name, false).get('instances')`, so without a mock you get `TypeError: Cannot read property 'getPluginInstancesFromElement' of undefined`. Mock it in `beforeEach`, create the plugin on a dummy element, null it in `afterEach`:

```javascript
/** @jest-environment jsdom */
beforeEach(() => {
    window.PluginManager = {
        getPluginInstancesFromElement: () => new Map(),
        getPlugin: () => ({ get: () => [] }),
    };
    plugin = new HelloWorldPlugin(document.createElement('div'));
});
afterEach(() => { plugin = null; });
```

Then assert, e.g. `expect(plugin).toBeInstanceOf(HelloWorldPlugin)` and `expect(plugin.sayHello()).toBe('Hello World!')`.

3. Run (development template): install dependencies with `composer run build:js:storefront`, then `composer run storefront:unit` (all tests plus coverage). Inside the Storefront app, the `unit` npm script runs `jest --config jest.config.js --ci`.

## Essential identifiers

- `src/helper/feature.helper` — `Feature.init()`, `Feature.isActive()`
- `src/plugin-system/plugin.class` — `Plugin` base class
- `window.PluginManager.getPluginInstancesFromElement`, `window.PluginManager.getPlugin`
- `@jest-environment jsdom` docblock
- `composer run build:js:storefront`, `composer run storefront:unit`

## Gotchas

- The docs' folder tree names a file `js-plugin-test.spec.js`, but the core Jest config only matches `*.test.js` under `test/` — use the `.test.js` suffix.
- The composer scripts apply to the Shopware-provided Storefront only; plugins may need their own test scripts.
- Always reset the plugin to `null` in `afterEach` to keep tests isolated.

## Code check (6.7.15.1)
- confirmed `Feature.init()` — static method on the feature helper — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:60
- confirmed `Feature.isActive()` — static method on the feature helper — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:71
- confirmed `Plugin` — Storefront plugin base class export — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:9
- confirmed `getPluginInstancesFromElement` — called in Plugin::_registerInstance(), hence the mock — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:168
- confirmed `getPlugin` — called with get('instances') during registration — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:171
- corrected `testMatch` — docs: js-plugin-test.spec.js file name; config matches only *.test.js — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:88
- confirmed `testEnvironment` — jsdom by default in core config — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:25
- confirmed `moduleNameMapper` — maps src/ imports to the src dir — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:74
- confirmed `unit` — npm script runs jest with jest.config.js — vendor/shopware/storefront/Resources/app/storefront/package.json:27
- unverified `composer run storefront:unit` — defined in the project/development template composer.json, out of scope
