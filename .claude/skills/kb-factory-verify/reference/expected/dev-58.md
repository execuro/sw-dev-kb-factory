# `dev-58` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-58` · `dev` · `Hosting & ops` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** My shopware.yaml still uses redis_url — how do I define the named Redis connections in Shopware 6.7 and which eviction policy does each one need?

**Expected answer — every fact an answer must contain:**

1. In 6.7 connections are declared in `config/packages/shopware.yaml` under `shopware.redis.connections.<name>.dsn` — `dsn` is the only child node and it is required — and each entry is compiled into the container service `shopware.redis.connection.<name>`, resolved at runtime through `RedisConnectionProvider::getConnection()`. `[code: Framework/DependencyInjection/Configuration.php:1581-1600]` `[code: Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:41-56]`
2. `redis_url` no longer exists anywhere in 6.7 core; every subsystem references a connection *name* instead: `shopware.cart.storage.type: redis` + `storage.config.connection`, `shopware.number_range.increment_storage: redis` + `config.connection`, `shopware.cache.invalidation.delay_options.storage: redis` + `delay_options.connection`, `shopware.increment.<pool>.config.connection`. Selecting redis storage without a connection name fails the container build (cart: `redisNotConfiguredForCartStorage()`; number range: *"The `config.connection` option is required when `increment_storage` is set to `redis`"*; invalidation delay: `missingRequiredParameter()`). `[code: Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:27-34]` `[code: Framework/DependencyInjection/Configuration.php:937-951]` `[code: Framework/Adapter/Cache/CacheCompilerPass.php:22-25]`
3. Eviction policy is not a Shopware setting — core neither validates nor prescribes one per named connection; it is configured on the Redis instances, and because a policy cannot differ per database the documented split is one instance per data class: ephemeral HTTP/object cache `volatile-lru` without durable persistence, sessions `allkeys-lru` with RDB/AOF, durable cart / number range / lock store / increment `volatile-lru` with persistence. The only enforcement in code is Symfony's `RedisTagAwareAdapter`, which throws unless the cache pool's Redis `maxmemory-policy` is `noeviction` or a `volatile-*` policy. `[docs-only]` `[code: vendor/symfony/cache/Adapter/RedisTagAwareAdapter.php:89-92]`

