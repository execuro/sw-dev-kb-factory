# `func-09` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-09` · `func` · `Merchant` |
| Version | `6.6` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** Why doesn't my payment method appear in the checkout — what has to be configured in the administration?

**Expected answer — every fact an answer must contain:**

1. Switching a payment method **Active** does not make it appear: the Store API payment-method listing unconditionally adds the filter `payment_method.salesChannels.id` = current sales channel, so the method must additionally be assigned to that sales channel, and the route then filters `active = true` and sorts by `position`. (Administration path is documented as **Settings > Shop > Payment methods** for 6.6 and **Settings > Commerce > Payment methods** for 6.7 `[docs-only]`.)  `[code: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15]`
2. The **Availability rule** is the third gate: a method survives only if `availabilityRuleId` is `NULL` or is among the rule ids the current sales-channel context matches, and the checkout always requests available-only (`CheckoutGatewayRoute` forces `onlyAvailable=1`) — so an unrestricted method must have the availability rule left blank. The semantics are the same in 6.6 (`PaymentMethodCollection::filterByActiveRules()` behind the then-deprecated `onlyAvailable` flag) and in 6.7 (`RuleIdMatcher`, always applied).  `[code: Framework/Rule/RuleIdMatcher.php:36]`
3. Beyond those three configurable gates the list is shaped by code, not configuration: the listing never checks the payment handler, so a method whose `handler_identifier` resolves to no registered service (plugin uninstalled or inactive) is still offered and only fails when the transaction is handled, while apps and plugins can drop a method that passed every gate through the checkout gateway's `RemovePaymentMethodCommand` — the confirm page shows only the gateway response, and a selected-but-unavailable method yields a `PaymentMethodBlockedError` with reason `not allowed`.  `[code: Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:57]`

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Gate 1 — sales channel assignment is unconditional in the store-api listing | `Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15-18` | `$criteria->addFilter(new EqualsFilter('payment_method.salesChannels.id', $context->getSalesChannelId()));` |
| Gate 2 — active flag plus position sorting | `Checkout/Payment/SalesChannel/PaymentMethodRoute.php:66-69` | `$criteria->addFilter(new EqualsFilter('active', true))->addSorting(new FieldSorting('position'))` |
| Gate 3 — availability rule: null or matched | `Framework/Rule/RuleIdMatcher.php:36-41` | `return $option->getAvailabilityRuleId() === null \|\| \in_array($option->getAvailabilityRuleId(), $ruleIds, true);` |
| The checkout always asks for available-only | `Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:44-55` | `$request->query->set('onlyAvailable', '1');` |
| Gate 4 — the checkout gateway may add/remove methods; its response is what the page shows | `Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:57-63` | `$response = $this->checkoutGateway->process($payload); ... return new CheckoutGatewayRouteResponse($response->getAvailablePaymentMethods(), ...)` |
| A selected-but-unavailable method produces a cart error | `Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:68-77` | `new PaymentMethodBlockedError(id: ..., name: ..., reason: 'not allowed',)` |
| The confirm page has no second source of payment methods, in 6.6 and 6.7 | `Storefront/Page/Checkout/Confirm/CheckoutConfirmPageLoader.php` (also read at tag v6.6.10.0) | `$response = $this->checkoutGatewayRoute->load($request, $cart, $context); $page->setPaymentMethods($response->getPaymentMethods());` |
| Version delta: 6.6 filters through the deprecated `filterByActiveRules()`; rule semantics unchanged | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Checkout/Payment/SalesChannel/PaymentMethodRoute.php#L65-L85` | `if ($request->query->getBoolean('onlyAvailable') ...) { $paymentMethods = $paymentMethods->filterByActiveRules($context); }` |
| The visibility-deciding fields on the entity are exactly active / position / availabilityRuleId / salesChannels (+ required technicalName, handlerIdentifier) | `Checkout/Payment/PaymentMethodDefinition.php` (defineFields) | `(new FkField('availability_rule_id', 'availabilityRuleId', RuleDefinition::class))` |
| A dangling handler identifier resolves to null | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:33-64` | `return $this->handlers[$handlerIdentifier] ?? null;` |
| App payment methods are activated/deactivated by the app lifecycle, outside the merchant's direct control | `Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php` | `public function activate(AppActivationContext $context): void { $this->updateActiveState($context->app->getId(), $context->context, false, true); }` |
| Sorting: the sales channel default is pinned first | `Checkout/Payment/PaymentMethodCollection.php:56-64` | `$ids = array_merge([$context->getSalesChannel()->getPaymentMethodId()], $this->getIds());` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The listing filters out methods whose handler class is missing or whose plugin is inactive | absent | `PaymentMethodRoute` applies only active + sales-channel + optional availability-rule filters; nothing queries `PaymentHandlerRegistry` (`Checkout/Payment/SalesChannel/PaymentMethodRoute.php:64-80`) |
| Deactivating a *plugin* deactivates its payment methods | absent from core for plugins | `Framework/Plugin` contains no code touching `payment_method.active`; automatic flipping exists only for app payment methods (`Framework/Plugin/PluginDefinition.php:79`) |
| A per-country / per-customer-group / per-currency setting exists on the payment method | absent | `PaymentMethodDefinition` has no such field; the only conditional mechanism is the single `availability_rule_id` FK |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| none — the vendor dist tree ships no `Checkout/Payment` tests; gates were read from production classes | `Checkout/Payment/SalesChannel/PaymentMethodRoute.php:64-80` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Payment/shipping methods not re-evaluated when a guest changes customer/address type during checkout | 6.6 | open | https://github.com/shopware/shopware/issues/12666 |
| Default payment method substituted only once when the selected one becomes rule-unavailable | 6.6 | closed | https://github.com/shopware/shopware/issues/5505 |
| Configured method absent from the confirm page for subscription/mixed carts | 6.7 | open | https://github.com/shopware/shopware/issues/18295 |
| No Store API way to list methods available for an existing order — availability is always context-based | 6.7 | open | https://github.com/shopware/shopware/issues/14282 |
| Technical name not displayed in admin lists/selects, names are not unique | unclear | open | https://github.com/shopware/shopware/issues/11464 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is sales-channel assignment a hard requirement or only the source of the default? | code | Hard requirement — the filter is added unconditionally in `SalesChannelPaymentMethodDefinition::processCriteria` |
| Is a method without an availability rule always available? | code | Yes — `RuleIdMatcher` admits `availabilityRuleId === null` |
| Is the plugin/app active state a condition of the route criteria? | code | No — absence recorded above; only app lifecycle flips the `active` flag |
| Is the list recomputed when cart/address changes (issue 12666)? | code (partially) | Availability is computed from the context's matched rule ids each time the gateway runs; whether the *context* is refreshed for guests is a separate defect and does not change the configuration chain — no fact rests on it |
| Does the technical name gate visibility? | code | No — visibility uses active / salesChannels / availabilityRuleId; the handler is resolved by `handler_identifier` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Activating a method does not make it available; the sales channel assignment decides | "However, this does not automatically mean that all activated payment methods are available to your customers in the storefront. The decisive factor here is which payment methods are assigned in your sales channel." | merchant `settings/Paymentmethods/v1-3-0-0.md:20` | yes — `SalesChannelPaymentMethodDefinition.php:15-18` |
| The availability rule determines when a method is available, using Rule Builder rules | "You can use the **availability rule** to determine when this payment method should be available." | merchant `settings/Paymentmethods/v1-3-0-0.md:53` | yes — `RuleIdMatcher.php:36-41` |
| An unrestricted method must have the availability rule left blank (NULL) | "For payment methods that are available without restriction, leave the availability rule blank (NULL)." | merchant `settings/Paymentmethods/v1-4-0-0.md:54` (6.7 page only) | yes — and the code shows the same semantics already in 6.6 |
| Module path is Settings > Shop > Payment methods (6.6) / Settings > Commerce (6.7) | "You can find the payment methods in the Shopware 6 Administration under **Settings > Shop > Payment methods**." | merchant `settings/Paymentmethods/v1-3-0-0.md:11`; 6.7 wording at `v1-4-0-0.md:10` | no code equivalent — admitted as `[docs-only]` |
| Four methods are active by default (cash on delivery, invoice, prepayment, direct debit) | "In the standard Shopware version, the four payment methods cash on delivery, invoice, prepayment and direct debit are activated." | merchant `settings/Paymentmethods/v1-3-0-0.md:20` | not checked — seeding migrations were not read; removed from the facts |
| Changing the technical name can render existing payment methods inoperable | "Changing the technical name can result in existing payment methods becoming inoperable." | merchant `settings/Paymentmethods/v1-3-0-0.md:30-32` | no — not examined by the code lane; the handler is resolved by `handler_identifier`, not `technical_name` |
| Position determines display order | "This position determines the order in which the payment types are displayed in the shop." | merchant `settings/Paymentmethods/v1-3-0-0.md:35` | yes — `PaymentMethodRoute.php:66-69`, with the sales-channel default pinned first |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The merchant page names only the Active flag, the sales channel assignment and the availability rule | There is a fourth, non-configurable gate: the checkout gateway can add or remove methods, and the confirm page renders only the gateway response | `Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:57-63` |
| Changing the technical name can make a payment method inoperable | The payment handler is resolved from `handler_identifier`, and the listing applies no technical-name condition; the code lane found no consumer of `technical_name` that would break | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:33-64` |
| The NULL-availability-rule requirement is stated only from the 6.7 page | The same `null`-or-matched semantics hold in 6.6, via `PaymentMethodCollection::filterByActiveRules()` | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Checkout/Payment/SalesChannel/PaymentMethodRoute.php#L65-L85` |
| 6.6 docs place the module under Settings > Shop, the suite's fact said Settings > Commerce (the 6.7 path) | not expressible in PHP source — resolved from the version-matched merchant page | merchant `settings/Paymentmethods/v1-3-0-0.md:11` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Payment methods are managed under **Settings > Commerce > Payment methods**; the default active methods are cash on delivery, invoice, prepayment and direct debit. | rewritten | The case is pinned to 6.6, where the version-matched merchant page states **Settings > Shop > Payment methods**; `Settings > Commerce` is the 6.7 path. The default-active list was dropped: no lane verified the seeding migrations, and it does not decide whether an answer to this question is usable. |
| A payment method being **active** does not make it available in the storefront — it must additionally be assigned in the sales channel configuration. | kept, now code-backed | Confirmed by the unconditional `payment_method.salesChannels.id` filter; merged with the active/position gate into fact 1. |
| The **Availability rule** is built with the Rule Builder and left blank (`NULL`) for an unrestricted method; changing the **Technical name** of an existing payment method can render it inoperable. | rewritten | The availability-rule half is confirmed and now states the mechanism (null or matched rule id) and that the checkout always requests available-only, including the 6.6/6.7 implementation delta. The technical-name half was removed: it is an unconfirmed doc claim, and the code shows handler resolution keys off `handler_identifier`. |
| _(new)_ | added | The code shows two load-bearing effects the old set missed: the listing does not check the payment handler (dangling handler, inactive plugin — still listed, fails later), and the checkout gateway can remove a method after all DB gates pass. |
