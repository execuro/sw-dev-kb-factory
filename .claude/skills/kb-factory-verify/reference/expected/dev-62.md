# `dev-62` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-62` · `dev` · `Config & CLI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** I changed a setting in `.env` on a deployed 6.7 shop but it still behaves the old way — what takes precedence between `.env`, `.env.local` and the real environment variables, and which settings does Shopware not read from `.env` at all?

**Expected answer — every fact an answer must contain:**

1. States the precedence, which is Symfony's: Shopware's entrypoints do not parse `.env` themselves — `public/index.php` and `bin/console` hand over to `symfony/runtime`, which calls `Dotenv::bootEnv()` with `overrideExistingVars = false`. A **real** environment variable (exported in the shell, `docker -e`, FPM `env[]`, systemd `Environment=`) therefore wins over every `.env` file; among the files the later one overrides the earlier, i.e. `.env.$APP_ENV.local` > `.env.$APP_ENV` > `.env.local` > `.env` (`.env.dist` only when `.env` is absent). And if a **`.env.local.php`** exists — written by `bin/console dotenv:dump` or `bin/console system:setup --dump-env` — `bootEnv()` populates from that file alone and does not read `.env`, `.env.local` or `.env.$APP_ENV` at all, which is the usual reason an edit to `.env` on a deployed shop has no effect. The fix there is to regenerate the dump or delete the file, not to clear the cache. `[code: vendor/symfony/dotenv/Dotenv.php:110-177,216-224]` `[code: vendor/symfony/runtime/SymfonyRuntime.php:128-134]` `[code: public/index.php:11-15]`
2. Does **not** claim that a changed `.env` value needs `bin/console cache:clear` in `prod`: container `%env(...)%` placeholders (`APP_URL`, `APP_SECRET`, `MAILER_DSN`, `MESSENGER_TRANSPORT_DSN`, `SHOPWARE_HTTP_CACHE_ENABLED`, …) are resolved by the dumped container **at runtime**, and core ships a PHPStan rule forbidding env reads inside compiler passes. The one exception is feature flags: `FeatureFlagCompilerPass` removes service definitions for inactive flags, so a changed `FEATURE_*` / `FEATURE_ALL` really is baked into the compiled container and needs a rebuild. Changing `APP_ENV`, `APP_CACHE_DIR` or `SHOPWARE_CACHE_ID` does not invalidate the cache either — it relocates the shop to a different, cold cache directory. `[code: Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:28-32]` `[code: DevOps/StaticAnalyze/PHPStan/Rules/NoEnvironmentHelperInsideCompilerPassRule.php:62-65]` `[code: Kernel.php:167-174,292-306]`
3. States that shop-facing configuration is **not** in `.env` at all: shop name/basic information, plugin settings and theme config are `system_config` rows in the database, scoped per sales channel and read through `SystemConfigService`, which has no env lookup whatsoever — editing `.env` never changes them (they are pinned, if at all, through the `shopware.system_config` YAML node, not through an env var). The mail transport is the trap in between: `MAILER_DSN` exists, but as soon as an administrator has saved Settings › Mail, `core.mailerSettings.emailAgent` is non-empty and `MailerTransportLoader::fromString()` discards the env DSN and rebuilds the transport from `core.mailerSettings.*` — for the `main` transport only. `[code: System/SystemConfig/SystemConfigService.php:58-64]` `[code: Content/Mail/Transport/MailerTransportLoader.php:57-72]`

