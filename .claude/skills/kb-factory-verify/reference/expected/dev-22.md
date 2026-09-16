# `dev-22` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-22` · `dev` · `Config & CLI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I give my plugin a settings page the shop operator can fill in, and what field types are available?

**Expected answer — every fact an answer must contain:**

1. The settings page is declared entirely in one XML file the core resolves by path at `<bundle path>/Resources/config/config.xml` (i.e. `<plugin root>/src/Resources/config/config.xml`); it is validated against `System/SystemConfig/Schema/config.xsd`, a missing file makes `ConfigReader::getConfigFromBundle()` throw `SystemConfigException::bundleConfigNotFound`, and no PHP class, service tag or compiler pass is involved in making the page appear. Its root `<config>` holds one or more `<card>`. `[code: System/SystemConfig/Util/ConfigReader.php:23,33-41; System/SystemConfig/Schema/config.xsd:3-24]`
2. Each `<input-field>` needs a `<name>` matching `[a-zA-Z][a-zA-Z0-9]*` that is unique across all cards; the `type` attribute is optional and defaults to `text`. In 6.7.13.0 the XSD enumerates exactly 16 types: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`, `price`. Anything outside that list — a media picker, an entity select — is not a field type but a `<component name="...">` element, which the reader emits as `componentName` and the XSD leaves unvalidated. `[code: System/SystemConfig/Schema/config.xsd:38,41-60,84-88; System/SystemConfig/Util/ConfigReader.php:155-171,178]`
3. Values live in `system_config` under the key `<PluginName>.config.<fieldName>` and are read back through `SystemConfigService` (`get`, `getString`, `getInt`, `getFloat`, `getBool`, `getDomain`, each with an optional `salesChannelId`); `savePluginConfiguration()` writes a row at plugin install and again with override at update, but only for fields that declare a `<defaultValue>` — a field without one has no row until the operator saves the form. `[code: System/SystemConfig/SystemConfigService.php:59,86-140,373-405; Framework/Plugin/PluginLifecycleService.php:157,297]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The config file is resolved by path at `Resources/config/config.xml` under the bundle; an alternative name is still resolved inside `Resources/config/` | `System/SystemConfig/Util/ConfigReader.php:33-37` | `$bundleConfigName = 'Resources/config/config.xml';` … `$configPath = $bundle->getPath() . '/' . ltrim($bundleConfigName, '/');` |
| A missing file throws rather than being ignored | `System/SystemConfig/Util/ConfigReader.php:39-41` | `throw SystemConfigException::bundleConfigNotFound($bundleConfigName, $bundle->getName());` |
| The file is XSD-validated | `System/SystemConfig/Util/ConfigReader.php:23` | `protected string $xsdFile = __DIR__ . '/../Schema/config.xsd';` |
| Root `<config>` holds one or more `<card>`; a card may hold `title`, `subtitle`, `name`, `ai-badge`, `input-field`, `component`, `flag` | `System/SystemConfig/Schema/config.xsd:3-24` | `<xs:element name="card" type="card" maxOccurs="unbounded"/>` … `<xs:element name="input-field" type="input-field" minOccurs="0" maxOccurs="unbounded"/>` |
| Exactly 16 input-field types; `type` defaults to `text` | `System/SystemConfig/Schema/config.xsd:38,41-60` | `<xs:attribute name="type" type="type" default="text"/>` … `<xs:enumeration value="price"/>` |
| The reader applies the same default | `System/SystemConfig/Util/ConfigReader.php:178` | `$swFieldType = $element->getAttribute('type') ?: 'text';` |
| `<component name="...">` renders an arbitrary admin component; the reader emits `componentName`, and its children are `processContents="skip"` | `System/SystemConfig/Util/ConfigReader.php:155-171`; `System/SystemConfig/Schema/config.xsd:25-32` | `'componentName' => $element->getAttribute('name'),` / `<xs:any processContents="skip" …/>` |
| Field `<name>` is restricted to `[a-zA-Z][a-zA-Z0-9]*` and unique across cards | `System/SystemConfig/Schema/config.xsd:9-12,84-88` | `<xs:selector xpath="card/input-field/name"/>` / `<xs:pattern value="[a-zA-Z][a-zA-Z0-9]*"/>` |
| `label`, `placeholder`, `helpText` are translatable via `lang` with `en-GB` fallback; `copyable`, `disabled`, `required` are booleans | `System/SystemConfig/Util/ConfigReader.php:24,301-317` | `\in_array($option->nodeName, ['label', 'placeholder', 'helpText'], true)` / `private const FALLBACK_LOCALE = 'en-GB';` |
| `defaultValue` is cast by type; a `<component>` keeps the phpized value untouched | `System/SystemConfig/Util/ConfigReader.php:258-274` | `self::INPUT_TYPE_BOOL, self::INPUT_TYPE_CHECKBOX => (bool) $value,` |
| Key prefix `<BundleName>.config.`; defaults saved only when declared | `System/SystemConfig/SystemConfigService.php:373-405` | `$prefix = $bundle->getName() . '.config.';` … `if (!isset($element['defaultValue'])) { continue; }` |
| Defaults written at install and, with override, at update | `Framework/Plugin/PluginLifecycleService.php:157,297` | `$this->systemConfigService->savePluginConfiguration($pluginBaseClass, true);` |
| Typed getters and optional sales-channel scope | `System/SystemConfig/SystemConfigService.php:59,86,96,106,116,140` | `public function getBool(string $key, ?string $salesChannelId = null): bool` |
| The admin fetches the cards from `GET /api/_action/system-config/schema?domain=…`, fields prefixed with the domain | `System/SystemConfig/Api/SystemConfigController.php:51-65`; `System/SystemConfig/Service/ConfigurationService.php:75` | `path: '/api/_action/system-config/schema'` / `$newField = ['name' => $domain . $field['name']];` |
| The extension settings page builds the domain as `<technical name>.config` | `administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-config/index.ts:52-54` | ``return `${this.namespace}.config`;`` |
| Cards and fields can be hidden behind an inactive feature `flag` | `System/SystemConfig/Service/ConfigurationService.php:68-81` | `if (\array_key_exists('flag', $card) && !Feature::isActive($card['flag'])) { unset($config[$i]);` |
| `cache-relevant="true"` on an input-field or component is surfaced as `cacheRelevant` | `System/SystemConfig/Util/ConfigReader.php:196-206` | `$elementData['cacheRelevant'] = XmlUtils::phpize($element->getAttribute('cache-relevant'));` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `media` / `media-upload` is a config.xml field type | absent | no such entry in the type enumeration; a media picker is only reachable as a `<component>` — `System/SystemConfig/Schema/config.xsd:41-60` |
| `entity` / `sw-entity-single-select` is a field type | absent | not enumerated; must be declared as `<component name="sw-entity-single-select">` — `System/SystemConfig/Schema/config.xsd:41-60`; `System/SystemConfig/Util/ConfigReader.php:155-171` |
| A field name may contain dashes, underscores or dots | absent | `name` is restricted to `[a-zA-Z][a-zA-Z0-9]*`, so such a name fails XSD validation — `System/SystemConfig/Schema/config.xsd:84-88` |
| PHP code (a config class, route or lifecycle hook) is needed to make the page appear | absent | the only entry point is the file at `Resources/config/config.xml`, discovered by path; no service tag, compiler pass or interface — `System/SystemConfig/Util/ConfigReader.php:33-37` |
| Fields without a `<defaultValue>` get a `system_config` row at install | absent | `saveConfig` skips them; `get()` returns null until the operator saves — `System/SystemConfig/SystemConfigService.php:396-398` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A canonical `config.xml` and the exact parsed array, including the `text` default, defaultValue casting, translatable labels, select options and the `<component>` form | `tests/unit/Core/System/SystemConfig/ConfigReaderTest.php` (trunk, sha ee66a4c) + `_fixtures/valid_config.xml` |
| An invalid `config.xml` throws `UtilException` — validation is enforced, not best-effort | `tests/unit/Core/System/SystemConfig/ConfigReaderTest.php` (trunk) |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `type="int"` with `<min>` clamps the typed value silently instead of showing a violation; `<min>0</min>` is not clamped at all (falsy check) | 6.7 | open | https://github.com/shopware/shopware/issues/19695 |
| Server-side validation errors on sales-channel-scoped config forms never rendered inline | 6.7 | merged | https://github.com/shopware/shopware/pull/18741 |
| Several field types re-inherit the global value when cleared per sales channel | 6.6/6.7 | closed | https://github.com/shopware/shopware/issues/4535 |
| Fix: allow clearing inherited config fields | 6.7 | merged | https://github.com/shopware/shopware/pull/17051 |
| `date`/`datetime` fields render without an inheritance switch | 6.7.10.2 | closed | https://github.com/shopware/shopware/issues/17273 |
| `SystemConfigService` uses null to remove a value while the validator rejects null for required fields | 6.6 era | merged | https://github.com/shopware/shopware/pull/7028 |
| An invalid `config.xml` blanks the whole extension list instead of showing an error | 6.7.4.2 | closed | https://github.com/shopware/shopware/issues/13574 |
| `<component name="sw-snippet-field">` renders with broken styling in an app config | 6.7.3.0 | open | https://github.com/shopware/shopware/issues/13104 |
| Feature request: no `<tab>` element, only `<card>` | unclear | open | https://github.com/shopware/shopware/issues/15379 |
| No documented way to pass props to a `<component>` entry | pre-6.7 | closed | https://github.com/shopware/docs/issues/442 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which `type` values does the XSD enumerate in 6.7? | code | Exactly 16, listed in fact 2; `single-select`, `multi-select`, `date`, `datetime`, `password`, `url`, `colorpicker`, `checkbox` are all among them, and `price` is too. `System/SystemConfig/Schema/config.xsd:41-60` |
| Does the XSD allow `<tab>` or only `<card>`? | code | `<card>` only — `System/SystemConfig/Schema/config.xsd:3-24` |
| Does the XSD allow `<component name="...">` alongside `<input-field>`, and can arbitrary props be passed? | code | Yes; children are `processContents="skip"`, i.e. anything is accepted and forwarded unvalidated — `System/SystemConfig/Schema/config.xsd:25-32`; `System/SystemConfig/Util/ConfigReader.php:155-171` |
| Is a `<defaultValue>` written into `system_config` at install, or only a read-time fallback? | code | Written at install and at update (override), and only for fields that declare one — `System/SystemConfig/SystemConfigService.php:373-405`; `Framework/Plugin/PluginLifecycleService.php:157,297` |
| `min`/`max` server-side constraint building, `mt-number-field` clamping, PR 18741 / PR 17051 presence, `date`/`datetime` inheritance switch, extension list blanking on invalid XML | not settled | Admin-side rendering and validation behaviour; not examined by the code lane and not part of the facts this case scores. Left open. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A settings page is defined by `config.xml` with no admin module or templating | "No custom Administration module or knowledge of templating is required." | add-plugin-configuration.md | yes — no registration path other than the file exists |
| The path is `src/Resources/config/config.xml` | "Create `src/Resources/config/config.xml` inside your plugin." | add-plugin-configuration.md | yes — `ConfigReader.php:33-37` |
| Every config.xml must contain at least one `<card>` with a `<title>` and at least one `<input-field>` | "Every `config.xml` must contain at least one `<card>` element with a `<title>` and at least one `<input-field>`." | add-plugin-configuration.md | partly — `<card>` yes, `<input-field>` is `minOccurs="0"` in the XSD |
| `<title>` is translatable via `lang`, default `en-GB` | "By default, the `lang` attribute is set to `en-GB`" | add-plugin-configuration.md | yes — `ConfigReader.php:24,301-317` |
| `<name>` must be at least 4 characters, matching `[a-zA-Z][a-zA-Z0-9]*` | "The field `<name>` must at least be 4 characters long" | add-plugin-configuration.md | pattern yes, 4-character minimum no — `config.xsd:84-88` |
| The `type` attribute defaults to a text field | "Unless defined otherwise, your `<input-field>` will be a text field." | add-plugin-configuration.md | yes — `config.xsd:38`; `ConfigReader.php:178` |
| The available types are the 15 listed in the table | types table, lines 106-122 | add-plugin-configuration.md | no — the XSD enumerates 16; `price` is missing from the table |
| `<defaultValue>` is imported into the database on install and update, cast via `XmlUtils` | "This value will be imported into the database on installing and updating the plugin." | add-plugin-configuration.md | yes — `SystemConfigService.php:373-405`; `PluginLifecycleService.php:157,297` |
| `<options>` applies to `single-select`/`multi-select`, each `<option>` needing `<id>` and `<name>` | "Each `<option>` represents one setting you can select." | add-plugin-configuration.md | yes — `ConfigReader.php` builds `{id, name}` lists |
| `<component name="...">` renders admin components; `<name>` first, all other children passed as props | "All other elements within the component element will be passed to the rendered admin component as properties." | add-plugin-configuration.md | yes — `ConfigReader.php:155-171`; `config.xsd:25-32` |
| Supported components by default are `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field`, per `ConfigValidator` | "also to be found in the ConfigValidator class" (permalink pinned at v6.6.7.0) | add-plugin-configuration.md | not checked — the cited class is in the App namespace; whether it constrains plugins was not examined |
| Values are read under `<BundleName>.config.<configName>` | "By default, the pattern is the following: `<BundleName>.config.<configName>`" | use-plugin-configuration.md | yes — `SystemConfigService.php:373-405` |
| `cache-relevant="true"` exists from 6.7.12.0; from 6.8.0.0 config writes no longer invalidate caches by default, and a cache-relevant write triggers sales-channel invalidation | "the broader system config cache invalidation path for the current sales channel" | add-plugin-configuration.md | attribute parsing yes (`ConfigReader.php:196-206`); the invalidation behaviour and the version boundaries were not examined |
| App configurations use the same schema as plugin configurations | "Configurations for apps adhere to the same schema" | apps/lifecycle/configuration.md | not checked — apps go through `AppConfigReader.php` |
| `minLength`/`maxLength` for text/url/password, `min`/`max` for int/float | "You can add the `<min>`/`<max>` settings…" | add-plugin-configuration.md | not checked |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| The types table lists 15 input-field types (`text` … `multi-select`) | The XSD enumerates 16; `price` is a valid `<input-field type>` in 6.7.13.0 and absent from the docs table | `System/SystemConfig/Schema/config.xsd:41-60` |
| A field `<name>` "must at least be 4 characters long" | The XSD imposes no length at all — the only restriction is the pattern `[a-zA-Z][a-zA-Z0-9]*`, so a 1-character name validates | `System/SystemConfig/Schema/config.xsd:84-88` |
| Every `config.xml` must contain at least one `<input-field>` | `<input-field>` is `minOccurs="0"` inside `card`; a card of `<component>` elements alone validates | `System/SystemConfig/Schema/config.xsd:3-24` |
| The page lists `text-editor` both as an `<input-field type>` and `sw-text-editor` as a `<component>` without explaining the relation | Both exist independently: `text-editor` is in the type enumeration, and any component name is accepted unvalidated inside `<component>` | `System/SystemConfig/Schema/config.xsd:41-60,25-32` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "The settings page is defined purely in `src/Resources/config/config.xml`, referencing `config.xsd` via `xsi:noNamespaceSchemaLocation`, with settings grouped into `<card>` elements that each hold a `<title>` and at least one `<input-field>`; labels are translated through the `lang` attribute (default `en-GB`)." | rewritten | The core resolves the file by path and validates it against its own bundled XSD — the `xsi:noNamespaceSchemaLocation` URL is an editor convenience, not the validation source (`ConfigReader.php:23`). "at least one `<input-field>`" is contradicted by `minOccurs="0"` in the XSD. |
| "Every `<input-field>` needs a unique `<name>` of at least 4 characters matching `[a-zA-Z][a-zA-Z0-9]*` plus a `type` attribute (default `text`) out of `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`; `<defaultValue>` is imported on install/update." | rewritten | The 4-character minimum does not exist in the XSD, the type list was missing `price`, and the fact omitted that everything outside the enumeration must go through `<component>` — the distinction that decides whether an answer is usable. |
| "Fields whose value affects cached Storefront output must carry `cache-relevant=\"true\"` so Administration writes trigger sales-channel-scoped invalidation (available from 6.7.12.0; from 6.8.0.0 system config writes no longer invalidate caches by default); values are read afterwards through `SystemConfigService` in PHP or Twig's `config()`." | removed, partly replaced | Code confirms only that the attribute is parsed and surfaced as `cacheRelevant` (`ConfigReader.php:196-206`); the invalidation behaviour, the 6.7.12.0 availability and the 6.8.0.0 default change were not established in code, and are peripheral to this query. The code-confirmed half — reading values through `SystemConfigService` under `<PluginName>.config.<fieldName>` — is kept and extended in the new fact 3. |
