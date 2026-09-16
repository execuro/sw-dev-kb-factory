# `dev-41` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-41` · `dev` · `Hosting & ops` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** `composer update` to Shopware 6.7 aborts on a platform requirement and my admin build then fails too — which PHP, database and Node versions does 6.7 actually require, and how do I check the machine I am on against them before I retry?

**Expected answer — every fact an answer must contain:**

1. The PHP requirement Composer enforces is the enumerated constraint `"php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0"` declared by `shopware/core` (6.7.13.0) and repeated by `shopware/administration` and `shopware/storefront` — a bounded list, not an open-ended "8.2 or newer", so a PHP outside it aborts the update; the required PHP extensions are Composer platform packages too (`ctype, curl, dom, fileinfo, filter, gd, intl, json, libxml, mbstring, openssl, pdo, pdo_mysql, session, simplexml, sodium, xml, xmlreader, zip, zlib`) and any missing one is an equally valid abort, with `memory_limit >= 512M` and `max_execution_time >= 30` required on top.  `[code: composer.json:51-72 · Installer/Requirements/ConfigurationRequirementsValidator.php:17-19]`
2. The database requirement is MySQL >= 8.0.22 **or** MariaDB >= 10.11, enforced by `DatabaseConnectionFactory::checkVersion()` — which runs only when a connection is built through `createConnection()` (`system:install`, the web installer), never on application boot and never during `composer update`, so a green `composer update` proves nothing about the database. MySQL Innovation releases are outside the support policy. `[code: Maintenance/System/Service/DatabaseConnectionFactory.php:26-56]` `[docs-only: Innovation releases]`
3. Node is a **build-time** requirement of the asset builds only, and the two bundles differ: the Administration declares `node ^20.0.0 || ^21 || ^22 || ^23 || ^24 || ^25` with `npm >= 10`, the Storefront the stricter `node ^20.19.0 || >=22.12.0` with `npm >= 11.8.0`; nothing enforces it (no `.npmrc`, no `engine-strict`), so a wrong Node produces an `EBADENGINE` warning and then a build error rather than an install failure. To check the machine from the CLI the working tool is Composer's own `composer check-platform-reqs` (composer/composer is a core requirement, linked at `vendor/bin/composer`); `bin/console system:check` does **not** answer this — it is an application health check (locales, sales channels, listing/detail, administration) and reports no PHP, database or Node version.  `[code: administration/Resources/app/administration/package.json:223-226 · storefront/Resources/app/storefront/package.json:108-111 · Framework/SystemCheck/Command/SystemCheckCommand.php:20]`

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/
<!-- expected:end -->

## Evidence — code (decisive)

Source version read: `6.7.13.0`.

