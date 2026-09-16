# `dev-52` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-52` · `dev` · `Core breaking changes` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** What must a plugin database migration class implement in Shopware 6.7, and where does the database cleanup on uninstall belong?

**Expected answer — every fact an answer must contain:**

1. A plugin migration class extends the abstract `Shopware\Core\Framework\Migration\MigrationStep` (there is no migration interface or attribute) and must implement its only two abstract members, `getCreationTimestamp(): int` and `update(Connection $connection): void`; the timestamp is validated at runtime and must be `>= 1` and `< 2147483647`, otherwise `MigrationException::implausibleCreationTimestamp` is thrown.  `[code: Framework/Migration/MigrationStep.php:17-33,42-51]`
2. The file lives in the bundle's `Migration` directory (namespace `<PluginNamespace>\Migration`, overridable via `getMigrationNamespace()`/`getMigrationPath()`), its FQCN must match the file name, and the directory must exist on disk or the bundle registers no `shopware.migration_source` at all; `bin/console database:create-migration -p <plugin>` scaffolds it.  `[code: Framework/Bundle.php:45-59,131-143]` `[code: Framework/Migration/MigrationCollection.php:180-189]`
3. Database cleanup on uninstall belongs in `Plugin::uninstall(UninstallContext $uninstallContext)` and must branch on `$uninstallContext->keepUserData()` — the core drops no plugin tables itself, and it disables auto-migration on the uninstall path (`setAutoMigrate(false)`), so cleanup cannot be delegated to a migration. `updateDestructive()` is optional (a concrete, empty method, not abstract) and destructive steps run only through `database:migrate-destructive`, never implicitly.  `[code: Framework/Plugin.php:63-65]` `[code: Framework/Plugin/PluginLifecycleService.php:218,226-254]` `[code: Framework/Migration/MigrationStep.php:38-40]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `MigrationStep` is abstract; only `getCreationTimestamp()` and `update()` are abstract members | `Framework/Migration/MigrationStep.php:17-33` | `abstract public function getCreationTimestamp(): int;` … `abstract public function update(Connection $connection): void;` |
| `updateDestructive()` is concrete with an empty body — optional | `Framework/Migration/MigrationStep.php:38-40` | `public function updateDestructive(Connection $connection): void\n    {\n    }` |
| Creation timestamp is range-validated at runtime | `Framework/Migration/MigrationStep.php:42-51` | `if ($creationTime < 1 \|\| $creationTime >= self::MAX_INT_32_BIT) { throw MigrationException::implausibleCreationTimestamp(...); }` |
| Migrations discovered by directory scan; FQCN must match file, non-`MigrationStep` classes skipped | `Framework/Migration/MigrationCollection.php:180-189` | `if (!class_exists($className) …) { throw MigrationException::invalidMigrationClass(...); }` / `if (!is_subclass_of($className, MigrationStep::class)) { continue; }` |
| Migration namespace/path derived by `Bundle`, both overridable | `Framework/Bundle.php:45-59` | `return $this->getNamespace() . '\Migration';` |
| Registration only when the directory exists; registers a `shopware.migration_source` service | `Framework/Bundle.php:131-143` | `if (!is_dir($migrationPath)) { return; }` … `->addTag('shopware.migration_source');` |
| The tag is consumed via `tagged_iterator` by `MigrationCollectionLoader` | `Framework/DependencyInjection/services.xml:144-149` | `<argument type="tagged_iterator" tag="shopware.migration_source"/>` |
| Scaffolding command is `database:create-migration` with `-p/--plugin` | `Framework/Migration/Command/CreateMigrationCommand.php:17-47,110-134` | `name: 'database:create-migration'` … `->addOption('plugin', 'p', InputOption::VALUE_REQUIRED)` |
| Generated plugin template contains exactly `getCreationTimestamp()` and `update()` | `Framework/Migration/Template/MigrationTemplatePlugin.txt:11-22` | `class Migration%%timestamp%%%%name%% extends MigrationStep` |
| Cleanup hook is the empty, overridable `Plugin::uninstall()` | `Framework/Plugin.php:63-65` | `public function uninstall(UninstallContext $uninstallContext): void\n    {\n    }` |
| Core branches on `keepUserData()` around the plugin hook and does not drop plugin tables | `Framework/Plugin/PluginLifecycleService.php:226-254` | `// plugin->uninstall() will remove the tables etc of the plugin,` … `$pluginBaseClass->uninstall($uninstallContext);` |
| Auto-migration is disabled on the uninstall path | `Framework/Plugin/PluginLifecycleService.php:218,639-641` | `$uninstallContext->setAutoMigrate(false);` … `if (!$context->isAutoMigrate()) {` |
| `keepUserData()` is a readonly constructor flag on `UninstallContext` | `Framework/Plugin/Context/UninstallContext.php:19-30` | `private readonly bool $keepUserData` |
| `Plugin::removeMigrations()` deletes the plugin's `migration` rows; refuses `shopware*` namespaces | `Framework/Plugin.php:97-106` | `DELETE FROM migration WHERE class LIKE :class` |
| Destructive steps have their own command | `Framework/Migration/Command/MigrationDestructiveCommand.php:14-16` | `name: 'database:migrate-destructive',` |
| `MigrationStep::indexExists()` is deprecated for 6.8 (exception-change) | `Framework/Migration/MigrationStep.php:87-96` | `@deprecated tag:v6.8.0 - reason:exception-change` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A 6.7 migration must implement an interface or carry an attribute | absent | No `*Interface.php` in `Framework/Migration/`; membership is checked with `is_subclass_of($className, MigrationStep::class)` |
| `updateDestructive()` is abstract/required in 6.7 | absent | Concrete, empty method — `Framework/Migration/MigrationStep.php:38` |
| A 6.7-specific deprecation or breaking change inside the `Migration` namespace | absent | `grep -rn "v6.7.0" Framework/Migration/` returns nothing; only marker targets v6.8.0 |
| The core drops plugin tables on uninstall | absent | `Framework/Plugin/PluginLifecycleService.php:226-254` removes assets, migration rows, config, custom entities/fields — no table drop |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Minimal shape of a valid migration class in core's own migration tests | `Framework/Test/Migration/_test_migrations_valid/Migration1.php:11-26` |
| Non-`MigrationStep` classes in the migration directory are ignored | `Framework/Test/Migration/_test_migrations_valid/Foo.php:8-10` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `migrateDestructiveInPlace()` called inside `uninstall()` stopped dropping plugin tables in 6.7; second developer confirms | 6.7 | closed | https://github.com/shopware/shopware/issues/7951 |
| Maintainer: destructive migrations are not the uninstall-cleanup mechanism; collection is empty in the uninstall context; clean up directly in `uninstall()` | 6.7 | closed | https://github.com/shopware/shopware/issues/7951#issuecomment-2758468187 |
| PR adds creation-timestamp range validation and deletes migration rows before `uninstall()` when `keepUserData=false` | 6.7 | merged | https://github.com/shopware/shopware/pull/5939 |
| Old report (6.1 era) of orphan tables after uninstall blocking reinstall | unclear | closed | https://github.com/shopware/shopware/issues/553 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Are the abstract members still `getCreationTimestamp()` + `update()`? | `Framework/Migration/MigrationStep.php:17-33` | Yes; `updateDestructive()` is not abstract |
| Is `getCreationTimestamp()` range-validated as PR #5939 claims? | `Framework/Migration/MigrationStep.php:42-51` | Yes, 1..2147483647, else `MigrationException::implausibleCreationTimestamp` |
| Are migration rows deleted before or after `Plugin::uninstall()`, and is it conditional? | `Framework/Plugin/PluginLifecycleService.php:226-254` | Before, and only when `!keepUserData()` |
| Does `keepUserData()` still exist, and is there a core helper for dropping plugin tables? | `Framework/Plugin/Context/UninstallContext.php:19-30`, `PluginLifecycleService.php:226-254` | Flag exists; no core table-drop helper — the plugin does it in `uninstall()` |
| Can uninstall rely on migrations running? | `Framework/Plugin/PluginLifecycleService.php:218,639-641` | No — `setAutoMigrate(false)` is set, `runMigrations()` returns early |
| Did 6.7 rename a `MigrationStep` parameter? | code lane found no `v6.7.0` marker in `Framework/Migration/`; community search returned 0 PRs | unsubstantiated; no fact rests on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Plugin migration extends `MigrationStep` with `getCreationTimestamp()` and `update()` | `class Migration1611740369ExampleDescription extends MigrationStep` | `guides/plugins/plugins/database/database-migrations.md:77-88` | yes — `MigrationStep.php:17-33` |
| "your migration contains two methods" | "As you can see, your migration contains two methods: `getCreationTimestamp()`, `update()`" | `…/database-migrations.md:91-96` | partly — accurate for the abstract set; `updateDestructive()` also exists as optional |
| Migration files live in a `Migration` directory relative to the plugin base class | "Shopware 6 is looking for migration files in a directory called `Migration`" | `…/database-migrations.md:25` | yes — `Framework/Bundle.php:45-59` |
| No migration rollback; cleanup belongs in `uninstall` | "There is no migration rollback. … Cleaning up the database when the plugin is removed belongs in the plugin lifecycle method `uninstall`" | `…/database-migrations.md:99` | yes — `Framework/Plugin.php:63-65`, `PluginLifecycleService.php:226-254` |
| `updateDestructive()` optional; plugin install/update never run it | "**Plugin install and update never run `updateDestructive()`.**" | `…/database-migrations.md:103` | partly — optional confirmed (`MigrationStep.php:38-40`); the "never run on install/update" half was not examined by the code lane and is not carried as a fact |
| `getMigrationNamespace()` can relocate the migrations | "you can choose another namespace … by overwriting your plugin's `getMigrationNamespace()`" | `…/database-migrations.md:202` | yes — `Framework/Bundle.php:45-59` |
| `setAutoMigrate(false)` lets a plugin drive the collection itself | "A plugin must reject the automatic execution of migrations in order to have control" | `…/database-migrations.md:182` | partly — the flag exists and is honoured (`PluginLifecycleService.php:639-641`), but the core sets it to `false` for uninstall regardless |
| `uninstall()` removes/cleans data created by the plugin | "this is executed when the plugin is uninstalled. Use it to remove or clean up data" | `plugin-fundamentals/plugin-lifecycle.md:149` | yes — `Framework/Plugin.php:63-65` |
| `UninstallContext` carries `keepUserData()`; persistent data must not be deleted when true | "If `keepUserData()` returns `true`, you must not delete persistent data" | `plugin-fundamentals/plugin-lifecycle.md:167` | yes — `UninstallContext.php:19-30` |
| Core guideline: a migration consists of `update` and `updateDestructive` | "The migration consists of two separated steps" | `resources/guidelines/code/core/database-migations.md:21` | partly — both exist, but only `update()` is required |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| "your migration contains two methods" (plugin guide) vs. "the migration consists of two separated steps: `update` and `updateDestructive`" (core guideline) — the two pages disagree on the required member set | Neither is the contract: the abstract members are `getCreationTimestamp()` and `update()`; `updateDestructive()` is a concrete, empty, optional override | `Framework/Migration/MigrationStep.php:17-33,38-40` |
| Neither doc page mentions any validation of the value returned by `getCreationTimestamp()` | The timestamp is range-checked at runtime and an out-of-range value throws | `Framework/Migration/MigrationStep.php:42-51` |
| No doc page states that a missing `Migration` directory means the bundle registers no migration source at all | `registerMigrationPath()` returns early when the directory does not exist | `Framework/Bundle.php:131-143` |
| Docs describe `setAutoMigrate(false)` as a plugin choice for install/update | The core itself forces `setAutoMigrate(false)` on the uninstall path, so uninstall never runs migrations | `Framework/Plugin/PluginLifecycleService.php:218,639-641` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| A migration lives at `<plugin root>/src/Migration/Migration<timestamp><Description>.php`, extends `Shopware\Core\Framework\Migration\MigrationStep` and implements `getCreationTimestamp()` and `update(Connection $connection): void`; skeletons come from `bin/console database:create-migration -p <plugin> --name <name>`. | split and rewritten | Correct as far as it went; split into facts 1 and 2 to carry the code-confirmed constraints it missed — no interface exists, the timestamp is range-validated, the FQCN must match the file name, and a missing directory registers no migration source |
| `updateDestructive()` is core-only for delayed major-version destructive changes — plugin install/update never runs it, so all plugin schema changes belong in `update()`. | rewritten into fact 3 | "core-only" and "plugin install/update never runs it" are doc claims the code lane did not examine; what code shows is that `updateDestructive()` is optional (not abstract) and that destructive steps run only via `database:migrate-destructive`, while uninstall disables auto-migration |
| There is no migration rollback and an executed migration must never be changed; database cleanup on plugin removal belongs in the plugin's `uninstall` lifecycle method, not in a migration. | rewritten into fact 3 | The uninstall half is code-confirmed and kept, strengthened with the `keepUserData()` obligation and the fact that the core drops no plugin tables; "an executed migration must never be changed" is a doc-only practice rule with no code finding behind it and was dropped to keep the set to the three deciding points |
