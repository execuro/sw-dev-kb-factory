# `dev-18` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-18` · `dev` · `Checkout & Cart` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** My plugin's cart processor adds a surcharge line item, but it is added again on every recalculation and its price is stale after the customer changes the quantity — how do I split the work between the collector and the processor?

**Expected answer — every fact an answer must contain:**

1. Only the processor can place the surcharge in the cart: `CartDataCollectorInterface::collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior)` has no `$toCalculate` parameter at all, while `CartProcessorInterface::process()` additionally receives `$toCalculate`, which is a brand-new empty `Cart` on every calculation pass (only token, comment and the data collection are carried over). Nothing survives into it unless a processor adds it, so the surcharge must be (re-)added to `$toCalculate` on every pass; all collectors run to completion before any processor runs. `[code: Checkout/Cart/CartDataCollectorInterface.php:12]` `[code: Checkout/Cart/CartProcessorInterface.php:12]` `[code: Checkout/Cart/Processor.php:34-52]` `[code: Checkout/Cart/Processor.php:86-102]`
2. The duplication comes from the recalculation loop, and the plugin must guard against it itself: `CartRuleLoader` calls `Processor::process` repeatedly (bounded by `MAX_ITERATION = 7`) and feeds each result cart back in as the *input* cart of the next pass, and the final cart is persisted by `CartService::recalculate()`. There is no core de-duplication step, and `LineItemCollection::add()` on an already-present id does not replace the item — it **sums the quantities** and marks it modified. The processor must therefore use a deterministic line-item id and take the existing surcharge from `$original` (or use `exists()`/`set($key, $lineItem)`) instead of constructing a new item each pass — the pattern `CustomCartProcessor::process()` follows: read the item from `$original`, recalculate it from its price definition, then add it to `$toCalculate`. `[code: Checkout/Cart/CartRuleLoader.php:145-177]` `[code: Checkout/Cart/CartRuleLoader.php:34]` `[code: Checkout/Cart/LineItem/LineItemCollection.php:30-53]` `[code: Checkout/Cart/CustomCartProcessor.php:48-75]` `[code: Checkout/Cart/SalesChannel/CartService.php:169-173]`
3. The stale price comes from the `CartDataCollection` being carried forward — `Processor` does `$cart->setData($original->getData())` ("move data from previous calculation into new cart"), so anything `collect()` cached under a key outlives a quantity change unless the key or a guard encodes the inputs (core guards it with a context hash in `ProductCartProcessor`). The quantity-dependent price must be recomputed inside `process()` on every pass: stamp the current quantity onto the `QuantityPriceDefinition` and recalculate — `$definition->setQuantity($item->getQuantity()); $item->setPrice($this->calculator->calculate($definition, $context));`. `[code: Checkout/Cart/Processor.php:51-52]` `[code: Content/Product/Cart/ProductCartProcessor.php:89-122]` `[code: Content/Product/Cart/ProductCartProcessor.php:152-157]` `[code: Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:59-62]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `collect()` sees only `$original`; `process()` additionally gets `$toCalculate` and is the only place that may add line items to the resulting cart | `Checkout/Cart/CartDataCollectorInterface.php:12` | `public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void;` |
| `process()` receives `$toCalculate` as a separate cart argument | `Checkout/Cart/CartProcessorInterface.php:12` | `public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void;` |
| `$toCalculate` is a brand-new empty `Cart` each calculation; only a few scalars and the data collection carry over | `Checkout/Cart/Processor.php:34-52` | `$cart = new Cart($original->getToken()); … // move data from previous calculation into new cart\n$cart->setData($original->getData());` |
| All collectors run first, then all processors in priority order, each followed by an amount recalculation | `Checkout/Cart/Processor.php:86-102` | `foreach ($this->collectors as $collector) { $collector->collect(...); } … foreach ($this->processors as $processor) { $processor->process($cart->getData(), $original, $cart, $context, $behavior); $this->calculateAmount($context, $cart); }` |
| Duplication mechanism: `CartRuleLoader` feeds the result cart back in as the next pass's input cart | `Checkout/Cart/CartRuleLoader.php:145-177` | `$cart = $this->processor->process($originalCart, …); do { $compare = $cart; … $cart = $this->processor->process($cart, …); $recalculate = $this->cartChanged($cart, $compare); } while ($recalculate);` |
| The loop is bounded at 7 iterations; changed item count/keys/types or total price re-triggers it | `Checkout/Cart/CartRuleLoader.php:34`, `:204-213` | `private const MAX_ITERATION = 7;` / `return $previousLineItems->count() !== $currentLineItems->count() \|\| $previous->getPrice()->getTotalPrice() !== …` |
| `LineItemCollection::add()` on an existing id sums quantities and marks modified, rather than replacing | `Checkout/Cart/LineItem/LineItemCollection.php:30-53` | `if ($exists) { $newQuantity = $lineItem->getQuantity() + $exists->getQuantity(); … $exists->setQuantity($newQuantity); $exists->markModified(); return; }` |
| `set($key, $lineItem)` / `exists()` / `removeElement()` exist as the idempotent alternatives | `Checkout/Cart/LineItem/LineItemCollection.php:56-68` | `public function set($key, $lineItem): void … public function exists(LineItem $lineItem): bool` |
| Core pattern for re-entry safety: read items from `$original`, recalculate from the price definition, add to `$toCalculate` | `Checkout/Cart/CustomCartProcessor.php:26-76` | `$lineItems = $original->getLineItems()->filterType(LineItem::CUSTOM_LINE_ITEM_TYPE); … $lineItem->setPrice($this->calculator->calculate($definition, $context)); … $toCalculate->add($lineItem);` |
| Core pattern for collector-builds/processor-places: `PromotionCollector` writes a `LineItemCollection` under a data key, `PromotionProcessor` reads it and does not carry the previous run's items over | `Checkout/Promotion/Cart/PromotionProcessor.php:60-100` | `if (!$data->has(self::DATA_KEY)) { … return; } … $this->promotionCalculator->calculate($items, $original, $toCalculate, $context, $behavior);` |
| The only branch that re-uses `$original`'s items is the explicit skip-promotion permission | `Checkout/Promotion/Cart/PromotionProcessor.php:49-58` | `if ($behavior->hasPermission(self::SKIP_PROMOTION)) { $items = $original->getLineItems()->filterType(self::LINE_ITEM_TYPE); foreach ($items as $item) { $toCalculate->add($item); } return; }` |
| Staleness mechanism: the `CartDataCollection` is explicitly moved from the previous calculation into the new cart | `Checkout/Cart/Processor.php:51-52` | `// move data from previous calculation into new cart\n$cart->setData($original->getData());` |
| Core guards cached data with a context hash and re-derives prices each pass | `Content/Product/Cart/ProductCartProcessor.php:89-122` | `$hash = $this->getDataContextHash($context); $ids = $this->getNotCompleted($data, $items, $hash); … $this->recalculate($items, $data, $context, $behavior);` |
| Quantity is re-stamped on the price definition inside `process()` immediately before calculating | `Content/Product/Cart/ProductCartProcessor.php:152-157` | `$definition->setQuantity($item->getQuantity()); $item->setPrice($this->calculator->calculate($definition, $context));` |
| `QuantityPriceDefinition::setQuantity()` is mutable public API | `Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:59-62` | `public function setQuantity(int $quantity): void { $this->quantity = $quantity; }` |
| Every completed calculation is persisted, so a duplicate is written to the cart store and returns as `$original` | `Checkout/Cart/SalesChannel/CartService.php:169-173` | `$cart = $this->calculator->calculate($cart, $context); $this->persister->save($cart, $context);` |
| The persisted cart is the processors' `$toCalculate` output | `Checkout/Cart/CartCalculator.php:22-38` | `$cart = $this->cartRuleLoader->loadByCart($context, $cart, new CartBehavior($context->getPermissions()))->getCart(); … $cart->markUnmodified();` |
| Priority places a processor relative to core: `ProductCartProcessor` 5000, default 0, `DeliveryProcessor` -5000 | `Checkout/DependencyInjection/cart.xml:306-313` | `<tag name="shopware.cart.processor" priority="-5000"/>` |
| Both tags are auto-applied by autoconfiguration, so an untagged plugin service still participates at priority 0 | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:80-87` | `->registerForAutoconfiguration(CartProcessorInterface::class)->addTag('shopware.cart.processor');` |
| The tags are consumed by the `Processor` service via tagged iterators | `Checkout/DependencyInjection/cart.xml:337-343` | `<argument type="tagged_iterator" tag="shopware.cart.processor"/>` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The cart pipeline deduplicates line items added by a processor | absent | No dedup step in `Processor::runProcessors` (`Checkout/Cart/Processor.php:76-103`); `LineItemCollection::add()` merges quantities instead |
| A collector can add line items to the cart | absent | `CartDataCollectorInterface::collect` has no `$toCalculate` parameter (`Checkout/Cart/CartDataCollectorInterface.php:12`); anything pushed into `$original` mutates the input cart |
| The `CartDataCollection` is cleared between calculations | absent | `Checkout/Cart/Processor.php:51-52` copies it forward explicitly |
| There is a core hook for "run my processor only once per request" | absent | `CartRuleLoader` re-runs the whole `Processor` up to 7 times with no per-processor flag; `CartBehavior` exposes only `hasPermission()`/`hookAware()` (`Checkout/Cart/CartRuleLoader.php:147-177`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Core pair that is safe under re-entry — items read from `$original`, recalculated, re-added; nothing new created per pass | `Checkout/Cart/CustomCartProcessor.php:48-75` |
| Core collector that rebuilds candidates each pass, merging codes already in the cart so the same promotion is not produced twice | `Checkout/Promotion/Cart/PromotionCollector.php:128-133` |

Not covered by a test read in this run: the dist package ships no cart tests, so no functional test asserts single-insertion of a processor-added line item across the 7-iteration loop.

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Instrumented `runProcessors()` shows the executed collector/processor set differs when the cart is empty; core and plugin collectors skipped | 6.6.10.3 | closed (not planned) | https://github.com/shopware/shopware/issues/9196 |
| Request for an option/event to force cart processing when a plugin adds line items or cart extensions on the fly | 6.6-era | closed (not planned) | https://github.com/shopware/shopware/issues/12425 |
| Heavy work inside `collect()` makes cart requests take 5-7 s with ~10 items | 6.6.9.0 | closed | https://github.com/shopware/shopware/issues/6549 |
| `CustomizedProductsCartProcessor` throws `NoProductException` on a recalculation pass under `SKIP_PRODUCT_RECALCULATION` — a processor assuming collector data is present | 6.7 | open | https://github.com/shopware/shopware/issues/19372 |
| `Processor::process()` builds a new `Cart` and copies only some fields, so the `persisted` flag is lost across recalculation | trunk / 6.6.10.18 | closed (completed) | https://github.com/shopware/shopware/issues/17840 |
| Forum: plugin surcharge line item shows in checkout but order placement fails with a calculation error; unanswered | 6 (unspecified) | open | https://forum.shopware.com/t/error-while-placing-an-order-including-the-surcharge-in-shopware-6/105683 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `process()` construct a new `Cart` and copy fields selectively? | code | Yes — `Checkout/Cart/Processor.php:34-52`; output must be written to `$toCalculate` to survive. Fact 1 |
| How does core prevent duplicate insertion across passes — deterministic ids replacing, or empty `$toCalculate` each pass? | code | `$toCalculate` starts empty each pass and `LineItemCollection::add()` *sums* quantities on an existing id; there is no core dedup. Fact 2 |
| Is `collect()` invoked once per `Processor::process()` call or once per request? | code | Once per `process()` call, and `CartRuleLoader` calls `process()` up to 7 times — so `collect()` runs repeatedly per request (`Processor.php:86-102`, `CartRuleLoader.php:145-177`) |
| What is shared between `collect()` and `process()`, and is it rebuilt? | code | The `CartDataCollection`, carried forward verbatim, not rebuilt (`Processor.php:51-52`). Fact 3 |
| Must the plugin recompute the surcharge price every pass, or does core recalculate an item that carries a price definition? | code | Core recalculates only the types its own processors filter for (`ProductCartProcessor`, `CustomCartProcessor`); the quantity is re-stamped on the definition inside `process()` each pass. Fact 3 |
| Are collectors/processors still separate tagged services with priority in 6.7? | code | Yes — `cart.xml:306-343`, and both tags are auto-applied by `AutoconfigureCompilerPass:80-87` |
| Does `process()` skip collectors when the cart has no line items (#9196, #12425)? | not settled | Not read by the code lane. Out of scope for this query, which describes a non-empty cart; no fact depends on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The cart is recalculated multiple times per request; extensions must be deterministic | "The cart is recalculated multiple times per request to resolve dependencies between line items." | `architecture/cart-process.md:10` | yes — `CartRuleLoader.php:145-177`, `MAX_ITERATION = 7` |
| Collector loads external data once; processor modifies calculated items; never query the DB in `process()` | "* Use `CartDataCollector` to load external data once. … * Never perform database queries in `process()`." | `architecture/cart-process.md:20-22` | partly — the split is confirmed, but "once" is wrong: collectors run on every pass. The DB rule is a performance recommendation, not enforced by code |
| `collect()` must itself check whether the data was already loaded | "must check whether data was already loaded and append it to `CartDataCollection`" | `architecture/cart-process.md:28` | yes — data is carried forward (`Processor.php:51-52`); core guards with a context hash (`ProductCartProcessor.php:89-122`) |
| The `collect` guard may be dropped when prices may have changed in between | "If you do need to request it multiple times because your prices may have changed in between, you can remove that method." | `change-price-of-item.md:122` | not checked by code |
| All modifications belong on `$toCalculate` | "Make sure to do all the changes on the `$toCalculate` instance, since this is the cart that's going to be considered in the end." | `add-cart-processor-collector.md:102-103` | yes — `Processor.php:34-52`, `CartCalculator.php:22-38` |
| A processor may create a line item and add it to `$toCalculate` on every run, with no de-duplication guard | "The last step is to add the discount to the new cart which is provided as `Cart $toCalculate`." | `add-cart-discounts.md:119` | no — see divergence |
| The price definition is the durable part; it is what lets core recalculate | "This definition is required for the cart to tell the core how this price can be recalculated even if the plugin would be uninstalled." | `add-cart-discounts.md:112` | partly — `CustomCartProcessor`/`ProductCartProcessor` recalculate from the definition for the types they filter |
| Calculation is Enrich → Process → Validate (repeating) → Persist | "In the **validate state**, validation is performed using the rule system…" | `checkout-concept/cart.md:111` | yes in shape — `CartRuleLoader` + `CartService::recalculate` |
| Idempotency for a script-added surcharge uses an explicit presence check | "{% if services.cart.has('my-surcharge') %}" | `cart-manipulation-script-services-reference.md:189` | different API (app-script `CartFacade`), not the PHP processor path |
| Intent: the split exists for performance and determinism, not code organisation | "Data loading must be separated from calculation to ensure stable performance." | `architecture/cart-process.md:14-16` | context only |
| A surcharge is modelled as a line item, the same extension point as discounts and promotions | "a promotion, a discount, or a surcharge is also a line item" | `checkout-concept/cart.md:44` | context only |

Docs coverage of this query was reported `partial`: the docs nowhere state, for the PHP path, that `$toCalculate` is a fresh cart per pass, why a processor-added item duplicates, how to key/guard it, or how to avoid a stale price after a quantity change. The facts above are therefore code-derived.

Internal doc inconsistencies recorded as reported: `cart-process.md:29` requires line items to be created via a `LineItemFactoryHandler`, while `add-cart-discounts.md:98` and `change-price-of-item.md` use `new LineItem(...)` inside a processor; and `cart-process.md:28` requires a collect-time guard that `change-price-of-item.md:122` says may be removed.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "Use `CartDataCollector` to load external data **once**" | Collectors run on every pass of the recalculation loop — up to 7 per calculation — so `collect()` must guard its own cache; "once" is per-`process()`-call, not per request | `Checkout/Cart/Processor.php:86-102`, `Checkout/Cart/CartRuleLoader.php:145-177`, `:34` |
| The discount guide adds a freshly constructed line item to `$toCalculate` on every run with no idempotency guard | The result cart becomes the next pass's `$original`, and `LineItemCollection::add()` sums quantities on an id collision instead of replacing — an unguarded add inflates the quantity and is persisted | `Checkout/Cart/CartRuleLoader.php:145-177`, `Checkout/Cart/LineItem/LineItemCollection.php:30-53`, `Checkout/Cart/SalesChannel/CartService.php:169-173` |
| "Never perform database queries in `process()`" | A performance/determinism recommendation; the code contains no such constraint or guard. Retained as docs intent, not as a checkable fact | `Checkout/Cart/Processor.php:86-102` |
| The old fact required registering both classes in `services.php` with the `shopware.cart.collector` / `shopware.cart.processor` tags | Autoconfiguration applies both tags to any service implementing the interfaces; explicit tagging is needed only to set a non-default `priority` | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:80-87`, `Checkout/DependencyInjection/cart.xml:306-343` |
| The only idempotency example in the docs is `services.cart.has('my-surcharge')` | That is the app-script `CartFacade`; the PHP equivalents are `LineItemCollection::exists()` / `set($key, $lineItem)`, and reading the existing item off `$original` | `Checkout/Cart/LineItem/LineItemCollection.php:56-68`, `Checkout/Cart/CustomCartProcessor.php:48-75` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The cart is recalculated on every request and rebuilt from `$original` into `$toCalculate`: the processor must apply its changes to `$toCalculate` (`Shopware\Core\Checkout\Cart\CartProcessorInterface::process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior)`), never to `$original` — a line item the processor does not re-add to `$toCalculate` disappears, and one appended without checking whether it is already there is added again on each run. | rewritten | The `$toCalculate` rule and the "does not re-add ⇒ disappears" half are confirmed, but "without checking whether it is already there" is wrong about where to check: `$toCalculate` is empty at the start of every pass, so the guard is against re-creating an item already present in `$original` (the result cart of the previous pass). Split into new facts 1 and 2 with the mechanism named. |
| Data is gathered once in the collector (`Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior)`), stored with `$data->set('uniqueKey', $newData)` and read back in `process` with `$data->get('uniqueKey')`; `collect` itself can run several times per request, so it must skip keys already present. | rewritten | Confirmed as far as it goes, but it does not address the query's stale-price failure: the code shows the `CartDataCollection` is carried across calculations verbatim, so "skip keys already present" is exactly what makes a price stale after a quantity change. New fact 3 adds the guard (context-hash-style key) and the per-pass `setQuantity()` + recalculate step. |
| No database, API or repository access inside `process` — it runs many times per cart calculation, which is why fetching belongs in `collect`; both classes are registered in `services.php` with the service tags `shopware.cart.collector` and `shopware.cart.processor`, whose `priority` orders them against the core product collector/processor (a surcharge that depends on calculated product prices must run after it). | removed | Two problems. The "no DB in `process`" clause is an unconfirmed docs recommendation — the code enforces nothing of the sort — so it cannot be a checkable fact. The registration clause is contradicted in part: `AutoconfigureCompilerPass:80-87` applies both tags automatically, so explicit `services.php` tagging is required only to set a non-default priority. Both are recorded in the docs and divergence tables instead; neither decides whether an answer fixes the duplication or the stale price. |