| fact | citation | excerpt |
| --- | --- | --- |
| PHP constraint is an enumerated tilde list; 8.1 and below are rejected by Composer | `vendor/shopware/core/composer.json:51` | `"php": "~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 \|\| ~8.5.0",` |
| The same constraint is in the lock for v6.7.13.0 and repeated by administration and storefront | `composer.lock:5969`; `vendor/shopware/administration/composer.json:35`; `vendor/shopware/storefront/composer.json:35` | `"php": "~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 \|\| ~8.5.0",` |
| Required extensions are platform packages, each able to abort `composer update` | `vendor/shopware/core/composer.json:52-72` | `"ext-ctype": "*", "ext-curl": "*", "ext-dom": "*", "ext-fileinfo": "*", "ext-filter": "*", "ext-gd": "*", "ext-intl": "*", "ext-json": "*", "ext-libxml": "*", "ext-mbstring": "*", "ext-openssl": "*", "ext-pdo": "*", "ext-pdo_mysql": "*", "ext-session": "*", "ext-simplexml": "*", "ext-sodium": "*", "ext-xml": "*", "ext-xmlreader": "*", "ext-zip": "*", "ext-zlib": "*", "composer-runtime-api": "^2.1",` |
| Database floor enforced in code: MySQL 8.0.22 / MariaDB 10.11, branching on `SELECT VERSION()` containing `mariadb` | `Maintenance/System/Service/DatabaseConnectionFactory.php:35-56` | `$mysqlRequiredVersion = '8.0.22'; $mariaDBRequiredVersion = '10.11';` |
| The failure message names both thresholds | `Maintenance/MaintenanceException.php:105` | `'Your database server is running {{ dbKind }} {{ actualVersion }}, but Shopware 6 requires at least MySQL {{ mysqlRequiredVersion }} OR MariaDB {{ mariaDBRequiredVersion }}',` |
| The check fires only inside `createConnection()` (system:install, web installer), so it is not a boot-time or update-time gate | `Maintenance/System/Service/DatabaseConnectionFactory.php:26-33` | `$connection = DriverManager::getConnection(...); self::checkVersion($connection);` |
| Administration build engines | `vendor/shopware/administration/Resources/app/administration/package.json:223-226` | `"node": "^20.0.0 \|\| ^21.0.0 \|\| ^22.0.0 \|\| ^23.0.0 \|\| ^24.0.0 \|\| ^25.0.0", "npm": ">=10.0.0"` |
| Storefront build engines are stricter | `vendor/shopware/storefront/Resources/app/storefront/package.json:108-111` | `"node": "^20.19.0 \|\| >=22.12.0", "npm": ">=11.8.0"` |
| PHP ini requirements checked by the installer | `Installer/Requirements/ConfigurationRequirementsValidator.php:17-19,34-65` | `private const MAX_EXECUTION_TIME_REQUIREMENT = 30; private const MEMORY_LIMIT_REQUIREMENT = '512M'; private const OPCACHE_MEMORY_RECOMMENDATION = '256M';` |
| The installer derives PHP/extension requirements from the installed core package — no second hardcoded list | `Installer/Requirements/EnvironmentRequirementsValidator.php:26-39` | `$platform = ...->findPackage('shopware/core', '*'); foreach ($platform->getRequires() as $require => $link) { if (!PlatformRepository::isPlatformPackage($require)) { continue; }` |
| Those validators are wired only into the web installer's HTTP route — no CLI entry point | `Installer/DependencyInjection/services.xml:148-166,194`; `Installer/Controller/RequirementsController.php:25` | `<tag name="shopware.installer.requirement"/>` … `#[Route(path: '/installer/requirements', ...)]` |
| The CLI preflight that does exist is Composer's `check-platform-reqs`, present because core requires composer/composer | `vendor/composer/composer/src/Composer/Command/CheckPlatformReqsCommand.php:29-30`; `vendor/shopware/core/composer.json:75` | `$this->setName('check-platform-reqs')->setDescription('Check that platform requirements are satisfied')` … `"composer/composer": "^2.9.3",` |
| No `config.platform.php` masks the running PHP, so Composer evaluates the actual binary | `composer.lock:14067-14070`; `composer.json:47-55` | `"platform": {"composer-runtime-api": "^2.0"}` ; config has only allow-plugins/optimize-autoloader/sort-packages |
| The admin build script asserts no Node engine itself | `bin/build-administration.sh:105,112` | `npm install --prefer-offline --omit=dev` … `npm run build` |
| `system:check` is an application health check, not an environment check | `Framework/SystemCheck/Command/SystemCheckCommand.php:20`; `System/Locale/SystemCheck/LocalesReadinessCheck.php`; `storefront/Framework/SystemCheck/SalesChannelsReadinessCheck.php`; `administration/Framework/SystemCheck/AdministrationReadinessCheck.php` | `#[AsCommand(name: 'system:check', description: 'Check the shopware application system health')]` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A Shopware console command verifies system requirements before an update | absent | the three `RequirementsValidatorInterface` implementations are all tagged `shopware.installer.requirement` and consumed only by the HTTP `RequirementsController` (`Installer/DependencyInjection/services.xml:194`) |
| A minimum PHP version is asserted in PHP code (a `PHP_VERSION_ID` guard) | absent | no `PHP_VERSION_ID`/`phpversion()` match across `Installer`, `Kernel.php`, `Framework/Adapter`; the constraint lives only in Composer metadata |
| npm hard-fails on a wrong Node version because of `engines` | not enforced in this tree | neither app directory has an `.npmrc` and neither package.json sets `engine-strict`, so `engines` yields an `EBADENGINE` warning; the wrong Node surfaces later as a build error |
| The database version is checked on normal application boot | absent | `checkVersion()` runs only in `DatabaseConnectionFactory::createConnection()`, used by `SystemInstallCommand.php:36` and `Installer/Controller/DatabaseConfigurationController.php:29` |
| A minimum Elasticsearch/OpenSearch, Redis/Valkey or web-server version is asserted in the requirement path | not found | the installer validators cover only platform packages, filesystem permissions and PHP ini; the MySQL/MariaDB gate is the only other hard version check |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| How the installed tree records the resolved requirement set — the machine-readable source `check-platform-reqs` reads | `composer.lock:5911-5969` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `composer update` aborts with "shopware/administration v6.7.5.1 requires php ~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 -> your php version (8.5.1) does not satisfy that requirement"; maintainer replies PHP 8.5 support was added but not yet released | 6.7.5.1 | closed | https://github.com/shopware/shopware/issues/14209 |
| A 6.6 patch adding PHP 8.5 support silently downgrades `sabberworm/php-css-parser` through the dompdf chain | 6.6.10.11–6.6.10.13 | closed | https://github.com/shopware/shopware/issues/14922 |
| A 6.7.8.2 → 6.7.12.1 upgrade fails on MySQL 8.4 with SQLSTATE 1553 in a migration while a fresh install on the same MySQL succeeds; attributed to `restrict_fk_on_non_standard_key` | 6.7.12.1, MySQL 8.4.10 | closed | https://github.com/shopware/shopware/issues/18582 |
| Same error class on MySQL 9.4.0 upgrading to 6.7.3.0; the same migration is fine on MariaDB 11.2.2 | 6.7.3.0, MySQL 9.4.0 | closed | https://github.com/shopware/shopware/issues/13039 |
| After 6.6.10.x → 6.7.0.x the admin build fails with a sass ENOENT; cause is the stale 6.6 `bin/build-administration.sh`, fixed by `composer recipes:update` — reporter was on Node 21.7.3 | 6.7.0.0 / 6.7.0.1 | closed | https://github.com/shopware/shopware/issues/10754 |
| Default Node for 6.7 CI/devenv raised from LTS 20 to LTS 22 | 6.7.0.0 RC4 | closed | https://github.com/shopware/shopware/issues/9291 |
| Proposal to extend `system:check` into a deployment readiness check was closed as not planned | 6.7 trunk | closed | https://github.com/shopware/shopware/issues/17130 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact `php` platform constraint in this checkout | code | settled — `vendor/shopware/core/composer.json:51`; the constraint is an enumerated list, which is why 8.5 aborted on 6.7.5.1 and is accepted at 6.7.13.0. The fact quotes the constraint as of 6.7.13.0 rather than a "8.2+" range |
| Is there a `config.platform.php` masking the real PHP? | code | settled — no `platform` key in the root config; the lock platform block holds only composer-runtime-api |
| Which MySQL/MariaDB versions are actually enforced | code | settled — `DatabaseConnectionFactory.php:35-56`: 8.0.22 / 10.11 |
| Does `system:check` report PHP or database version? | code | settled — no; it is a health check. Fact 3 now says so explicitly instead of recommending it |
| Is a CLI requirements checker reachable in a Composer install? | code | settled — none in Shopware; `composer check-platform-reqs` is the working route |
| Declared Node/npm versions, and do admin and storefront agree? | code | settled — they do not; storefront is stricter (`package.json:223-226` vs `:108-111`) |
| Is the admin build failure after an upgrade a Node problem? | code + community | not a fact either way: the build script asserts no engine (`bin/build-administration.sh:105,112`), and the one reproduced community case was stale recipe scaffolding, not Node. The facts therefore claim Node only as a build-time requirement and make no claim about the cause of a given build failure |
| Does `MigrationRuntime` retry on MySQL error 1553? | not settled | not traced. It does not bear on the version floors the facts state — a migration failure above the floor is a separate case, not a correction to fact 2 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| PHP 8.2+ minimum, 8.4 recommended; `memory_limit ≥ 512M`, `max_execution_time ≥ 30s`; extension list `ctype, curl, dom, fileinfo, gd, iconv, intl, mbstring, openssl, pcre, pdo_mysql, phar, simplexml, xml, xmlreader, zip, zlib` | the hosting requirement table row | `guides/hosting/index.md:21` | ini values yes (`ConfigurationRequirementsValidator.php:17-19`); the "8.2+" range and the extension list **diverge** from `composer.json:51-72` |
| MariaDB ≥ 10.11.6 or MySQL ≥ 8.0.22, Innovation releases unsupported, `max_allowed_packet ≥ 32M` | "MariaDB ≥ 10.11.6 or MySQL ≥ 8.0.22 (Innovation releases are not supported)" | `guides/hosting/index.md:22` | MySQL floor yes; **MariaDB floor diverges** (code: 10.11); `max_allowed_packet` not found in the requirement code path; "Innovation releases" is support policy, admitted as `[docs-only]` |
| Node 20.0.0+ minimum, Node 24 / npm 10 recommended, marked Required | the Node.js / npm table row | `guides/hosting/index.md:23` | partly — the floor matches the Administration's `^20.0.0`, but the docs state no storefront-specific floor and code shows one (`^20.19.0 \|\| >=22.12.0`) |
| OpenSearch/Elasticsearch and Redis/Valkey are optional; OpenSearch 3.1 support arrived in 6.7.3.1 | "Support for OpenSearch 3.1 was added in shopware v6.7.3.1" | `guides/hosting/index.md:24` | not confirmed — no such version gate exists in the requirement code path |
| Check the machine with `php -v`, `php -m`, `php -i \| grep memory_limit`, `composer -V`, `node -v`, `npm -v` | the command list | `guides/hosting/index.md:41-46` | not code-expressible; code shows the authoritative check is `composer check-platform-reqs`, which compares those values against the lock automatically |
| CLI and FPM often use different `php.ini` files, so the CLI version may not be the web one | "Make sure to use the correct PHP binary" | `guides/hosting/index.md:36-38` | not code-expressible; consistent with Composer evaluating the running binary (`composer.json:47-55` has no platform pin) |
| Homebrew PHP on macOS may omit `intl` | the macOS note | `guides/hosting/index.md:21` | `ext-intl` is indeed a hard requirement (`composer.json:52-72`) |
| Full Shopware CLI validation needs PHP 8.2+, Node 20+, Composer and npm | "the host environment must provide PHP 8.2 or newer, Node.js 20 or newer" | `products/tools/cli/validation.md:23` | not checkable from this tree (external tool) |
| The System Requirements page covers only the physical machine | "For the recommended application stack and supported versions, see the hosting guide." | `guides/installation/system-requirements.md:13` | n/a |
| The Docker upgrade example targets 6.7 on PHP 8.5, with 8.3 as an intermediate | "going from Shopware 6.6 on PHP 8.2 to Shopware 6.7 on PHP 8.5" | `guides/hosting/installation-updates/docker.md:342` | 8.5 is inside the 6.7.13.0 constraint (`composer.json:51`), but community shows it was not at 6.7.5.1 |
| Official dev images pair PHP 8.3/8.4 with Node 22/24 | "`ghcr.io/shopware/docker-dev:php8.4-node24-caddy`" | `guides/installation/advanced-options.md:55` | consistent with the engines fields; not a requirement statement |

