# `dev-71` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-71` · `dev` · `App system` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** How does an app define its own custom entities in Shopware 6.7 and read them back through the API?

**Expected answer — every fact an answer must contain:**

1. Entities are declared **not** in `manifest.xml` but in the app's `Resources/entities.xml` — the filename is fixed and the file is validated against `entity-1.0.xsd` — as `<entities><entity name="…"><fields>`. The entity name is also the table name and must start with `custom_entity_` or the shorthand `ce_`, otherwise `CustomEntityException::wrongTablePrefix` is thrown; every scalar field must carry `store-api-aware` (`use="required"` in the XSD), and the `id` primary key is added automatically. `[code: System/CustomEntity/CustomEntityLifecycleService.php:46-59, System/CustomEntity/Xml/CustomEntityXmlSchema.php:15-17, System/CustomEntity/Schema/SchemaUpdater.php:21-45, System/CustomEntity/Xml/entity-1.0.xsd:51-57, System/CustomEntity/Schema/DynamicEntityDefinition.php:86-94]`
2. Each entity is registered at boot as a `DynamicEntityDefinition` plus a `<entity_name>.repository` service, and only for rows whose app is **active** and which are not soft-deleted. Over the Admin API the URL segment is the entity name with underscores replaced by hyphens — `custom_entity_blog` → `/api/custom-entity-blog`, `/api/search/custom-entity-blog`; `ce_blog` → `/api/ce-blog` — with the full CRUD surface (detail, list, search, search-ids, aggregate, create, update, delete). An entity of an inactive app has no definition, so the route answers `CustomEntityException::notFound`, not a 403. `[code: System/CustomEntity/CustomEntityRegistrar.php:33-63, System/CustomEntity/Api/CustomEntityApiController.php:24-192, Framework/Api/Controller/ApiController.php:89-91,943-946]`
3. `store-api-aware="true"` only attaches the `ApiAware` read-protection flag to the field — it creates **no** route: there is no generic Store API route for custom entities in 6.7, and storefront access goes through an app script endpoint at `/store-api/script/{hook}`. An app is granted `read/create/update/delete` on its own custom entities automatically, on both install and update, without declaring them in `<permissions>` — but only when permissions are accepted (both CLI commands pass `acceptPermissions: true`); an app whose manifest sets `validates-permissions="true"`, or an install path passing `acceptPermissions: false`, leaves those privileges in `app.requested_privileges` and out of the `acl_role`, which yields `FRAMEWORK__MISSING_PRIVILEGE_ERROR` (403) on its own entity. `[code: Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:13-16,34-45, Framework/Script/Api/ScriptStoreApiRoute.php:36, Framework/App/Lifecycle/AppManager.php:353-361,600-614, Framework/App/Lifecycle/PermissionLifecycleService.php:30-41]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The lifecycle service looks for the app's `Resources` folder; no folder means no custom entities | `System/CustomEntity/CustomEntityLifecycleService.php:46-59,164-175` | `if (!$fs->has('Resources')) { return null; }` |
| Filename is fixed as `entities.xml`, validated against `entity-1.0.xsd` | `System/CustomEntity/Xml/CustomEntityXmlSchema.php:15-17` | `final public const FILENAME = 'entities.xml';` |
| Root `<entities>` with `<entity name="…">`; `name` required, `custom-fields-aware`/`label-property` optional, at least one `<fields>` | `System/CustomEntity/Xml/entity-1.0.xsd:4-30` | `<xs:attribute name="name" type="xs:string" use="required"/>` |
| Field types: int, float, string, text, bool, many-to-many, many-to-one, one-to-many, one-to-one, json, email, price, date | `System/CustomEntity/Xml/entity-1.0.xsd:32-48` | `<xs:element name="date" type="field-date-type" …/>` |
| Every scalar field must carry `store-api-aware` — `use="required"` | `System/CustomEntity/Xml/entity-1.0.xsd:51-57` | `<xs:attribute type="xs:boolean" name="store-api-aware" use="required" />` |
| Name must be prefixed `custom_entity_` or `ce_`, else `wrongTablePrefix` | `System/CustomEntity/Schema/SchemaUpdater.php:21-45` | `final public const TABLE_PREFIX = 'custom_entity_'; final public const SHORTHAND_TABLE_PREFIX = 'ce_';` |
| Install/update persists the definition into `custom_entity` and then updates the DB schema | `System/CustomEntity/CustomEntityLifecycleService.php:146-162`; `Schema/CustomEntityPersister.php:61-88` | `$this->customEntityPersister->update(...); $this->customEntitySchemaUpdater->update();` |
| Re-install deletes the app's previous `custom_entity` rows and re-inserts, keeping id/created_at for unchanged names | `System/CustomEntity/Schema/CustomEntityPersister.php:51-55,76-81` | `'DELETE FROM custom_entity WHERE app_id = :id'` |
| Schema updates take a 30-second lock | `System/CustomEntity/Schema/CustomEntitySchemaUpdater.php:49-57` | `$lock = $this->lockFactory->createLock('custom-entity::schema-update', 30);` |
| At boot a definition and `<entity_name>.repository` are registered, only for active apps and non-deleted rows | `System/CustomEntity/CustomEntityRegistrar.php:33-63` | `WHERE (custom_entity.app_id IS NULL OR app.active = 1) AND custom_entity.deleted_at IS NULL;` |
| `id` (IdField, ApiAware, Required, PrimaryKey) is added automatically | `System/CustomEntity/Schema/DynamicEntityDefinition.php:86-94` | `(new IdField('id', 'id'))->addFlags(new ApiAware(), new Required(), new PrimaryKey())` |
| `store-api-aware="true"` maps to `new ApiAware()`; `false` means no flag at all | `System/CustomEntity/Schema/DynamicFieldFactory.php:131-133` | `$apiAware = ($field['storeApiAware'] ?? false) ? new ApiAware() : null;` |
| Translatable fields produce a `<entity>_translation` definition plus repository and a `translations` association | `System/CustomEntity/Schema/DynamicFieldFactory.php:76-108` | `$translations = new TranslationsAssociationField($entityName . '_translation', …);` |
| Admin API: `/api/custom-entity-{entityName}` resolves `'custom-entity-' . $entityName`; `DefinitionNotFoundException` becomes `CustomEntityException::notFound` | `System/CustomEntity/Api/CustomEntityApiController.php:24-34` | `$entity = 'custom-entity-' . $entityName;` |
| A parallel shorthand family `/api/ce-{entityName}` exists | `System/CustomEntity/Api/CustomEntityApiController.php:36-45` | `$entity = 'ce-' . $entityName;` |
| Full CRUD in both families: detail, search-ids, search, aggregate, list, create, update, delete | `System/CustomEntity/Api/CustomEntityApiController.php:24-192` | `'api.custom_entity_entity.search-ids' … 'api.custom_entity_entity.delete'` |
| The app is granted read/create/update/delete on its own entities automatically | `Framework/App/Lifecycle/AppManager.php:599-614` | `$manifest->addPermissions([$entity->getName() => [PRIVILEGE_READ, PRIVILEGE_CREATE, PRIVILEGE_UPDATE, PRIVILEGE_DELETE]]);` |
| `custom-fields-aware` requires a `label-property` naming an existing string field | `System/CustomEntity/Xml/CustomEntityXmlSchemaValidator.php:24-38` | `if ($label === null) { throw CustomEntityException::noLabelProperty(); }` |
| Associations to core tables may not cascade-delete or be reverse-required | `System/CustomEntity/Xml/CustomEntityXmlSchemaValidator.php:48-63` | `'Cascade delete and referencing core tables are not allowed, field %s'` |
| `on-delete` accepts only set-null, cascade, restrict | `System/CustomEntity/Xml/entity-1.0.xsd:12-18` | `<xs:enumeration value="restrict"/>` |
| An app with a `restrict` association cannot be deactivated | `System/CustomEntity/CustomEntityLifecycleService.php:61-107` | `if ($restricted === AssociationField::RESTRICT) { return false; }` |
| Uninstall with `keepUserData` detaches and soft-deletes instead of dropping the tables | `System/CustomEntity/CustomEntityLifecycleService.php:119-139` | `'appId' => null, 'deletedAt' => $deletedAt,` |
| Optional `Resources/config/admin-ui.xml` enriches the definition before persisting | `System/CustomEntity/CustomEntityLifecycleService.php:153-156,177-186` | `$this->customEntityEnrichmentService->enrich(...)` |
| **deep** One canonical URL rule: URL segment = entity name with `_` → `-`; the two route families correspond to the two allowed prefixes, so exactly one applies per entity | `System/CustomEntity/Api/CustomEntityApiController.php:120-142` | `#[Route(path: '/api/custom-entity-{entityName}{path}', …)] … $entity = 'custom-entity-' . $entityName;` |
| **deep** `ApiController::urlToSnakeCase()` converts back and the result is looked up verbatim — no api-alias indirection | `Framework/Api/Controller/ApiController.php:89-91,943-946` | `private function urlToSnakeCase(string $name): string { return str_replace('-', '_', $name); }` |
| **deep** Definitions are registered in `DefinitionInstanceRegistry` under the raw entity name; an inactive app's entities have no route at all | `System/CustomEntity/CustomEntityRegistrar.php:33-63` | `$registry->register($definition, $definition->getEntityName());` |
| **deep** No Store API route for custom entities; `ApiAware` is a read-protection allow-list, not a route | `Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:13-16,34-45` | `private const BASE_URLS = [AdminApiSource::class => '/api/', SalesChannelApiSource::class => '/store-api/'];` |
| **deep** The only Store API entry point is the generic script endpoint | `Framework/Script/Api/ScriptStoreApiRoute.php:36` | `#[Route(path: '/store-api/script/{hook}', name: 'store-api.script_endpoint', …)]` |
| **deep** `updateCustomEntities` has one caller, `persistApp()`, invoked from both `install()` and `update()`; permissions are handed to `PermissionLifecycleService` on the next line | `Framework/App/Lifecycle/AppManager.php:353-361,600-614` | `$this->updateCustomEntities($app, $manifest); $this->permissionLifecycle->updatePrivileges($manifest->getPermissions(), $id, $manifest->validatesPermissions() === false && $parameters->acceptPermissions, $context);` |
| **deep** The grant only reaches `acl_role` when that third argument is true; otherwise new privileges go to `requested_privileges` | `Framework/App/Lifecycle/PermissionLifecycleService.php:30-41`; `Framework/App/Privileges/Privileges.php:172-196` | `if ($acceptPermissions) { $this->privileges->setPrivileges($appId, $privileges, $context); return; } $this->privileges->requestPrivileges($appId, $privileges, $context);` |
| **deep** Both CLI commands pass `acceptPermissions: true` unconditionally | `Framework/App/Command/InstallAppCommand.php:89-93`; `RefreshAppCommand.php:96-100`; `Privileges.php:156-167` | `new AppInstallParameters(activate: $input->getOption('activate'), acceptPermissions: true)` |
| **deep** With no `Resources` dir or no `entities.xml`, `updateCustomEntities` silently adds nothing — no warning | `System/CustomEntity/CustomEntityLifecycleService.php:46-59,164-170` | `if (!\is_file($filePath)) { return null; }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Custom entities are declared inside `manifest.xml` | absent | `manifest-3.0.xsd` has no custom-entities element; definitions come from `Resources/entities.xml` against `entity-1.0.xsd` |
| The app must declare permissions for its own custom entities | absent | `AppManager::updateCustomEntities` adds full CRUD to the manifest permissions itself (`AppManager.php:602-613`) |
| Custom entities of an inactive app are reachable through the API | absent | The registrar filters on `app.active = 1`; the route then throws `CustomEntityException::notFound` |
| `store-api-aware` only affects the Store API | absent | It maps to `ApiAware` with no arguments, whose allow list covers both `/api/` and `/store-api/`; `false` means no flag at all |
| A custom entity may be named freely | absent | `SchemaUpdater` rejects any name not prefixed `custom_entity_` or `ce_` |
| There are two competing Admin API URL forms for the same entity | absent | The mapping is deterministic — `_` → `-` — and each entity carries exactly one of the two prefixes (`ApiController.php:943-946`) |
| A generic Store API route exists for custom entities | absent | No `/store-api/custom-entity`, `/store-api/ce-` or `/store-api` `{entityName}` route exists; the registrar registers only into `DefinitionInstanceRegistry` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The Admin API URL for `custom_entity_blog` is `/api/custom-entity-blog` across create/update/list/detail/search/search-ids/delete | `shopware/shopware@trunk tests/integration/Core/System/CustomEntity/CustomEntityTest.php:864-962` |
| Store API access to the same entities goes through an app script endpoint (`POST /store-api/script/blog`), not an entity route | `…/CustomEntityTest.php:992-1004` |
| The automatic grant lands in the app's `acl_role` as full CRUD per own custom entity (`custom_entity_blog:read` … `ce_blog_comment:delete`) | `…/CustomEntityTest.php (testAutoPermissions)` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 403 `FRAMEWORK__MISSING_PRIVILEGE_ERROR` (`ce_ravioli:read`) on `GET /api/ce-ravioli` with the app's own token, although the docs say no permissions need declaring; maintainer pointed at `updateCustomEntities` and `testAutoPermissions`, suspected stale `acl_role`/`custom_entity` state; closed not-planned, unreproduced | 6.6.10.4 | closed | https://github.com/shopware/shopware/issues/9991 |
| Field types the XSD accepts (price, one-to-one, one-to-many, many-to-many, json) were not renderable by the generated admin UI | 6.5 era | closed | https://github.com/shopware/shopware/issues/5984 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the `ce_`/`custom_entity_` prefix mandatory? | code lane | Yes — `SchemaUpdater::wrongTablePrefix` — fact 1 |
| Does the auto-grant still exist in 6.7 and under which name? | deep pass | Yes, as `AppManager::updateCustomEntities`, on both install and update — fact 3 |
| Which file and which XSD? | code lane | `Resources/entities.xml`, `entity-1.0.xsd` — fact 1 |
| What is the Admin API route, and is there a Store API route gated by `store-api-aware`? | deep pass | `_`→`-` on the entity name; no Store API route at all — facts 2 and 3 |
| Which field elements does the XSD declare, and which are honoured by the admin UI? | code lane (XSD only) | The 13 types are listed in the evidence; the admin-UI rendering gap (#5984) was not checked against code and is in no fact |
| Can the 403 on an app's own entity still occur after a plain `app:refresh`? | deep pass | Yes, condition-dependent: `validates-permissions="true"` in the manifest, or any caller passing `acceptPermissions: false`, leaves the privileges in `requested_privileges` — fact 3 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Entities are registered in the app's `Resources/entities.xml` | "register them in your app's `Resources/entities.xml` file" | custom-entities.md | yes — `CustomEntityLifecycleService.php:46-59`, `CustomEntityXmlSchema.php:15-17` |
| `entities.xml` uses `entity-1.0.xsd` and `<entities>/<entity name>/<fields>` | schema-location quote | custom-entities.md | yes — `entity-1.0.xsd:4-30` |
| Scalar types int, float, string, text, bool, date plus json, email, price | "we support different scalar values: int, float, string, text, bool, date" | entities-reference.md | yes, and the XSD also declares the four association types |
| `on-delete` supports cascade, restrict, set-null | `on-delete="cascade"` example | entities-reference.md | yes — `entity-1.0.xsd:12-18` |
| Every registered entity gets an automatic repository, also available in app scripts | "All registered entities will get an automatically registered repository." | custom-entities.md | yes — `CustomEntityRegistrar.php:33-63` |
| Custom entities are accessible via the Admin API, e.g. `POST /api/search/custom-entity-blog` | route quote | custom-entities.md | yes — `CustomEntityApiController.php:24-192` |
| `store-api-aware` controls whether a field is available in the Store API | "some fields should not be available in the store-api" | entities-reference.md | partly — it is a field-level read-protection flag covering both `/api/` and `/store-api/`, and no Store API route for custom entities exists |
| An app has full access to its own custom entities without declaring permissions | "your app directly has full access rights to your own custom entities" | custom-entities.md | yes on the CLI path, with the `validates-permissions` / `acceptPermissions: false` caveat |
| The `ce_` shorthand must then be used consistently with repository and API | "you also need to use it if you use the repository or the API" | custom-entities.md | yes — the prefix is part of the entity name that both the registry and the route resolve |
| Custom entities cannot be renamed without losing all data | "you can't rename existing custom entities as that would lead to the deletion of all existing data" | custom-entities.md | not checked — no code finding either way |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| custom-entities.md shows the Admin API route in two forms — `POST /api/search/custom-entity-blog` (kebab) and `POST /api/search/ce_blog` (snake, unconverted) — and never states the conversion rule | One deterministic rule: the URL segment is the entity name with `_` replaced by `-`, so `ce_blog` is `/api/ce-blog`, never `/api/ce_blog`. `ApiController::urlToSnakeCase()` converts it back and looks the name up verbatim. | `Framework/Api/Controller/ApiController.php:89-91,943-946`; `System/CustomEntity/Api/CustomEntityApiController.php:120-142` |
| entities-reference.md presents `store-api-aware` as controlling Store API availability of a field | It attaches the `ApiAware` flag, a read-protection allow-list covering both `/api/` and `/store-api/`; `false` means no flag at all. It creates no route, and 6.7 has no generic Store API route for custom entities — the storefront path is `/store-api/script/{hook}`. | `System/CustomEntity/Schema/DynamicFieldFactory.php:131-133`; `Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:13-16,34-45`; `Framework/Script/Api/ScriptStoreApiRoute.php:36` |
| custom-entities.md: "your app directly has full access rights to your own custom entities" — stated unconditionally | The grant is written to `acl_role` only when `$manifest->validatesPermissions() === false && $parameters->acceptPermissions`. A manifest with `validates-permissions="true"`, or any caller passing `acceptPermissions: false`, leaves those privileges in `app.requested_privileges` and produces a 403 on the app's own entity. | `Framework/App/Lifecycle/AppManager.php:353-361`; `Framework/App/Lifecycle/PermissionLifecycleService.php:30-41`; `Framework/App/Privileges/Privileges.php:172-196` |
| custom-entities.md dates the `ce_` shorthand "Since v6.4.15.0"; entities-reference.md dates it "since shopware v6.5.15.0" | Both prefixes exist in 6.7.13.0 (`TABLE_PREFIX`, `SHORTHAND_TABLE_PREFIX`, `wrongTablePrefix` otherwise); the introducing version is not established by code, so no fact states one. | `System/CustomEntity/Schema/SchemaUpdater.php:21-45` |
| entities-reference.md lists the scalar types without mentioning `store-api-aware` being mandatory | `store-api-aware` is `use="required"` on every scalar field type in the XSD. | `System/CustomEntity/Xml/entity-1.0.xsd:51-57` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Entities are declared in the app's `Resources/entities.xml` inside `<entities><entity name="..."><fields>`, with field attributes such as `store-api-aware="true"` and types like `<string>`, `<price>`, `<many-to-many reference="product">`. | kept and tightened as fact 1 | Confirmed, but the load-bearing constraints were missing: the mandatory `custom_entity_`/`ce_` name prefix (`SchemaUpdater.php:21-45`), `store-api-aware` being `use="required"`, and that the declaration is not in `manifest.xml` |
| Each registered entity gets an automatic repository, reachable from app scripts via `services.repository.search('custom_entity_bundle', criteria)` and over the Admin API at `POST /api/search/<entity-name>`. | rewritten as fact 2 | The URL form `<entity-name>` is wrong as written: the segment is the entity name with `_` replaced by `-` (`/api/search/custom-entity-blog`), and registration happens only for active, non-deleted apps — an inactive app's entity yields `notFound` |
| Since Shopware 6.4.15.0 the `ce_` prefix shorthand (e.g. `ce_bundle`) is allowed and must then be used consistently in repository and API calls; entity names cannot be renamed later without losing all data. | removed, replaced by fact 3 | The version pin is unverifiable from code and the two doc pages disagree (6.4.15.0 vs 6.5.15.0); the rename/data-loss clause has no code finding either way. The prefix rule itself is kept in fact 1, where code shows it is mandatory rather than merely allowed, and the slot is used for what code does settle: no Store API route, and the conditions under which the automatic privilege grant does not reach the `acl_role` |