**Trap:** the deployed-shop symptom points at `.env.local.php` / a real environment variable / the database, **not** at a stale compiled container. An answer whose remedy is "run `cache:clear`" fails Accuracy, as does one that presents every Shopware setting as an env var.

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Shopware's entrypoints do not load `.env` themselves; `public/index.php` and `bin/console` require `vendor/autoload_runtime.php` and only set `APP_RUNTIME_OPTIONS['disable_dotenv']` when no `.env`, `.env.dist` or `.env.local.php` exists | `public/index.php:11-15` | `if (!file_exists(__DIR__ . '/../.env') && !file_exists(__DIR__ . '/../.env.dist') && !file_exists(__DIR__ . '/../.env.local.php')) { $_SERVER['APP_RUNTIME_OPTIONS']['disable_dotenv'] = true; }` |
| SymfonyRuntime calls `Dotenv::bootEnv()` with `overrideExistingVars = $options['dotenv_overload'] ?? false`, i.e. false unless the project opts in | `vendor/symfony/runtime/SymfonyRuntime.php:128-134` | `$overrideExistingVars = $options['dotenv_overload'] ?? false;` |
| Real environment variables win over every `.env` file: `populate()` skips a name already in `$_ENV` that was not itself set by a previous dotenv load | `vendor/symfony/dotenv/Dotenv.php:216-224` | `if (!isset($loadedVars[$name]) && !$overrideExistingVars && isset($_ENV[$name])) { continue; }` |
| File order is `.env` (or `.env.dist`), then `.env.local`, then `.env.$APP_ENV`, then `.env.$APP_ENV.local`; between dotenv files the later file overrides the earlier | `vendor/symfony/dotenv/Dotenv.php:110-156` | `if (!\in_array($env, $testEnvs, true) && is_file($p = "$path.local")) { $this->doLoad($overrideExistingVars, [$p]); }` |
| If `.env.local.php` exists, `bootEnv` populates from it and does **not** read `.env` / `.env.local` / `.env.$env` at all (unless its `APP_ENV` conflicts with the real environment) | `vendor/symfony/dotenv/Dotenv.php:165-177` | `$p = $path.'.local.php'; $env = is_file($p) ? include $p : null; ... $this->populate($env, $overrideExistingVars);` |
| `system:setup --dump-env` is what writes that file: `SystemSetupCommand` takes `DotenvDumpCommand` as a dependency and re-runs it after writing `.env`; the deployment helper only *reads* `.env.local.php` | `Maintenance/System/Command/SystemSetupCommand.php:40-42,274-291`; `vendor/shopware/deployment-helper/src/Services/DotenvLoader.php:18-25` | `private readonly DotenvDumpCommand $dumpEnvCommand … (new Dotenv())->bootEnv($this->projectDir . '/.env');` |
| `APP_ENV` is resolved from the real environment first; `.env.local` is skipped when the resolved env is in `testEnvs`; `APP_ENV=local` returns before `.env.$env` files | `vendor/symfony/dotenv/Dotenv.php:124-140` | `if ('local' === $env) { return; }` |
| Shopware reads env vars through `EnvironmentHelper::getVariable()`, which looks only at `$_SERVER` then `$_ENV` — never `getenv()` | `DevOps/Environment/EnvironmentHelper.php:22-27` | `$value = $_SERVER[$key] ?? $_ENV[$key] ?? null;` |
| Container `%env(...)%` placeholders resolve through `EnvVarProcessor`: `$_ENV` first, then `$_SERVER`, then `getenv()` — a different precedence from `EnvironmentHelper` | `vendor/symfony/dependency-injection/EnvVarProcessor.php:170-171` | `($env = $_ENV[$name] ?? ... ($_SERVER[$name] ?? null)) ... $env ??= getenv($name)` |
| Only feature flags are read at container-compile time: `FeatureFlagCompilerPass` calls `Feature::isActive()` and removes service definitions, baking `FEATURE_*` into the compiled container | `Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:28-32` | `if (Feature::isActive($tag['flag'])) { continue; } $container->removeDefinition($serviceId);` |
| Core codifies "env is runtime-only" with a PHPStan rule that fails the build when `EnvironmentHelper` is called from a compiler pass | `DevOps/StaticAnalyze/PHPStan/Rules/NoEnvironmentHelperInsideCompilerPassRule.php:62-65` | `RuleErrorBuilder::message('Do not use EnvironmentHelper inside compiler passes.')` |
| `Kernel::getCacheDir()` is `APP_CACHE_DIR` + `APP_ENV` + a hash of `SHOPWARE_CACHE_ID`, revision and plugin map — changing them relocates to a cold container dir rather than invalidating the current one | `Kernel.php:167-174,292-306` | `return \sprintf('%s/%s_h%s', $this->cacheRootDir, $this->getEnvironment(), $this->getCacheHash());` |
| `MailerTransportLoader::fromString()` reads `core.mailerSettings.emailAgent` at runtime and discards the env DSN when it is non-empty; `fromStrings()` applies the override to the transport named `main` only | `Content/Mail/Transport/MailerTransportLoader.php:57-72` | `$transportConfig = trim($this->configService->getString('core.mailerSettings.emailAgent')); if ($transportConfig === '') { return $this->createTransportUsingDSN($dsn); }` |
| `MAILER_DSN` is declared with a `null://null` default and consumed as `framework.mailer.dsn`; the override pass is registered from the Content bundle. Out of the box the override is inert — `mailerSettings.xml` gives `emailAgent` no `defaultValue` | `Framework/Resources/config/packages/framework.yaml:6,37`; `Content/Content.php:60` | `env(MAILER_DSN): 'null://null' … dsn: '%env(MAILER_DSN)%' … addCompilerPass(new MailerConfigurationCompilerPass(), TYPE_BEFORE_OPTIMIZATION, 0)` |
| `SHOPWARE_HTTP_CACHE_ENABLED`, `MESSENGER_TRANSPORT_DSN`, `APP_URL`, `APP_SECRET` are all read in 6.7 as `%env()%` placeholders (`APP_URL`/`APP_SECRET` also via `EnvironmentHelper` at runtime) | `Framework/DependencyInjection/services.xml:37-38`; `cache.xml:174-177`; `Framework/Resources/config/packages/framework.yaml:3,25,68`; `shopware.yaml:3-5`; `api.xml:261` | `<parameter key="shopware.http.cache.enabled">%env(default:shopware_http_cache_enabled_default:SHOPWARE_HTTP_CACHE_ENABLED)%</parameter> … secret: "%env(APP_SECRET)%"` |
| The installer writes its answers to `.env.local`, not `.env` | `Installer/Configuration/EnvConfigWriter.php:80-93,124` | `file_put_contents($this->projectDir . '/.env.local', implode("\n", $newEnv));` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Administration-configurable settings (`system_config`) can be changed via `.env` | absent | `SystemConfigService::get()` resolves purely through `AbstractSystemConfigLoader`; no env lookup, no `EnvironmentHelper` call in the class (`System/SystemConfig/SystemConfigService.php:58-64`) |
| An env var can pin/lock a `system_config` value | present but YAML-only | Pinned through the `shopware.system_config` node fed into `SymfonySystemConfigService`; `ConfiguredSystemConfigLoader` overrides DB values and `setMultiple` throws `systemConfigKeyIsManagedBySystems` (`Framework/DependencyInjection/Configuration.php:1266-1271`; `System/SystemConfig/ConfiguredSystemConfigLoader.php:24-29`) |
| Most `shopware.yaml` settings have env-var equivalents | absent | Only `APP_URL`, `PRODUCT_ANALYTICS_GATEWAY_URL`, `REDIS_PREFIX`, `SHOPWARE_CDN_STRATEGY_DEFAULT`, `BLUE_GREEN_DEPLOYMENT`, `LOGGER_ENFORCE_THROW_EXCEPTION` are `%env()%`; `shopware.http_cache.reverse_proxy.*`, `shopware.cdn.url`, `shopware.sitemap.*` are literal YAML (`shopware.yaml:3-6,202,408,511,626`) |
| A compiler pass or bundle extension reads env vars, so any changed `.env` value needs `cache:clear` in prod | absent, except feature flags | Every `CompilerPassInterface` implementation in core/storefront/administration grepped for `EnvironmentHelper` / `getenv(` / `$_SERVER` / `$_ENV` / `Feature::isActive` yields only the prohibition rule itself and `FeatureFlagCompilerPass` |
| Shopware enforces a 32-character minimum on `APP_SECRET` (Kernel boot / compiler pass / system check) | absent in Shopware code | No length check exists; `JWTConfigurationFactory` passes the value straight to `InMemory::plainText`. The 256-bit floor is `lcobucci/jwt`'s `Hmac::sign()`, thrown when a token is signed, not at boot. Shopware's only number is the 136-char *generation* length (`SystemGenerateAppSecretCommand:22`) |
| `shopware/deployment-helper` dumps `.env.local.php` during deploy | absent | grep for `env.local.php`, `dotenv:dump`, `dump-env` over its `src/` returns one hit: the existence check in `DotenvLoader::load()` |
| Shopware reads env vars via `getenv()` | absent for Shopware's own helper | `EnvironmentHelper::getVariable`/`::hasVariable` use only `$_SERVER`/`$_ENV` (`DevOps/Environment/EnvironmentHelper.php:22-40`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The Administration mailer config overrides `MAILER_DSN` for the `main` transport only — `null://localhost:25` is ignored for `main` (becomes `EsmtpTransport`) but honoured for `fallback` (stays `NullTransport`) | `shopware/shopware@v6.7.13.0 tests/unit/Core/Content/Mail/Transport/MailerTransportLoaderTest.php` (`testLoadMultipleMailers`) |
| An empty `core.mailerSettings.emailAgent` means the env DSN wins | `shopware/shopware@v6.7.13.0 tests/unit/Core/Content/Mail/Transport/MailerTransportLoaderTest.php` (`testUseSymfonyTransportDefault`) |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Hosting KB and a developer notebook report that a generated `.env.local.php` silently wins over every other `.env` file, so edits to `.env`/`.env.local` have no effect until it is deleted or regenerated | 6.5+ | n/a | https://knowledge.maxcluster.de/en/shopware-6-using-.env.local.php |
| Report that command-line and `.env.local.php` values do not appear in `bin/console debug:dotenv`, so the effective source is not visible | unclear | n/a | https://notebook.vanwittlaer.de/hosting/how-to-trouble-shoot-and-evaluate-environment-variables |
| `.env.local` not respected by `system:setup` (historical) | 6.3.4.1 | closed | https://github.com/shopware/shopware/issues/1596 |
| `system:setup` only generated/checked `.env` after the production template moved to `.env.local` | 6.4.7.0 | closed | https://github.com/shopware/shopware/issues/2249 |
| Wrong/stale `APP_URL` in `.env` reported as the largest source of app breakage | 6.4.0.0+ | closed | https://github.com/shopware/shopware/issues/5434 |
| `bin/console debug:container --env-vars` aborts with "default value of an env() parameter must be a string or null" | 6.5.7.1 | closed | https://github.com/shopware/shopware/issues/3437 |
| 6.7 upgrade write-ups: `SQL_SET_DEFAULT_SESSION_VARIABLES` removed and without effect; custom JWT secrets dropped for `APP_SECRET`, which "now needs ≥32 characters" | 6.7 | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does the 6.7 bootstrap use `bootEnv()`, and do real env vars win? | code | Settled: `SymfonyRuntime` → `Dotenv::bootEnv()` with `overrideExistingVars=false`; real env vars win |
| Does a `.env.local.php` short-circuit `.env`/`.env.local`? | code | Settled: yes, `Dotenv.php:165-177` |
| Is `.env.local` skipped when `APP_ENV=test`? | code | Settled: yes, `testEnvs` default `['test']` |
| Does `EnvironmentHelper` read only `$_SERVER`/`$_ENV`? | code | Settled: yes |
| Which merchant settings are not env-backed? | code | Settled: `system_config` is DB/YAML only, no env path |
| Are any env values resolved at container-compile time (so `cache:clear` is required)? | deep code | Settled: only `FEATURE_*` via `FeatureFlagCompilerPass`; a PHPStan rule forbids the rest |
| Does 6.7 enforce a minimum `APP_SECRET` length? | deep code | Settled: not in Shopware — `lcobucci/jwt` throws `InvalidKeyProvided::tooShort` below 256 bits when a token is signed. Community number right, mechanism wrong |
| Is `MAILER_DSN` overridden by the Administration configuration? | deep code | Settled: yes, for the `main` transport, once `core.mailerSettings.emailAgent` is non-empty |
| Does the deployment helper alter dotenv precedence? | deep code | Settled: it only *reads* `.env.local.php`; the writer is `dotenv:dump` / `system:setup --dump-env` |
| Is `SQL_SET_DEFAULT_SESSION_VARIABLES` still read in 6.7? | — | Not examined by either code pass; not load-bearing for this query and absent from the facts |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Env vars live in `.env`, `.env.local`, the server/container environment or the platform — no ordering stated | "`.env`, `.env.local`, server/container environment, or deployment platform" | `guides/hosting/configurations/shopware/index.md:23` | partially — code supplies the ordering the docs omit |
| A `.env.local.php` is used in production instead of `.env` to skip parsing on every request | "Symfony recommends that a `.env.local.php` file is used in production instead of a `.env` file" | `guides/hosting/performance/performance-tweaks.md:224` | yes — `Dotenv.php:165-177` |
| `bin/console system:setup --dump-env` / `dotenv:dump {APP_ENV}` produce that file | "Since Shopware v6.4.15.0, you can dump the content of the `.env` file to a `.env.local.php` file" | `guides/hosting/performance/performance-tweaks.md:227` | yes — `SystemSetupCommand.php:40-42,274-291`; `DotenvDumpCommand` |
| `MAILER_DSN` is overwritten by the Administration configuration | "Mailer DSN (Admin Configuration overwrites this)" | `guides/hosting/configurations/shopware/environment-variables.md:38` | yes — `MailerTransportLoader.php:57-72`, `main` transport only |
| Static system configuration in `config/packages` overrides the database value and removes it from the Administration | "the value from `config/packages` wins and the setting can no longer be changed in the Administration" | `guides/hosting/configurations/shopware/index.md:28` | yes — `ConfiguredSystemConfigLoader.php:24-29`, `SystemConfigService.php:235-248` |
| The cache may have to be cleared before `.env` changes are processed | "clear your cache with `bin/console cache:clear` so the changes from your *.env* can be processed" | `guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md:157` | no — env placeholders are runtime-resolved; only `FEATURE_*` is compiled in |
| Since 6.6 `TRUSTED_PROXIES` is no longer read; `SYMFONY_TRUSTED_PROXIES` must be used | "Since Shopware 6.6, the `TRUSTED_PROXIES` environment variable is no longer taken into account out of the box." | `guides/hosting/infrastructure/reverse-http-cache.md:74` | not checked by either code pass |
| PaaS precedence: `.env` lowest, `application.yaml` above it, vault secrets above both | "a variable set in `application.yaml` overwrites the same variable from `.env`" | `products/paas/shopware/fundamentals/environment-variables.md:21` | n/a — PaaS-specific, outside the self-hosted question |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| No developer-docs page states the precedence between `.env`, `.env.local` and real process environment variables for a self-hosted shop | Precedence is fully determined: real env > `.env.$APP_ENV.local` > `.env.$APP_ENV` > `.env.local` > `.env`, and `.env.local.php` bypasses all files | `vendor/symfony/dotenv/Dotenv.php:110-177,216-224` |
| Elasticsearch setup page: clear the cache so `.env` changes "can be processed" | `%env()%` placeholders are resolved at runtime by the dumped container; core forbids env reads in compiler passes with a PHPStan rule. Only `FEATURE_*` requires a rebuild; `APP_CACHE_DIR`/`SHOPWARE_CACHE_ID`/`APP_ENV` relocate the cache dir instead of invalidating it | `FeatureFlagCompilerPass.php:28-32`; `NoEnvironmentHelperInsideCompilerPassRule.php:62-65`; `Kernel.php:167-174,292-306` |
| Docs recommend dumping to `.env.local.php` but never state the consequence for later `.env` edits | `bootEnv` does not read `.env`/`.env.local` at all when `.env.local.php` exists | `vendor/symfony/dotenv/Dotenv.php:165-177` |
| Docs are inconsistent about which file holds a setting (`caches.md:18` says `.env.local`, `performance-tweaks.md:20` says `.env` for the same key) | Both are loaded; `.env.local` overrides `.env` for the same key | `vendor/symfony/dotenv/Dotenv.php:110-156` |
| The env-var reference page presents itself as the complete list of variables configuring Shopware | Several env vars are consumed outside that config surface (`APP_CACHE_DIR`, `SHOPWARE_CACHE_ID`, `INSTANCE_ID`, `COMPOSER_PLUGIN_LOADER`) | `Kernel.php:78,182,190`; `Framework/Adapter/Kernel/KernelFactory.php:59` |
| Community write-ups: `APP_SECRET` "must now be at least 32 characters" in 6.7 | Shopware enforces nothing; the 256-bit floor is `lcobucci/jwt`'s and fires when a token is signed | `Framework/Api/OAuth/JWTConfigurationFactory.php:23-27`; `vendor/lcobucci/jwt/src/Signer/Hmac.php:15-21` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States the precedence as the page has it: a real environment variable set in the process/container wins over `.env.local`, which wins over `.env` — so a value edited in `.env` is ignored whenever the same key is exported by the environment (Docker, systemd, the hosting panel) or overridden in `.env.local`. | rewritten | Direction was right but the set was incomplete: the code shows `.env.$APP_ENV` / `.env.$APP_ENV.local` also sit above `.env.local`, and a `.env.local.php` bypasses every file — the actual cause of the symptom in the query |
| Names the values that genuinely live in the environment — `DATABASE_URL` (`mysql://user:password@host:port/dbname`), `APP_ENV`, `APP_SECRET`, `APP_URL`, `MAILER_DSN`, `MESSENGER_TRANSPORT_DSN`, `SHOPWARE_HTTP_CACHE_ENABLED` — and that in `prod` the container is compiled, so `bin/console cache:clear` is required before a changed value takes effect. | rewritten | The `cache:clear` clause is disproved: `%env()%` placeholders resolve at runtime and core's PHPStan rule forbids env reads in compiler passes; only `FEATURE_*` is baked in (`FeatureFlagCompilerPass.php:28-32`). `MAILER_DSN` also does not "genuinely live in the environment" — the Administration mailer settings discard it for the `main` transport (`MailerTransportLoader.php:57-72`) |
| An answer that presents everything as an env var fails Accuracy. | kept, moved | Retained as the case's **Trap** line together with the new `cache:clear` trap |

