---
id: platform/dev/6.7/products/paas/shopware/guides/monorepo.md
title: Deploy from a monorepo
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/monorepo.html
sourceHash: 3d2827e24b10792647fee884e39984efcf156d3d
codeCheckedAgainst: "6.7.15.1"
keywords: ["--application-yaml-path", "sw-paas application create", "sw-paas application update", "app.build.context", "app.build.dockerfile_path", "services.fastly.snippets_path", "application.yaml", "monorepo", "application root", "build context", ".dockerignore", "composer.lock"]
summary: PaaS Native monorepo deploys via --application-yaml-path on sw-paas application create, app.build.context, and application-root path rules.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

Shopware PaaS Native expects `application.yaml` at the repository root by default. For a monorepo, where several applications share one repository and each needs its own configuration, two settings apply: the `--application-yaml-path` flag of `sw-paas application create` (where this application's `application.yaml` lives) and the `app.build.context` option in `application.yaml` (which directory the image is built from, if not the one holding `application.yaml`).

## When to use

Hosting a Shopware shop and other applications (e.g. a frontend) in sub-directories of one repository connected to a PaaS Native project.

## Key steps / config

**Application root.** The directory containing `application.yaml` is the application root. Without `--application-yaml-path` it is the repository root. Paths resolve as follows:

| Setting | Resolved relative to |
|---|---|
| `app.build.context` | application root |
| `app.build.dockerfile_path` | application root |
| `services.fastly.snippets_path` | application root |
| `composer.lock` | build context |

All resolved paths must stay inside the repository; `..` segments are allowed if the result does not leave it.

**Point each application at its file** (repository-relative, including the file name):

```sh
sw-paas application create --name shopware --application-yaml-path apps/shopware/application.yaml
sw-paas application create --name frontend --application-yaml-path apps/frontend/application.yaml
```

for a layout of `apps/shopware/{application.yaml,composer.json,composer.lock}` and `apps/frontend/{application.yaml,package.json}`. The path is stored on the application at creation; `sw-paas application update` reuses it.

**Choose the build context.** Default is the application root, enough for a self-contained application. To include files outside it (a shared package, a workspace lock file), widen it:

```yaml
app:
  build:
    context: ".."
  php:
    version: "8.3"
```

With `application.yaml` in `apps/shopware/`, `context: ".."` builds from `apps/`. The context is validated on create/update; if it does not exist, is not a directory, or points outside the repository, the command fails and prints the resolved path.

**Fastly snippets.** `services.fastly.snippets_path: config/fastly` for an application rooted at `apps/shopware/` reads `apps/shopware/config/fastly`. Folder layout: [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md).

## Essential identifiers

- `sw-paas application create --application-yaml-path <path>`
- `sw-paas application update`
- `app.build.context`, `app.build.dockerfile_path`
- `services.fastly.snippets_path`

## Gotchas

- The flag is only needed once; to move `application.yaml` to another directory you must create a new application.
- The generated Shopware Dockerfile copies the root of its context, so for a shop the context must be the directory that holds the shop.
- `composer.lock` is read from the build context, not the application root — a widened context needs the lock file in the new context directory.
- `.dockerignore` is read from the context root, not the repository root.
- Everything in the context is sent to the build; a context covering the whole monorepo slows every build.

## Code check (6.7.15.1)
- unverified `--application-yaml-path` — sw-paas CLI flag, outside the Shopware code roots
- unverified `app.build.context` — PaaS application.yaml key, outside the Shopware code roots
- unverified `app.build.dockerfile_path` — PaaS application.yaml key, outside the Shopware code roots
- unverified `services.fastly.snippets_path` — PaaS application.yaml key, outside the Shopware code roots
