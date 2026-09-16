# `dev-40` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-40` · `dev` · `Platform upgrade` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I upgrade a Composer-based Shopware project from 6.6 to 6.7 — which composer.json constraint do I change, and which console commands do I run afterwards?

**Expected answer — every fact an answer must contain:**

1. The only Shopware constraint to change is `shopware/core` (plus `shopware/commercial` when that plugin is used); `shopware/administration`, `shopware/storefront` and `shopware/deployment-helper` are pinned `*` and follow core, because each of them requires an exactly matching `shopware/core`. Then run `composer update` (the docs' manual route adds `--no-scripts`; Shopware's own tooling runs `composer update --with-all-dependencies`). `[code: composer.json:5-13 (project root)]` · `[code: vendor/shopware/administration/composer.json:44]`
2. The Composer step alone is not enough — the Symfony Flex recipes must be refreshed (`composer recipes:update`, or `composer symfony:recipes:install --force --reset`), because `symfony.lock` pins the `shopware/core` and `shopware/administration` recipes by MAJOR.MINOR and those recipes own `bin/console`, `bin/functions.sh`, `bin/build-*.sh`, `public/index.php` and `config/`; the 6.7 core recipe additionally registers the `Shopware\Core\Service\Service` bundle that a 6.6 project would otherwise be missing. `[code: symfony.lock (shopware/core and shopware/administration blocks); config/bundles.php:12]`
3. Afterwards run `bin/console system:update:finish`. It runs `database:migrate core --all` and `database:migrate-destructive core --all --version-selection-mode=safe`, dispatches `UpdatePostFinishEvent` — which the storefront's Theme `UpdateSubscriber` turns into `refreshThemes()` plus a compile of every active theme, so themes **are** recompiled unless `--skip-asset-build` is passed — and finally runs `assets:install`. Alternatively `vendor/bin/shopware-deployment-helper run` performs the whole sequence (`system:update:finish` → `plugin:refresh` → `theme:refresh` → `scheduled-task:register` → extension lifecycle → `theme:compile --active-only`). Maintenance mode is bracketed with `bin/console sales-channel:maintenance:enable --all` / `:disable --all`. `[code: Maintenance/System/Command/SystemUpdateFinishCommand.php:84-147]` · `[code: vendor/shopware/storefront/Theme/Subscriber/UpdateSubscriber.php:39-94]`

**Official reference URL:** https://developer.shopware.com/docs/guides/upgrades-migrations/upgrade-shopware.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version read: `6.7.13.0`.

