---
id: platform/dev/6.7/products/paas/shopware-paas/composable-frontends/blackfire.md
title: Blackfire Continuous Profiling of Nuxt.js
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/composable-frontends/blackfire.html
sourceHash: a393de223c76cc8f183f93adccd52b49c59bfcb6
codeCheckedAgainst: "6.7.15.1"
keywords: ["blackfire", "continuous profiling", "profiler", "nuxt", "composable frontends", "@blackfireio/node-tracing", "BLACKFIRE_ENABLE", "BLACKFIRE_APP_NAME", "defineNitroPlugin", "nitro plugin", "server/plugins/blackfire.ts"]
summary: Enabling Blackfire continuous profiling on a Nuxt.js composable frontend via @blackfireio/node-tracing and a Nitro server plugin.
lastBuilt: 2026-10-21
---
## What it is

Setup for Blackfire Continuous Profiling on a Nuxt.js-based Shopware composable frontend, using the Blackfire Node.js tracing library started from a Nitro server plugin.

## When to use

When you want continuous CPU profiling of a Nuxt.js frontend running on Shopware PaaS.

## Key steps / config

1. Install the library: `npm install @blackfireio/node-tracing`
2. Set the environment variable `BLACKFIRE_ENABLE=1`.
3. Add `./server/plugins/blackfire.ts` (skeleton):
   ```ts
   export default defineNitroPlugin(async () => {
     if (process.env.BLACKFIRE_ENABLE !== '1') return;
     try {
       const mod = await import('@blackfireio/node-tracing');
       const Blackfire: any = (mod as any).default || mod;
       Blackfire.start({
         appName: process.env.BLACKFIRE_APP_NAME || 'shopware-frontend',
         // durationMillis, cpuProfileRate, labels: optional
       });
     } catch (e) { console.error('[blackfire] failed to start node-tracing', e); }
   });
   ```

## Essential identifiers

- `@blackfireio/node-tracing`
- `BLACKFIRE_ENABLE`, `BLACKFIRE_APP_NAME`
- `defineNitroPlugin`, `Blackfire.start()`
- `server/plugins/blackfire.ts`

## Gotchas

- The dynamic `import()` handles both default and named exports so the plugin works in ESM.
- Without `BLACKFIRE_ENABLE` set to exactly `'1'` the plugin returns early and profiling stays off.

## Code check (6.7.15.1)
- unverified `@blackfireio/node-tracing` — npm package for the Nuxt frontend, outside Shopware core/storefront/administration
- unverified `BLACKFIRE_ENABLE` — frontend env variable, not read by Shopware code
- unverified `defineNitroPlugin` — Nuxt/Nitro API, out of scope
