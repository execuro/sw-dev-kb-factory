# `dev-61` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-61` · `dev` · `Hosting & ops` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` (read from `shopware/shopware` @ `v6.7.13.0`; the `shopware/elasticsearch` bundle is not installed in this project) |

**Query:** After the upgrade my Elasticsearch index has to be rebuilt — where do I set the shard and replica counts and which reindex command do I run?

**Expected answer — every fact an answer must contain:**

1. Storefront shard and replica counts are set under `elasticsearch.index_settings.number_of_shards` / `number_of_replicas` (a free-form array node, so any index-level setting belongs there), each bound to the env vars `SHOPWARE_ES_NUMBER_OF_SHARDS` / `SHOPWARE_ES_NUMBER_OF_REPLICAS`. In 6.7 both env defaults are **empty** — Shopware no longer forces 3 shards / 3 replicas, and a null value is stripped from the index-create body so the cluster default applies. `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml]` `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Framework/Indexing/IndexCreator.php]`
2. These settings are applied only when an index is created, and no command applies them to an existing index — so changing them means a full reindex with `bin/console es:index` (there is no `es:reindex` command). Without `--no-queue` the command only dispatches `ElasticsearchIndexingMessage`s, so a messenger worker must run; the alias is switched by the `CreateAliasTask` scheduled task, or manually with `bin/console es:create:alias`, and superseded indices are removed with `es:index:cleanup`. `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Framework/Command/ElasticsearchIndexingCommand.php]` `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/DependencyInjection/services.php:337-351]`
3. The admin search indices are configured and rebuilt separately: `elasticsearch.administration.index_settings` with `SHOPWARE_ADMIN_ES_NUMBER_OF_SHARDS` / `SHOPWARE_ADMIN_ES_NUMBER_OF_REPLICAS`, which in 6.7 still default to `3`/`3` (marked `@deprecated tag:v6.8.0` — to be emptied in 6.8 to match the storefront), and the command `bin/console es:admin:index`; `es:index` does not touch them. `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml]` `[code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Framework/Command/ElasticsearchAdminIndexingCommand.php]`

**Trap:** The docs' "three shards and three replicas by default" is no longer true for the storefront indices in 6.7 — the defaults were emptied so the cluster decides, and only the *admin* indices still default to 3/3.

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html
<!-- expected:end -->

## Evidence — code (decisive)

All citations are `github.com/shopware/shopware` at `refs/tags/v6.7.13.0` — `shopware/elasticsearch` is not installed in this project (`find vendor -iname '*elasticsearch*'` → no hits).

