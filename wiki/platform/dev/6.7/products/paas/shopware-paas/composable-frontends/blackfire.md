---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware-paas/composable-frontends/blackfire.md
sourceHash: a393de223c76cc8f183f93adccd52b49c59bfcb6
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/composable-frontends/blackfire.html
title: Blackfire Continuous Profiling of Nuxt.js
version: "6.7"
versions:
  - "6.7"
keywords: ["blackfire", "continuous profiling", "nuxt.js", "composable frontends", "@blackfireio/node-tracing", "BLACKFIRE_ENABLE", "BLACKFIRE_APP_NAME", "defineNitroPlugin", "server/plugins/blackfire.ts", "nitro plugin", "node.js profiling", "shopware paas"]
summary: "Enable Blackfire continuous profiling on a Nuxt.js composable frontend: @blackfireio/node-tracing, BLACKFIRE_ENABLE=1 and a Nitro server plugin."
lastBuilt: 2026-09-15
---
## What it is

How to enable Blackfire Continuous Profiling on a Nuxt.js-based frontend (Composable Frontends) on Shopware PaaS, using the Blackfire Node.js tracing library started from a Nitro server plugin.

## When to use

You run a Nuxt.js Composable Frontend and want continuous CPU profiling data for it in Blackfire.

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

Optional `Blackfire.start()` options shown commented out in the source: `durationMillis` (e.g. 45000), `cpuProfileRate` (e.g. 100), `labels` (e.g. `{ service: 'frontend', framework: 'nuxt3' }`). `BLACKFIRE_APP_NAME` overrides the default app name `shopware-frontend`.

## Essential identifiers

- `@blackfireio/node-tracing`
- `BLACKFIRE_ENABLE`, `BLACKFIRE_APP_NAME`
- `defineNitroPlugin`, `server/plugins/blackfire.ts`
- `Blackfire.start()`

## Gotchas

- The plugin only starts tracing when `BLACKFIRE_ENABLE` is exactly the string `'1'`.
- The dynamic `import()` handles both default and named exports so it works in ESM.

## Code check (6.7.13.0)
- unverified `@blackfireio/node-tracing` — npm package for the Nuxt frontend, outside vendor/shopware
- unverified `BLACKFIRE_ENABLE` — frontend environment variable, not read by vendor/shopware code
- unverified `defineNitroPlugin` — Nuxt/Nitro API, outside vendor/shopware
