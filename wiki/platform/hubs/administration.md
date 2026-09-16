---
id: platform/hubs/administration.md
title: administration
summary: "Overview of the Shopware Administration: SPA architecture, plugin/app extension guides, Meteor Admin SDK, ACL, and related ADRs across 6.6 and 6.7."
keywords: ["administration", "vue.js", "spa", "plugin system", "apps", "meteor admin sdk", "acl", "snippets", "mixins", "directives", "b2b suite", "adr", "vue 3 migration", "eslint"]
members: ["platform/dev/6.6/concepts/commerce/content/_index.md", "platform/dev/6.6/concepts/framework/architecture/administration-concept.md", "platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.6/guides/plugins/apps/_index.md", "platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md", "platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.6/guides/plugins/plugins/administration/_index.md", "platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.md", "platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md", "platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md", "platform/dev/6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.md", "platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.6/products/extensions/b2b-components/quotes-management/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md", "platform/dev/6.6/resources/references/administration-reference/utils.md", "platform/dev/6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md", "platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md", "platform/dev/6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md", "platform/dev/6.6/resources/references/adr/2022-27-09-vue-2.7-update.md", "platform/dev/6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md", "platform/dev/6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.md", "platform/dev/6.6/resources/references/adr/2024-09-26-native-block-system.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/development/_index.md", "platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md", "platform/dev/6.7/guides/plugins/plugins/administration/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md", "platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/administration/_index.md", "platform/dev/6.7/resources/guidelines/code/platform-domains.md", "platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md", "platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md", "platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md", "platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md", "platform/dev/6.7/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md", "platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md", "platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md", "platform/dev/6.7/resources/references/adr/2022-09-27-vue-2.7-update.md", "platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md", "platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md", "platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md", "platform/dev/6.7/resources/references/core-reference/_index.md"]
lastBuilt: "2026-09-15"
---

This hub covers the Shopware Administration: its Vue.js SPA architecture, how plugins and apps extend it (modules, routes, components, mixins, directives, filters, snippets, ACL), the Meteor Admin SDK, and the Vue 2 to Vue 3 / Meteor Component Library migration history recorded in ADRs. Come here instead of grepping the source tree when the task is "extend or understand the admin panel" — the individual guide/ADR pages below give the exact API and reasoning.

## Developer — Shopware 6.6

Architecture & concepts:
- [Content](platform/dev/6.6/concepts/commerce/content/_index.md) — Shopping Experiences CMS and Page Builder in the Admin panel.
- [Administration](platform/dev/6.6/concepts/framework/architecture/administration-concept.md) — SPA architecture: modules/pages/views, Admin API, inheritance, ACL. Same topic as the 6.7 page below.

Deployment:
- [Deployments](platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md) — building Administration/Storefront assets without a database, CI/CD.

Apps & extension SDKs:
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) — App SDK, plugin system, and App scripts overview.
- [Add translations for apps](platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md) — per-locale admin snippet JSON files for apps.
- [Meteor Admin SDK](platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md) — NPM library shared by apps/plugins to extend the Admin UI.

Plugin administration guides:
- [Administration](platform/dev/6.6/guides/plugins/plugins/administration/_index.md) — section index: custom sections, modules, dashboards, settings.
- [Using Directives](platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.md) — Shopware.Directive.register, global vs. local scope.
- [Using Mixins](platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md) — Mixin.getByName and the component mixins array.
- [Using base components](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md) — reusing registry components such as sw-text-field.
- [Add custom route](platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md) — routes property, meta.parentPath, dynamic params.
- [Add filter](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md) — Filter.register text-formatting filters.
- [Injecting services](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/injecting-services.md) — inject property, e.g. repositoryFactory.
- [Using filter](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md) — calling filters via $options.filters and Twig pipes.
- [Adding responsive behavior](platform/dev/6.6/guides/plugins/plugins/administration/ui-ux/adding-responsive-behavior.md) — DeviceHelper $device.onResize and v-responsive.
- [Custom Fields](platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md) — per-entity custom field sets via admin or API.

B2B Suite:
- [Quotes Management](platform/dev/6.6/products/extensions/b2b-components/quotes-management/_index.md) — B2B quote request/adjust/accept workflow.
- [Guides](platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md) — B2B Suite installation and Core/Storefront/Administration guides. Same topic as the 6.7 page below.
- [Administration](platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md) — B2B Suite admin modules follow the standard plugin guidelines. Same topic as the 6.7 page below.

