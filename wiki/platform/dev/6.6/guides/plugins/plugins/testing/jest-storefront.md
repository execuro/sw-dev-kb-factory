---
id: platform/dev/6.6/guides/plugins/plugins/testing/jest-storefront.md
title: Jest unit tests in Shopware's storefront
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-storefront.html
sourceHash: 33e62ac19732c1dc743ff457191e09809293290d
keywords: ["jest", "storefront unit tests", "composer run storefront:unit", "composer run build:js:storefront", "PluginManager mock", "feature.helper", "jsdom", "plugin test", "beforeEach afterEach"]
summary: How to write Jest unit tests for Storefront services and JS plugins, including mocking window.PluginManager.
lastBuilt: 2026-09-15
---

## What it is

Guide to writing Jest unit tests for Shopware's Storefront: testing plain services/modules and testing JS plugins that depend on `window.PluginManager`.

## When to use

When adding or changing Storefront JS services, helpers, or plugins and needing unit test coverage.

## Key steps / config

Test folder structure mirrors the source path, under `test`:

```text
Resources
  `-- app
    `-- <environment>
      `-- test
        `-- plugin
          `-- <plugin-name>
            `-- js-plugin-test.spec.js
```

Basic service test:

```javascript
import Feature from 'src/helper/feature.helper';

describe('feature.helper.js', () => {
    beforeEach(() => { Feature.init(default_flags); });
    test('checks the flags', () => {
        expect(Feature.isActive('test1')).toBeTruthy();
    });
});
```

Testing a plugin requires mocking `window.PluginManager` before instantiation:

```javascript
/**
 * @jest-environment jsdom
 */
beforeEach(() => {
    window.PluginManager = {
        getPluginInstancesFromElement: () => new Map(),
        getPlugin: () => ({ get: () => [] })
    };
    plugin = new HelloWorldPlugin(document.createElement('div'));
});

afterEach(() => { plugin = null; });
```

Run all tests: `composer run storefront:unit`. Install deps first with `composer run build:js:storefront`.

## Essential identifiers

- `window.PluginManager.getPluginInstancesFromElement()`, `window.PluginManager.getPlugin()`
- `composer run storefront:unit`, `composer run build:js:storefront`
- `@jest-environment jsdom` docblock annotation
- Test file suffix `.test.js`/`.spec.js`

## Gotchas

- Storefront plugin tests must set `@jest-environment jsdom` since plugins interact with DOM elements.
- Always reset the plugin instance to `null` in `afterEach` to keep tests isolated.
- Instantiating a Storefront plugin without mocking `window.PluginManager` first throws `TypeError: Cannot read property 'getPluginInstancesFromElement' of undefined`.
