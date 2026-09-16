# `dev-14` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-14` · `dev` · `Events` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** I wrote a subscriber class in my plugin but it never fires — which interface and which service tag (`shopware.event_subscriber`?) register it?

**Expected answer — every fact an answer must contain:**

1. The class implements `Symfony\Component\EventDispatcher\EventSubscriberInterface` and returns `<event> => <method>` pairs from `public static function getSubscribedEvents(): array`, e.g. `ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded'`.  `[code: Framework/Plugin/Command/Scaffolding/Stubs/event-subscriber.stub:6-17]`
2. The registering service tag is Symfony's `kernel.event_subscriber`. `shopware.event_subscriber` does not exist — the literal string has zero occurrences across `vendor/shopware/` and nothing consumes it. Core sets no global `autoconfigure`, so the explicit tag (or the plugin's own `<defaults autoconfigure="true"/>`) is required; the class alone is not enough and no error is raised when the tag is missing.  `[code: Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29]`
3. The service definition must sit in `<plugin>/src/Resources/config/services.{xml,yaml,php}`: `Bundle::registerContainerFile()` loads only files matching that glob, and `Plugin extends Bundle` inherits it. A definition anywhere else is never loaded — the mechanical cause of "never fires".  `[code: Framework/Bundle.php:243-252]`

