---
id: platform/dev/6.7/concepts/framework/storefront-components.md
title: Storefront Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/storefront-components.html
sourceHash: 281275128ea222963a45124bc83fc809e1705c14
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront components", "twig components", "symfony ux", "AsTwigComponent", "ShopwareComponent", "data-component", "data-component-options", "emitInterception", "intercept", "BuyButton:PreSubmit", "build:components", "vite.components.config.mts", "storefront:dev-server", "storybook", "js plugin successor"]
summary: "Storefront components (6.7.11+): Twig components in Resources/views/components with co-located SCSS, ShopwareComponent JS, Vite build and events."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/plugins/_index.md"]
---
## What it is

Since Shopware 6.7.11.0 the default Storefront ships a component system built on Symfony UX Twig Components, extended with co-located SCSS, a JavaScript component system (successor of the JS plugin system), a Vite build, a dev-server and an experimental Storybook library.

## When to use

Building reusable Storefront UI in a plugin or app on 6.7.11+, adding interactive JS to it, hooking into core component events, or building component assets.

## Key steps / config

1. **Place files** in `Resources/views/components/` of the bundle (plugins: `src/Resources/views/components/`). The path is the name, namespaced with the bundle: `components/Button/Primary.html.twig` → `MyExtension:Button:Primary`; `components/Button/index.html.twig` → `MyExtension:Button`.
2. **Anonymous component** (plugins and apps):

```twig
{% props label = 'Click here!', size = 'md' %}
<button data-component="MyExtension:Button:Primary"
        data-component-options="{{ this.props|json_encode }}">
    {% block content %}{{ label }}{% endblock %}
</button>

<twig:MyExtension:Button:Primary label="Buy now!" size="lg" />
```

3. **PHP class component** (plugins only): `Primary.php` beside the template, namespace `MyPlugin\Resources\views\components\Button`, `#[AsTwigComponent()]` (`Symfony\UX\TwigComponent\Attribute\AsTwigComponent`), public properties as props. Register it: `$services->set(Primary::class)->autoconfigure(true);` in `src/Resources/config/services.php`.
4. **Styles**: `Primary.scss` beside the template, compiled by Vite at build time (not the PHP theme compiler). Theme config only as CSS custom properties (`var(--sw-color-brand-primary)`); Bootstrap via `@import "bootstrap/scss/variables";`.
5. **JavaScript**: `Primary.js` (or TypeScript) beside the template:

```js
export default class ButtonPrimary extends ShopwareComponent {
    static options = { label: 'Click me!', size: 'md' };
    init() { /* listeners on this.el */ }
    destroy() { /* cleanup */ }
}
```

   No registration: an import map is built from component names; elements with `data-component` load the module via native ES modules and are initialised (also when added later, destroyed when removed). `data-component-options` (JSON) is merged over `static options`.
6. **Events** on `window.Shopware`: `emit(name, ...args)` / `on(name, cb)`; interceptable via `emitInterception(name, data)` + `intercept(name, cb, priority)` — callbacks return the data; default priority `0`, higher runs first, negatives allowed. Core example: `BuyButton:PreSubmit` with `{ requestUrl, formData }`.
7. **Instances**: `Shopware.callMethod(name, method)`, `Shopware.getComponentInstances(name)`, `Shopware.getComponentInstanceByElement(name, element)`.
8. **Mutation observation**: `this.initializeObserver({ childList, attributes, subtree })`, then `onContentUpdate(mutationRecord)` / `onAttributeUpdate(mutationRecord)`.
9. **Build** (extensions ship the artifacts, output to the bundle's public dir): `composer build:js:storefront`; components only `composer npm:storefront run build:components` or `npm run build:components` in `src/Storefront/Resources/app/storefront`. Optional `Resources/app/storefront/vite.components.config.mts` returning `createComponentBuildConfig({ componentRoot, outDir, namespace, storefrontAppDir, sourcemap })` from `src/Storefront/Resources/app/storefront/build/vite/component-config-factory`.
10. **Dev-server**: `composer storefront:dev-server`, then open the normal Storefront URL (no proxy).
11. **Storybook (experimental)**: `Primary.stories.json` (`title`, `parameters.server.id`, `parameters.template`, `argTypes`, `stories[]`), run `composer storefront:storybook`.

## Essential identifiers

- `Resources/views/components/`, `{% props %}`, `<twig:...>`, `#[AsTwigComponent]`
- `ShopwareComponent`, `init()`, `destroy()`, `static options`, `this.el`
- `data-component`, `data-component-options`
- `window.Shopware`: `emit`, `on`, `intercept`, `emitInterception`, `callMethod`, `getComponentInstances`, `getComponentInstanceByElement`
- `initializeObserver()`, `onContentUpdate()`, `onAttributeUpdate()`
- `build:components`, `vite.components.config.mts`, `createComponentBuildConfig`

## Gotchas

- The source's directory trees spell `commponents`; the code resolves `Resources/views/components`.
- An unregistered PHP component class is unknown to the container; Twig silently falls back to an anonymous component.
- Apps cannot use PHP class components.
- Component SCSS/JS is not recompiled at runtime; only build-time information is available.
- No JS plugin overrides; use events/interception.
- Bootstrap 5.3 uses deprecated Sass syntax, so expect console deprecation warnings.
- In TypeScript, `initializeObserver()` is declared `private` on `ShopwareComponent`.
- Storybook previews work only in local development, not production.

## Version notes

- Available since Shopware 6.7.11.0.

## Code check (6.7.15.1)
- corrected `Resources/views/components` — docs: `commponents` in directory trees — vendor/shopware/storefront/DependencyInjection/TwigComponentBundlePass.php:22
- confirmed `ShopwareComponent` — base class of JS components — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:23
- confirmed `data-component-options` — parsed as JSON and merged into options — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:129
- confirmed `ShopwareComponent::initializeObserver()` — exists, declared private in TS — vendor/shopware/storefront/Resources/app/storefront/src/component-system/component.ts:75
- confirmed `Shopware::intercept()` — priority parameter defaults to 0 — vendor/shopware/storefront/Resources/app/storefront/src/component-system/shopware.ts:259
- confirmed `Shopware::emitInterception()` — interceptors sorted by priority descending — vendor/shopware/storefront/Resources/app/storefront/src/component-system/shopware.ts:274
- confirmed `Shopware::callMethod()` — calls a method on all instances — vendor/shopware/storefront/Resources/app/storefront/src/component-system/shopware.ts:295
- confirmed `build:components` — npm script of the storefront app — vendor/shopware/storefront/Resources/app/storefront/package.json:15
- confirmed `vite.components.config.mts` — optional per-bundle config picked up by the build — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:262
- confirmed `createComponentBuildConfig` — exported factory — vendor/shopware/storefront/Resources/app/storefront/build/vite/component-config-factory.ts:55
