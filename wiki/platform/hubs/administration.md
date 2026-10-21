---
id: platform/hubs/administration.md
title: Administration
summary: "Shopware Administration (Vue SPA): concepts, plugin and app extension guides, Meteor SDK, ADRs and the Vue 3 and Pinia migration."
keywords: ["administration", "admin spa", "vue", "vue 3", "pinia", "meteor admin sdk", "sw-block", "component factory", "mixins", "directives", "admin api", "adr"]
members: ["platform/dev/6.6/concepts/commerce/content/_index.md", "platform/dev/6.6/concepts/framework/architecture/administration-concept.md", "platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.6/guides/plugins/apps/_index.md", "platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md", "platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.6/guides/plugins/plugins/administration/_index.md", "platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.md", "platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md", "platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md", "platform/dev/6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.md", "platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.6/products/extensions/b2b-components/quotes-management/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md", "platform/dev/6.6/resources/references/administration-reference/utils.md", "platform/dev/6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md", "platform/dev/6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md", "platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md", "platform/dev/6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md", "platform/dev/6.6/resources/references/adr/2022-27-09-vue-2.7-update.md", "platform/dev/6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md", "platform/dev/6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.md", "platform/dev/6.6/resources/references/adr/2024-09-26-native-block-system.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/development/_index.md", "platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md", "platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/guides/plugins/apps/content/cms/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-placeholder.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-override.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md", "platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md", "platform/dev/6.7/resources/guidelines/code/platform-domains.md", "platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md", "platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md", "platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md", "platform/dev/6.7/resources/references/adr/2022-09-27-vue-2.7-update.md", "platform/dev/6.7/resources/references/adr/2022-10-20-test-structure.md", "platform/dev/6.7/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md", "platform/dev/6.7/resources/references/adr/2023-03-27-admin-text-editor-evaluation.md", "platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md", "platform/dev/6.7/resources/references/adr/2024-06-17-replace-vuex-with-pinia.md", "platform/dev/6.7/resources/references/adr/2024-09-26-native-block-system.md", "platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md", "platform/dev/6.7/resources/references/adr/2026-05-13-administration-pr-guidelines.md", "platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md", "platform/dev/6.7/resources/references/core-reference/_index.md"]
lastBuilt: 2026-10-21
---

# Administration

This hub covers the Shopware Administration: the Vue.js single-page app on top of the Admin API, how plugins and apps extend it (modules, components, templates, mixins, directives, routing, filters, services), the Meteor Admin SDK for apps, and the ADRs that explain its architecture. Come here to find the right member page for an Administration question, especially one about the Vue 2 to Vue 3 move, the Vuex to Pinia move, or the TwigJs to `sw-block` change, instead of grepping across versions.

Lifecycle notes:
- Vue 2.7 was skipped; the Administration went directly to Vue 3 (Vue 2.7 update ADRs). Upgrade steps for plugins are in the 6.7 Vue 3 upgrade page.
- Administration state moves from Vuex (`Shopware.State`) to Pinia (`Shopware.Store`) in 6.7.
- TwigJs block overriding is replaced by the native `sw-block` / `sw-block-parent` system. The 6.6 "Native extension system with vue" ADR records an earlier evaluation that kept the Component Factory.
- The Meteor Component Library (`mt-` components) replaces the Administration base components.
- Several ADRs exist in both 6.6 and 6.7 under the same name (ESLint, Admin extension SDK, Vue 2.7 update, npm pre-release versions, native block system); they are near-duplicates, and the 6.7 copy is the more detailed or current one.

## Shopware 6.6

Concepts and overviews
- [Administration](platform/dev/6.6/concepts/framework/architecture/administration-concept.md) — Vue.js SPA structure: modules, pages, views, inheritance, ACL.
- [Content](platform/dev/6.6/concepts/commerce/content/_index.md) — Shopping Experiences and Page Builder in the Admin panel.
- [Deployments](platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md) — building Administration and Storefront assets without a database.

Apps
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) — app extension overview.
- [Add translations for apps](platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md) — locale JSON snippets; no overriding of plugin keys.
- [Meteor Admin SDK](platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md) — NPM library to extend the Administration UI.

Plugins
- [Administration](platform/dev/6.6/guides/plugins/plugins/administration/_index.md) — section overview for Administration plugins.
- [Using Directives](platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.md) — `Directive.register`, global or local.
- [Using Mixins](platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md) — `Mixin.getByName`.
- [Using base components](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md) — reuse components such as `sw-text-field`.
- [Add custom route](platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md) — module `routes`, `meta.parentPath`.
- [Add filter](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md) — `Filter.register`.
- [Using filter](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md) — call filters from JavaScript and Twig.
- [Injecting services](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.md) — `inject` property, `repositoryFactory`.
- [Adding responsive behavior](platform/dev/6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.md) — `$device.onResize`, `v-responsive`.
- [Custom Fields](platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md) — custom field landing page.