| fact | citation | excerpt |
| --- | --- | --- |
| Storefront shard/replica settings and their env bindings, defaults empty | `src/Elasticsearch/Resources/config/packages/elasticsearch.yaml` | `number_of_shards: '%env(int-or-null:SHOPWARE_ES_NUMBER_OF_SHARDS)%'` / `env(SHOPWARE_ES_NUMBER_OF_SHARDS): ""` |
| Admin indices have a separate block, still defaulting to 3/3, deprecated for 6.8 | same file | `# @deprecated tag:v6.8.0 - change SHOPWARE_ADMIN_ES_NUMBER_OF_SHARDS and SHOPWARE_ADMIN_ES_NUMBER_OF_REPLICAS to empty string …` |
| `index_settings` is a free-form `variablePrototype` node that becomes `settings.index` in the index body | `src/Elasticsearch/DependencyInjection/Configuration.php:48,79`; `services.php:112-118`; `ElasticsearchExtension.php:24-33` | `->arrayNode('index_settings')->variablePrototype()->end()->end()` / `'index' => '%elasticsearch.index_settings%'` |
| Settings are applied at index creation only | `src/Elasticsearch/Framework/Indexing/IndexCreator.php` | `$this->client->indices()->create(['index' => $index, 'body' => $event->getConfig()]);` |
| Null shard/replica values are stripped, so the cluster default applies | `src/Elasticsearch/Framework/Indexing/IndexCreator.php` (constructor) | `if (… $config['settings']['index']['number_of_shards'] === null) { unset(…); }` |
| `number_of_replicas` is re-applied via `putSettings` when the alias is switched | `src/Elasticsearch/Framework/Indexing/CreateAliasTaskHandler.php:103-111` | `'number_of_replicas' => $this->config['settings']['index']['number_of_replicas'], 'refresh_interval' => null` |
| `es:index` dispatches to the queue unless `--no-queue`, which also runs the alias handler inline | `src/Elasticsearch/Framework/Command/ElasticsearchIndexingCommand.php` | `if ($input->getOption('no-queue')) { $this->aliasHandler->run(); }` |
| `es:index` aborts when indexing is disabled | same file | `if (!$this->enabled) { $this->io->error('Elasticsearch indexing is disabled'); return self::FAILURE; }` |
| Admin search has its own command driven by `AdminSearchRegistry` | `src/Elasticsearch/Framework/Command/ElasticsearchAdminIndexingCommand.php` | `name: 'es:admin:index'` |
| Alias switching after a queued run is a scheduled task whose handler is a messenger handler | `src/Elasticsearch/DependencyInjection/services.php:337-351` | `$services->set(CreateAliasTask::class)->tag('shopware.scheduled.task');` |
| Full 6.7 command set | `src/Elasticsearch/Framework/Command/` (dir listing + `AsCommand`) | `es:index, es:admin:index, es:create:alias, es:reset, es:admin:reset, es:mapping:update, es:admin:mapping:update, es:index:cleanup, es:status, es:test:analyzer, es:admin:test` |
| Other creation-time index settings in the same block | `src/Elasticsearch/Resources/config/packages/elasticsearch.yaml` | `'mapping.total_fields.limit': 50000` … `max_result_window: 10000` (admin: 500000) |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated `es:reindex` command | absent | The 6.7.13.0 command directory contains no such command; reindexing means `es:index` (optionally after `es:reset`) |
| Shards/replicas can be changed on an existing index by a Shopware command | absent | No command applies `index_settings` to existing indices; `es:mapping:update` updates mappings only, and the only `putSettings` call is inside `CreateAliasTaskHandler` (replicas + refresh_interval, during an indexing run) |
| The Elasticsearch bundle is part of this project's vendor tree | absent | `vendor/shopware/` holds only administration, core, deployment-helper, storefront |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — the bundle is not installed locally and tests were not fetched from GitHub._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| UPGRADE-6.7.md records the removal of the built-in 3-shard/3-replica default so the search server decides | 6.7 | merged | UPGRADE-6.7.md |
| Conflicting statements about which file/node carries the settings (`elasticsearch.yml` vs `shopware.yml`) | 6.7 | open | developer.shopware.com elasticsearch-setup |
| Shipped defaults blew up a single-node cluster (~720 shards, mostly unassigned); reporter asked for shard/replica env vars; closed as not planned in 2024 | 6.4–6.6 | closed | github.com/shopware/shopware/issues/1752 |
| Indexing "succeeds" but the storefront shows nothing because the alias step is separate | 6.6 / 6.7 | open | elasticsearch-debugging docs |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact config path for shard/replica settings? | code lane | `elasticsearch.index_settings.*` (bundle config), plus `elasticsearch.administration.index_settings.*` for admin — not a node under `shopware.` |
| Does 6.7 still ship a default for shards/replicas? | code lane | Storefront env defaults are empty strings (`int-or-null`); admin still defaults to 3/3, deprecated for 6.8 |
| Is `index_settings` merged per key or replaced wholesale? | code lane | Free-form `variablePrototype` array node; env vars now exist for the shard/replica keys, which is what issue #1752 asked for |
| Which commands exist, and which creates the alias? | code lane | Full set listed above; the alias is switched by `CreateAliasTask`/`CreateAliasTaskHandler`, or manually by `es:create:alias`; `es:index --no-queue` runs the alias handler itself |
| Does `es:index` use the queue? | code lane | Yes by default — it dispatches `ElasticsearchIndexingMessage`s; `--no-queue` indexes inline |
| Does a mapping-version guard force a reindex after upgrade? | not examined by the code lane | Left open; no fact depends on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Default is three shards and three replicas, overridable in `config/packages/elasticsearch.yml` | "Shopware will use by default three shards and three replicas for the created index." | `elasticsearch/elasticsearch-setup.md` | **no** for the storefront in 6.7 (defaults emptied); still true for the admin indices |
| Override keys are `number_of_shards` / `number_of_replicas` under `elasticsearch.index_settings` | `elasticsearch:\n  index_settings:\n    number_of_shards: 1` | same | yes |
| `index_settings` available since 6.4.12.0 | "This configuration is available since Shopware version 6.4.12.0" | same | not code-checkable at the 6.7 pin — excluded from the facts |
| The reindex command is `es:index` | "Normally, you can index by executing the command `bin/console es:index`." | same | yes |
| A full-shop reindex uses `dal:refresh:index --use-queue` | "For a reindex of the whole shop, you can use the command `bin/console dal:refresh:index --use-queue`." | same / `elasticsearch-debugging.md` | not examined by the code lane — excluded from the facts |
| The alias may have to be created manually with `es:create:alias` | "Some systems require you to manually execute `bin/console es:create:alias`" | same | consistent — the alias is otherwise switched by the `CreateAliasTask` scheduled task |
| Each indexing run creates a new index; `es:index:cleanup` removes unused ones | "`es:index:cleanup` to remove unused indices" | `elasticsearch-debugging.md` | yes — `IndexCreator` creates a new index and the command exists |
| Indexing is driven through the message queue, so workers must run | "the data is written in bulks to the message queue" | `elasticsearch-setup.md` | yes |
| Admin indices have their own commands | `bin/console es:admin:index` | `elasticsearch-setup.md` | yes |
| Elasticsearch ships as a separate bundle a project may not have installed | "provided in the shopware/elasticsearch bundle" | `elasticsearch-setup.md` | yes — absent from this project's vendor tree |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| "Shopware will use by default three shards and three replicas for the created index." | In 6.7 the storefront env defaults are empty strings and null values are stripped from the create body, so the cluster decides; only `elasticsearch.administration.index_settings` still defaults to 3/3, and that is deprecated for 6.8 | `src/Elasticsearch/Resources/config/packages/elasticsearch.yaml`; `src/Elasticsearch/Framework/Indexing/IndexCreator.php` |
| The setup page documents no env vars for shards/replicas, only the YAML keys | Both keys are bound to `SHOPWARE_ES_NUMBER_OF_SHARDS` / `SHOPWARE_ES_NUMBER_OF_REPLICAS` (admin: `SHOPWARE_ADMIN_ES_*`) | same yaml |
| The setup page says the alias must be created manually "on some systems"; the debugging page says it is normally automatic and only needed on older versions | `CreateAliasTask` is a registered scheduled task whose handler is a messenger handler, so a queued run needs the scheduled-task runner; `es:create:alias` is the manual equivalent | `src/Elasticsearch/DependencyInjection/services.php:337-351` |
| `dal:refresh:index --use-queue` is presented as the reindex command for Elasticsearch | The Elasticsearch bundle's own reindex entry point is `es:index`; `dal:refresh:index` was not examined by the code lane | `src/Elasticsearch/Framework/Command/ElasticsearchIndexingCommand.php` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Shard and replica overrides go in `config/packages/elasticsearch.yml` under `elasticsearch.index_settings.number_of_shards` and `number_of_replicas` (file support added in 6.4.12.0). | rewritten | Config path confirmed, but the fact missed what actually changed at the 6.7 pin: the env bindings `SHOPWARE_ES_NUMBER_OF_SHARDS`/`_REPLICAS` and their now-empty defaults, with null stripped from the create body. The 6.4.12.0 version note was dropped — it is a doc claim not checkable at the 6.7 pin and does not decide whether an answer is usable. |
| Reindex the whole shop with `bin/console dal:refresh:index --use-queue` (always with `--use-queue`) after `bin/console cache:clear`; the queued messages are processed by `bin/console messenger:consume`, and some systems additionally need `bin/console es:create:alias`. | rewritten | The code-confirmed Elasticsearch reindex command is `es:index` (queued by default, `--no-queue` inline; no `es:reindex` exists). `dal:refresh:index` and the `cache:clear` prerequisite were not examined by the code lane and are recorded as doc claims instead of facts. The tolerance-shaped "some systems additionally need" was replaced with the mechanism: the alias is switched by `CreateAliasTask`, or manually by `es:create:alias`. |
| Activation is via `.env`: `OPENSEARCH_URL="<host>:9200"`, `SHOPWARE_ES_INDEXING_ENABLED=1`, `SHOPWARE_ES_ENABLED=1`, `SHOPWARE_ES_INDEX_PREFIX=sw`; `SHOPWARE_ES_ENABLED=1` with `SHOPWARE_ES_INDEXING_ENABLED=0` gives read-only search. | removed | None of these variables were examined by the code lane, and activation is not what the query asks about (where to set shards/replicas, which reindex command). Its slot went to the load-bearing fact the old set missed: the admin search indices have a separate settings block that still defaults to 3/3 and a separate `es:admin:index` command, so an answer covering only `es:index` leaves the admin indices unrebuilt. |