**Trap:** The query offers the invented tag `shopware.event_subscriber`. The real tag is Symfony's `kernel.event_subscriber`; an answer that confirms the invented tag is wrong.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/listening-to-events.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Subscriber implements Symfony's `EventSubscriberInterface` with `getSubscribedEvents(): array`; this is what `plugin:create --create-event-subscriber` scaffolds | `Framework/Plugin/Command/Scaffolding/Stubs/event-subscriber.stub:6-17` | `class MySubscriber implements EventSubscriberInterface { public static function getSubscribedEvents(): array { return [ ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded' ]; }` |
| The scaffolder emits the tag `kernel.event_subscriber` into the plugin's `services.xml` | `Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29` | `<service id="{{ namespace }}\Subscriber\MySubscriber"> <tag name="kernel.event_subscriber"/> </service>` |
| Core registers its own subscribers with the same tag | `Framework/DependencyInjection/app.php:191-192` | `$services->set(AppLoadedSubscriber::class)->tag('kernel.event_subscriber');` |
| Only `Resources/config/services.*` is auto-loaded from a bundle | `Framework/Bundle.php:243-252` | `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }` |
| `Bundle::build()` calls `registerContainerFile()`, and `abstract class Plugin extends Bundle` | `Framework/Bundle.php:34-42`, `Framework/Plugin.php:17` | `$this->registerContainerFile($container);` / `abstract class Plugin extends Bundle` |
| Alternatives exist: `#[AsEventListener]` on a plain class (autoconfigured services only), and the `kernel.event_listener` tag with `event`/`method`/`priority` | `Framework/App/Subscriber/VerifyAppUrlListener.php:9-16`, `Framework/DependencyInjection/cache.xml:122` | `#[AsEventListener] class VerifyAppUrlListener` / `<tag name="kernel.event_listener" event="…CategoryIndexerEvent" method="invalidateCategoryRouteByCategoryIds" priority="2000" />` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The registering tag is `shopware.event_subscriber` | absent | grep for the literal string across `vendor/shopware/` (core, storefront, administration) returns zero hits; nothing consumes such a tag. `kernel.event_subscriber` has 164 occurrences in `vendor/shopware/core` alone |
| Core enables `autoconfigure` globally, so an untagged subscriber is picked up automatically | absent | no global `<defaults autoconfigure="true">` block in core DI XML; `autoconfigure` appears on exactly one service definition (`CacheControlListener`, `Framework/DependencyInjection/cache.xml:200`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The canonical class + tag pair Shopware itself scaffolds for a plugin subscriber | `Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:31-49` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Forum thread: subscriber stopped loading after a class rename because `services.xml` still held the old FQCN; the working registration shown uses `kernel.event_subscriber` | unclear | closed | https://forum.shopware.com/t/plugin-subscriber-issue/86860 |
| A method bound to `ProductEvents::PRODUCT_PRICE_LOADED_EVENT` never fired while `PRODUCT_LOADED_EVENT` in the same class did — the constant is declared but reportedly never dispatched | 6.6 | closed | https://github.com/shopware/shopware/issues/4524 |
| Three core subscribers declared `getSubscribedEvents()` without the `: array` return type (Symfony 7.3 deprecation) | 6.8-dev | closed | https://github.com/shopware/shopware/issues/16738 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `shopware.event_subscriber` exist as a DI tag in 6.7? | code lane | No — zero occurrences in `vendor/shopware/`; `kernel.event_subscriber` is the only registering tag |
| Is the tag mandatory, or does autoconfiguration register an untagged `EventSubscriberInterface`? | code lane | Mandatory — core sets no global `autoconfigure`, so a plugin `services.xml` does not inherit it |
| Which interface and namespace must a 6.7 plugin subscriber implement? | code lane | `Symfony\Component\EventDispatcher\EventSubscriberInterface`; the scaffolding stub declares `getSubscribedEvents(): array` |
| Which config paths does a plugin bundle auto-load? | code lane | `Resources/config/services.*` (plus `services_test.*` in the test env), loaded by `Bundle::build()` without an override |
| Is `PRODUCT_PRICE_LOADED_EVENT` still dispatched in 6.7? | not settled | Out of scope for this case's facts (interface + tag); a dead-constant question belongs to `dev-15` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The class implements `EventSubscriberInterface`, exactly as in Symfony | "To start creating a subscriber, we need to create a class first implementing EventSubscriberInterface." | `listening-to-events.md:43-44` | yes |
| The tag is `kernel.event_subscriber` | "you need to add the `kernel.event_subscriber` tag to your subscriber for it to be recognized as such." | `listening-to-events.md:127` | yes |
| An untagged subscriber silently never runs | "Creating the subscriber class alone is not enough … there may be no obvious error" | `listening-to-events.md:117-120` | yes |
| Registration requires a `services.php` in `src/Resources/config/` | "This is done by either placing a file with name `services.php` into a directory called `src/Resources/config/`." | `listening-to-events.md:35-36` | yes — code shows `services.*` (xml/yaml/php) all qualify |
| Versioned entities dispatch the event once per version; check `Defaults::LIVE_VERSION` | "Therefore, you can check the version of the context to make sure you're only reacting to the live version." | `listening-to-events.md:80-82` | not checked by the code lane — dropped from the facts |

Intent context (not a fact in the snippet): the docs frame subscribers as observation and enrichment, not a substitute for decorating a service, and advise against heavy computation or DB queries inside them (`listening-to-events.md:16-18`, `architecture/events.md:22-23`).

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| (none material) — the docs use `kernel.event_subscriber` throughout and `shopware.event_subscriber` has zero occurrences in the docs clone, matching the code | the tag consumed is `kernel.event_subscriber` | `Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29` |
| Docs name `services.php` specifically | the loader glob is `Resources/config/services.*`, so `.xml`, `.yaml` and `.php` are equivalent | `Framework/Bundle.php:243-252` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `For versioned entities (orders, products) the event fires once per version; check `$event->getContext()->getVersionId() !== Defaults::LIVE_VERSION` (`Shopware\Core\Defaults::LIVE_VERSION`) to skip non-live versions.` | removed | Doc claim only; the code lane did not examine version dispatch, so no code finding backs it. It is a technical claim, not intent context, so it cannot be admitted as `[docs-only]`. It also does not decide whether an answer to "which interface, which tag" is usable. |
| `It must be registered in `services.php` with the tag `kernel.event_subscriber` — creating the class alone is not enough and Shopware gives no error when the tag is missing.` | rewritten | Code confirms the tag and the silence, and adds two things the old wording missed: `shopware.event_subscriber` does not exist at all, and core sets no global `autoconfigure`, so the tag is genuinely mandatory. |
| — | added (fact 3) | `Bundle::registerContainerFile()` loads only `Resources/config/services.*`; a definition outside that glob is never loaded, which is the other mechanical cause of the reported symptom. |
