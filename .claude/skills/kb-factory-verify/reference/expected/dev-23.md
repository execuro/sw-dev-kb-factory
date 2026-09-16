# `dev-23` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-23` · `dev` · `Content (CMS/mail/SEO/media/sitemap)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I ship a mail template with my plugin so it is installed automatically, including a custom mail template type?

**Expected answer — every fact an answer must contain:**

1. There is no declarative path in 6.7 — no manifest element, no resource loader and no mail-template hook on the `Plugin` base class — so the template is shipped as data from a `MigrationStep` (or repository writes in `Plugin::install()`): insert `mail_template_type` (`technical_name` is Required and UNIQUE at DB level, `available_entities` is the JSON alias ⇒ entity map), its translations (`name` Required), then `mail_template` (`mail_template_type_id` Required) and one `mail_template_translation` per language, guarding on an existing `technical_name` so a reinstall is idempotent.  `[code: Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:58]` `[code: Migration/V6_3/Migration1536233330MailTemplate.php:30]` `[code: Migration/V6_7/Migration1763377570CreatePasswordChangeMailTemplate.php:49-57]`
2. The core helper `Shopware\Core\Migration\Traits\CreateMailTemplateTrait` (added in 6.7.8.0, present in 6.7.13.0, not marked `@internal`/`@final`) creates the type, the template and all translations in one `createMail()` call, but it cannot carry a plugin's own template bodies: its `MailTemplateCreateStruct` is `@internal` and hard-codes the fixture directory to core's own `Migration/Fixtures/mails/<name>` with no override, so a plugin still writes its own inserts.  `[code: Migration/Traits/CreateMailTemplateTrait.php:12-18]` `[code: Migration/Structs/MailTemplateCreateStruct.php:8-12,31-35]`
3. Nothing beyond those rows is needed for the template to be usable: `mail_template.system_default` is a plain `BoolField` that no code enforces (only the trait's idempotency lookup and the SSO invitation service filter on `systemDefault = true`, so `1` is the safer value for a type's canonical template — the docs' "must be 0" is editorial), the `mail_template_sales_channel` entity/table does not exist in 6.7 (dropped in V6_5), and a plugin-registered type needs no PHP/business-event registration — `SendMailAction` resolves the template by id alone and the flow-builder picker is an unfiltered entity select over `mail_template`.  `[code: Content/MailTemplate/MailTemplateDefinition.php:56]` `[code: Content/Flow/Dispatching/Action/SendMailAction.php:110-118,265-273]` `[code: Migration/V6_5/Migration1675082889DropUnusedTables.php:23]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html
<!-- expected:end -->

Round 2 verdict: **`confirmed`**. The deep code pass settled all four round-1 open questions; the facts above replace the suite's original doc-derived text.

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Mail templates and types are plain DAL entities; no plugin manifest for them, so a plugin ships them as data (migration or repository writes in `Plugin::install()`) | `Content/MailTemplate/MailTemplateDefinition.php:28` | `final public const ENTITY_NAME = 'mail_template';` |
| `mail_template_type` requires `technical_name` and a Required translations association | `Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:58` | `(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required())` |
| `mail_template_type_translation.name` is Required | `Content/MailTemplate/Aggregate/MailTemplateTypeTranslation/MailTemplateTypeTranslationDefinition.php:47` | `(new StringField('name', 'name'))->addFlags(new Required()),` |
| `technical_name` is UNIQUE at DB level | `Migration/V6_3/Migration1536233330MailTemplate.php:30` | ``CONSTRAINT `uniq.mail_template_type.technical_name` UNIQUE (`technical_name`),`` |
| `mail_template.mail_template_type_id` is Required; subject/senderName/contentHtml/contentPlain live on the translation | `Content/MailTemplate/MailTemplateDefinition.php:54` | `(new FkField('mail_template_type_id', 'mailTemplateTypeId', MailTemplateTypeDefinition::class))->addFlags(new Required()),` |
| Core's current 6.7 pattern: guard on `technical_name`, insert type with `available_entities` JSON, then translations, then the template | `Migration/V6_7/Migration1763377570CreatePasswordChangeMailTemplate.php:49-57` | `$existingMailTemplateTypeId = $connection->fetchOne('SELECT id FROM mail_template_type WHERE technical_name = :technicalName' …` |
| `available_entities` is the JSON alias ⇒ entity map | `Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:59` | `(new JsonField('available_entities', 'availableEntities'))` |
| `mail_template_type.template_data` is deprecated as of 6.7.12.0, removed in 6.8.0.0 | `Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:65-70` | `->addFlags(new Deprecated('v6.7.12.0', 'v6.8.0.0'))` |
| **Deep:** `CreateMailTemplateTrait` exists at `Migration/Traits/CreateMailTemplateTrait.php`, carries no docblock and no `#[Package]` — neither `@internal` nor `@final`; sole entry point `createMail()` | `Migration/Traits/CreateMailTemplateTrait.php:12-18` | `trait CreateMailTemplateTrait { protected function createMail(Connection $connection, MailTemplateTypeCreateStruct $mailTemplateType, MailTemplateCreateStruct $mailTemplate,): void {` |
| **Deep:** `createMail()` inserts into all four tables via raw `Connection::insert` — type (guarded by technical_name), type translations, template (`system_default` from the struct), template translations | `Migration/Traits/CreateMailTemplateTrait.php:51-59,67-75,109-117,125-137` | `$connection->insert('mail_template', ['id' => …, 'mail_template_type_id' => …, 'system_default' => $mailCreateStruct->isSystemDefault(), …]);` |
| **Deep:** language targeting is by locale **prefix** (`de-*` vs. everything else plus `LANGUAGE_SYSTEM`) in 6.7.13.0; the 6.7.8.0 original resolved exactly `en-GB`/`de-DE` | `Migration/Traits/CreateMailTemplateTrait.php:19-27` | `$germanLanguageByteIds = $this->getLanguageByteIdsByLocalePrefix($connection, 'de');` |
| **Deep:** three V6_7 core migrations use the trait | `Migration/V6_7/Migration1768545319RevocationRequestMailTemplate.php:19,47,65` | `use CreateMailTemplateTrait; … $this->createMail($connection, $merchantTypeStruct, $merchantTemplate);` |
| **Deep, caveat:** a plugin cannot ship its own bodies through the trait — `MailTemplateCreateStruct` is `@internal` and reads fixtures eagerly from core's own directory with no path override | `Migration/Structs/MailTemplateCreateStruct.php:8-12,31-35` | `$path = __DIR__ . '/../Fixtures/mails/' . $this->mailTemplateFixtureDirectoryName; $this->enHtml = $filesystem->readFile($path . '/en-html.html.twig');` |
| **Deep:** `system_default` is a plain `BoolField` with only `ApiAware` — no Required, WriteProtected, Computed or default; both 0 and 1 are writable | `Content/MailTemplate/MailTemplateDefinition.php:56` | `(new BoolField('system_default', 'systemDefault'))->addFlags(new ApiAware()),` |
| **Deep:** the only functional reader of `systemDefault` outside `Migration/` is the SSO invitation service; the admin `sw-mail-template` module never references it | `Framework/Sso/SsoUser/SsoUserInvitationMailService.php:118-126` | `new EqualsFilter('systemDefault', true),` |
| **Deep:** consequence of choosing 0 — the trait's idempotency lookup only matches `system_default = 1`, so a later trait-based migration inserts a second template for the same type | `Migration/Traits/CreateMailTemplateTrait.php:186-193` | ``SELECT `id` FROM `mail_template` WHERE `mail_template_type_id` = :mailTemplateTypeId AND `system_default` = 1`` |
| **Deep:** `SendMailAction` resolves the template by primary key from the flow config, with no sales-channel and no type filtering | `Content/Flow/Dispatching/Action/SendMailAction.php:110-118,265-273` | `$criteria = new Criteria([$id]); $criteria->addAssociation('media.media'); $criteria->setLimit(1);` |
| **Deep:** the flow send-mail modal's picker is an unfiltered `sw-entity-single-select` over `mail_template` (administration package) | `administration: src/module/sw-flow/component/modals/sw-flow-mail-send-modal/index.js:57-61` | `const criteria = new Criteria(1, 25); criteria.addAssociation('mailTemplateType');` |
| **Deep:** nothing filters mail template types by known business-event names; `available_entities` only governs the render data. A new flow **trigger** is the separate thing needing PHP registration | `Framework/DependencyInjection/CompilerPass/BusinessEventRegisterCompilerPass.php:20-24`; `Content/MailTemplate/Service/MailDataProvider.php:44-47` | `$definition->addMethodCall('addClasses', [$this->classes]); … $entities = array_intersect_key($entityMapping, $availableEntities);` |
| `Plugin::install(InstallContext)` is an overridable no-op hook | `Framework/Plugin.php:38-40` | `public function install(InstallContext $installContext): void { }` |
| Cleanup on uninstall is the plugin's job; `UninstallContext::keepUserData()` is the only signal | `Framework/Plugin/Context/UninstallContext.php:27-30` | `public function keepUserData(): bool` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A plugin/app can declare a mail template or type declaratively (manifest.xml or a Resources XML) and Shopware imports it | absent | no `mailtemplate` hit under `Framework/App/`; no `mail` element in `manifest-3.0.xsd`; no resource loader scans a plugin dir for them |
| The `Plugin` base class offers a mail-template-specific hook | absent | no `MailTemplate` hit under `Framework/Plugin/`; `Plugin.php` declares only install/postInstall/update/postUpdate/activate/deactivate/uninstall |
| A `MailTemplateTrait` (as opposed to `CreateMailTemplateTrait`) exists in core | absent | `grep -rn 'trait .*MailTemplate'` returns only `CreateMailTemplateTrait` and `MailTemplateTestBehaviour` |
| `CreateMailTemplateTrait` is marked `@internal` or `@final` | absent | the trait declaration follows the use statements directly — no docblock, no `#[Package]`, unlike the two Structs it consumes |
| `MailTemplateSalesChannelDefinition` exists in 6.7 | absent | `Content/MailTemplate/Aggregate/` holds only MailHeaderFooter(+Translation), MailTemplateMedia, MailTemplateTranslation, MailTemplateType(+Translation); the table was dropped in `Migration/V6_5/Migration1675082889DropUnusedTables.php:23` |
| The mail template administration module treats `system_default` specially (read-only, badge, filter) | absent | recursive grep for `systemDefault`/`system_default` across `module/sw-mail-template` returns no matches |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Dedicated trait for mail behaviour in functional tests | `Framework/Test/TestCaseBase/MailTemplateTestBehaviour.php` |
| Canonical end-to-end example incl. the idempotency guard | `Migration/V6_7/Migration1763377570CreatePasswordChangeMailTemplate.php:49-55` |
| `CreateMailTemplateTrait` end-to-end (idempotency, per-language translations, foreign default language) — and that the fixture twig files must live inside **core's** `src/Core/Migration/Fixtures/mails/` | `shopware/shopware @ v6.7.13.0 — tests/integration/Core/Migration/Traits/CreateMailTemplateTraitTest.php` |
| `createMail()` writes a translation for every language, not just en-GB/de-DE | same file, `testCreateMailUsesLanguageLocalePrefixForRegionalLanguages` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Core TODO asks for a declarative way to define templates from plugins/apps; today every install duplicates ~44 system templates | 6.7 | open | https://github.com/shopware/shopware/issues/17741 |
| A mail-template migration helper trait (reported as `CreateMailTemplateTrait`) added, milestone 6.7.8.0 | 6.7.8.0 | merged | https://github.com/shopware/shopware/pull/14921 |
| Follow-up "Use new MailTemplateTrait" closed as done | 6.7 | closed | https://github.com/shopware/shopware/issues/15043 |
| Maintainers: `templateData` "no longer useful", to be deprecated then removed | 6.7 | closed | https://github.com/shopware/shopware/issues/16967 |
| Core templates use `{{ salesChannel.name }}` instead of `.translated.name`, breaking inherited languages | 6.7.3.1 | closed | https://github.com/shopware/shopware/issues/13527 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does a mail-template migration helper trait exist in 6.7 core, what is its FQCN, is it `@internal`, does it create the type as well? | deep code lane | settled: `Shopware\Core\Migration\Traits\CreateMailTemplateTrait`, not `@internal`/`@final`, creates all four tables — but unusable for plugin-owned bodies (fixture path fixed to core) |
| Is any declarative (non-DB) mechanism available for a plugin in 6.7? | code lane | settled: no manifest element, no plugin hook, no resource loader |
| Do `template_data` / `available_entities` still exist and are they deprecated? | code lane | settled: `available_entities` current; `template_data` deprecated 6.7.12.0, removed 6.8.0.0 |
| What is the minimum row on `mail_template_type` (NOT NULL columns, unique index)? | code lane | settled: `technical_name` Required + UNIQUE, translations Required, translation `name` Required |
| Does core clean up plugin-created mail templates on uninstall? | code lane | settled: nothing does; `keepUserData()` is the only signal |
| Must a plugin's `mail_template` row carry `system_default = 0`, and does Flow Builder selectability need a `mail_template_sales_channel` row? | deep code lane | settled: no enforcement on `system_default` (1 is safer); `mail_template_sales_channel` does not exist in 6.7 |
| Is a plugin-registered type surfaced to the flow mail action from the DB row alone? | deep code lane | settled: yes — picker is unfiltered, no business-event registration needed for the type |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Shipping a template with a plugin is done via a plugin DB migration | "adding a mail template is done by using a plugin database migration" | `developer/guides/plugins/plugins/content/mail/add-mail-template.md` | yes — data-only entities, no declarative path |
| Steps: resolve/create the type id, insert `mail_template`, insert `mail_template_translation` per language | "Create a new mail template type or fetch an existing mail template type ID …" | same | yes |
| Existing type id fetched by SQL on `technical_name` | "SELECT id FROM mail_template_type WHERE technical_name = \"contact_form\"" | same | yes |
| The `mail_template` row must be inserted with `system_default` = 0 | "Make sure to set `system_default` to 0 here!" | same | **no** — nothing in 6.7.13.0 enforces or reads it that way; core's own migrations use 1 |
| Insert column lists for template and translation | "(mail_template_id, language_id, sender_name, subject, …)" | same | yes — same columns the trait writes |
| Language ids resolved by joining `language` to `locale` on `locale.code`, existence checked first | "we have to check whether the languages exist" | same | partially — 6.7.13.0 core matches by locale **prefix** and always fills `LANGUAGE_SYSTEM` |
| A custom type is created by inserting `mail_template_type` (`id`, `technical_name`, `available_entities`, `created_at`) + translations | "INSERT IGNORE INTO `mail_template_type` (id, technical_name, available_entities, created_at)" | same | yes |
| `available_entities` defines which entities are available to the template | "you define which entities should be available" | same | yes — intersected against the event's entity mapping in `MailDataProvider` |
| The template becomes available once the plugin is installed | "once your plugin is installed, the mail template will be added" | same | yes, given the migration runs on install |
| Use `INSERT IGNORE`; never remove mail templates on uninstall | "Do not remove e-mail templates in your plugin" | same | partially — code confirms nothing in core removes them; the advice itself is editorial |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The `mail_template` row must have `system_default` = 0 | `system_default` is a plain `BoolField` with only `ApiAware`; no validator, subscriber, delete restriction or admin behaviour reads it. Choosing 0 breaks the trait's idempotency lookup and any `EqualsFilter('systemDefault', true)` consumer, so 1 is the safer value for a type's canonical template | `Content/MailTemplate/MailTemplateDefinition.php:56`; `Migration/Traits/CreateMailTemplateTrait.php:186-193` |
| The guide's hand-written INSERT recipe is the only/current way | Core itself now uses `CreateMailTemplateTrait` (since 6.7.8.0); the docs never mention it — though it remains unusable for plugin-owned template bodies | `Migration/Traits/CreateMailTemplateTrait.php:12-18`; `Migration/Structs/MailTemplateCreateStruct.php:31-35` |
| Recipes populate the mail template type's data fields | `template_data` is deprecated as of 6.7.12.0 and removed in 6.8.0.0; `SendMailAction`'s write-back is disabled under the v6.8.0.0 flag | `Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:65-70` |
| Language ids are resolved per exact locale code (`en-GB`, `de-DE`) | 6.7.13.0's helper matches by locale prefix and always writes a `LANGUAGE_SYSTEM` translation; the exact-code form is what 6.7.8.0 shipped | `Migration/Traits/CreateMailTemplateTrait.php:19-27` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The template is installed from a `Shopware\Core\Framework\Migration\MigrationStep` subclass, which first resolves a `mail_template_type_id` by looking up `technical_name` in `mail_template_type` (e.g. `contact_form`) or inserting a new row. | rewritten | correct but incomplete: code shows the absence of any declarative path and the Required/UNIQUE constraints are what decide whether an answer is usable; merged into new fact 1 |
| Insert into `mail_template` (`id`, `mail_template_type_id`, `system_default` which must be `0`, `created_at`) and one `mail_template_translation` row per language (`mail_template_id`, `language_id`, `sender_name`, `subject`, `description`, `content_html`, `content_plain`, `created_at`), resolving `language_id` through a join on `locale.code` such as `en-GB` or `de-DE`. | removed | code disproves "`system_default` which must be `0`": the field is a plain `BoolField` no code enforces, and 0 breaks the trait's idempotency lookup and `systemDefault = true` consumers. The column list survives in new fact 1 |
| All inserts use `INSERT IGNORE INTO` so reinstalls do not throw, and mail templates must not be removed on uninstall because other entities may reference them; a custom type also needs `mail_template_type.available_entities` as a JSON map. | rewritten | the idempotency requirement and `available_entities` are kept in new fact 1; the "must not be removed on uninstall" clause is doc editorial that no code enforces and does not decide usability |
| — | added (new fact 2) | `CreateMailTemplateTrait` is the in-core idiom since 6.7.8.0, and its fixture-path limitation is what stops a plugin from using it |
| — | added (new fact 3) | code shows `mail_template_sales_channel` does not exist in 6.7 and no PHP registration is needed for the type — both are load-bearing negatives the old set missed |
