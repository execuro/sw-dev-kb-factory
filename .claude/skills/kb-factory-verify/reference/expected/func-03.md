# `func-03` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-03` · `func` · `Merchant` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** How do promotions and discount codes work, including individually generated codes?

**Expected answer — every fact an answer must contain:**

1. The code mode is two Required booleans on the promotion: `useCodes` (a code is needed at all) and `useIndividualCodes` (one generated code per customer instead of the single generic `code`), giving exactly three modes — automatic (`useCodes = false`), one fixed code, and individually generated codes from `individualCodePattern`. All three lookups additionally require `active = true`, a sales-channel assignment and a valid date range, and a code entered in the cart is resolved global-code-first, individual-code second. `[code: Checkout/Promotion/PromotionDefinition.php:95-98; Checkout/Promotion/Gateway/Template/PermittedAutomaticPromotions.php:26-32; Checkout/Promotion/Gateway/Template/PermittedIndividualCodePromotions.php:28-38; Checkout/Promotion/Cart/PromotionCollector.php:330-342]`
2. An individual code is single-use by construction: the lookup requires `promotion.individualCodes.payload IS NULL`, and redemption writes `['orderId', 'customerId', 'customerName']` into that payload when the order line item is written (`ORDER_LINE_ITEM_WRITTEN_EVENT`, live version only) — after that the code can never be found again. Codes are generated from a pattern of literal prefix, a run of `%s` (letter A-Z) / `%d` (digit 0-9) and a literal suffix; a pattern without such a run throws `invalidCodePattern`, and one not varied enough for the requested amount throws `patternNotComplexEnough`. `[code: Checkout/Promotion/Gateway/Template/PermittedIndividualCodePromotions.php:36-37; Checkout/Promotion/Subscriber/PromotionIndividualCodeRedeemer.php:41-62,88-101; Checkout/Promotion/Util/PromotionCodeService.php:25,73-78,151-162,208-231]`
3. Discounts have four scopes (`cart`, `delivery`, `set`, `setgroup`) and four types (`percentage`, `absolute`, `fixed_unit`, `fixed`), with scope, type and value Required and an optional `maxValue` cap; targeting is rule-driven through `personaRules`, `orderRules`, `cartRules` and per-discount `discountRules` (plus a direct `personaCustomers` assignment). Usage limits are cart-time checks, not database constraints: `maxRedemptionsGlobal` against the write-protected `orderCount` and `maxRedemptionsPerCustomer` against `ordersPerCustomerCount`, where null or <= 0 means unlimited — and a promotion with no discount is silently dropped. 6.6 is identical on all of this. `[code: Checkout/Promotion/Aggregate/PromotionDiscount/PromotionDiscountEntity.php:22-65; Checkout/Promotion/PromotionDefinition.php:112-115; Checkout/Promotion/PromotionEntity.php:577-598; Checkout/Promotion/Cart/PromotionCollector.php:360-377]`

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/marketing/promotions
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Two-flag code mode | `Checkout/Promotion/PromotionDefinition.php:95-98` | `(new BoolField('use_codes', 'useCodes'))->addFlags(new Required())` … `(new BoolField('use_individual_codes', 'useIndividualCodes'))->addFlags(new Required())` |
| Three modes expressed as criteria templates | `Checkout/Promotion/Gateway/Template/PermittedAutomaticPromotions.php:26-32`; `PermittedIndividualCodePromotions.php:28-38` | `new EqualsFilter('useCodes', false)` / `new EqualsFilter('useIndividualCodes', true)` with `active`, sales channel and `$activeDateRange` |
| Individual code is single-use | `Checkout/Promotion/Gateway/Template/PermittedIndividualCodePromotions.php:36-37`; `Checkout/Promotion/Aggregate/PromotionIndividualCode/PromotionIndividualCodeEntity.php:92-107` | `// a payload of null means, they have not yet been redeemed` / `new EqualsFilter('promotion.individualCodes.payload', null)` |
| Redemption happens on order line item write | `Checkout/Promotion/Subscriber/PromotionIndividualCodeRedeemer.php:41-62,88-101` | `OrderEvents::ORDER_LINE_ITEM_WRITTEN_EVENT => 'onOrderLineItemWritten'` and a live-version guard |
| Code matching is case-insensitive | `Checkout/Promotion/Subscriber/PromotionIndividualCodeRedeemer.php:82-84`; `Checkout/Promotion/PromotionEntity.php:589-591` | `if (strtolower($code) !== strtolower($promotion->getCode())) { continue; }` |
| Pattern syntax and validation | `Checkout/Promotion/Util/PromotionCodeService.php:25,151-162,176-192` | `PROMOTION_PATTERN_REGEX = '/(?<prefix>[^%]*)(?<replacement>(%[sd])+)(?<suffix>.*)/'` / `throw PromotionException::invalidCodePattern($pattern);` |
| Complexity floor for generation | `Checkout/Promotion/Util/PromotionCodeService.php:26,73-78,208-231` | `CODE_COMPLEXITY_FACTOR = 0.5;` / `$possibilityCounts = ['d' => 10, 's' => 26];` |
| Uniqueness is procedural (blacklist + pattern-in-use check) | `Checkout/Promotion/Util/PromotionCodeService.php:79-90,164-171` | `return array_diff($codes, $codeBlacklist);` / `->addFilter(new EqualsFilter('individualCodePattern', $pattern));` |
| Limits enforced in the cart collector | `Checkout/Promotion/PromotionEntity.php:582-598`; `Checkout/Promotion/Cart/PromotionCollector.php:360-377` | `return $this->getMaxRedemptionsGlobal() === null \|\| $this->getMaxRedemptionsGlobal() <= 0 \|\| $this->getOrderCount() < $this->getMaxRedemptionsGlobal();` |
| Promotion without discounts is dropped | `Checkout/Promotion/Cart/PromotionCollector.php:372-375`; `Checkout/Promotion/PromotionEntity.php:577-580` | `// check if no discounts have been set` / `if (!$promotion->hasDiscount()) { return false; }` |
| Re-editing an order skips the limit check | `Checkout/Promotion/Cart/PromotionCollector.php:356-359,379-387` | `// code is already applied to this order, so it's should be valid` |
| Global-first code resolution | `Checkout/Promotion/Cart/PromotionCollector.php:330-342` | `// no global code, so try with an individual code instead` |
| Discount scopes and types | `Checkout/Promotion/Aggregate/PromotionDiscount/PromotionDiscountEntity.php:22-65`; `PromotionDiscountDefinition.php:66-70` | `SCOPE_CART … SCOPE_SETGROUP` / `TYPE_PERCENTAGE … TYPE_FIXED` |
| Code placeholder line item | `Checkout/Promotion/Cart/PromotionItemBuilder.php:29,47-53` | `PLACEHOLDER_PREFIX = 'promotion-';` |
| Rule-driven targeting, four rule sets | `Checkout/Promotion/PromotionDefinition.php:112-115`; `PromotionDiscountDefinition.php:77` | `personaRules`, `personaCustomers`, `orderRules`, `cartRules`, discount `discountRules` |
| 6.6 parity | `refs/heads/6.6.x src/Core/Checkout/Promotion/Util/PromotionCodeService.php:24-25`; `.../PermittedIndividualCodePromotions.php:30-37` | Same regex, same complexity factor, same payload-IS-NULL condition |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Individual codes carry their own redemption counter or expiry | absent | `promotion_individual_code` has only id, promotionId, code, payload — `Checkout/Promotion/Aggregate/PromotionIndividualCode/PromotionIndividualCodeDefinition.php:50-54` |
| Code uniqueness across promotions is enforced by the schema | absent | Plain `StringField` with no unique flag; collisions avoided procedurally — `Checkout/Promotion/PromotionDefinition.php:95` |
| Redemption limits are enforced at order write time | absent | `isOrderCountValid` is called only from `PromotionCollector` — `Checkout/Promotion/Cart/PromotionCollector.php:364,369` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Redemption counters are maintained by raw SQL in the redemption indexer | `Checkout/Promotion/DataAbstractionLayer/PromotionRedemptionUpdater.php:141` |
| Shared date-range gate for all three promotion lookups | `Checkout/Promotion/Gateway/Template/ActiveDateRange.php` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Two individual codes from one promotion cannot be stacked; storefront shows a generic error | 6.6.10.2 | closed | https://github.com/shopware/shopware/issues/7765 |
| Re-entered one-time code reports "could not be found" rather than "already redeemed" | 6.7.12.1 | closed | https://github.com/shopware/shopware/issues/18413 |
| One-time codes consumed in an aborted order stay invalid | 6.6 | open | https://github.com/shopware/shopware/issues/8575 |
| Code generation with a custom pattern hangs in the admin | 6.7.10.x-6.7.11.x | closed | https://github.com/shopware/shopware/issues/17884 |
| 'Prevent combination' / exclusions misbehave in both directions | 6.5.7.3, 6.7.4.2 | open | https://github.com/shopware/shopware/issues/13675 |
| `PromotionDeliveryCalculator::reduceDiscountLineItemsIfFixedPresent()` reduces before checking applicability | 6.6.10.6 | open | https://github.com/shopware/shopware/issues/12178 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which fields express the code mode, and where are individual codes stored? | code | `useCodes` / `useIndividualCodes` / `individualCodePattern` on `promotion`; `promotion_individual_code` with only id, promotionId, code, payload |
| When is an individual code marked redeemed? | code | On `ORDER_LINE_ITEM_WRITTEN_EVENT` in the live version, by writing the payload |
| Is a redeemed code released when the order is cancelled? | not settled | No release path was read; no fact above claims one either way |
| How do exclusions / `preventCombination` resolve when several promotions match? | not settled | `PromotionCalculator` was not traced; no fact above asserts exclusion behaviour |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Three code modes | "**No promotional code required:** … **Fixed promotion code:** This selection allows you to enter a single code that is the same for all customers." | merchant `marketing/promotions/v1-7-0-0.md` | yes — the two boolean flags and the three criteria templates |
| Individual codes are single-use and rejected on re-entry | "These individual codes can only be redeemed once and will not be accepted if they are entered again." | merchant `marketing/promotions/v1-7-0-0.md` | yes — `payload IS NULL` in the lookup |
| `%s` is a random letter, `%d` a random digit | "To insert a random letter (A-Z), store _%s_, for a random number (0-9) _%d_." | merchant `marketing/promotions/v1-7-0-0.md` | yes — `PROMOTION_PATTERN_REGEX` and `getRandomChar()` |
| Max total uses and max uses per customer are separate limits | "**Max. total uses (4)** … **Max. uses per customer (5)**" | merchant `marketing/promotions/v1-7-0-0.md` | yes — `maxRedemptionsGlobal` / `maxRedemptionsPerCustomer` |
| Discount types absolute, percentage, fixed price, fixed unit price; max discount only for percentage | "Here you specify whether the discount should be an absolute discount, a percentage discount or a fixed price or fixed unit price." | merchant `marketing/promotions/v1-7-0-0.md` | yes for the four types (`TYPE_*`); the percentage-only display of `maxValue` is admin UI and was not checked |
| Two individual codes from one promotion cannot be applied together | "It is not possible to apply several different individual codes from a single promotion at the same time." | merchant `marketing/promotions/v1-7-0-0.md` | not checked — cart de-duplication by promotion id was not read |
| Regenerating codes invalidates the previous ones | "the subsequent adjustment and regeneration of the promotional codes will result in the previous codes becoming invalid" | merchant `marketing/promotions/v1-7-0-0.md` | not checked |
| Multiple rules in one slot are OR-combined | "If multiple rules have been selected, only one of them needs to be triggered to apply the promotion." | merchant `marketing/promotions/v1-7-0-0.md` | partially — the four rule sets exist; their OR semantics were not read |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The docs present max uses as a limit on the promotion | It is a cart-time eligibility check against write-protected counters maintained by the redemption indexer, not a write constraint; re-editing an existing order bypasses it | `Checkout/Promotion/Cart/PromotionCollector.php:356-359,364,369`; `Checkout/Promotion/DataAbstractionLayer/PromotionRedemptionUpdater.php:141` |
| The docs describe redemption as happening when the customer redeems the code | Redemption is written when the order line item is written, and only in the live version | `Checkout/Promotion/Subscriber/PromotionIndividualCodeRedeemer.php:41-62` |
| The docs do not mention that a promotion without a discount does nothing | `hasDiscount()` is part of eligibility; such a promotion is silently dropped | `Checkout/Promotion/Cart/PromotionCollector.php:372-375` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Promotions are created under **Marketing > Promotions** with validity period, max uses (total and per customer) and sales channels. | replaced | The menu path is not supported by any lane report; the substance (date range, sales-channel assignment, the two redemption limits) is retained in new facts 1 and 3 with code citations and with the correction that the limits are cart-time checks. |
| Code modes: no code, one fixed code, or individually generated codes. | replaced | Kept but made checkable: the modes are the `useCodes` / `useIndividualCodes` pair, and the lookups also require active, sales channel and date range. |
| Discounts can be absolute, percentage or fixed price on the cart, delivery costs or a set group of products; conditions come from Rule Builder rules. | replaced | Code shows four types (`percentage`, `absolute`, `fixed_unit`, `fixed`) — the old text omitted fixed unit price — and four scopes including `set` alongside `setgroup`; targeting is four distinct rule sets plus `personaCustomers`. |
