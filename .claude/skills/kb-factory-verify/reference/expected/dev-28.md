# `dev-28` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-28` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I override an existing Storefront JavaScript plugin, such as the cookie permission bar, from my own plugin instead of registering a new one?

**Expected answer — every fact an answer must contain:**

1. From the plugin's own Storefront entry point (`<bundle>/Resources/app/storefront/src/main.ts`, or `main.js` — `getEntryFile()` prefers `.ts` and builds no Storefront JS if neither exists) call `PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]')`. The selector must be the one the core registration used, because `override()` is refused with a `console.warn` unless the registry holds that name *for that selector*.  `[code: storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:698]` `[code: storefront: Resources/app/storefront/src/plugin-system/plugin.registry.js:21]` `[code: storefront: Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178]`
2. `override()` replaces the registration outright: with the same from/to name it deregisters the existing entry and registers the class you passed, with **no** automatic inheritance from the plugin being overridden. To keep core behaviour the override class must explicitly `extends` the core class (`import CookiePermissionPlugin from 'src/plugin/cookie/cookie-permission.plugin'`, which is exported as `default class CookiePermissionPlugin extends Plugin`).  `[code: storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:122]` `[code: storefront: Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:10]`
3. `CookiePermission` is registered lazily in core — `PluginManager.register('CookiePermission', () => import('src/plugin/cookie/cookie-permission.plugin'), '[data-cookie-permission]')` — and `register()` treats any argument without an own `prototype` descriptor as async, so an override of it is passed the same way, as an import factory. Calling `register()` again with the same name and selector is *not* an override: it warns "already registered" and returns without replacing anything.  `[code: storefront: Resources/app/storefront/src/main.js:130]` `[code: storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:80]` `[code: storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:74]`

**Trap:** `override()` does not subclass for you. An override class that does not `extends` the core class silently drops all core behaviour; and re-`register()`ing the same name is a no-op, not a replacement.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/override-existing-javascript.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `override()` delegates to `extend()` with `fromName === newName` | `storefront: …/plugin-system/plugin.manager.js:698-700` | `static override(overrideName, pluginClass, selector, options = {}) { return PluginManagerInstance.extend(overrideName, overrideName, pluginClass, selector, options); }` |
| Equal names deregister and re-register — full replacement, no prototype merging | `storefront: …/plugin-system/plugin.manager.js:122-135` | `if (fromName === newName) { this.deregister(fromName, selector); return this.register(newName, pluginClass, selector, options); }` |
| The override is refused unless the name is registered for that exact selector | `storefront: …/plugin-system/plugin.registry.js:21-34` | `return pluginMap.get('registrations').has(selector);` |
| Re-`register()` with the same name+selector warns and returns | `storefront: …/plugin-system/plugin.manager.js:74-78` | `console.warn(\`Plugin "${pluginName}" is already registered.\`); return;` |
| Core registers the cookie bar as `CookiePermission` on `[data-cookie-permission]`, lazily | `storefront: Resources/app/storefront/src/main.js:130` | `PluginManager.register('CookiePermission', () => import('src/plugin/cookie/cookie-permission.plugin'), '[data-cookie-permission]');` |
| Async registration is detected by the missing `prototype` descriptor, so overrides may pass an import factory | `storefront: …/plugin-system/plugin.manager.js:80-85` | `if (!Object.getOwnPropertyDescriptor(pluginClass, 'prototype')) { return this._registry.set(pluginName, pluginClass, selector, options, true); }` |
| The core class is a default export extending `Plugin`, so it can be imported and subclassed | `storefront: …/src/plugin/cookie/cookie-permission.plugin.js:10` | `export default class CookiePermissionPlugin extends Plugin {` |
| The plugin's JS entry point is `Resources/app/storefront/src/main.ts` (preferred) or `main.js`; neither present means no Storefront JS is built | `storefront: Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178-191` | `if (\is_file($path . '/main.ts')) { return 'app/storefront/src/main.ts'; } if (\is_file($path . '/main.js')) { … } return null;` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `override()` automatically inherits from the plugin being overridden | absent | The subclass-creating code (`class InternallyExtendedPlugin extends parentPlugin`) lives in `_extendPlugin()`, reached only when the names differ; the equal-name branch only deregisters and re-registers — `storefront: …/plugin.manager.js:120-139` |
| A different (new) plugin name can override the core one | absent | With a different `newName` the original registration stays in place and the merged class is registered additionally — `storefront: …/plugin.manager.js:128-135` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Canonical override of a synchronously registered core plugin, override class extending the core class; one instance remains and the overridden method wins | `storefront: Resources/app/storefront/test/plugin-system/plugin.manager.test.js:25-37,326-346` |
| Override of an **async** (lazy-import) core plugin — the shape `CookiePermission` uses — asserting the instance is the override's | `storefront: Resources/app/storefront/test/plugin-system/plugin.manager.test.js:564-578` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Documented async override registered but never instantiated; element kept the core instance (Navbar, GallerySlider, ZoomModal, …). Priority/critical. | 6.7.12.1 | closed | https://github.com/shopware/shopware/issues/18488 |
| Fix merged: "fix(storefront): apply plugin overrides of async plugins" | 6.7 | merged | https://github.com/shopware/shopware/pull/18718 |
| Earlier thread: webpack `output.uniqueName` workaround resolves the class but not the instance binding | 6.7 | open | https://github.com/shopware/shopware/issues/12981 |
| Core TODO: the 6.6 guide tells authors to `extends window.PluginBaseClass`, "yet basically no Shopware JS plugin currently does this" | 6.6 / 6.7 | open | https://github.com/shopware/shopware/issues/14577 |
| Docs state each JS plugin can be overridden only once; last override wins | unclear | open | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/override-existing-javascript.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `override(name, plugin, selector)` still exist in 6.7 and what does it accept? | code | Yes — `plugin.manager.js:698`; accepts a class or an import factory (`register()` detects async at `:80-85`) |
| Does the documented async-override recipe actually apply the override in 6.7 (issue 18488 / PR 18718)? | code test anchor | At 6.7.13.0 the core jest suite asserts the async override's instance wins (`plugin.manager.test.js:564-578`). The reported failure is a patch-level bug below the pinned version, not a flaw in the recipe. |
| Is `CookiePermission` still the registered name, with `[data-cookie-permission]`, registered async? | code | Yes, all three — `main.js:130` |
| Can a plugin import and `extends` the core class, or must it use `window.PluginBaseClass`? | code | The core class is a default export extending `Plugin` and can be imported directly — `cookie-permission.plugin.js:10` |
| Is "only one override wins" visible in the 6.7 source? | not settled | The code lane did not examine multi-override layering. No fact above asserts it; see divergence. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Use `override()` rather than `register()` | "instead of using the `register()` function … you use the `override()` function" | `…/javascript/override-existing-javascript.md` | yes — `plugin.manager.js:698`, `:74-78` |
| The concrete call is `PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]')` | as quoted | same | yes — `main.js:130` |
| Import the core class and `extends` it | "`import CookiePermissionPlugin from 'src/plugin/cookie/cookie-permission.plugin';`" | same | yes — `cookie-permission.plugin.js:10` |
| Storefront JS plugins are vanilla classes you can simply extend | as quoted | same | yes |
| Overriding an async plugin requires an async import for the override too | as quoted | same | yes — `plugin.manager.js:80-85` plus the async test anchor |
| When the class cannot be imported, use `window.PluginManager.getPlugin(name)` / `Plugin.get('class')` | as quoted | same | not checked by the code lane |
| Each JS plugin can be overridden only once; the last override wins | as quoted | same | not checked by the code lane |
| `main.js` under `<plugin root>/src/Resources/app/storefront/src/` is the entry point | as quoted | same | partly — code shows `main.ts` is preferred over `main.js` |
| The Storefront must be rebuilt for the override to take effect | as quoted | same | not checked by the code lane |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| The entry point is `main.js` under `Resources/app/storefront/src/` | `getEntryFile()` checks `main.ts` **first** and falls back to `main.js`; if neither exists no Storefront JS is built for the bundle | `storefront: Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178-191` |
| "As JavaScript Storefront plugins are vanilla JavaScript classes, you can simply extend them" — read by many as `override()` doing the extending | `override()` performs no inheritance at all when the names are equal; the developer's class must `extends` the core class explicitly | `storefront: …/plugin.manager.js:120-139` |
| "Each JavaScript plugin can only be overridden once. If two Shopware plugins try to override the same plugin, only the last one of them will actually work." | Not examined by the code lane; the claim is therefore not carried as a fact | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `Registration in `main.js` uses `PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]')` instead of `register()`.` | rewritten (now fact 1) | Confirmed, but incomplete: code shows the entry point is `main.ts` first with `main.js` as fallback, and that the override is silently refused unless the *selector* matches the core registration. |
| `When the original class cannot be imported, retrieve it via `PluginManager.getPlugin('CookiePermission')` and `Plugin.get('class')`; if the original is registered asynchronously the override must pass an async import factory too.` | split — async half kept in fact 3, `getPlugin()` half removed | The async half is code-confirmed (`plugin.manager.js:80-85` plus the async override test anchor). The `getPlugin()`/`Plugin.get('class')` fallback was not examined by the code lane, and for the cookie bar — the case's own example — the core class is importable, so it does not decide whether an answer is usable. |
| `A JavaScript plugin can only be overridden once — if two plugins override the same one, only the last one takes effect.` | removed | Documentation claim, echoed by a community signal, that no code finding confirms: the code lane did not examine multi-override layering. Per the hierarchy an unconfirmed doc claim does not enter the facts, and it is not intent/business context. Recorded under divergence instead. |
| _(new)_ | added as fact 2 | Code shows the load-bearing point the old set missed: `override()` does **not** inherit from the overridden plugin, so an override class that omits `extends` silently drops core behaviour. |
