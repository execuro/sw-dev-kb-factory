---
id: platform/dev/6.6/guides/plugins/plugins/testing/jest-admin.md
title: Jest unit tests in Shopware's administration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-admin.html
sourceHash: ad63630f1e6bd325cb40e9c3808533d5e0ed7438
keywords: ["jest", "administration unit tests", "Shopware.Component.build", "Shopware.Component.register", "shallowMount", "composer run admin:unit", "composer run admin:create:test", "activeAclRoles", "activeFeatureFlags", "repositoryFactoryMock", "vue test utils"]
summary: How to write Jest/Vue Test Utils component and service unit tests for Shopware's Administration, including mocks and ACL/feature flags.
lastBuilt: 2026-09-15
---

## What it is

Guide to writing Jest unit tests for Shopware's Administration, covering service tests, Vue component tests via Vue Test Utils, and the various built-in mocks the test setup provides.

## When to use

When adding or changing Administration code (services, Vue components) and needing automated unit test coverage.

## Key steps / config

Test files sit next to the tested file, suffixed `.spec.js`/`.spec.ts`.

Testing an isolated service/module:

```javascript
import Sanitizer from 'src/core/helper/sanitizer.helper';

describe('core/helper/sanitizer.helper.js', () => {
    it('should sanitize the html', () => {
        expect(Sanitizer.sanitize('...')).toBe('...');
    });
});
```

Building/mounting a registered component:

```javascript
shallowMount(Shopware.Component.build('sw-multi-select'), {
    props: { options: [], value: '' },
    stubs: { 'sw-select-base': Shopware.Component.build('sw-select-base') }
});
```

Generate boilerplate: `composer run admin:create:test`. Install deps first with `composer run init:js`. Run all tests: `composer run admin:unit`; watch mode: `composer run admin:unit:watch`.

Set ACL rights and feature flags for a test:

```javascript
global.activeAclRoles = ['product.editor'];
global.activeFeatureFlags = ['FEATURE_NEXT_12345'];
```

Register a mocked service before tests: `Shopware.Service.register('mediaService', { ... })`.

## Essential identifiers

- `Shopware.Component.register()` / `Shopware.Component.build()`
- `shallowMount()` / `mount()` from `@vue/test-utils`
- `composer run admin:unit`, `composer run admin:unit:watch`, `composer run admin:create:test`, `composer run init:js`
- `global.activeAclRoles`, `global.activeFeatureFlags`, `global.repositoryFactoryMock`
- `Shopware.Service.register()`, `createLocalVue()`

## Gotchas

- Components can't be tested as simply as in plain Vue projects because of Shopware's template inheritance/extendability — always build via `Shopware.Component.build()`.
- Missing child components, directives, or injections produce specific `[Vue warn]` messages; the fix is stubbing, mocking, or registering the dependency (e.g. `localVue.directive(...)`, `provide: { mediaService: {} }`).
- The repository factory logs a console warning with a suggested mock whenever an unmocked API route is requested.
