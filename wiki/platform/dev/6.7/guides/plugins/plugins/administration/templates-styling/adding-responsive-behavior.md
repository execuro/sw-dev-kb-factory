---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md
title: Adding Responsive Behavior
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.html
sourceHash: 8a0f581f035046da0ef793c3789b5bd49e671a64
codeCheckedAgainst: "6.7.15.1"
keywords: ["DeviceHelper", "$device", "$device.onResize", "removeResizeListener", "getViewportWidth", "getScreenOrientation", "v-responsive", "is--compact", "responsive", "resize listener", "viewport size", "media queries", "administration"]
summary: "Administration responsive helpers: this.$device (DeviceHelper) resize listeners and viewport getters, and the v-responsive directive for size-based classes."
lastBuilt: 2026-10-21
---
## What it is

The Shopware 6 Administration offers two ways to react to element or viewport size besides plain CSS media queries: the DeviceHelper, exposed as `this.$device` on every Vue component, and the `v-responsive` directive, which toggles classes based on an element's own dimensions.

## When to use

A plugin component must add/remove classes or run logic when the browser is resized, read viewport/screen dimensions, or switch an element to a compact layout below a width threshold.

## Key steps / config

### DeviceHelper resize listener

Register a listener (e.g. in the `mounted` lifecycle hook):

```javascript
const listener = function (ev) { /* add or remove classes */ };
const scope = this;
const component = 'sw-basic-example';

this.$device.onResize({ listener, scope, component });
```

Remove it again with `this.$device.removeResizeListener(component);` — listeners are filtered out by the `component` value you registered with. In the installed code, `onResize` itself also registers a Vue `onBeforeUnmount` hook that calls `removeResizeListener(component)`, and the resize event is debounced by 100 ms before listeners run.

### DeviceHelper getters

| Call | Returns |
|---|---|
| `this.$device.getViewportWidth()` | viewport width |
| `this.$device.getViewportHeight()` | viewport height |
| `this.$device.getDevicePixelRatio()` | device pixel ratio |
| `this.$device.getScreenWidth()` | screen width |
| `this.$device.getScreenHeight()` | screen height |
| `this.$device.getScreenOrientation()` | screen orientation |

### v-responsive directive

```html
<input v-responsive="{ 'is--compact': el => el.width <= 1620, timeout: 200 }">
```

- Each key is a class name; its function receives the element's size and the class is added when it returns `true`, removed otherwise (here: `is--compact` at width ≤ 1620px).
- `timeout` sets the throttle wait in ms (defaults to 200 in code when omitted).

## Essential identifiers

- `this.$device` (DeviceHelper), `onResize({ listener, scope, component })`, `removeResizeListener(component)`
- `getViewportWidth`, `getViewportHeight`, `getDevicePixelRatio`, `getScreenWidth`, `getScreenHeight`, `getScreenOrientation`
- `v-responsive`, option `timeout`

## Gotchas

- The source says to remove listeners in an `onDestroy` hook; Vue 3 has no such hook — use `beforeUnmount`/`unmounted`, or rely on the automatic removal registered by `onResize`.
- The global `$device` mixin removes listeners on `unmounted` by passing the component instance; a string `component` key (as in the example) is only matched by an explicit `removeResizeListener` call or the `onBeforeUnmount` hook from `onResize`.
- `v-responsive` uses a `ResizeObserver` on the element (element size, not viewport) and is marked `@private` in the code.

## Code check (6.7.15.1)
- confirmed `DeviceHelper::onResize()` — takes `{ listener, scope, component }`, also hooks `onBeforeUnmount` — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:41
- corrected `DeviceHelper::removeResizeListener()` — docs: remove in `onDestroy`; code auto-removes via `onBeforeUnmount` — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:50
- confirmed `$device` — defined as global property by the device-helper plugin — vendor/shopware/administration/Resources/app/administration/src/app/plugin/device-helper.plugin.js:23
- confirmed `DeviceHelper::getViewportWidth()` — returns `window.innerWidth` — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:79
- confirmed `DeviceHelper::getViewportHeight()` — viewport height getter — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:88
- confirmed `DeviceHelper::getDevicePixelRatio()` — pixel ratio getter — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:107
- confirmed `DeviceHelper::getScreenWidth()` — screen width getter — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:116
- confirmed `DeviceHelper::getScreenOrientation()` — orientation getter — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:134
- confirmed `responsive` — directive registered via `Shopware.Directive.register('responsive', ...)` — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:22
- confirmed `timeout` — defaults to 200 when not a number — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:24
