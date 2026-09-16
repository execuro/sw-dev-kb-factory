---
id: platform/dev/6.7/concepts/framework/storefront-components.md
title: Storefront Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/storefront-components.html
sourceHash: 281275128ea222963a45124bc83fc809e1705c14
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront components", "twig components", "Symfony UX TwigComponent", "AsTwigComponent", "ShopwareComponent", "data-component", "data-component-options", "window.Shopware", "emitInterception", "BuyButton:PreSubmit", "vite.components.config.mts", "createComponentBuildConfig", "build:components", "storybook", "js plugin successor"]
summary: "Storefront Twig component system (6.7.11+): components dir, co-located SCSS/JS, ShopwareComponent class, events/interception, Vite build."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/_index.md"]
---
## What it is

Since Shopware 6.7.11.0 the default Storefront ships a component system built on Symfony UX Twig Components: reusable Twig templates with co-located SCSS, JS/TS and optional Storybook stories, built by Vite. The JS part (`ShopwareComponent`) succeeds the JS plugin system.

## When to use

Building reusable Storefront UI in a plugin or app on 6.7.11+, or JS that must auto-initialize on dynamic DOM, talk to other components via events, or intercept core component data (e.g. buy button form data).

## Key steps / config

**1. Location and name.** Files live in `Resources/views/components/` of the bundle (plugin: `src/Resources/views/components/`). The path defines the name, prefixed with the bundle name: `components/Button/Primary.html.twig` → `MyExtension:Button:Primary`; `components/Button/index.html.twig` → `MyExtension:Button`.

**2. Anonymous component** (plugins and apps):

```twig
{% props label = 'Click here!', size = 'md' %}
<button data-component="MyExtension:Button:Primary"
        data-component-options="{{ this.props|json_encode }}">
    {% block content %}{{ label }}{% endblock %}
</button>
```

Usage: `<twig:MyExtension:Button:Primary label="Buy now!" size="lg" />`.

**3. PHP class component** (plugins only): `Primary.php` beside the template, namespace `MyPlugin\Resources\views\components\Button`, class with `#[AsTwigComponent()]` (`Symfony\UX\TwigComponent\Attribute\AsTwigComponent`) and public properties as props. Register it as a service: `$services->set(Primary::class)->autoconfigure(true);`.

**4. Styles.** `Primary.scss` beside the template; not compiled by the PHP theme compiler. Theme config only via CSS custom properties, e.g. `var(--sw-color-brand-primary)`; Bootstrap via `@import "bootstrap/scss/variables";`.

**5. JavaScript.** `Primary.js`/`.ts` beside the template:

```js
export default class ButtonPrimary extends ShopwareComponent {
    static options = { size: 'md' };
    init() { /* e.g. this.el.addEventListener(...) */ }
    destroy() { /* cleanup */ }
}
```

Loaded via native ES modules and an import map only when an element with `data-component="<Name>"` is rendered; also initialized on dynamically added elements. `data-component-options` (JSON) is merged over `static options`.

**6. Events and instances** (`window.Shopware`): `emit(name, ...args)` / `on(name, cb)`; `emitInterception(name, data)` / `intercept(name, cb, priority)` — callback must return `data`, priority default `0`, higher runs earlier (example event `BuyButton:PreSubmit`); `callMethod(name, method)`, `getComponentInstances(name)`, `getComponentInstanceByElement(name, element)`. Mutation observer: `this.initializeObserver({ childList, attributes, subtree })` with hooks `onContentUpdate(mutationRecord)` / `onAttributeUpdate(mutationRecord)`.

**7. Build.** Extensions must ship compiled component artifacts (output to the bundle's public dir). Commands: `composer build:js:storefront`, `composer npm:storefront run build:components`, dev server `composer storefront:dev-server`. Optional `Resources/app/storefront/vite.components.config.mts` returning `createComponentBuildConfig({ componentRoot, outDir, namespace, storefrontAppDir, sourcemap })` from `build/vite/component-config-factory`.

**8. Storybook (experimental).** `Primary.stories.json` beside the component (`title`, `parameters.server.id`, `parameters.template`, `argTypes`, `stories[]`); run `composer storefront:storybook`. Local dev only.

## Essential identifiers

- `Resources/views/components/`, `Symfony\UX\TwigComponent\Attribute\AsTwigComponent`
- `ShopwareComponent`, `window.Shopware`, `data-component`, `data-component-options`
- `emitInterception()`, `intercept()`, `callMethod()`, `getComponentInstances()`, `initializeObserver()`
- `vite.components.config.mts`, `createComponentBuildConfig`, `build:components`

## Gotchas

- The source's directory examples spell the folder `commponents`; the code only scans `Resources/views/components`.
- Without service registration (autoconfigure) the PHP class is ignored and Twig silently falls back to an anonymous component.
- Component assets are not recompiled at runtime; Bootstrap 5.3 Sass deprecation warnings are expected.
- No override mechanism as in JS plugins; extend via events/interception.
- `initializeObserver()` is `private` in the TypeScript base class; TS subclasses need a cast, plain JS works.

## Version notes

- Introduced in Shopware 6.7.11.0.

## Code check (6.7.13.0)
- corrected `Resources/views/components` — docs examples: `commponents` — vendor/shopware/storefront/DependencyInjection/TwigComponentBundlePass.php:22
- confirmed `getTwigComponentNamespace()` — bundle namespace + `\Resources\views\components\` — vendor/shopware/core/Framework/Bundle.php:65
- confirmed `ShopwareComponent` — base class with `static options` and `el` — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:23
- confirmed `data-component-options` — parsed as JSON and merged — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:129
- confirmed `intercept()` — `priority = 0` default — vendor/shopware/storefront/Resources/app/storefront/src/component-system/shopware.ts:259
- confirmed `emitInterception()` — returns intercepted data — vendor/shopware/storefront/Resources/app/storefront/src/component-system/shopware.ts:274
- confirmed `initializeObserver()` — exists, declared private in TS — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:75
- confirmed `createComponentBuildConfig` — options incl. `componentRoot`, `outDir`, `namespace` — vendor/shopware/storefront/Resources/app/storefront/build/vite/component-config-factory.ts:55
- confirmed `vite.components.config.mts` — custom config picked up per bundle — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:262
- unverified `composer storefront:storybook` — composer scripts are in the project root composer.json, out of scope
