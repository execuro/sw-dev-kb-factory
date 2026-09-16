# `dev-17` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-17` · `dev` · `Checkout & Cart` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** How do I overwrite the price of a product line item in the cart at runtime from a plugin?

**Expected answer — every fact an answer must contain:**

1. One class implements both `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` (`collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior)`) and `Shopware\Core\Checkout\Cart\CartProcessorInterface` (`process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior)`); the collector fetches the new price and stores it in the `CartDataCollection` under a unique key, `process` only reads it back — no database access in `process`. Both tags are applied automatically by autoconfiguration, but the class is registered explicitly with `shopware.cart.processor` and `shopware.cart.collector`. `[code: Checkout/Cart/CartProcessorInterface.php:12]` `[code: Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:80-87]`
2. Priority is what makes the overwrite stick: `ProductCartProcessor` is tagged at priority **5000** for both the collector and the processor — the highest in core — and its `process()` unconditionally recomputes every product line item's price from that item's price definition. A plugin must therefore run *after* it (a lower priority, e.g. the documented `4500`; an untagged service defaults to `0`), otherwise its price is overwritten. `[code: Checkout/DependencyInjection/cart.xml:355-356]` `[code: Content/Product/Cart/ProductCartProcessor.php:150-158]`
3. In `process`, build a `QuantityPriceDefinition($price, $taxRules, $quantity)` — for a product line item the definition **must** be a `QuantityPriceDefinition` or `ProductCartProcessor` throws `CartException::missingLineItemPrice` — run it through the injected `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`, then call `setPriceDefinition()` and `setPrice()` on the line item in `$toCalculate` (a fresh cart the pipeline builds each run), not on `$original`. The `customPrice` extension alone does not pin a price: `shouldPriceBeRecalculated()` also requires the `allowProductPriceOverwrites` permission on the `CartBehavior`, which core grants only in the admin sales-channel proxy and order recalculation — never in a plain storefront request, and a plugin cannot set it from inside `collect()`/`process()`. `[code: Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:32-38]` `[code: Content/Product/Cart/ProductCartProcessor.php:548-566]` `[code: Checkout/Cart/CartBehavior.php:17-26]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/change-price-of-item.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`.

