# `dev-67` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-67` · `dev` · `App system` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** What does a minimal app folder and `manifest.xml` need to contain, and which console commands install and activate the app on my local Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. A minimal app is a folder under `custom/apps/<Name>/` holding a `manifest.xml` in its root (the loader scans `custom/apps` at depth `<= 1` for that filename); `<meta>` is the only mandatory block of the manifest — every other top-level block is `minOccurs="0"` — and its required children are `label`, `name`, `author`, `copyright`, `license` and `version`. In 6.7 the manifest is validated against `manifest-3.0.xsd`. `[code: Framework/App/Lifecycle/AppLoader.php:62-69, Framework/App/Manifest/Schema/manifest-3.0.xsd:5-20, Framework/App/Manifest/Xml/Meta/Metadata.php:18-25, Framework/App/Manifest/Manifest.php:33]`
2. The folder name must equal `<meta><name>` (compared case-insensitively): `AppNameValidator` is tagged `shopware.app_manifest.validator` and run by `ManifestValidator`, which `app:install`, `app:refresh` and `app:validate` all invoke, so a mismatch aborts install/refresh with `The technical app name "%s" in the "manifest.xml" and the folder name must be equal.` unless `--no-validate` is passed. `[code: Framework/App/Validation/AppNameValidator.php:17-28, Framework/DependencyInjection/app.php:220-229]`
3. Install and activate with `bin/console app:refresh` to pick up a manually created app, then `bin/console app:install --activate <Name>`, where `<Name>` is the required technical name (not a path); without `--activate` the app installs inactive and `bin/console app:activate <Name>` activates it afterwards (exactly one name per call). `[code: Framework/App/Command/InstallAppCommand.php:106-124, Framework/App/Command/InstallAppCommand.php:86-91, Framework/App/Command/AbstractAppActivationCommand.php:36-54]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Apps live in `<project>/custom/apps`, bound to `kernel.app_dir` / `shopware.app_dir` | `Kernel.php:285` | `'kernel.app_dir' => rtrim($this->getProjectDir(), '/') . '/custom/apps',` |
| Same dir in the framework DI config | `Framework/DependencyInjection/app.php:182` | `->set('shopware.app_dir', '%kernel.project_dir%/custom/apps');` |
| An app is discovered by `manifest.xml` in the app root, scanned at depth `<= 1` | `Framework/App/Lifecycle/AppLoader.php:62-69` | `$finder->in($this->appDir)->depth('<= 1')->followLinks()->name('manifest.xml');` |
| A second pass loads `manifest.local.xml` and overrides entries keyed by `<meta><name>` | `Framework/App/Lifecycle/AppLoader.php:78-91` | `// Overriding with local manifests` |
| 6.7 validates against `manifest-3.0.xsd`, not 2.0, for all three entry points | `Framework/App/Manifest/Manifest.php:33` | `private const XSD_FILE = __DIR__ . '/Schema/manifest-3.0.xsd';` |
| `<meta>` is the only mandatory child of `<manifest>`; the children are an `xs:all`, so block order is free | `Framework/App/Manifest/Schema/manifest-3.0.xsd:5-20` | `<xs:all><xs:element name="meta" type="meta"> … <xs:element name="setup" type="setup" minOccurs="0">` |
| Required meta fields enforced by PHP | `Framework/App/Manifest/Xml/Meta/Metadata.php:18-25` | `protected const REQUIRED_FIELDS = ['label','name','author','copyright','license','version'];` |
| Enforced in the `XmlElement` constructor, independently of the XSD | `Framework/App/Manifest/Xml/XmlElement.php:22-24` | `$this->validateRequiredElements($data, static::REQUIRED_FIELDS);` |
| `app:create` skeleton is the canonical minimal manifest (meta + `manifest-3.0.xsd` schema location) | `Framework/App/Command/CreateAppCommand.php:248-266` | `xsi:noNamespaceSchemaLocation="…/manifest-3.0.xsd">` |
| `app:create` scaffolds under `custom/apps` and writes `manifest.xml` | `Framework/App/Command/CreateAppCommand.php:299-312` | `file_put_contents($appDirectory . '/manifest.xml', $manifestContent);` |
| `app:install <name>…` — name REQUIRED and IS_ARRAY; options `-f/--force`, `-a/--activate`, `--no-validate` | `Framework/App/Command/InstallAppCommand.php:106-124` | `$this->addArgument('name', InputArgument::REQUIRED \| InputArgument::IS_ARRAY, 'The name of the app')` |
| `app:install` calls `install()` with `AppInstallParameters(activate: <--activate>, acceptPermissions: true)` | `Framework/App/Command/InstallAppCommand.php:86-91` | `new AppInstallParameters(activate: $input->getOption('activate'), acceptPermissions: true),` |
| `app:activate <name>` takes exactly one REQUIRED name; counterpart `app:deactivate` | `Framework/App/Command/ActivateAppCommand.php:14-34` | `#[AsCommand(name: 'app:activate', description: 'Activates an app')]` |
| Resolved through `AppStorage::findByName`; name must also be the folder name | `Framework/App/Command/AbstractAppActivationCommand.php:36-54` | `$app = $this->appStorage->findByName($appName, $context);` |
| `app:refresh` (alias `app:update`) — name OPTIONAL\|IS_ARRAY, same options | `Framework/App/Command/RefreshAppCommand.php:26-56` | `#[AsCommand(name: 'app:refresh', … aliases: ['app:update'])]` |
| `app:validate [name]` validates manifests; without a name, every app folder | `Framework/App/Command/ValidateAppCommand.php:71` | `$this->addArgument('name', InputArgument::OPTIONAL, …)` |
| **deep** `AppNameValidator` compares the last path segment of `Manifest::getPath()` with the meta name, case-insensitively | `Framework/App/Validation/AppNameValidator.php:17-28` | `if ($appName !== strtolower($manifest->getMetadata()->getName())) { $errors->add(new AppNameError(...)); }` |
| **deep** It is tagged `shopware.app_manifest.validator` and consumed by `ManifestValidator` via `tagged_iterator` | `Framework/DependencyInjection/app.php:220-229` | `$services->set(AppNameValidator::class)->tag('shopware.app_manifest.validator');` |
| **deep** The error message is literal | `Framework/App/Validation/Error/AppNameError.php:11-20` | `'The technical app name "%s" in the "manifest.xml" and the folder name must be equal.'` |
| **deep** `app:install` runs `ManifestValidator` before `install()` and `continue`s with FAILURE on `AppValidationException`; `app:refresh` aborts the whole run | `Framework/App/Command/InstallAppCommand.php:76-93` | `if (!$input->getOption('no-validate')) { try { $this->manifestValidator->validate($manifest, $context); } catch (AppValidationException $e) { … $success = self::FAILURE; continue; } }` |
| **deep** With `--no-validate` the mismatch is undetected: the meta name is the identity, the folder only the stored `path` | `Framework/App/Lifecycle/AppLoader.php:69-77`, `Framework/App/Lifecycle/AppManager.php:337` | `$manifests[$manifest->getMetadata()->getName()] = $manifest;` / `$metadata['path'] = str_replace($this->projectDir . '/', '', $manifest->getPath());` |
| **deep** `validateRequiredElements` only tests `isset()`, so `<author/>` passes and the app installs with an empty author | `Framework/App/Manifest/Xml/XmlElement.php:94-101` | `if (!isset($data[$field])) { throw AppException::invalidArgument($field . ' must not be empty'); }` |
| **deep** An empty element is "set" because the parser assigns `nodeValue` (`''`); XSD types are plain `xs:string` | `Framework/App/Manifest/XmlParserUtils.php:74-89` | `$values[self::kebabCaseToCamelCase($child->tagName)] = $child->nodeValue;` |
| **deep** A genuinely absent `<author>` becomes `AppXmlParsingException`, which `AppLoader` only logs — `app:refresh` reports "Nothing to install, update or delete."; only `app:validate` surfaces it | `Framework/App/Manifest/Manifest.php:291-293,320-322` | `} catch (\Exception $e) { throw AppException::xmlParsingException($xmlFile, $e->getMessage()); }` |
| **deep** No cache invalidation on install/activate inside `Framework/App`; `AppManager::activate` only resets the `ActiveAppsLoader` memo | `Framework/App/Lifecycle/AppManager.php:239-254` | `$this->activeAppsLoader->reset();` |
| **deep** The one indirect hop: `SalesChannelFileCacheInvalidator` invalidates a single template-discovery tag on `AppActivatedEvent`/`Deactivated`/`Updated` (not `Installed`) | `System/SalesChannel/File/SalesChannelFileCacheInvalidator.php:44-57,78-83` | `AppActivatedEvent::class => 'invalidateDiscovery',` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The `<setup>` block is required in every manifest | absent | `setup` carries `minOccurs="0"`; only `<meta>` is unconditional (`manifest-3.0.xsd:15, :186-204`) |
| `<compatibility>` and `<description>` are required meta fields | absent | Neither is in `Metadata::REQUIRED_FIELDS`; `description` is `minOccurs="0"` (`Metadata.php:18-25`) |
| `app:install` can be called without an app name to install everything | absent | `InputArgument::REQUIRED \| IS_ARRAY`; only `app:refresh` makes it OPTIONAL (`InstallAppCommand.php:108`) |
| `app:activate` accepts several app names at once | absent | plain REQUIRED argument without `IS_ARRAY` (`AbstractAppActivationCommand.php:53`) |
| The name/folder check exists only in `app:validate`, not on the install path | **refuted** | `ManifestValidator` is injected into `InstallAppCommand` and `RefreshAppCommand` too (`Framework/DependencyInjection/app.php:717-730, 762-767`) |
| `app:install` / `app:activate` invalidate caches | absent | grep for `CacheInvalidator` over `Framework/App` returns no matches |
| An empty `<author/>` or `<copyright/>` is rejected | absent | `isset()`-only check, plain `xs:string` types, no validator inspects the content (`manifest-3.0.xsd:159-168`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| `AppNameValidator` enforces folder == meta name, case-insensitively, and emits `AppNameError` otherwise | `shopware/shopware@trunk tests/unit/Core/Framework/App/Validation/AppNameValidatorTest.php:32-52` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `app:install --activate` left storefront template overrides ineffective; maintainer stated the CLI deliberately does not clear caches (the Admin UI does) and `cache:clear:http` / `cache:clear:all` are needed | 6.6.10.4 | closed | https://github.com/shopware/shopware/issues/9539 |
| Documented `<compatibility>~6.5.0</compatibility>` rejected by `app:validate` as "not expected" — documented element did not match the shipped XSD | 6.6.0.0 | closed | https://github.com/shopware/shopware/issues/4522 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact 6.7 command names/signatures for the app lifecycle | code lane | `app:install` (REQUIRED\|IS_ARRAY, `-f`, `-a`, `--no-validate`), `app:activate` (one name), `app:refresh` (OPTIONAL\|IS_ARRAY), `app:validate` (OPTIONAL) — folded into fact 3 |
| Do `app:install` / `app:activate` clear caches in 6.7? | deep pass | No — no `CacheInvalidator` anywhere in `Framework/App`; only one template-discovery tag via `SalesChannelFileCacheInvalidator` on activate. The maintainer's 6.6 statement still holds for 6.7.13.0 |
| Which manifest elements are required for a minimal app in 6.7 | code lane | `<meta>` only, with `label`/`name`/`author`/`copyright`/`license`/`version` — fact 1 |
| Which directory is scanned for local apps | code lane | `custom/apps`, depth `<= 1` — fact 1 |
| Must `<meta><name>` equal the folder name? | deep pass | Yes — `AppNameValidator` on the install/refresh/validate paths — fact 2 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Minimal layout is `custom/apps/<AppName>/manifest.xml` | `└── custom ├── apps │ └── MyExampleApp │ └── manifest.xml` | app-base-guide.md | yes — `AppLoader.php:62-69`, `Kernel.php:285` |
| Folder name and `<meta><name>` must match | "The folder name and the `<meta><name>` in `manifest.xml` must match." | app-base-guide.md | yes — `AppNameValidator.php:17-28` (deep pass) |
| `<author>` and `<copyright>` are required, and `app:refresh` fails if they are missing or empty | "`<author>` and `<copyright>` are required. If they are missing or empty, `bin/console app:refresh` fails." | app-base-guide.md | partly — required only in the `isset()` sense; empty passes, and a missing one makes `app:refresh` report "Nothing to install…" rather than fail |
| The meta block is the only required manifest section | "## Meta information (required)" / "The following configurations are all optional." | manifest-reference.md | yes — `manifest-3.0.xsd:5-20` |
| Refresh with `bin/console app:refresh`, install with `app:install --activate <Name>` using the technical name | "Install the app using its technical name (`<meta><name>`), not a filesystem path" | app-base-guide.md | yes — `RefreshAppCommand.php:26-56`, `InstallAppCommand.php:106-124` |
| Without `--activate` the app installs inactive; activate via Admin or `app:activate` | "Without the `--activate` flag, the app is installed inactive." | app-base-guide.md | yes — `InstallAppCommand.php:86-91`, `ActivateAppCommand.php:14-34` |
| Apps are validated during installation; `--no-validate` skips it | "To skip validation only while debugging, use `--no-validate` with `app:install`." | app-base-guide.md | yes — `InstallAppCommand.php:76-93` |
| A cache clear may be needed after activating an app | "After activating an app, you might need to clear the cache for the changes to take effect" | app-base-guide.md | yes — no invalidation in `Framework/App`; only one discovery tag on activate |
| `<setup>` may be omitted when no communication is needed | "Can be omitted if no communication between Shopware and your app is needed." | manifest-reference.md | yes — `setup` is `minOccurs="0"` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "`<author>` and `<copyright>` … If they are missing or **empty**, `bin/console app:refresh` fails." | `validateRequiredElements` only tests `isset()`; an empty `<author/>` parses to `''`, is "set", and the app installs with an empty author. When genuinely absent, the exception is swallowed by `AppLoader` and `app:refresh` reports "Nothing to install, update or delete." — `app:validate` is the command that surfaces it. | `Framework/App/Manifest/Xml/XmlElement.php:94-101`; `Framework/App/Manifest/Manifest.php:291-293,320-322` |
| The manifest reference's `meta.xml` snippet ships `<compatibility>~6.5.0</compatibility>` as part of the meta block | Neither `compatibility` nor `description` is in `Metadata::REQUIRED_FIELDS`; 6.7 validates against `manifest-3.0.xsd`, not 2.0 | `Framework/App/Manifest/Xml/Meta/Metadata.php:18-25`; `Framework/App/Manifest/Manifest.php:33` |
| The docs present the name/folder match as a convention stated in prose | It is an enforced validator on the install and refresh paths, not only in `app:validate` — and the check is case-insensitive | `Framework/App/Validation/AppNameValidator.php:17-28`; `Framework/DependencyInjection/app.php:220-229` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The app lives in `custom/apps/<Name>/manifest.xml`, and the folder name must match `<meta><name>`. | split and expanded into facts 1 and 2 | Code confirms both halves but the manifest's own minimum content (the `<meta>` block and its six required children, `manifest-3.0.xsd`) was missing, and the name/folder rule needed its enforcing validator and its `--no-validate` escape hatch named |
| Register it with `bin/console app:refresh`, then `bin/console app:install --activate <Name>` using the technical name, not a filesystem path; without `--activate` the app installs inactive. | kept as fact 3, tagged | Confirmed by `InstallAppCommand.php:106-124,86-91`; added that `app:activate` takes exactly one name |
| Missing or empty `<author>` / `<copyright>` in the `<meta>` block makes `bin/console app:refresh` fail. | removed | Code disproves both halves: an empty element passes `isset()`-based validation and installs, and a missing element is swallowed as a logged `AppXmlParsingException`, so `app:refresh` reports "Nothing to install, update or delete." instead of failing |
