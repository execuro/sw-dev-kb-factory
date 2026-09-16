# `dev-63` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-63` · `dev` · `Config & CLI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** I deployed a plugin update to a 6.7 staging shop and my new migration never ran — which `bin/console` command applies the pending migrations of that one plugin, and what do I have to pass to it?

**Expected answer — every fact an answer must contain:**

1. The command is `bin/console database:migrate <Identifier> --all` (the flag may also precede the identifier). The identifier is the plugin's **bundle name** — the plugin class short name, under which `Bundle::registerMigrationPath()` registers a `MigrationSource` — not a namespace path and not a file path; it defaults to `core`, and only `core` takes the version-spanning path. `--all` or `--until=<timestamp>` is **mandatory**: it is the timestamp cap, not a widening of the migration sources, and without either the command throws `missing timestamp cap or --all option`. Destructive steps are never included — they need `bin/console database:migrate-destructive <Identifier> --all`. `[code: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105]` `[code: Framework/Bundle.php:131-143]`
2. Names at least one reason the migration silently did not run on the deployed shop, all of which the command shape alone does not fix: the plugin must be **installed and active** (only actives boot as bundles, so a deactivated plugin registers no `MigrationSource`); the identifier must resolve, because an unknown one is not an error — the command prints `No collection found for identifier: "…", continuing` and exits **0**, so a typo looks like a successful run; and a `Migration` directory that did **not** exist when the container was compiled is not registered at all, so `bin/console cache:clear` is needed before `database:migrate` can see a first-ever migration (further files added to an already-registered directory are scanned at runtime and need nothing). `[code: Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:27-30]` `[code: Framework/Migration/Command/MigrationCommand.php:121-129]` `[code: Framework/Bundle.php:131-143]`
3. States that the normal path is the plugin lifecycle rather than the migration command: `bin/console plugin:update <Name>` runs that plugin's migrations itself (`PluginLifecycleService::updatePlugin()` → `runMigrations()` → `migrateInPlace()`, unless the plugin set `setAutoMigrate(false)`), and it builds the migration source at runtime, so it needs no container rebuild. `bin/console plugin:refresh` must run first: it re-reads each plugin's `composer.json` into the `plugin` table and writes `upgradeVersion`, and the Deployment Helper skips `plugin:update` for any plugin whose `upgradeVersion` is NULL or equal to the installed version — a plugin deployed without a version bump is therefore never updated and its migrations never run. `plugin:activate` / `deactivate` / `uninstall` do **not** run migrations. `[code: Framework/Plugin/PluginLifecycleService.php:323,611-645]` `[code: Framework/Plugin/PluginService.php:100-114]` `[code: vendor/shopware/deployment-helper/src/Services/Plugin/PluginManagementPlanner.php:95-106]`