| fact | citation | excerpt |
| --- | --- | --- |
| The only Shopware constraint to change is `shopware/core`; administration, storefront and deployment-helper are pinned `*` | `composer.json:5-13` (project root) | `"shopware/administration": "*", "shopware/core": "6.7.13.0", "shopware/deployment-helper": "*", "shopware/storefront": "*"` |
| `*` is safe because those packages require an exact matching core | `vendor/shopware/administration/composer.json:44` | `"shopware/core": "v6.7.13.0",` |
| The project is Symfony Flex with the Shopware recipe endpoint | `composer.json:67-76` | `"endpoint": ["https://raw.githubusercontent.com/shopware/recipes/flex/main/index.json", "flex://defaults"]` |
| The recipes are pinned by MAJOR.MINOR and own the project's entrypoints and build scripts | `symfony.lock` (shopware/core, shopware/administration blocks) | `"version": "6.7", … "files": ["bin/.htaccess","bin/build-js.sh","bin/ci","bin/console","bin/functions.sh", … "public/index.php"]` / `["bin/build-administration.sh","bin/watch-administration.sh"]` |
| Recipe content is genuinely version-coupled: the 6.7 core manifest adds the `Shopware\Core\Service\Service` bundle (present in this project) and drops MAILER_URL; `bin/build-administration.sh` differs substantially between 6.6 and 6.7 | `https://raw.githubusercontent.com/shopware/recipes/main/shopware/core/{6.6,6.7}/manifest.json`; `.../administration/{6.6,6.7}/bin/build-administration.sh`; `config/bundles.php:12` | `"Shopware\\Core\\Service\\Service": ["all"]` / `- export DISABLE_ADMIN_COMPILATION_TYPECHECK=true` → `+ export ADMIN_ROOT` |
| Counter-point kept honest: the recipe's `bin/console` is byte-identical between 6.6 and 6.7 | `cmp` of `shopware/recipes` `shopware/core/{6.6,6.7}/bin/console` | files identical |
| shopware-cli's upgrade runner makes the recipe refresh a mandatory named step right after the composer update | `https://raw.githubusercontent.com/shopware/shopware-cli/0.18.4/internal/shop/upgrade/run.go:30-51,166-179` | `RunSteps = []StepID{StepRewriteComposer, StepComposerUpdate, StepRecipesInstall, StepDeploymentHelper, StepWriteReport}` … `"symfony:recipes:install", "--force", "--reset", "--yes", "--no-interaction"` |
| The Shopware conflicts repository is registered and `shopware/conflicts` is a hard core requirement | `composer.json:36-39`; `vendor/shopware/core/composer.json:109` | `"url": "https://shopware.github.io/conflicts/"` … `"shopware/conflicts": "0.6.2",` |
| Composer's post-update hook runs only `assets:install` | `composer.json:56-65` | `"auto-scripts": {"assets:install": "symfony-cmd"}, "post-update-cmd": ["@auto-scripts"]` |
| Running that auto-script mid-update degrades rather than fails: Flex expands `symfony-cmd` to the project's `bin/console`, which boots the new code against the old schema; plugin/app loading is exception-guarded, so their assets are silently not copied. `system:update:finish` re-runs `assets:install` afterwards anyway | `vendor/symfony/flex/src/ScriptExecutor.php:82-107`; `vendor/shopware/core/Kernel.php:146-153`; `Framework/App/ActiveAppsLoader.php:54-70`; `SystemUpdateFinishCommand.php:102-107` | `} catch (DBALException $e) { IOStreamHelper::writeError('Warning: Failed to load plugins', $e); }` |
| `system:update:finish` dispatches UpdatePreFinishEvent, runs migrations, dispatches UpdatePostFinishEvent, prints its post-update message, then installs assets | `Maintenance/System/Command/SystemUpdateFinishCommand.php:84-107` | `$updateEvent = new UpdatePostFinishEvent($context, $oldVersion, $this->shopwareVersion); $this->eventDispatcher->dispatch($updateEvent);` |
| **Themes are recompiled** by that event: the storefront Theme `UpdateSubscriber` calls `refreshThemes()` then `compileThemeById()` per active theme; compile failures are appended to the post-update message, not fatal | `vendor/shopware/storefront/Theme/Subscriber/UpdateSubscriber.php:39-94` | `UpdatePostFinishEvent::class => 'updateFinished'` … `$this->themeLifecycleService->refreshThemes($context); … $this->themeService->compileThemeById($theme->getId(), $context);` |
| The single switch that disables it is the command's own `--skip-asset-build`, which adds `STATE_SKIP_ASSET_BUILDING` to the Context before the events — the same state the subscriber checks | `Maintenance/System/Command/SystemUpdateFinishCommand.php:84-107` (option at :52-57); `UpdateSubscriber.php:52-55` | `if ($input->getOption('skip-asset-build')) { $context->addState(PluginLifecycleService::STATE_SKIP_ASSET_BUILDING); }` / `if ($context->hasState(...STATE_SKIP_ASSET_BUILDING)) { return; }` |
| The subscriber is wired as a kernel.event_subscriber and the Storefront bundle is enabled here | `vendor/shopware/storefront/DependencyInjection/theme.php:448-454`; `config/bundles.php:20` | `$services->set(UpdateSubscriber::class)->…->tag('kernel.event_subscriber');` |
| Internally the command runs `database:migrate core --all`, then `database:migrate-destructive core --all --version-selection-mode=safe`, then `assets:install` | `Maintenance/System/Command/SystemUpdateFinishCommand.php:117-147` | `$application->find('database:migrate'); … find('database:migrate-destructive'); … find('assets:install');` |
| Options: `--skip-migrations`, `--skip-asset-build`, `--version-selection-mode` (default SAFE) | `Maintenance/System/Command/SystemUpdateFinishCommand.php:43-67` | `->addOption('version-selection-mode', null, InputOption::VALUE_REQUIRED, ... VERSION_SELECTION_SAFE)` |
| Both update commands silently no-op when `DATABASE_URL` is unset | `Maintenance/System/Command/SystemUpdatePrepareCommand.php:36-41` | `if ($dsn === '') { $output->note('Environment variable \'DATABASE_URL\' not defined. Skipping ...'); return self::SUCCESS; }` |
| `system:update:prepare` exists but only dispatches pre/post prepare events; the new version is hardcoded empty | `Maintenance/System/Command/SystemUpdatePrepareCommand.php:46-53` | `// TODO: get new version (from composer.lock?)` / `$newVersion = '';` |
| `sales-channel:maintenance:enable` / `:disable` exist under exactly those names and take `[<ids>...]` plus `--all`/`-a`; with neither, the command prints a note and exits SUCCESS | `Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:20-23,38-67`; `SalesChannelMaintenanceDisableCommand.php:11-18` | `#[AsCommand(name: 'sales-channel:maintenance:enable', ...)]` / `class SalesChannelMaintenanceDisableCommand extends SalesChannelMaintenanceEnableCommand { protected bool $setMaintenanceMode = false; }` |
| Both are registered as console.command services and the Maintenance bundle is enabled here | `Maintenance/DependencyInjection/services.xml:108-119`; `config/bundles.php:9` | `<service id="…SalesChannelMaintenanceEnableCommand"> <tag name="console.command"/>` |
| Caveat: `--all` is unfiltered by channel type (headless/API channels included) and does not restore prior per-channel values; the deployment helper instead records and restores only Storefront-type channels | `SalesChannelMaintenanceEnableCommand.php:55-82`; `vendor/shopware/deployment-helper/src/Services/ShopwareState.php:97-112` | `$criteria = new Criteria(); if (!$input->getOption('all')) { … }` / `SELECT LOWER(HEX(id)), maintenance FROM sales_channel WHERE type_id = 0x8a24…` |
| The code-defined full sequence is the deployment helper's `UpgradeManager`: messenger:setup-transports → system:update:finish (only when the stored version changed) → plugin:refresh → theme:refresh → scheduled-task:register → messenger:stop-workers → plugin/app lifecycle → `theme:compile --active-only` | `vendor/shopware/deployment-helper/src/Services/UpgradeManager.php:32-121` | `$this->processHelper->console(['system:update:finish', ...]); … console(['theme:compile', '--active-only']);` |
| That sequence is one command, `vendor/bin/shopware-deployment-helper run`, branching on install state | `vendor/shopware/deployment-helper/src/Command/RunCommand.php:22,48,64-69` | `#[AsCommand('run', description: 'Install or Update Shopware')]` |
| `shopware/deployment-helper` is required by the project and ships the binary | `vendor/shopware/deployment-helper/composer.json:10-12` | `"bin": ["bin/shopware-deployment-helper"],` |
| Helper flags for pipelines: `--skip-theme-compile`, `--skip-assets-install`, `--timeout` | `vendor/shopware/deployment-helper/src/Command/RunCommand.php:38-41` | `$this->addOption('skip-theme-compile', ...)` |
| The named console commands exist under exactly these names in 6.7.13 | `Framework/Plugin/Command/PluginRefreshCommand.php:21`; `Framework/Migration/Command/MigrationCommand.php:20-21`; `Framework/Migration/Command/MigrationDestructiveCommand.php:15`; `storefront/Theme/Command/ThemeCompileCommand.php:19`; `storefront/Theme/Command/ThemeRefreshCommand.php:14`; `Framework/MessageQueue/Command/RegisterScheduledTasksCommand.php:13` | `name: 'plugin:refresh', 'database:migrate', 'database:migrate-destructive', 'theme:compile', 'theme:refresh', 'scheduled-task:register'` |
| `database:migrate` defaults its identifier to `core` and takes `--all`/`--until`/`--limit` | `Framework/Migration/Command/MigrationCommand.php:53-58` | `->addArgument('identifier', ... , ['core'])->addOption('all', 'all', InputOption::VALUE_NONE, 'no migration timestamp cap')` |
| Rebuilding admin/storefront JS is `bin/build-administration.sh` / `bin/build-storefront.sh` | `bin/build-administration.sh:51-52,105-113` | `"${BIN_TOOL}" bundle:dump` … `npm run build` … `"${BIN_TOOL}" assets:install` |
| `shopware-cli project upgrade` flags are real at tag 0.18.4: `--target` (accepts an exact version, `recommended`, `latest-patch`; required with `--no-interaction`), `--dry-run` (stops after the read-only preflight), `--no-interaction`/`-n` (persistent root flag) | `https://raw.githubusercontent.com/shopware/shopware-cli/0.18.4/cmd/project/project_upgrade.go:13-17,71-76`; `cmd/root.go:44,96` | `projectUpgradeCmd.Flags().String("target", "", "Version to upgrade to (required with --no-interaction; also accepts 'recommended' or 'latest-patch')")` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A Shopware console command performs the Composer upgrade itself | absent | the only `system:*` commands are restore, dump, check, config:set/get, setup, update:finish, setup:staging, update:prepare, is-installed, generate-app-secret, install, configure-shop; `Framework/Update` has no Command directory |
| `system:update:prepare` computes the target version from composer.lock | absent | `Maintenance/System/Command/SystemUpdatePrepareCommand.php:46-47` — hardcoded `''` with a TODO |
| `composer update` alone finishes the upgrade | absent | the only post-update auto-script is `assets:install` (`composer.json:56-65`) |
| The root project pins a PHP platform version that must be bumped | absent | `composer.json:47-55` has only allow-plugins/optimize-autoloader/sort-packages; the lock platform block lists only composer-runtime-api |
| `shopware-cli` is part of this project's toolchain | absent | not in composer.json require/require-dev, not in `bin/`, no Makefile, no `.github/`; only `/.shopware-cli` in `.gitignore:22` and a "managed by shopware-cli" header in `compose.yaml:1` |
| The recipe-provided `bin/console` changed between 6.6 and 6.7, making the composer auto-script unsafe | absent | the two recipe copies are byte-identical; the version coupling is real but does not run through `bin/console` |
| `assets:install` hard-fails against a not-yet-migrated database | absent | `Kernel::boot` catches DBALException around plugin init and only warns; `ActiveAppsLoader` catches `\Throwable` and falls back to local apps — degradation, not a non-zero exit |
| `system:update:finish` does only migrations and assets | incomplete | the body calls those three commands, but the dispatched `UpdatePostFinishEvent` drives theme refresh + compile via the storefront subscriber |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| `system:update:finish` recompiles all active themes via `UpdatePostFinishEvent`, and does not when `STATE_SKIP_ASSET_BUILDING` is set | `https://raw.githubusercontent.com/shopware/shopware/v6.7.13.0/tests/integration/Storefront/Theme/Subscriber/UpdateSubscriberTest.php:32-47,75-96` (stripped from the vendor dist) |
| End-to-end upgrade order as executed in production deployments | `vendor/shopware/deployment-helper/src/Services/UpgradeManager.php:32-121` |
| Maintenance-mode bracketing with cache pool clears (helper-internal, restoring prior per-channel values) | `vendor/shopware/deployment-helper/src/Services/UpgradeManager.php:41-46,115-120`; `ShopwareState.php:97-112` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| After a 6.6.10.x → 6.7.0.x Composer upgrade `bin/build-administration.sh` is broken; maintainer answers the project's copy is still the 6.6 recipe file and `composer recipes:update` fixes it; two reporters confirm | 6.7.0.0 / 6.7.0.1 from 6.6.10.2 / 6.6.10.5 | closed | https://github.com/shopware/shopware/issues/10754#issuecomment-3022360936 |
| Core-side mitigation so the admin build works without the env var; issue closed as fixed by it | 6.7 | merged | https://github.com/shopware/shopware/pull/10925 |
| Precedent from 6.5 → 6.6: the project `bin/` scripts are not refreshed by the upgrade | 6.6 | closed | https://github.com/shopware/shopware/issues/7710 |
| The migration step after the composer update is where 6.7 upgrades break: SQLSTATE 1553 in `Migration1772007509ProductMainCategoryInheritance`; a fresh install succeeds | 6.7.3.0; 6.7.8.2 → 6.7.12.1 | closed | https://github.com/shopware/shopware/issues/18582 |
| Third-party guides recommend `composer update --no-scripts` then running the post-update tasks separately | unclear | open | https://werkstattl.com/blog/shopware-6-custom-update-guide/ |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which packages must be bumped in lockstep? | code | settled — only `shopware/core` (`composer.json:5-13`; `vendor/shopware/administration/composer.json:44`) |
| Which post-update console commands exist and what does `system:update:finish` run? | code | settled — `SystemUpdateFinishCommand.php:86-147` |
| Is there a console command that performs the Composer upgrade? | code | settled — none exists |
| Does `theme:compile` happen as part of `system:update:finish`? | deep | settled — yes, via `UpdatePostFinishEvent` → storefront `UpdateSubscriber.php:39-94`, unless `--skip-asset-build` |
| Do `sales-channel:maintenance:enable/disable --all` exist? | deep | settled — yes, both registered, `--all` supported (`SalesChannelMaintenanceEnableCommand.php:20-23,38-67`) |
| Is a Flex recipe refresh a required step? | deep | settled — yes; `symfony.lock` pins recipes per MAJOR.MINOR and the 6.6/6.7 recipe contents differ (bundle list, admin build scripts) |
| Can `shopware-cli` flags be cited? | deep | settled — yes at tag 0.18.4, but the tool is not part of this project |
| Is `composer update --no-scripts` code-required? | deep | no — running the auto-script early degrades silently and is redundant, but neither the deployment-helper nor shopware-cli passes `--no-scripts`; it remains a documentation convention |
| Is the MySQL 1553 migration retry present in this tree? | not settled | `MigrationRuntime` was not read in either round; it does not bear on any fact above |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Edit the `shopware/core` constraint in composer.json | "update the `shopware/core` version constraint to the target version" | `performing-updates.md:101-109` | yes — `composer.json:5-13` |
| Also raise `shopware/commercial`; otherwise the update resolves back to the installed version | "update the `shopware/commercial` requirement to a compatible version as well." | `upgrade-shopware.md:50-52` | not checkable — `shopware/commercial` is not in this project's composer.json |
| Run `composer update --no-scripts`, because scripts reference CLI commands that only work after updated recipes | "These commands will only work after updated recipes are installed." | `upgrade-shopware.md:60` | rationale partly wrong — the auto-script is `assets:install` via the recipe `bin/console`, which is byte-identical across 6.6/6.7; running it early under-delivers silently rather than failing |
| `composer recipes:update` force-updates all Flex-managed config files (called optional but recommended) | "To force-update all configuration files managed by Symfony Flex: `composer recipes:update`" | `upgrade-shopware.md:63-68` | yes as a step — and it is **not** optional: `symfony.lock` pins recipes per MAJOR.MINOR and the 6.7 recipe adds the `Service` bundle and new admin build scripts |
| `bin/console system:update:finish` applies all update routines, including migrations and recompiling themes | "including running database migrations and recompiling themes with the latest code." | `upgrade-shopware.md:80` | yes — migrations in the body, theme refresh+compile via `UpdatePostFinishEvent` (`UpdateSubscriber.php:39-94`) |
| Production sequence maintenance:enable → system:update:prepare → system:update:finish → maintenance:disable; prepare triggers events so extensions can prepare | "This command triggers events that allow extensions to prepare for the update." | `performing-updates.md:152-156` | events yes, but the new-version value handed to them is hardcoded `''` (`SystemUpdatePrepareCommand.php:46-53`) |
| Maintenance mode is `bin/console sales-channel:maintenance:enable --all` / `:disable --all` | "`bin/console sales-channel:maintenance:enable --all`" | `performing-updates.md:59-61` | yes — both commands and `--all` exist and are registered |
| The recommended path is the `shopware-cli project upgrade` wizard (backup → rewrite requirements → `composer update --with-all-dependencies` → `composer symfony:recipes:install --force --reset` → `vendor/bin/shopware-deployment-helper run` → report) | the six-step execution list | `project-commands/upgrade.md:81-86` | yes as to the runner's steps (`shopware-cli 0.18.4 internal/shop/upgrade/run.go:30-51,166-179`), but the tool is external to this project |
| Non-interactive preflight needs `--target` (exact version, `recommended`, or `latest-patch`) | the `--target` list | `project-commands/upgrade.md:105-109` | yes — `shopware-cli 0.18.4 cmd/project/project_upgrade.go:71-76`; `cmd/root.go:44,96` |
| The wizard blocks on extensions not managed by Composer | "Extensions living outside `vendor/` … block the upgrade readiness check." | `project-commands/upgrade.md:33` | not checkable from this tree |
| Raise PHP to the new minimum *before* updating Shopware | "Update the PHP version … *before* updating Shopware." | `performing-updates.md:69` | not checked in this case (see dev-41) |
| Under Docker/Deployment Helper hosting the helper runs `system:update:finish` automatically | "the Deployment Helper automatically runs the database migrations (`system:update:finish`) for you." | `docker.md:322` | yes — `UpgradeManager.php:50-108` |
| Split the 6.6 → 6.7 move from the PHP move, one thing at a time | "change **one thing at a time**, in order." | `docker.md:332` | not code-expressible |