References and ADRs
- [Utils](platform/dev/6.6/resources/references/administration-reference/utils.md) — utility functions on the `shopware` global object.
- [Import ACL privileges from other roles](platform/dev/6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md) — `getPrivileges()` reuse.
- [Vue administration app has ESLint support](platform/dev/6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md) — linting `.js` and `.html.twig`.
- [Rule condition field abstraction](platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — `Rule::getConfig()` and `RuleConfig`.
- [Providing the admin extension SDK](platform/dev/6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md) — SDK in its own repository.
- [Vue 2.7 update](platform/dev/6.6/resources/references/adr/2022-27-09-vue-2.7-update.md) — skip 2.7, go to Vue 3.
- [Npm packages pre-release versions](platform/dev/6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md) — pre-release versions prohibited.
- [Native extension system with vue](platform/dev/6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.md) — Vue 3 `sw-block` evaluation, Component Factory kept.
- [Native Block System in Shopware](platform/dev/6.6/resources/references/adr/2024-09-26-native-block-system.md) — `sw-block` replaces TwigJs blocks.

B2B (6.6 products)
- [Quotes Management](platform/dev/6.6/products/extensions/b2b-components/quotes-management/_index.md) — B2B quote workflow.
- [Guides](platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md) — B2B Suite guides entry.
- [Administration](platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md) — B2B Suite Administration modules.

## Shopware 6.7

Concepts and development
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — Core, Storefront and Administration domains.
- [Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md) — SPA layout, modules, inheritance, ACL roles.
- [Development](platform/dev/6.7/guides/development/_index.md) — development entry point and tooling.
- [Authentication and API Requests](platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md) — Admin API password grant, impersonation, schema download.
- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) — allowed dependencies between domains.
- [Dependency Injection & Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — Core versus Storefront rules.
- [Core Reference](platform/dev/6.7/resources/references/core-reference/_index.md) — reference lookup tables.

Apps
- [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) — `@shopware-ag/meteor-admin-sdk`.
- [CMS](platform/dev/6.7/guides/plugins/apps/content/cms/_index.md) — custom CMS blocks and elements from an app.

Plugins
- [Advanced Configuration](platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md) — rule assignment, shortcuts, webpack.
- [Mixins and Directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/_index.md) — mixin and directive index.
- [Adding Error Handling](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md) — `error` store helpers.
- [Routing and Navigation](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/_index.md) — routes, menu entries, tabs.
- [usePlaceholder()](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-placeholder.md) — composable replacing the placeholder mixin.
- [swDefineOverride()](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-override.md) — macro for `.override.vue` files.
- [Add Custom Styles](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md) — component SCSS.
- [Adding Responsive Behavior](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md) — `$device`, `v-responsive`.
- [Using Assets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md) — static files, `assets:install`.
- [Writing templates](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md) — TwigJS `.html.twig` templates.
- [Vue 3 upgrade](platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md) — plugin upgrade from Vue 2 to Vue 3.

ADRs
- [Notification titles are pre-defined and make use of the global namespace](platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md) — default notification titles.
- [The best-practice to always re-fetch the data after saving](platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — reload after `repository.save()`.
- [Vue administration app has ESLint support](platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md) — 6.7 version of the ESLint ADR.
- [Providing the admin extension SDK](platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md) — 6.7 version.
- [Vue 2.7 update](platform/dev/6.7/resources/references/adr/2022-09-27-vue-2.7-update.md) — 6.7 version.
- [Test structure](platform/dev/6.7/resources/references/adr/2022-10-20-test-structure.md) — Jest specs next to components.
- [Npm packages pre-release versions](platform/dev/6.7/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md) — 6.7 version.
- [Admin text editor evaluation](platform/dev/6.7/resources/references/adr/2023-03-27-admin-text-editor-evaluation.md) — TipTap V2 chosen.
- [Disable Vue compat mode per component level](platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) — `compatConfig`.
- [Implementation of Meteor Component Library](platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md) — `mt-` components.
- [Replace Vuex with Pinia](platform/dev/6.7/resources/references/adr/2024-06-17-replace-vuex-with-pinia.md) — `Shopware.Store`.
- [Native Block System in Shopware](platform/dev/6.7/resources/references/adr/2024-09-26-native-block-system.md) — 6.7 version.
- [Vue 2 Options API to Vue 3 Composition API Conversion Codemod](platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md) — ESLint-rule codemod.
- [Administration Pull Request Guidelines](platform/dev/6.7/resources/references/adr/2026-05-13-administration-pr-guidelines.md) — PR rules.
- [Keep Administration HTTP transports behind a compatibility facade](platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md) — Axios 0.x and 1.x facade.