**Trap:** Shopware ships no Doctrine migration tooling — `doctrine/migrations` and `doctrine-migrations-bundle` are not installed, so there is no `doctrine:migrations:migrate` or `:diff`; the four commands are `database:create-migration`, `database:migrate`, `database:migrate-destructive`, `database:refresh-migration` (the last only rewrites a file's timestamp). An answer offering a `doctrine:migrations:*` command, or one that omits `--all`/`--until`, fails Accuracy.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The command is `database:migrate`; its only argument is `identifier` (optional, IS_ARRAY, default `['core']`), plus `--all`, `--until\|-u`, `--limit\|-l` | `Framework/Migration/Command/MigrationCommand.php:20-23,53-59` | `->addArgument('identifier', InputArgument::OPTIONAL \| InputArgument::IS_ARRAY, 'identifier to determine which migrations to run', ['core'])` |
| Either `--all` or `--until=<timestamp>` is mandatory — without one the command throws; multiple identifiers require `--all` and forbid `--limit` | `Framework/Migration/Command/MigrationCommand.php:70-77` | `if (!$until && !$input->getOption('all')) { throw MigrationException::invalidArgument('missing timestamp cap or --all option'); }` |
| The identifier for a plugin is the bundle name: `Bundle::registerMigrationPath()` registers a `MigrationSource` with `$this->getName()`, tagged `shopware.migration_source`, and **returns early when the `Migration` directory does not exist at container-compile time** | `Framework/Bundle.php:131-143` | `$migrationPath = $this->getMigrationPath(); if (!is_dir($migrationPath)) { return; } $container->register(MigrationSource::class . '_' . $this->getName(), MigrationSource::class)->addArgument($this->getName())` |
| `MigrationCollectionLoader` consumes that tag via `tagged_iterator` and keys sources by `MigrationSource::getName()` — exactly the identifier the command resolves; an unregistered name throws `UnknownMigrationSourceException` | `Framework/DependencyInjection/services.xml:144-149`; `Framework/Migration/MigrationCollectionLoader.php:64-78` | `$this->migrationSources[$migrationSource->getName()] = $migrationSource; … if (!isset($this->migrationSources[$name])) { throw MigrationException::unknownMigrationSource($name); }` |
| At the command level that exception is caught: a note is printed and the exit code is 0 — a typo'd or deactivated plugin looks like a successful run that migrated nothing | `Framework/Migration/Command/MigrationCommand.php:121-129` | `catch (UnknownMigrationSourceException) { $this->io->note(sprintf('No collection found for identifier: "%s", continuing', $identifier)); return 0; }` |
| Migration classes themselves are read from the registered directory at runtime — `MigrationCollection::loadMigrationSteps()` `scandir()`s on every call, so a further file in an already-registered directory needs no rebuild | `Framework/Migration/MigrationCollection.php:150-171` | `foreach ($this->migrationSource->getSourceDirectories() as $directory => $namespace) { … $classFiles = scandir($directory, \SCANDIR_SORT_ASCENDING);` |
| Only the identifier `core` takes the version-spanning path; anything else is a plain named source | `Framework/Migration/Command/MigrationCommand.php:98-105` | `if ($identifier === 'core') { return $this->loader->collectAllForVersion($this->shopwareVersion); } return $this->loader->collect($identifier);` |
| The command calls `$collection->sync()` first (new classes written to the `migration` table), then runs the executable ones, then clears the cache if anything ran | `Framework/Migration/Command/MigrationCommand.php:88-93,131-133`; `Framework/Migration/MigrationCollection.php:34-43` | `$collection->sync(); ... if ($total > 0) { $this->cache->clear(); }` |
| Destructive migrations need the sibling command `database:migrate-destructive <PluginName> --all` (`--version-selection-mode` applies only to `core`) | `Framework/Migration/Command/MigrationDestructiveCommand.php:14-17,39-47` | `#[AsCommand(name: 'database:migrate-destructive', ...)]` |
| `plugin:update <PluginName>` runs the plugin's migrations itself, and builds the source at **runtime** — `createMigrationCollection()` calls `addSource()` on the fly and falls back to the empty `null` source when the directory is missing | `Framework/Plugin/PluginLifecycleService.php:323,611-645` | `if (!is_dir($migrationPath)) { return $this->migrationLoader->collect('null'); } $this->migrationLoader->addSource(new MigrationSource($pluginBaseClass->getName(), [$migrationPath => $pluginBaseClass->getMigrationNamespace()])); … $collection->sync();` |
| `plugin:update` skips only plugins with `installedAt === null`; it never checks whether an update is actually pending, so running it by hand re-runs pending migrations. It offers `-r/--refresh` and `-c/--clearCache` | `Framework/Plugin/Command/Lifecycle/PluginUpdateCommand.php:39-46`; `AbstractPluginLifecycleCommand.php:82-86,139` | `if ($plugin->getInstalledAt() === null) { $io->note('… is not installed. Skipping.'); continue; } $this->pluginLifecycleService->updatePlugin($plugin, $context);` |
| `plugin:activate` / `deactivate` / `uninstall` call `setAutoMigrate(false)` — only install and update run plugin migrations | `Framework/Plugin/PluginLifecycleService.php:218,394,469` | `$activateContext->setAutoMigrate(false);` |
| Only active, installed plugins are booted as bundles, so a deactivated plugin contributes no `MigrationSource` | `Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:27-30`; `KernelPluginLoader.php:95,147` | `IF(\`active\` = 1 AND \`installed_at\` IS NOT NULL, 1, 0) AS active,` |
| `plugin:refresh` → `PluginService::refreshPlugins()` scans the filesystem, reads each `composer.json` and upserts the `plugin` table, setting `upgradeVersion` when the filesystem version is newer. `DbalKernelPluginLoader` boots from that table, so a never-refreshed plugin is no bundle at all | `Framework/Plugin/PluginService.php:45-52,100-114`; `DbalKernelPluginLoader.php:23-40` | `} elseif ($this->hasPluginUpdate($pluginVersion, $currentPluginVersion)) { $pluginData['version'] = $currentPluginVersion; $pluginData['upgradeVersion'] = $pluginVersion;` |
| The Deployment Helper reaches plugin migrations only through the lifecycle commands, and its planner **skips** a plugin whose `upgradeVersion` is NULL or equal to the installed version | `vendor/shopware/deployment-helper/src/Services/Plugin/PluginManagementPlanner.php:95-106`; `Services/UpgradeManager.php:49-95` | `if ($plugin['upgradeVersion'] === null \|\| $plugin['version'] === $plugin['upgradeVersion']) { continue; } $commands[] = new UpdatePlugin($plugin['name'], $additionalParameters);` |
| `database:create-migration` is Shopware's own scaffolding command; with `-p/--plugin` it resolves the plugin against the booted `KernelPluginCollection` and throws `pluginNotFound` otherwise | `Framework/Migration/Command/CreateMigrationCommand.php:17-20,110-116` | `$pluginBundles = array_filter($this->kernelPluginCollection->all(), static fn (Plugin $value) => mb_strpos($value->getName(), $pluginName) === 0); if ($pluginBundles === []) { throw MigrationException::pluginNotFound($pluginName); }` |
| The migration directory is derived from the bundle namespace (`<BundleNamespace>\Migration`, `<bundle path>/Migration`); a file elsewhere is never collected | `Framework/Bundle.php:44-59` | `return $this->getNamespace() . '\Migration';` |
| `database:refresh-migration <path>` only rewrites a migration file's timestamp — a dev aid, not a way to apply pending migrations | `Framework/Migration/Command/RefreshMigrationCommand.php:15-18,44-56` | `$io->writeln('Updating timestamp of migration: ' . $filename);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A `doctrine:migrations:*` command is available in a 6.7 shop | absent | `vendor/doctrine/` holds only dbal, deprecations, inflector, instantiator, lexer; `composer.lock` has no `doctrine/migrations` or `doctrine-migrations-bundle`; `config/bundles.php` registers no such bundle. The only migration commands are the four under `Framework/Migration/Command/` |
| `bin/console system:update:finish` applies pending plugin migrations | absent | `SystemUpdateFinishCommand::runMigrations()` invokes `database:migrate` / `-destructive` with the hard-coded identifier `core` only (`Maintenance/System/Command/SystemUpdateFinishCommand.php:114-135`) |
| A dedicated `plugin:migrate` command exists | absent | `Framework/Plugin/Command/` contains no migration command |
| `plugin:update` has an option to skip or force migrations | absent | The shared `configureCommand()` adds only `plugins`, `--refresh/-r`, `--clearCache/-c` (`AbstractPluginLifecycleCommand.php:46-66`) |
| `database:migrate` fails when the named plugin has no migration source | absent (silent success) | `UnknownMigrationSourceException` is caught and turned into a note with `return 0` (`MigrationCommand.php:121-127`) |
| The Deployment Helper runs `database:migrate` with a plugin identifier | absent | grep over `vendor/shopware/deployment-helper/src` finds no `database:migrate` call; plugin migrations are reached only via `plugin:install` / `plugin:update`. Its only `cache:clear` is Platform.sh-guarded (`Integration/PlatformSHSubscriber.php:25,35-44`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| An unregistered identifier throws `UnknownMigrationSourceException` instead of yielding an empty collection; the `null` source is the empty one | `shopware/shopware@v6.7.13.0 tests/integration/Core/Framework/Migration/MigrationLoaderTest.php` (`testExceptionForInvalidNames`, `testNullCollection`) |
| Migration classes are read from the source directory at runtime; invalid classes fail only on lazy init | `shopware/shopware@v6.7.13.0 tests/integration/Core/Framework/Migration/MigrationLoaderTest.php` (`testItLoadsTheValidMigrations`) |
| How a plugin migration collection is built and synced in the real lifecycle path | `Framework/Plugin/PluginLifecycleService.php:611-636` |
| Reference invocation shape (`identifier` + `--all`) as core itself calls it | `Maintenance/System/Command/SystemUpdateFinishCommand.php:118-122` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A bare `database:migrate` runs only the `Shopware\Core\Migration` set; `--all` is reported to control the timestamp cutoff, not the set of bundles | 6.x (filed 2020) | closed | https://github.com/shopware/shopware/issues/406 |
| Forum: a migration added to an already-installed plugin produced "0/0 Migrations"; the thread's advice is to ship an empty migration from the start | 6.x | closed | https://forum.shopware.com/t/plugin-migration-angelegt-wird-aber-mit-bin-console-database-migrate-all-nicht-gefunden/68461 |
| Community guidance: invocation is `database:migrate <PluginName> --all`, and the plugin must be active | 6.4–6.6 era | n/a | https://matheusgontijo.com/2022/01/27/how-to-create-a-migration-in-shopware-6 |
| Destructive changes are never applied by install/update or `database:migrate`; they need `database:migrate-destructive <PluginName> --all` | unclear | n/a | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/database-migrations.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the identifier argument required, and does omitting it restrict the run to core? | code | Settled: optional, default `['core']`; `core` alone takes the version-spanning path |
| What does `--all` do? | code | Settled: it is the timestamp cap; either `--all` or `--until` is mandatory |
| Is the identifier a plugin name or a namespace prefix? | code | Settled: the bundle name, keyed by `MigrationSource::getName()` |
| Are inactive plugins' migration sources loaded? | code | Settled: no — only active, installed plugins boot as bundles |
| Does `PluginLifecycleService::updatePlugin` run migrations? | code | Settled: yes, via `runMigrations()` → `migrateInPlace()` when `isAutoMigrate()` |
| Does `database:migrate-destructive` still exist and take the identifier? | code | Settled: yes |
| Does the forum's "0/0 Migrations" mean a missing source? | deep code | Settled: no — a missing *registered* source produces the caught "No collection found" note; a genuine zero count is the `null` source the lifecycle substitutes when the directory is absent at runtime |
| Is a newly added `Migration` directory picked up without a container rebuild? | deep code | Settled: `database:migrate` needs `cache:clear` (the source is registered at compile time); the lifecycle commands do not (the source is built at runtime) |
| Is any `doctrine:migrations:*` command registered? | deep code | Settled: no — doctrine/migrations is not installed |
| Does `plugin:refresh` decide whether a deployed plugin is seen at all? | deep code | Settled: yes — it upserts the `plugin` table and writes `upgradeVersion`, which the Deployment Helper's planner gates on |
| Does the Deployment Helper run plugin migrations? | deep code | Settled: only through `plugin:install` / `plugin:update`, never via `database:migrate` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A single plugin's pending migrations are run with `./bin/console database:migrate SwagBasicExample --all` | "$ ./bin/console database:migrate SwagBasicExample --all" | `guides/plugins/plugins/database/database-migrations.md:167` | yes — `MigrationCommand.php:53-77` |
| The identifier is optional, defaults to core migrations, and must be the plugin's bundle name for plugin migrations | "set the identifier argument to your plugin's bundle name" | `guides/plugins/plugins/database/database-migrations.md:178` | yes — `Framework/Bundle.php:131-143`, `MigrationCollectionLoader.php:64-78` |
| Installing a plugin runs all migrations' `update()`; updating via the Plugin Manager runs all new ones the same way | "when you update a plugin via the Plugin Manager, all **new** migrations are executed the same way" | `guides/plugins/plugins/database/database-migrations.md:164` | yes — `PluginLifecycleService.php:323,611-645` |
| Plugin install and update never run `updateDestructive()` | "**Plugin install and update never run `updateDestructive()`.**" | `guides/plugins/plugins/database/database-migrations.md:103` | yes — `migrateInPlace()` path; destructive has its own command |
| A plugin may suppress automatic migration execution via `setAutoMigrate(false)` | "A plugin must reject the automatic execution of migrations in order to have control" | `guides/plugins/plugins/database/database-migrations.md:182` | yes — `InstallContext::isAutoMigrate()` guard |
| Migration files are looked up in a `Migration` directory relative to the plugin base class | "looking for migration files in a directory called `Migration`" | `guides/plugins/plugins/database/database-migrations.md:25` | yes — `Framework/Bundle.php:44-59` |
| Bundles have no lifecycle, so their migrations need `bin/console database:migrate <BundleName> --all` | "Since bundles don't have a lifecycle, migrations aren't automatically executed." | `guides/plugins/plugins/bundle.md:173` | yes — the same identifier mechanism |
| The identifier can be a major-version namespace, e.g. `database:migrate --all core.V6_7` | "You can run migrations specific to a major version with `bin/console database:migrate --all core.V6_7`" | `resources/guidelines/code/core/database-migations.md:75` | consistent — the option may precede the argument (`MigrationCommand.php:53-59`); the `core.V6_7` source name itself was not read by either code pass |
| The commands reference describes `database:migrate` only as "Executes all migrations", identically to `database:migrate-destructive` | "\| `database:migrate` \| Executes all migrations \|" | `resources/references/core-reference/commands-reference.md:120` | no — the two commands run different collections |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The command table documents only the optional identifier and describes the command as running "unhandled migrations"; the meaning of `--all` is stated nowhere | `--all` (or `--until`) is mandatory — the command throws `MigrationException::invalidArgument('missing timestamp cap or --all option')` without one | `Framework/Migration/Command/MigrationCommand.php:70-77` |
| `commands-reference.md:120-121` gives `database:migrate` and `database:migrate-destructive` the identical description "Executes all migrations" | Separate commands over separate execution paths; the destructive one additionally has `--version-selection-mode`, which applies only to `core` | `Framework/Migration/Command/MigrationDestructiveCommand.php:14-17,39-47` |
| No page states what happens when the identifier does not match a migration source | The command catches `UnknownMigrationSourceException`, prints a note and exits 0 — a typo'd or inactive plugin looks like a successful run | `Framework/Migration/Command/MigrationCommand.php:121-129` |
| No page states that a deactivated plugin has no migration source | Only active, installed plugins boot as bundles, so no `MigrationSource` is registered for them | `Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:27-30` |
| The docs present `database:migrate <Bundle> --all` and the lifecycle path as interchangeable ways to run the same migrations | They resolve the source differently: `database:migrate` sees only sources registered at container-compile time (a first-ever `Migration` directory needs `cache:clear`), while `plugin:install`/`plugin:update` add the source at runtime | `Framework/Bundle.php:131-143` vs `Framework/Plugin/PluginLifecycleService.php:611-636` |
| The bundle page suggests wiring `database:migrate <BundleName> --all` into the Deployment Helper as a pre-update hook | The Deployment Helper itself never calls `database:migrate`; it runs `plugin:refresh` and then `plugin:update` only for plugins whose `upgradeVersion` differs from the installed version | `vendor/shopware/deployment-helper/src/Services/Plugin/PluginManagementPlanner.php:95-106` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The command is `bin/console database:migrate <identifier>`, where the identifier selects the migration set — the plugin's migration namespace/name rather than a file path — and `--all` is what makes it apply every pending migration instead of stopping at the default timestamp cutoff (`bin/console database:migrate --all <identifier>` / `<identifier> --all`, as the page writes it). | rewritten | "migration namespace/name" is imprecise: the identifier is the **bundle name**, the key under which `Bundle::registerMigrationPath()` registers the source (`Framework/Bundle.php:131-143`). "instead of stopping at the default timestamp cutoff" is also wrong — there is no default cutoff: `--all` or `--until` is mandatory and the command throws without either (`MigrationCommand.php:70-77`) |
| Migrations are normally executed by the plugin lifecycle itself — `bin/console plugin:update <Name>` (and install/activate) runs them — so the first thing to check on the deployed shop is whether the plugin was actually updated there; `bin/console plugin:refresh` re-reads the plugin metadata first. | rewritten | `plugin:activate` does **not** run migrations — it calls `setAutoMigrate(false)` (`PluginLifecycleService.php:394`). The deep pass also supplied the load-bearing detail the fact only gestured at: `plugin:refresh` writes `upgradeVersion`, and the Deployment Helper skips `plugin:update` when it is NULL or unchanged (`PluginManagementPlanner.php:95-106`) |
| Shopware has no Doctrine ORM migration tooling: there is no `doctrine:migrations:migrate` or `:diff`, migration skeletons come from `bin/console database:create-migration` and are hand-written. An answer offering a `doctrine:migrations:*` command fails Accuracy. | moved to Trap, replaced | Confirmed by the deep pass (no doctrine/migrations package, no bundle registration) but it is a trap, not one of the three things that decide whether an answer is usable. The freed slot now carries the silent-failure modes that actually explain "my migration never ran" |