Docs-only context (intent/business, code cannot express):

- MySQL Innovation releases are outside the support policy even when their version number exceeds the floor (`guides/hosting/index.md:22`).
- Move PHP and Shopware in separate steps so a failure is diagnosable and reversible (`docker.md:330`).
- The two requirement pages split hardware/OS from application stack, which is why a reader hitting a platform abort is sent between them (`system-requirements.md:49`).

Docs coverage was reported as **partial**: no page states requirements per Shopware release, and no page explains or diagnoses a Composer platform-requirement abort or a Node-version build failure. The facts above are therefore code-derived, not doc-derived.

Internal doc inconsistencies reported by the docs lane:

- `docker.md:346` sends the reader to `system-requirements.md` for the required PHP version; that page states no PHP version at all.
- The hosting table says "8.2+ / 8.4 recommended" while `docker.md:342` uses 8.5 and `validation.md:75` lists profiles up to 8.6.
- `docker.md:332` says every major supports exactly two PHP versions; the hosting table advertises an open-ended range.
- `docker.md:346` recommends `shopware-cli project upgrade-check`, declared outdated by `performing-updates.md:35`.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| PHP "8.2+" — an open-ended minimum | an enumerated list `~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 \|\| ~8.5.0`: a PHP newer than the listed majors aborts the update just as an older one does | `vendor/shopware/core/composer.json:51` |
| Required extensions include `iconv`, `pcre`, `phar` and omit `filter`, `json`, `libxml`, `pdo`, `session`, `sodium` | the enforced platform packages are ctype, curl, dom, fileinfo, filter, gd, intl, json, libxml, mbstring, openssl, pdo, pdo_mysql, session, simplexml, sodium, xml, xmlreader, zip, zlib — `iconv`, `pcre` and `phar` are not required by core | `vendor/shopware/core/composer.json:52-72` |
| MariaDB ≥ 10.11.6 | the enforced threshold is `10.11` | `Maintenance/System/Service/DatabaseConnectionFactory.php:35-40` |
| Node 20.0.0+ as one Required row | two different engine ranges: Administration `^20.0.0 \|\| … \|\| ^25.0.0` / npm ≥ 10, Storefront `^20.19.0 \|\| >=22.12.0` / npm ≥ 11.8.0 | `administration/.../package.json:223-226`; `storefront/.../package.json:108-111` |
| `max_allowed_packet ≥ 32M` is a database requirement | no such check exists in the requirement code path; the only database gate is the version check | `Installer/Requirements/` (three validators); `DatabaseConnectionFactory.php:35-56` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Names the minimum PHP version the page states (2026-09-06: 8.2+, 8.4 recommended) as the requirement Composer is enforcing, and distinguishes it from the recommended one; names the PHP settings and extensions the page requires (`memory_limit >= 512M`, `max_execution_time >= 30s`, `intl`, `pdo_mysql`, `gd`, `mbstring`, `zip`). | rewritten | "8.2+" misstates what Composer enforces: the constraint is the enumerated list `~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 \|\| ~8.5.0` (`composer.json:51`), under which a too-new PHP aborts too. The recommended-version distinction is a docs artefact with no code counterpart and was dropped; the ini values are kept (code-confirmed) and the extension list replaced with the enforced one. |
| Names the minimum database versions as a separate requirement Composer does **not** check (2026-09-06: MariaDB >= 10.11.6 or MySQL >= 8.0.22, Innovation releases unsupported, `max_allowed_packet >= 32M`) — so a green `composer update` does not mean the stack is ready. | rewritten | The substance holds and is now code-cited, but the MariaDB floor is `10.11`, not `10.11.6` (`DatabaseConnectionFactory.php:35-40`), and `max_allowed_packet >= 32M` appears nowhere in the requirement code path, so it was removed. "Composer does not check it" is upgraded from assertion to citation: the check runs only inside `createConnection()`. |
| Names Node.js as a **build-time** requirement for the administration/storefront assets (2026-09-06: 20.0.0+), and names at least one way to check the running environment rather than only quoting numbers — `bin/console system:check`, and/or `composer why-not shopware/core <version>` to see which package blocks the update. | rewritten | `bin/console system:check` is an application health check and reports no PHP, database or Node version (`Framework/SystemCheck/Command/SystemCheckCommand.php:20`), so recommending it answers the query wrongly; it is replaced by `composer check-platform-reqs`, which is present in the tree. `composer why-not` was not cited by any lane and is dropped. "20.0.0+" is replaced by the two distinct engine ranges, since a Node that builds the Administration may not build the Storefront. |
| **Scoring note:** the version numbers below are the values the page carried on 2026-09-06 and are **informative, not normative** — the scorer grades an answer against the requirement page as it reads on the day of the run. An answer that reproduces the page's current numbers scores full Accuracy even when they have moved; what is scored is that the answer separates hard requirements from recommendations, covers runtime *and* build-time, and names a way to verify the machine instead of only listing numbers. | removed | A tolerance clause: it graded answers against a moving docs page and would award full accuracy to an answer reproducing doc numbers the code contradicts (PHP "8.2+", MariaDB 10.11.6, `system:check`). The facts are now pinned to shopware/core 6.7.13.0 and are checkable as written. |