Docs-only context (intent/business, code cannot express):

- Majors are the yearly breaking-change release and need special attention (`performing-updates.md:20`).
- The CLI wizard is local-only and never deploys (`project-commands/upgrade.md:12`).
- Run the console commands on production only after the matching code is deployed (`performing-updates.md:173`).
- Never jump several majors at once; back up first (`docker.md:354`).
- The web updater is only recommended for small instances (`performing-updates.md:181`).

Internal doc inconsistencies reported by the docs lane:

- `upgrade-shopware.md:72-80` finishes with `system:update:finish` alone; `performing-updates.md:150-164` prescribes `system:update:prepare` first.
- Manual route uses `composer update --no-scripts`; the wizard runs `composer update --with-all-dependencies`.
- Recipe refresh is `composer recipes:update` on the guide pages and `composer symfony:recipes:install --force --reset` on the CLI page.
- `docker.md:346` still instructs `shopware-cli project upgrade-check`, which `performing-updates.md:35` declares outdated.
- `performing-updates.md:106` pins an exact `"shopware/core": "6.7.0.0"`; `upgrade-shopware.md:50` says only "adjust" and adds `shopware/commercial`.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| (round 1, now withdrawn) `system:update:finish` does not recompile themes | it does: the dispatched `UpdatePostFinishEvent` drives `refreshThemes()` and a compile of every active theme, suppressed only by `--skip-asset-build` | `vendor/shopware/storefront/Theme/Subscriber/UpdateSubscriber.php:39-94`; `SystemUpdateFinishCommand.php:84-107` |
| `--no-scripts` is needed because the post-update scripts "only work after updated recipes are installed" | the recipe `bin/console` is identical across 6.6/6.7; the real effect of the early `assets:install` is that plugin/app bundles may be dropped from the boot and their assets silently not copied, and `system:update:finish` re-runs `assets:install` anyway. Neither the deployment-helper nor shopware-cli passes `--no-scripts` | `vendor/symfony/flex/src/ScriptExecutor.php:82-107`; `Kernel.php:146-153`; `Framework/App/ActiveAppsLoader.php:54-70`; `SystemUpdateFinishCommand.php:102-107` |
| `composer recipes:update` is "optional but recommended" | the recipes are pinned per MAJOR.MINOR and own `bin/*.sh`, `config/`, `public/index.php`; the 6.7 core recipe registers a bundle the 6.6 one does not | `symfony.lock`; recipes `shopware/core/{6.6,6.7}/manifest.json`; `config/bundles.php:12` |
| `system:update:prepare` lets extensions prepare for the update | it dispatches the events, but the new-version value passed to them is hardcoded `''` with a TODO | `Maintenance/System/Command/SystemUpdatePrepareCommand.php:46-53` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Manual path: adjust the Shopware version constraint in `composer.json` (and `shopware/commercial` if applicable), then run `composer update --no-scripts`, then `bin/console system:update:finish`, which runs update routines, database migrations and theme recompilation. | split and rewritten | the constraint and the theme-recompilation claim are both confirmed (`composer.json:5-13`; `UpdateSubscriber.php:39-94`), so this became facts 1 and 3 with their citations. `--no-scripts` is demoted from a requirement to a documentation convention: the deep pass shows neither the deployment-helper nor shopware-cli passes it, and the early auto-script degrades silently rather than failing. The old single fact also omitted the recipe refresh, which the deep pass shows is load-bearing — now fact 2 |
| Wrap the update in maintenance mode: `bin/console sales-channel:maintenance:enable --all` before and `bin/console sales-channel:maintenance:disable --all` after. | merged into fact 3 | commands and `--all` confirmed (`SalesChannelMaintenanceEnableCommand.php:20-23,38-67`), but maintenance bracketing does not need a fact of its own next to the console sequence it belongs to; the caveat that `--all` hits headless channels and does not restore prior values is recorded in the evidence |
| The recommended path is the `shopware-cli project upgrade` wizard from a clean Git working tree; for CI preflight use `shopware-cli project upgrade --no-interaction --target latest-patch --dry-run`. | removed | the query asks which composer.json constraint to change and which console commands to run. `shopware-cli` is an external Go binary, absent from this project's composer.json, `bin/`, Makefile and CI (`.gitignore:22`, `compose.yaml:1` are its only traces); its flags are real at tag 0.18.4 and its runner's steps reduce to exactly the composer update, recipe refresh and deployment-helper run that facts 1–3 already require. Retained as evidence, not as a required fact |