Reference & ADRs:
- [Utils](platform/dev/6.6/resources/references/administration-reference/utils.md) — utility functions on the shopware global object.
- [Vue administration app has ESLint support](platform/dev/6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md) — ESLint for .js/.html.twig. Same ADR reused in 6.7.
- [Rule condition field abstraction](platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — Rule::getConfig()/RuleConfig generic condition component. Same ADR reused in 6.7.
- [Providing the admin extension SDK](platform/dev/6.6/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md) — why the Admin/Meteor Extension SDK lives in its own repo. Same ADR reused in 6.7.
- [Vue 2.7 update](platform/dev/6.6/resources/references/adr/2022-27-09-vue-2.7-update.md) — skipping Vue 2.7, going straight to Vue 3. Companion of the differently-dated 6.7 ADR below.
- [Npm packages pre-release versions](platform/dev/6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md) — prohibits npm pre-release dependency versions.
- [Native extension system with vue](platform/dev/6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.md) — rejected native Vue 3 sw-block extension system.
- [Native Block System in Shopware](platform/dev/6.6/resources/references/adr/2024-09-26-native-block-system.md) — sw-block/sw-block-parent replacing TwigJs block overriding.

## Developer — Shopware 6.7

Architecture & concepts:
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — Core/Storefront/Administration domains, API-first design.
- [Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md) — SPA in a Symfony bundle, src layout, module/page/view, ACL. Same topic as the 6.6 page above.

Development workflow & API:
- [Development](platform/dev/6.7/guides/development/_index.md) — extension types, workflow, tooling (bin/console, shopware-cli).
- [Authentication and API Requests](platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md) — Admin API password-grant token, openapi3.json.

Plugin administration guides:
- [Administration](platform/dev/6.7/guides/plugins/plugins/administration/_index.md) — entry point: module, routes, components, data, ACL, services, templates, state. Same topic as the 6.6 page above.
- [Directives](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md) — reference of global Vue directives (autofocus, draggable, tooltip, etc.).
- [Mixins](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md) — reference of Administration mixins and their Mixin.getByName names.
- [Advanced Configuration](platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md) — rule assignment config, shortcuts, extending webpack.
- [Displaying User Feedback](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md) — notification mixin and, from 6.7.14.0, snackbarService.
- [Adding Responsive Behavior](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-responsive-behavior.md) — this.$device resize listeners and v-responsive.
- [Adding Snippets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md) — per-locale snippet JSON, $t/Shopware.Snippet, pluralization.
- [Using Assets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md) — static assets under Resources/app/administration/static, assets:install.

B2B Suite:
- [Guides](platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md) — B2B Suite installation and component guides. Same topic as the 6.6 page above.
- [Administration](platform/dev/6.7/products/extensions/b2b-suite/guides/administration/_index.md) — B2B Suite admin modules follow the standard plugin guidelines. Same topic as the 6.6 page above.

Reference & ADRs:
- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) — allowed domain dependencies: Administration may depend only on Core, enforced via phpat.
- [Notification titles are pre-defined and make use of the global namespace](platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md) — notification mixin supplies titles from global.default.*.
- [Import ACL privileges from other roles](platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md) — reuse privileges via the privileges service getPrivileges call.
- [The best-practice to always re-fetch the data after saving](platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md) — reload with repository.get() after repository.save().
- [Vue administration app has ESLint support](platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md) — ESLint rule adjustments and twig-as-comment linting. Same ADR reused from 6.6.
- [Add possibility for plugins to add a HTML file](platform/dev/6.7/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md) — plugin index.html built and loaded as an iFrame view.
- [Rule condition field abstraction](platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — RuleConfig renders via sw-condition-generic. Same ADR reused from 6.6.
- [Providing the admin extension SDK](platform/dev/6.7/resources/references/adr/2022-06-27-providing-the-admin-extension-sdk.md) — Meteor Extension SDK lives in its own repository. Same ADR reused from 6.6.
- [Vue 2.7 update](platform/dev/6.7/resources/references/adr/2022-09-27-vue-2.7-update.md) — skipping Vue 2.7 for Vue 3; the installed Administration runs on Vue 3 createApp. Companion of the 6.6 ADR above.
- [Disable Vue compat mode per component level](platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) — migrate components individually via Shopware.compatConfig.
- [Implementation of Meteor Component Library](platform/dev/6.7/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md) — mt- components replace admin base components; sw-* wrappers switch by flag.
- [Vue 2 Options API to Vue 3 Composition API Conversion Codemod](platform/dev/6.7/resources/references/adr/2024-10-02-vue-2-options-api-to-vue-3-composition-api-conversion-codemod.md) — ESLint-rule codemod converting Options API components to setup().
- [Keep Administration HTTP transports behind a compatibility facade](platform/dev/6.7/resources/references/adr/2026-07-23-administration-http-client-compatibility-facade.md) — HTTP client facade over Axios 0.x/1.x, selected via useAxiosV1.
- [Core Reference](platform/dev/6.7/resources/references/core-reference/_index.md) — index of DAL, Administration, feature flags, filters, Flow Builder and Rules references.
</content>