**Trap:** `redis_url` is the pre-6.6.8.0 key and is gone from 6.7 core (zero occurrences); the docs still present it only as the "before" form and the number-ranges page even instructs configuring it, so an answer that keeps `redis_url` is wrong.

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/infrastructure/redis.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Config tree: `connections` keyed by name, single required `dsn` | `Framework/DependencyInjection/Configuration.php:1581-1600` | `->arrayNode('connections')->useAttributeAsKey('name')->arrayPrototype()->children()->scalarNode('dsn')->isRequired()` |
| Each connection becomes service `shopware.redis.connection.<name>`; non-string dsn throws `AdapterException::invalidRedisConnectionDsn` | `Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:41-56` | `$serviceId = 'shopware.redis.connection.' . $name;` |
| Runtime lookup by name; unknown name throws `unknownRedisConnection` | `Framework/Adapter/Redis/RedisConnectionProvider.php:28-45` | `if (!$this->hasConnection($connectionName)) { throw AdapterException::unknownRedisConnection($connectionName); }` |
| Cart storage enum mysql\|redis + `config.connection`; service built via provider | `Framework/DependencyInjection/Configuration.php:896-906`; `Checkout/DependencyInjection/cart.xml:552-555` | `<argument>%shopware.cart.storage.config.connection%</argument>` |
| Redis cart storage without connection = build error | `Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:27-34` | `throw DependencyInjectionException::redisNotConfiguredForCartStorage();` |
| Number range `increment_storage` + validated `config.connection` | `Framework/DependencyInjection/Configuration.php:937-951` | `->thenInvalid('The "config.connection" option is required when "increment_storage" is set to "redis".')` |
| Cache invalidation `delay_options.storage` / `.connection` | `Framework/DependencyInjection/Configuration.php:739-752`; `Framework/DependencyInjection/cache.xml:17-20` | `<argument>%shopware.cache.invalidation.delay_options.connection%</argument>` |
| Delay storage redis without connection throws at compile time | `Framework/Adapter/Cache/CacheCompilerPass.php:22-25` | `throw AdapterException::missingRequiredParameter('shopware.cache.invalidation.delay_options.connection');` |
| Increment pools wire Redis only when `config.connection` is present | `Framework/Increment/IncrementerGatewayCompilerPass.php:85-92` | `if (\array_key_exists('connection', $config)) { … } else { return $gatewayServiceName; }` |
| Tag-aware cache pool refuses non-volatile/non-noeviction policies (Symfony, not Shopware) | `vendor/symfony/cache/Adapter/RedisTagAwareAdapter.php:89-92` | `if ('noeviction' !== $eviction && !str_starts_with($eviction, 'volatile-')) { throw new LogicException(…) }` |
| Cache pool namespaces are prefixed with `%shopware.cache.redis_prefix%` so pools can share an instance | `Framework/DependencyInjection/CompilerPass/RedisPrefixCompilerPass.php:19-25` | `$definition->replaceArgument(1, '%shopware.cache.redis_prefix%' . $definition->getArgument(1));` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `redis_url` is still a usable key in 6.7 | absent | `grep -rn redis_url vendor/shopware/core` → 0 hits; UPGRADE-6.7.md maps `shopware.cart.redis_url` → `cart.storage.config.connection`, `shopware.number_range.redis_url` → `number_range.config.connection`, `delay_options.dsn` → `delay_options.connection`, `increment.<name>.config.url` → `config.connection` |
| Core states or enforces an eviction policy per named connection | absent | `grep -rni 'maxmemory\|noeviction\|volatile-lru\|allkeys'` over `vendor/shopware/core` → no cache/redis hit; only Symfony's `RedisTagAwareAdapter:89-92` enforces anything |
| `shopware.redis.connections` entries support options beyond `dsn` | absent | array prototype declares only `dsn` (`Configuration.php:1590-1595`); the pass passes only `$connection['dsn']` to the factory |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — the dist package strips functional tests; no test for the compiler pass or provider was present in vendor._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 6.6.8.0 changelog announces named connections and deprecates the old dsn/url keys for removal in the next major | 6.6.8.0 → 6.7 | merged | `changelog/release-6-6-8-0/2024-10-04-improved-redis-config-structure.md` |
| Blog and doc summaries disagree on which eviction policy belongs to which use case (allkeys-lru vs volatile-lru for the cache instance) | 6.6 / 6.7 | open | kickbyte.de/en/blog/shopware-6-redis-configuration-mistakes |
| `number-range:migrate SQL Redis` rejected once Redis is the configured storage | 6.7 | open | forum.shopware.com/t/108010 |
| Confusion whether Redis is hard-required in 6.7 | 6.7 | open | forum.shopware.com/t/107469 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Do the legacy `redis_url` / `*.url` keys still exist in 6.7? | code lane grep + config tree | No — removed; only `shopware.redis.connections` + per-subsystem `connection:` |
| Which key references a named connection, for which subsystems? | code lane | `connection:` — cart storage, number range, cache invalidation delay, increment pools |
| What service id is generated, and does an undefined name fail hard? | code lane | `shopware.redis.connection.<name>`; unknown name throws `unknownRedisConnection`, missing name is a container build error |
| Does any source file state an eviction policy per use case? | code lane | No — eviction guidance is documentation-only; only Symfony's tag-aware adapter enforces a policy |
| Is Redis a hard dependency in 6.7? | code lane | No — cart storage and increment storage default to `mysql`, invalidation delay storage defaults to `mysql` |
| Is the `number-range:migrate` source-argument error intended? | not examined by the code lane | Left open; no fact depends on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Named connections live in `shopware.yaml` under `shopware.redis.connections`, since v6.6.8.0 | "Starting with v6.6.8.0, Shopware supports configuring different reusable Redis connections in the `config/packages/shopware.yaml` file under the `shopware` section" | `guides/hosting/infrastructure/redis.md` | yes (location/shape; the version statement itself is not code-checkable) |
| Names must be unique and become part of container service names | "the names are used as part of the service names in the container, so they should follow the service naming conventions" | `guides/hosting/infrastructure/redis.md` | yes — `shopware.redis.connection.<name>` |
| Env vars may be used inside the DSN | "It's possible to use environment variables in the DSN string" | `guides/hosting/infrastructure/redis.md` | not checked by the code lane — excluded from the facts |
| `?persistent=1` controls connection pooling, not data persistence | "the persistent flag influences connection pooling, not persistent storage of data" | `guides/hosting/infrastructure/redis.md` | not checked by the code lane — excluded from the facts |
| Eviction policies cannot differ per database, so use separate instances | "it is not possible to use different eviction policies for different databases in the same Redis instance" | `guides/hosting/infrastructure/redis.md` | not expressible in code — admitted as `[docs-only]` |
| Ephemeral cache → `volatile-lru` | "For key eviction policy you should use `volatile-lru`, which only automatically deletes data that is expired" | `guides/hosting/infrastructure/redis.md` | consistent with `RedisTagAwareAdapter:89-92` |
| Sessions → `allkeys-lru` with RDB/AOF | "`allkeys-lru` should be used as key eviction policy here" | `guides/hosting/infrastructure/redis.md` | `[docs-only]` |
| Cart / number range / lock store / increment → `volatile-lru`, persisted | "As the data is critical … `volatile-lru` should be used." / "The cart, number range, lock store, and increment data are what should be stored in this instance." | `guides/hosting/infrastructure/redis.md` | `[docs-only]` |
| Per-subsystem forms: `cart.storage.config.connection`, `number_range.config.connection`, `increment.<pool>.config.connection` | `connection: 'persistent'` | `performance/{cart-storage,number-ranges,increment}.md` | yes |
| Session, cache pool and lock store are configured with raw DSNs / Symfony-native options | `framework: session: handler_id: "redis://host:port/0"`; `framework: lock: 'redis://host:port/dbindex'` | `performance/{session,lock-store,caches}.md` | not examined by the code lane — no fact asserts named connections for these |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| The number-ranges migration section instructs configuring `shopware.number_range.redis_url` | The key does not exist in 6.7 core (0 grep hits); only `number_range.config.connection` | `Framework/DependencyInjection/Configuration.php:937-951`; grep over `vendor/shopware/core` |
| The cart-storage page presents `redis_url` merely as the "Before v6.6.8.0" form and never says it was removed | Removed in 6.7; per UPGRADE-6.7.md it maps to `cart.storage.config.connection` | `Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:27-34` |
| `cart:migrate {fromStorage} {redisUrl?}` still takes a raw Redis URL | Not examined by the code lane — recorded, unsettled, no fact depends on it | — |
| Named connections can be referenced "in the configuration of different subsystems", yet session/cache/lock-store pages show only raw DSNs | Code confirms the `connection:` model for cart, number range, invalidation delay and increment; session/lock/cache-pool wiring was not examined | `Framework/Adapter/Redis/RedisConnectionProvider.php:28-45` |
| Eviction-policy guidance is stated as a Shopware recommendation | Core contains no eviction-policy string or validation at all | grep over `vendor/shopware/core` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Named connections are declared in `config/packages/shopware.yaml` as `shopware.redis.connections.<name>.dsn: 'redis://host:port/dbindex'`, supported since v6.6.8.0; DSNs may use env vars such as `%env(REDIS_EPHEMERAL)%/1`. | rewritten | Config location and shape confirmed by the config tree; the env-var clause was a doc claim the code lane never checked, so it was dropped and the code-confirmed service-id/provider mechanics added in its place. |
| Use a separate Redis instance per data category with its own eviction policy: ephemeral HTTP/object cache `volatile-lru`, sessions persisted with RDB/AOF and `allkeys-lru`, durable critical data (cart, number ranges, lock store, increment) persisted with `volatile-lru`. | rewritten | Kept as `[docs-only]` operational guidance — code neither states nor validates any eviction policy — with the one code-enforced constraint (Symfony `RedisTagAwareAdapter` requires `noeviction` or `volatile-*`) added, which also settles the community disagreement over `allkeys-lru` for the cache instance. |
| `persistent=1` appended to the DSN enables connection pooling only, not persistent storage of the data; connection names become part of container service names, so they must be unique and follow service naming conventions. | removed | The `persistent=1` half is an unconfirmed doc claim the code lane did not check; the service-name half is code-confirmed and moved into fact 1. Replaced by the load-bearing fact the old set missed: `redis_url` is gone and every subsystem now takes a connection *name*, with a hard container build error when it is missing. |
