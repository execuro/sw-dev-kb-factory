---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md
title: Adding Responsive Behavior
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.html
sourceHash: 8a0f581f035046da0ef793c3789b5bd49e671a64
codeCheckedAgainst: "6.7.13.0"
keywords: ["responsive", "DeviceHelper", "$device", "onResize", "removeResizeListener", "getViewportWidth", "getScreenOrientation", "v-responsive", "is--compact", "resize listener", "viewport size", "media queries", "administration"]
summary: Responsive Administration components via this.$device (DeviceHelper resize listeners, viewport/screen getters) and the v-responsive class directive.
lastBuilt: 2026-09-15
---
## What it is

The Administration offers two ways to add classes to elements based on size: the DeviceHelper (`this.$device`) and the `v-responsive` directive. Plain CSS media queries in component styles are the third option.

## When to use

An Administration plugin component must change classes or behaviour depending on browser viewport size or on an individual element's dimensions.

## Key steps / config

### DeviceHelper (`this.$device`)

`$device` is a DeviceHelper instance exposed on the Vue app's global properties, so it is available in every component.

Register a resize listener (e.g. in `mounted`):

```javascript
const listener = function (ev) { /* add/remove classes */ };
const scope = this;
const component = 'sw-basic-example';

this.$device.onResize({ listener, scope, component });
```

- `scope` defaults to `window` when omitted; the listener is called with `scope` as `this`.
- Browser resize events are debounced (100 ms) before listeners run.
- `onResize` itself registers a Vue `onBeforeUnmount` callback that calls `removeResizeListener(component)`; you can also remove manually with `this.$device.removeResizeListener(component)`. Removal filters by identity of the `component` value.

Getters:

| Function | Returns |
|---|---|
| `this.$device.getViewportWidth()` | `window.innerWidth` |
| `this.$device.getViewportHeight()` | `window.innerHeight` |
| `this.$device.getDevicePixelRatio()` | `window.devicePixelRatio` |
| `this.$device.getScreenWidth()` | `window.screen.width` |
| `this.$device.getScreenHeight()` | `window.screen.height` |
| `this.$device.getScreenOrientation()` | `window.screen.orientation` |

### `v-responsive` directive

```html
<input v-responsive="{ 'is--compact': el => el.width <= 1620, timeout: 200 }">
```

- Each key is a class name; its value is a callback receiving the element's content rect (`DOMRectReadOnly`). The class is added when the callback returns true, removed otherwise.
- `timeout` is the throttle duration in ms; non-numeric or missing means 200.
- Implemented with a `ResizeObserver` on the element.

## Essential identifiers

- `this.$device`, `DeviceHelper`
- `onResize({ listener, scope, component })`, `removeResizeListener(component)`
- `getViewportWidth`, `getViewportHeight`, `getDevicePixelRatio`, `getScreenWidth`, `getScreenHeight`, `getScreenOrientation`
- `v-responsive`, `timeout`

## Gotchas

- The docs say `$device` is bound to the Vue prototype and that listeners are removed in an `onDestroy` hook; in the installed Vue 3 code it is an app global property and cleanup is automatic via `onBeforeUnmount` (plus a global `unmounted` mixin calling `removeResizeListener(this)`).
- The DeviceHelper plugin and the directive are both annotated `@private` in core.

## Code check (6.7.13.0)
- confirmed `$device` — defined on `app.config.globalProperties` — vendor/shopware/administration/Resources/app/administration/src/app/plugin/device-helper.plugin.js:23
- confirmed `DeviceHelper::onResize()` — pushes listener, defaults scope to window, auto-removes onBeforeUnmount — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:41
- corrected `removeResizeListener` — docs: remove manually in `onDestroy` hook; code removes automatically on unmount — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:50
- confirmed `DeviceHelper::getViewportWidth()` — returns window.innerWidth — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:79
- confirmed `DeviceHelper::getViewportHeight()` — returns window.innerHeight — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:88
- confirmed `DeviceHelper::getDevicePixelRatio()` — returns window.devicePixelRatio — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:97
- confirmed `DeviceHelper::getScreenWidth()` — returns window.screen.width — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:106
- confirmed `DeviceHelper::getScreenHeight()` — returns window.screen.height — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:115
- confirmed `DeviceHelper::getScreenOrientation()` — returns window.screen.orientation — vendor/shopware/administration/Resources/app/administration/src/core/helper/device.helper.js:124
- confirmed `timeout` — throttle duration, defaults to 200 when not a number — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:24
