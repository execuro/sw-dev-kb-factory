# `dev-02` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-02` · `dev` · `Plugin fundamentals` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** What's the plugin lifecycle in Shopware — install, activate, uninstall — and how does `keepUserData` work?

**Expected answer — every fact an answer must contain:**

1. The plugin's base class extends `Shopware\Core\Framework\Plugin` and overrides the hooks it needs out of `install(InstallContext)`, `postInstall(InstallContext)`, `update(UpdateContext)`, `postUpdate(UpdateContext)`, `activate(ActivateContext)`, `deactivate(DeactivateContext)`, `uninstall(UninstallContext)`. All seven exist with empty bodies and none is abstract; there is no `postActivate`/`postDeactivate`/`postUninstall` method, and the constructor is `final` so the plugin class must not declare one. `[code: Framework/Plugin.php:19-68]`
2. `UninstallContext::keepUserData()` is a read-only boolean getter (no setter). Core never drops the plugin's own tables: when it returns `false` core removes only the plugin's migration rows, its system configuration, its custom entities and its custom fields; assets and the plugin's `uninstall()` hook run either way. Dropping the plugin's data is therefore the plugin's job, and `uninstall()` must check the flag and return early when it is `true`. Identical in 6.6 and 6.7. `[code: Framework/Plugin/PluginLifecycleService.php:222-251]`
3. Install and uninstall are driven by `PluginLifecycleService`: install saves config defaults, calls `install()`, runs migrations automatically, then calls `postInstall()`; uninstall throws if the plugin was never installed and deactivates an active plugin first. On the CLI, `bin/console plugin:install --activate <Name>` installs and activates, and `bin/console plugin:uninstall --keep-user-data <Name>` sets keepUserData — whose default is `false`, i.e. data is removed unless the caller opts in. `[code: Framework/Plugin/PluginLifecycleService.php:154-205]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Seven overridable lifecycle hooks, all with empty default bodies, none abstract | `Framework/Plugin.php:37-68` | `public function install(InstallContext $installContext): void\n    {\n    }` … `public function uninstall(UninstallContext $uninstallContext): void\n    {\n    }` |
| The `Plugin` constructor is `final` and `@internal` | `Framework/Plugin.php:19-31` | `final public function __construct(private readonly bool $active, private string $basePath, ?string $projectDir = null)` |
| Five context classes; `UninstallContext extends InstallContext` and adds the flag | `Framework/Plugin/Context/UninstallContext.php:11-21` | `class UninstallContext extends InstallContext { public function __construct(… private readonly bool $keepUserData) {` |
| `keepUserData()` is a read-only getter; its core docblock is inverted relative to the actual logic | `Framework/Plugin/Context/UninstallContext.php:24-29` | `/** If true is returned, migrations of the plugin will also be removed */ public function keepUserData(): bool { return $this->keepUserData; }` |
| Install order: config defaults → `install()` → migrations → custom fields → `installedAt` → `postInstall()`; a Throwable rolls back via `uninstallPlugin(…, true)` | `Framework/Plugin/PluginLifecycleService.php:154-183` | `$pluginBaseClass->install($installContext);\n\n            $this->runMigrations($installContext);` … `$pluginBaseClass->postInstall($installContext);` |
| Install migrations run automatically (`autoMigrate` defaults to true) | `Framework/Plugin/Context/InstallContext.php:13` | `private bool $autoMigrate = true;` |
| `uninstallPlugin()` default for keepUserData is `false` | `Framework/Plugin/PluginLifecycleService.php:194-198` | `public function uninstallPlugin(PluginEntity $plugin, Context $shopwareContext, bool $keepUserData = false): UninstallContext` |
| Uninstall throws `notInstalled` and auto-deactivates an active plugin first | `Framework/Plugin/PluginLifecycleService.php:199-205` | `if ($plugin->getInstalledAt() === null) { throw PluginException::notInstalled(...); } if ($plugin->getActive()) { $this->deactivatePlugin(...); }` |
| keepUserData gates exactly four core cleanup steps; assets and the plugin's `uninstall()` hook run regardless | `Framework/Plugin/PluginLifecycleService.php:222-251` | `if (!$uninstallContext->keepUserData()) { $pluginBaseClass->removeMigrations(); }\n\n        $pluginBaseClass->uninstall($uninstallContext);\n\n        if (!$uninstallContext->keepUserData()) { $this->systemConfigService->deletePluginConfiguration(...); }` |
| The scaffolding stub encodes the early-return contract | `Framework/Plugin/Command/Scaffolding/stubs/plugin-class.stub:19-28` | `if ($uninstallContext->keepUserData()) { return; }\n\n        // Remove or deactivate the data created by the plugin` |
| Uninstall sets `autoMigrate(false)` — no migrations execute during uninstall | `Framework/Plugin/PluginLifecycleService.php:218` | `$uninstallContext->setAutoMigrate(false);` |
| Activate rebuilds the container so the plugin's services exist, then calls `activate()` with `autoMigrate(false)` and runs migrations | `Framework/Plugin/PluginLifecycleService.php:381-402` | `$this->rebuildContainerWithNewPluginState($plugin, $pluginBaseClass->getNamespace());` … `$activateContext->setAutoMigrate(false);\n\n        $pluginBaseClass->activate($activateContext);` |
| Deactivate throws `notActivated` / `hasActiveDependants` | `Framework/Plugin/PluginLifecycleService.php:444-459` | `throw PluginException::notActivated($plugin->getName());` … `throw PluginException::hasActiveDependants(...)` |
| CLI `--keep-user-data` flag reaches `uninstallPlugin()` | `Framework/Plugin/Command/Lifecycle/PluginUninstallCommand.php:26,44,54` | `$this->addOption('keep-user-data', null, InputOption::VALUE_NONE, 'Keep user data of the plugin');` … `$this->pluginLifecycleService->uninstallPlugin($plugin, $context, $keepUserData);` |
| CLI `plugin:install --activate` / `-a`, plus `--reinstall` (which uninstalls without keepUserData) | `Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50-76` | `$this->addOption('activate', 'a', InputOption::VALUE_NONE, 'Activate plugins after installation.')` |
| Admin/Store surface forwards the same flag for plugins and apps | `Framework/Store/Services/ExtensionLifecycleService.php:50-60` | `public function uninstall(string $type, string $technicalName, bool $keepUserData, Context $context): void` |
| 6.6 parity: `UninstallContext` at tag v6.6.10.0 is byte-identical to 6.7.13.0 | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Plugin/Context/UninstallContext.php` | `public function keepUserData(): bool { return $this->keepUserData; }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Core drops the plugin's database tables on uninstall when keepUserData is false | absent | `uninstallPlugin()` contains no table-dropping code; only migrations, config, custom entities and custom fields are removed — `Framework/Plugin/PluginLifecycleService.php:226-252` |
| keepUserData can be set or overridden from inside the plugin's `uninstall()` hook | absent | Only a getter exists; the property is `private readonly` and there is no `setKeepUserData()` — `Framework/Plugin/Context/UninstallContext.php:18-29` |
| `postActivate` / `postDeactivate` / `postUninstall` hook methods on `Plugin` | absent | Only the seven hooks are declared; the "post" phases exist as events only — `Framework/Plugin.php:37-68` |
| keepUserData applies to plugin assets | absent | `removeAssetsOfBundle()` is called unconditionally — `Framework/Plugin/PluginLifecycleService.php:222-224` |
| A failed install leaves plugin data behind | contradicted | The catch block calls `uninstallPlugin($plugin, $shopwareContext, true)` — a failed install deliberately keeps data — `Framework/Plugin/PluginLifecycleService.php:174-183` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The `--keep-user-data` CLI flag reaches `uninstallPlugin()` as `true` | `tests/unit/Core/Framework/Plugin/Command/Lifecycle/PluginUninstallCommandTest.php` (ref ee66a4c) |
| Full install → uninstall lifecycle against a real plugin (SwagTestPlugin) | `tests/integration/Core/Framework/Plugin/PluginLifecycleServiceTest.php` (ref ee66a4c) |
| Canonical shape of a plugin `uninstall()` honouring keepUserData | `Framework/Plugin/Command/Scaffolding/stubs/plugin-class.stub:19-28` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `migrateDestructiveInPlace()` in `uninstall()` silently stopped dropping tables on 6.7.0.0-rc1; maintainer says the uninstall migration collection is now empty and destructive migrations were never the intended cleanup mechanism | 6.7 | closed | https://github.com/shopware/shopware/issues/7951 |
| The behaviour change (PR #5939) shipped without an upgrade-guide entry; two docs PRs added it afterwards | 6.7 | merged | https://github.com/shopware/shopware/pull/5939 |
| `UninstallContext::keepUserData()` docblock describes the inverse of the actual logic | unclear | open | https://github.com/shopware/shopware/issues/14902 |
| Plugin's own services are in the container only during activate/deactivate, not install/uninstall | 6.3 era | closed | https://github.com/shopware/shopware/issues/1619 |
| App uninstall removes custom-entity data even without the "remove all app data" option | 6.x | closed | https://github.com/shopware/shopware/issues/9675 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Under which branch of `keepUserData()` is `removeMigrations()` called? | code | Only when `!keepUserData()` — `PluginLifecycleService.php:226-231` |
| Does core execute any destructive migration during uninstall? | code | No — uninstall sets `setAutoMigrate(false)` (`:218`); core only deletes migration rows |
| Does the inverted docblock still read that way in the version under test? | code | Yes — `UninstallContext.php:24-26`; the comment is wrong, the logic is authoritative. No fact quotes the comment |
| Is the ordering deactivate-before-uninstall still current? | code | Yes — `uninstallPlugin()` calls `deactivatePlugin()` first (`:203-205`) |
| Does `setAutoMigrate(false)` still exist? | code | Yes — `PluginLifecycleService.php:218`, `InstallContext.php:13` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A plugin must extend `Shopware\Core\Framework\Plugin` | "you must extend the `Shopware\Core\Framework\Plugin` class" | plugin-lifecycle.md:10 | yes — `Framework/Plugin.php` |
| Lifecycle stages are Install, Activate, Deactivate, Update, Uninstall | "A Shopware plugin goes through several lifecycle stages" | plugin-lifecycle.md:26-32 | yes, partially — code also has `postInstall`/`postUpdate` |
| `activate()`/`deactivate()` execute *before* activation/deactivation | "\| `activate()` \| Executed **before** plugin activation \|" | plugin-lifecycle.md:37-42 | partially — code calls `activate()` before `active=true` is written, but the page also states the opposite at :78 |
| `InstallContext` provides version info, `Context`, migrations and auto-migration control | "Auto-migration control (`isAutoMigrate` or `setAutoMigrate`…)" | plugin-lifecycle.md:64-70 | yes — `InstallContext.php:13` |
| `UninstallContext` = `InstallContext` plus `keepUserData()` | "provides the same information as `InstallContext`, plus the `keepUserData()` flag" | plugin-lifecycle.md:163 | yes — `UninstallContext.php:11-29` |
| Honouring keepUserData is the plugin author's obligation | "If `keepUserData()` returns `true`, you must not delete persistent data created by your plugin." | plugin-lifecycle.md:167 | yes — core drops no plugin tables |
| Canonical guard is an early return | "if ($uninstallContext->keepUserData()) { return; }" | plugin-lifecycle.md:174-176 | yes — identical to the scaffolding stub |
| CLI sequence `plugin:refresh` then `plugin:install --activate <Name>` | "bin/console plugin:install --activate SwagBasicExample" | install-activate-plugin.md:40 | yes — `PluginInstallCommand.php:50` |
| keepUserData is also a per-extension key in `.shopware-project.yml` | "keepUserData: true" | deployment-helper/extensions.md:151-154 | not checked in code (deployment helper is outside `vendor/shopware/core`) |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The lifecycle is five stages (Install, Activate, Deactivate, Update, Uninstall) | Seven overridable hooks: the docs omit that `postInstall`/`postUpdate` are methods on the same class | `Framework/Plugin.php:37-68` |
| The same page states `activate()` runs "before plugin activation" (:38) and "once the plugin is activated" (:78) | Code calls `$plugin->activate()` after the container rebuild but before `active` is persisted | `Framework/Plugin/PluginLifecycleService.php:381-402` |
| No developer page documents a CLI flag for keeping user data; only the Deployment Helper YAML key | `plugin:uninstall --keep-user-data` exists and is the direct CLI surface for the flag | `Framework/Plugin/Command/Lifecycle/PluginUninstallCommand.php:26` |
| Docs do not state what core itself removes when keepUserData is false | Core removes exactly migrations, plugin config, custom entities and custom fields — never the plugin's tables | `Framework/Plugin/PluginLifecycleService.php:226-252` |
| Core's own docblock: "If true is returned, migrations of the plugin will also be removed" | `removeMigrations()` runs only when keepUserData is **false** — the comment is inverted | `Framework/Plugin/Context/UninstallContext.php:24-26` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The plugin class extends `Shopware\Core\Framework\Plugin` and overrides `install`, `postInstall`, `update`, `postUpdate`, `activate`, `deactivate`, `uninstall` with their `*Context` arguments. | rewritten | Code shows none of the seven hooks is abstract, so a plugin overrides only what it needs; added the `final` constructor and the absence of `postActivate`/`postDeactivate`/`postUninstall`, both load-bearing |
| `uninstall(UninstallContext)` must check `$context->keepUserData()` before dropping tables. | rewritten | Correct but incomplete: code shows core drops no tables at all and gates exactly four cleanup steps, which is what makes the check the plugin's responsibility |
| `bin/console plugin:install --activate <Name>` installs and activates locally. | rewritten | Kept and extended with `plugin:uninstall --keep-user-data` and the `false` default, which the query asks about and the old set missed |