| fact | citation | excerpt |
| --- | --- | --- |
| A line item's price is derived from a price definition; both setters are public | `Checkout/Cart/LineItem/LineItem.php:321-338` | `public function setPriceDefinition(?PriceDefinitionInterface $priceDefinition): self` … `public function setPrice(?CalculatedPrice $price): self` |
| For product line items the definition must be a `QuantityPriceDefinition`, else `CartException::missingLineItemPrice`; the quantity is forced on before calculating | `Content/Product/Cart/ProductCartProcessor.php:150-158` | `if (!$definition instanceof QuantityPriceDefinition) { throw CartException::missingLineItemPrice($item->getId()); }` |
| Tax state of the context decides gross/net interpretation | `Checkout/Cart/Price/QuantityPriceCalculator.php:25-31` | `if ($context->getTaxState() === CartPrice::TAX_STATE_GROSS) {` |
| `QuantityPriceDefinition` constructor is `(float $price, TaxRuleCollection $taxRules, int $quantity = 1)` — no precision argument | `Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:32-38` | `public function __construct(protected float $price, protected TaxRuleCollection $taxRules, protected int $quantity = 1)` |
| All collectors run first, then all processors, over a fresh `$toCalculate` | `Checkout/Cart/Processor.php:86-102` | `foreach ($this->collectors as $collector) { … } … foreach ($this->processors as $processor) { $processor->process($cart->getData(), $original, $cart, …); }` |
| `ProductCartProcessor` is priority 5000 for both tags | `Checkout/DependencyInjection/cart.xml:355-356` | `<tag name="shopware.cart.processor" priority="5000"/>` `<tag name="shopware.cart.collector" priority="5000"/>` |
| It sets the price definition in `collect()`, gated by `shouldPriceBeRecalculated()` | `Content/Product/Cart/ProductCartProcessor.php:364-368` | `if ($this->shouldPriceBeRecalculated($lineItem, $behavior)) { $lineItem->setPriceDefinition(...); }` |
| Exactly three escapes keep a foreign price definition | `Content/Product/Cart/ProductCartProcessor.php:548-566` | `hasExtension(self::CUSTOM_PRICE) && $behavior->hasPermission(self::ALLOW_PRODUCT_PRICE_OVERWRITES)` … `SKIP_PRODUCT_RECALCULATION` … `$lineItem->isModifiedByApp()` |
| The extension key is the literal `customPrice`; the permission constants moved to `CheckoutPermissions` (old copies deprecated for 6.8) | `Content/Product/Cart/ProductCartProcessor.php:42-47` | `final public const CUSTOM_PRICE = 'customPrice';` |
| Permission strings | `Checkout/CheckoutPermissions.php:20-24` | `final public const ALLOW_PRODUCT_PRICE_OVERWRITES = 'allowProductPriceOverwrites';` |
| Permissions come from the caller; `CartBehavior` has no setter | `Checkout/Cart/CartBehavior.php:17-26` | `public function __construct(private readonly array $permissions = [], …)` |
| `allowProductPriceOverwrites` is granted only in the admin proxy and order recalculation | `Framework/Api/Controller/SalesChannelProxyController.php:70` | `CheckoutPermissions::ALLOW_PRODUCT_PRICE_OVERWRITES => true,` |
| The API line-item factory rejects a `priceDefinition` payload without that permission, then adds the extension itself | `Checkout/Cart/LineItemFactoryHandler/ProductLineItemFactory.php:62-67` | `if (isset($data['priceDefinition']) && !$context->hasPermission(CheckoutPermissions::ALLOW_PRODUCT_PRICE_OVERWRITES))` |
| Autoconfiguration tags both interfaces (default priority 0) | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:80-87` | `->registerForAutoconfiguration(CartProcessorInterface::class)->addTag('shopware.cart.processor');` |
| The tags are consumed by `Processor` via tagged iterators | `Checkout/DependencyInjection/cart.xml:337-343` | `<argument type="tagged_iterator" tag="shopware.cart.processor"/>` |
| Interface signatures | `Checkout/Cart/CartProcessorInterface.php:12` | `public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void;` |
| The app-script equivalent builds the same `QuantityPriceDefinition` and marks the item modified-by-app | `Checkout/Cart/Facade/PriceFacade.php:109-120`, `:236-247` | `$this->item->markModifiedByApp(); $this->item->setPriceDefinition($definition);` |
| The modified-by-app flag is reset at the start of every hook-aware calculation | `Checkout/Cart/Processor.php:44-49` | `foreach ($original->getLineItems()->getFlat() as $item) { $item->markUnModifiedByApp(); }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| There is a dedicated "change a line item price" service for plugins | absent | Only `LineItem::setPriceDefinition()`/`setPrice()` plus the tagged interfaces; `PriceFacade` is `@internal` for the script hook and not injectable. `Checkout/Cart/Facade/PriceFacade.php:31-40` |
| `setPrice()` alone is enough | absent | `ProductCartProcessor::process` re-runs `setPrice($this->calculator->calculate($definition, $context))` for every product item, so a price set before it (priority 5000) is discarded. `Content/Product/Cart/ProductCartProcessor.php:157` |
| The `customPrice` extension by itself pins a price | absent | `shouldPriceBeRecalculated()` requires the extension **and** the `allowProductPriceOverwrites` permission. `Content/Product/Cart/ProductCartProcessor.php:550-554` |
| A plugin can grant itself the price-overwrite permission during calculation | absent | `CartBehavior::$permissions` is a readonly constructor array with only `hasPermission()`. `Checkout/Cart/CartBehavior.php:17-26` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Core reference collector/processor pair for a non-product line item type (`CustomCartProcessor`, processor priority 4000) | `Checkout/DependencyInjection/cart.xml:14-19` |
| Core processor order by priority: product 5000, promotion 4900, custom 4000, container 3800, discount 3700, credit 0, delivery −5000 | `Checkout/DependencyInjection/cart.xml:11-533` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `ProductCartProcessor::process()` hard-throws `CartException::missingLineItemPrice` when a product item has no `QuantityPriceDefinition`, blocking admin order edit | 6.7.4.0 | closed (not planned) | https://github.com/shopware/shopware/issues/19373 |
| `QuantityPriceDefinition::fromArray` drops `referencePriceDefinition`, so a plugin-set definition does not round-trip onto the order | 6.6 and 6.7 | open | https://github.com/shopware/shopware/issues/14623 |
| `CustomizedProductsCartProcessor` throws `NoProductException` during recalculation under `skipProductRecalculation` | 6.7 | open | https://github.com/shopware/shopware/issues/19372 |
| Merchant "Custom Price"/graduated prices reported ignored by the cart | 6.5.3.3 | closed | https://github.com/shopware/shopware/issues/6081 |
| Option surcharges added to total instead of unit price, `isCalculated` not set | 6.5.8.7 | closed | https://github.com/shopware/shopware/issues/3986 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Must the definition be a `QuantityPriceDefinition` specifically in 6.7? | code | Yes — anything else throws `CartException::missingLineItemPrice` (`ProductCartProcessor.php:150-158`); stated in fact 3 |
| What exactly preserves an existing price definition — the extension or the behaviour permission? | code | Both together, or `skipProductRecalculation`, or `isModifiedByApp()` (`ProductCartProcessor.php:548-566`); stated in fact 3 |
| Tag/priority mechanism, and where a plugin processor sits relative to `ProductCartProcessor`? | code | `shopware.cart.processor`/`shopware.cart.collector`, product at 5000, default 0 — a plugin runs after it in both phases (`cart.xml:355-356`); stated in fact 2 |
| Does `QuantityPriceDefinition` still take a precision argument? | code | No — `(float $price, TaxRuleCollection $taxRules, int $quantity = 1)`; the fact carries no precision argument |
| Does `setPriceDefinition()` still exist, and must changes go to `$toCalculate`? | code | Yes; `Processor` builds `$toCalculate` and hands it to each processor (`Processor.php:86-102`); stated in fact 3 |
| Does `fromArray()` drop `referencePriceDefinition`, i.e. does the definition persist in full onto the order? | not settled by code | The code lane did not read `PriceDefinitionFieldSerializer`; no fact claims persistence onto the order, so no fact depends on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Overwriting a price requires a collector and a processor | "you'll have to use a cart collector and a cart processor" | `change-price-of-item.md:26` | yes — the two interfaces and tagged iterators |
| Collector implements `CartDataCollectorInterface::collect`, processor `CartProcessorInterface::process` | "has to implement the interface `…CartDataCollectorInterface`" | `change-price-of-item.md:38` | yes |
| Collected prices stored under a custom-prefixed key in the `CartDataCollection` | "We will prefix a custom string to the line item ID" | `change-price-of-item.md:112-114` | yes — the data collection is the shared channel (`Processor.php:86-102`) |
| `collect` may run several times per request; skip already-fetched values | "your collect method may be executed multiple times per request" | `change-price-of-item.md:122` | not examined by the code lane for this case — not asserted as a fact here |
| Build a `QuantityPriceDefinition`, calculate with `QuantityPriceCalculator`, then `setPrice()` and `setPriceDefinition()` | "we're building a new instance of a `QuantityPriceDefinition`" | `change-price-of-item.md:252` | yes |
| All changes on `$toCalculate`, not `$original` | "Make sure to do all the changes on the `$toCalculate` instance" | `change-price-of-item.md:246` | yes — `Processor.php:86-102` |
| No database queries in `process` | "Do not query the database in the `process` method." | `change-price-of-item.md:257` | consistent with the collector/processor split in `Processor.php:86-102` |
| Register with both tags; the example uses priority 4500, described as running after the product collector/processor | "has to be registered using the two tags" | `change-price-of-item.md:262` | yes — product is 5000 on both tags, so 4500 runs after in both phases |
| Price adjustments must go through the `Checkout\Cart\Price` calculators | "All price calculations must use the `…Price` calculators" | `cart-process.md:30` | yes — `QuantityPriceCalculator.php:25-31` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The guide presents priority `4500` as a plain registration detail | The number is load-bearing: `ProductCartProcessor` runs at 5000 on both tags and `process()` unconditionally recalculates every product price from its definition, so anything at a higher priority is silently overwritten | `Checkout/DependencyInjection/cart.xml:355-356`, `Content/Product/Cart/ProductCartProcessor.php:157` |
| The guide never mentions the `customPrice` extension or the `allowProductPriceOverwrites` permission | Those are the only ways to make `ProductCartProcessor` keep a foreign price definition, and core grants the permission only in the admin proxy and order recalculation — not in the storefront | `Content/Product/Cart/ProductCartProcessor.php:548-566`, `Framework/Api/Controller/SalesChannelProxyController.php:70` |
| The collector/processor guide links interfaces at tag `v6.3.4.1` and states no version | The signatures are unchanged in 6.7.13.0 | `Checkout/Cart/CartProcessorInterface.php:12` |
| The guide does not say the tags may be omitted | Autoconfiguration tags any service implementing the interfaces, at default priority 0 | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:80-87` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| One class implements both `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` (`collect`) and `Shopware\Core\Checkout\Cart\CartProcessorInterface` (`process`); the collector stores the new price in the `CartDataCollection` under a key such as `'price-overwrite-'.$id` and skips ids already present, since `collect` can run several times per request. | rewritten | the interfaces and the data-collection channel are code-confirmed and kept; the "collect can run several times per request, so skip ids already present" clause is a docs claim the code lane did not examine for this case and is not asserted. Autoconfiguration of both tags added (`AutoconfigureCompilerPass.php:80-87`) |
| In `process`, build `new QuantityPriceDefinition($newPrice, $product->getPrice()->getTaxRules(), $product->getPrice()->getQuantity())`, run it through the injected `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`, then call `$product->setPrice($calculated)` and `$product->setPriceDefinition($definition)`. | rewritten | constructor arity confirmed (`QuantityPriceDefinition.php:32-38`); extended with the code-backed requirement that the definition must be a `QuantityPriceDefinition` for a product item (`ProductCartProcessor.php:150-158`) and with the `customPrice` + `allowProductPriceOverwrites` condition (`ProductCartProcessor.php:548-566`), which decides whether the overwrite survives |
| Register the class in `services.php` under both `shopware.cart.processor` and `shopware.cart.collector` with priority `4500` so it runs after the core product collector/processor; never query the database in `process()`, and apply changes to `$toCalculate`, not `$original`. | rewritten | confirmed and made explicit: the core product collector/processor is priority 5000 on both tags (`cart.xml:355-356`), and its `process()` recomputes every product price from the definition (`ProductCartProcessor.php:157`), which is *why* a lower priority is required |
