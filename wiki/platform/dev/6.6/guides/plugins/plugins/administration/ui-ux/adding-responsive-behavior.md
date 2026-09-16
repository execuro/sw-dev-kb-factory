---
id: platform/dev/6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.md
title: Adding responsive behavior
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.html
sourceHash: 3e54bc70315424389732ca4fc368eeba372e53a2
keywords: ["DeviceHelper", "$device", "onResize", "v-responsive", "responsive directive", "getViewportWidth", "getScreenWidth", "getDevicePixelRatio", "administration responsive", "removeResizeListener", "css media queries", "administration"]
summary: How to react to viewport/element size changes in the Administration using the DeviceHelper's $device.onResize and the v-responsive directive.
lastBuilt: "2026-09-15"
---
## What it is

This page explains the two ways the Shopware 6 Administration offers for adding classes to elements based on their size: the `DeviceHelper` and the `v-responsive` directive. It notes that plain CSS media queries are a viable alternative, pointed to via a separate guide on adding custom styles.

## When to use

Use the `DeviceHelper` when a component needs to run arbitrary JavaScript in reaction to viewport resize events — for example adding or removing classes programmatically. Use the `v-responsive` directive when the goal is simply to toggle a class based on an element's own dimensions, without custom resize-handling logic.

## Key steps / config

The `DeviceHelper` is bound to the Vue prototype and available as `this.$device` in every Vue component. Register a resize listener with `$device.onResize`, typically inside the `mounted` lifecycle hook, and remove it inside `onDestroy`:

```javascript
const listener = function (ev) {
    // do something on resize with the event, like adding or removing classes to elements   
};

const scope = this;
const component = 'sw-basic-example';

this.$device.onResize({ listener, scope, component });
```

```javascript
this.$device.removeResizeListener(component);
```

The `DeviceHelper` also exposes several read-only helper methods for device/browser information: `this.$device.getViewportWidth()`, `this.$device.getViewportHeight()`, `this.$device.getDevicePixelRatio()`, `this.$device.getScreenWidth()`, `this.$device.getScreenHeight()`, and `this.$device.getScreenOrientation()`.

The `v-responsive` directive dynamically applies classes based on an element's own dimensions, using a `timeout` to control the throttle duration:

```html
<input v-responsive="{ 'is--compact': el => el.width <= 1620, timeout: 200 }">
```

In this example, the `is--compact` class is applied whenever the element's width is 1620px or smaller, and `timeout` sets how long the throttle waits between re-evaluations.

## Essential identifiers

- `this.$device` — the DeviceHelper instance bound to every Vue component.
- `$device.onResize({ listener, scope, component })` — registers a resize listener.
- `$device.removeResizeListener(component)` — removes a previously registered resize listener.
- `v-responsive` — the directive for conditionally applying classes based on element dimensions.

## Gotchas

A resize listener registered with `$device.onResize` in `mounted` must be explicitly removed with `$device.removeResizeListener` in `onDestroy`, or it keeps firing after the component is gone.
