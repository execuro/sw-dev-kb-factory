# `func-02` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-02` · `func` · `Merchant` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** How do Rule Builder conditions work for shipping and payment methods?

**Expected answer — every fact an answer must contain:**

1. A shipping method and a payment method each reference **at most one** availability rule, through the nullable FK `availability_rule_id`; a NULL availability rule means the method is always available, and a rule that is in use cannot be deleted (`RestrictDelete`). Several conditions must therefore be combined inside one rule, not spread over several rules. `[code: Checkout/Shipping/ShippingMethodDefinition.php:81; Checkout/Payment/PaymentMethodDefinition.php:76; Framework/Rule/RuleIdMatcher.php:24-27; Content/Rule/RuleDefinition.php:90-91]`
2. Conditions are `rule_condition` rows (required `type`, JSON `value`) nested by `parent_id`; the payload builder always wraps the root in an `AndRule`, so multiple top-level conditions are ANDed and OR requires an explicit container condition (containers are AndRule, OrRule, NotRule, XorRule, MatchAllLineItemsRule). Matching runs against the serialised `payload` blob, never against the condition rows — a rule whose payload is not a `Rule` object never matches, so an invalid or un-indexed rule silently blocks the method it guards. `[code: Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:78-81,125-166; Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:56-67; Content/Rule/RuleCollection.php:22-27]`
3. Availability is checked twice against the pre-computed rule ids of the `SalesChannelContext` (built by `CartRuleLoader`, which re-evaluates rules against the recalculated cart up to 7 iterations): the store-api routes filter the method list only when `onlyAvailable` is requested, and cart validation emits `ShippingMethodBlockedError` / `PaymentMethodBlockedError` — the payment error distinguishes 'inactive', 'rule not matching' and 'not allowed' (method not assigned to the sales channel). 6.6 has the same semantics through `filterByActiveRules()`; in 6.7 those collection methods still exist but are deprecated for 6.8 in favour of `RuleIdMatcher`. `[code: Checkout/Cart/CartRuleLoader.php:34,148-176; Checkout/Payment/SalesChannel/PaymentMethodRoute.php:76-78; Checkout/Cart/Delivery/DeliveryValidator.php:17-33; Checkout/Payment/Cart/PaymentMethodValidator.php:17-48]`

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/settings/rules
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| One nullable availability rule per shipping/payment method | `Checkout/Shipping/ShippingMethodDefinition.php:81,90`; `Checkout/Payment/PaymentMethodDefinition.php:76,82` | `(new FkField('availability_rule_id', 'availabilityRuleId', RuleDefinition::class))->setDescription('Unique identity of availability rule.')` |
| NULL rule = always available | `Framework/Rule/RuleIdMatcher.php:24-27,38-42` | `return $option->getAvailabilityRuleId() === null \|\| \in_array($option->getAvailabilityRuleId(), $ruleIds, true);` |
| Filtering happens only on `onlyAvailable`, against context rule ids | `Checkout/Payment/SalesChannel/PaymentMethodRoute.php:76-78`; `Checkout/Shipping/SalesChannel/ShippingMethodRoute.php:79-81` | `if ($request->query->getBoolean('onlyAvailable') ...) { $paymentMethods = $this->ruleIdMatcher->filterCollection($paymentMethods, $context->getRuleIds()); }` |
| Rule ids computed by CartRuleLoader, max 7 iterations over a recalculated cart | `Checkout/Cart/CartRuleLoader.php:34,148-176` | `private const MAX_ITERATION = 7;` … `$rules = $rules->filterMatchingRules($cart, $salesChannelContext);` |
| Matching uses the payload blob; non-Rule payload never matches | `Content/Rule/RuleCollection.php:22-27`; `Content/Rule/RuleDefinition.php:78-79` | `if (!$rule->getPayload() instanceof Rule) { return false; }` |
| Root is always an AndRule; containers receive their children | `Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:78-81,125-166` | `// ensure the root rule is an AndRule` / `$nested = new AndRule($nested);` |
| Conditions are rows with required `type`, JSON `value`, parent/children self-association | `Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:56-67` | `(new StringField('type', 'type'))->addFlags(new Required())` … `new ParentFkField(self::class)` … `new ChildrenAssociationField(self::class)` |
| Container types available | `Framework/Rule/Container/` (listing); `Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:134-136` | `AndRule.php Container.php ContainerInterface.php … NotRule.php OrRule.php XorRule.php` / `throw new ConditionTypeNotFound($rule['type']);` |
| Condition types are services tagged `shopware.rule.definition` | `Framework/DependencyInjection/rule.xml:7,13`; `Framework/Rule/Collector/RuleConditionRegistry.php:22-26` | `<argument type="tagged_iterator" tag="shopware.rule.definition"/>` |
| Rule areas are derived from the RuleAreas flag, not chosen | `Content/Rule/RuleDefinition.php:80,88-91`; `Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:150-158` | `(new OneToManyAssociationField('paymentMethods', …))->addFlags(new RestrictDelete(), new RuleAreas(RuleAreas::PAYMENT_AREA))` |
| Second enforcement at cart validation, with three payment reasons | `Checkout/Cart/Delivery/DeliveryValidator.php:17-33`; `Checkout/Payment/Cart/PaymentMethodValidator.php:17-48` | `reason: 'rule not matching or inactive'` / `reason: 'not allowed'` |
| Shipping prices carry their own `rule_id` and `calculation_rule_id` | `Checkout/Shipping/Aggregate/ShippingMethodPrice/ShippingMethodPriceDefinition.php:56-60` | `(new FkField('rule_id', 'ruleId', RuleDefinition::class))` … `(new FkField('calculation_rule_id', 'calculationRuleId', RuleDefinition::class))` |
| Flow-condition rules are excluded from cart/context evaluation | `Checkout/Cart/CartRuleLoader.php:198-202`; `Content/Rule/RuleCollection.php:32-37` | `!\in_array(RuleAreas::FLOW_CONDITION_AREA, $rule->getAreas(), true)` |
| 6.6 parity | `refs/heads/6.6.x src/Core/Checkout/Payment/SalesChannel/PaymentMethodRoute.php:72-73`; `Checkout/Shipping/ShippingMethodCollection.php:18-36` | 6.6: `$paymentMethods = $paymentMethods->filterByActiveRules($context);` / 6.7: `@deprecated tag:v6.8.0 use RuleIdMatcher instead` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A method can have several availability rules | absent | Single scalar FK `availability_rule_id` plus one ManyToOne association; no mapping table — `Checkout/Shipping/ShippingMethodDefinition.php:81,90` |
| `onlyAvailable` was removed in 6.7 as its 6.6 deprecation announced | absent | 6.7.13.0 still reads and honours the flag — `Checkout/Payment/SalesChannel/PaymentMethodRoute.php:76-86` |
| Conditions are evaluated live from `rule_condition` rows | absent | Matching goes exclusively through the deserialised payload — `Content/Rule/RuleCollection.php:22-27` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Error keys surfaced to the storefront | `Checkout/Shipping/Cart/Error/ShippingMethodBlockedError.php:12`; `Checkout/Payment/Cart/Error/PaymentMethodBlockedError.php:12` |
| 6.7 aggregation of blocked methods for the checkout gateway | `Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:59,64` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Methods not re-evaluated when the account type changes mid-checkout for guests | 6.6.10.4 | open | https://github.com/shopware/shopware/issues/12666 |
| Tag condition 'are none of' blocks the method for carts of only custom line items | 6.6.10.20 | closed | https://github.com/shopware/shopware/issues/18380 |
| 'Item quantity / All / lower or equal 1' behaves as if a product is required | 6.6.10.6 | closed | https://github.com/shopware/shopware/issues/12493 |
| Maintainer proposal to deprecate the 'Item available' condition for 6.8 | 6.6/6.7 | closed | https://github.com/shopware/shopware/issues/7790 |
| Availability rules ignored for B2B organization units / quotes | 6.7.5.1, 6.7.9.1 | closed | https://github.com/shopware/shopware/issues/14794, https://github.com/shopware/shopware/issues/16784 |
| Rule Builder UI duplicates conditions above ~250-500 OR conditions | 6.6.10.18 | closed | https://github.com/shopware/shopware/issues/18652 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Where is the availability rule applied — route or validator? | code | Both: route filtering on `onlyAvailable`, plus `DeliveryValidator` / `PaymentMethodValidator` at cart validation |
| Does `shipping_method_price` carry its own `rule_id`? | code | Yes, plus `calculation_rule_id` — a second, independent rule hook |
| Are the availability lists cached per session or recomputed? | code | Rule ids are recomputed by `CartRuleLoader` against the recalculated cart (max 7 iterations) |
| Individual condition classes ('Item available', `LineItemTagRule` no-tag branch) | not settled | Not examined; no fact above asserts individual condition semantics |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The availability rule decides when shipping with this method is possible | "In the availability rule, you decide when shipping is possible using this shipping method." | merchant `settings/shipping/v1-3-1.md` | yes — `ShippingMethodDefinition.php:81` |
| An unrestricted payment method leaves the availability rule blank (NULL) | "For payment methods that are available without restriction, leave the availability rule blank (NULL)." | merchant `settings/Paymentmethods/v1-4-0-0.md` (6.7 only) | yes — `RuleIdMatcher.php:24-27` |
| AND requires all conditions, OR requires one | "When multiple conditions are linked with \"AND\", all conditions must be fulfilled for the rule to apply." | merchant `settings/rules/v1-6-1-0.md` | yes — root AndRule in `RulePayloadUpdater.php:78-81` |
| Only valid rules can be used | "Indicates whether the rule is valid, only valid rules can be used." | merchant `settings/rules/v1-6-1-0.md` | yes — non-Rule payload never matches; `invalid` is write-protected |
| Rules cannot be deleted while assigned | "Rules cannot be deleted as long as they are assigned." | merchant `settings/rules/v1-6-1-0.md` | yes — `RestrictDelete` on the method associations |
| A price matrix without a rule always applies | "If you do not select a rule here, this price matrix will always be used for this shipping method." | merchant `settings/shipping/v1-3-1.md` | partially — `shipping_method_price.rule_id` is nullable; the null-means-always path was not read |
| Higher priority runs sooner | "The higher the priority, the sooner it is executed." | merchant `settings/rules/v1-6-1-0.md` | not checked — not admitted as a fact |
| Condition categories offered in the admin | (field list on the page) | merchant `settings/rules/v1-6-1-0.md` | not checked — condition types are registry-driven (`shopware.rule.definition`), so the list is not fixed by core docs |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The 6.7 page states the Assignments tab "is not used for assigning rules directly", while the 6.6 page presents the same list as the way to assign rules | Assignment for shipping/payment is the `availability_rule_id` FK on the *method*; the rule's `areas` list is derived and write-protected, never chosen | `Content/Rule/RuleDefinition.php:80,88-91`; `Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:150-158` |
| The docs describe conditions as evaluated during evaluation of the rule | Evaluation runs against the pre-built serialised payload, so an un-indexed rule fails closed | `Content/Rule/RuleCollection.php:22-27` |
| The 6.6 payment page does not state the NULL-means-unrestricted behaviour; only the 6.7 page does | The behaviour is identical in both versions | `Framework/Rule/RuleIdMatcher.php:24-27`; 6.6 `filterByActiveRules` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Rules live under **Settings > Automation > Rule Builder** (as the page states it; older docs say Settings > Shop) and consist of conditions with operators and values, combined with **AND** / **OR** and subconditions; higher priority runs first. | replaced | No lane report supports the menu path; the priority ordering is a code-expressible claim that the code lane did not check, so it is not admissible as `[docs-only]`. The AND/OR half is retained in new fact 2, backed by the always-AndRule root. |
| Condition categories are General (e.g. Sales Channel, Currency, Date range, Day of the week, Time range), Orders, Flow Builder, Customers, Marketing & Promotions, Items in shopping cart and Shopping cart. | removed | No code finding backs the enumeration, and condition types are registry-driven via the `shopware.rule.definition` tag, so the set is not fixed by core; the enumeration is code-expressible and therefore not admissible as `[docs-only]`. |
| Rules are assigned to payment methods, shipping methods and shipping cost calculation, promotions and discounts, advanced prices and flows; product/category/Shopping Experience block visibility additionally requires Dynamic Access. | replaced | Narrowed to what the query asks about and what code settles: the shipping/payment assignment is the method's `availability_rule_id`, plus the separate `shipping_method_price.rule_id`. The Dynamic Access gating is licence information the code lane did not examine. |
