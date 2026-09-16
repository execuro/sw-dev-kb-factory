# `dev-47` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-47` · `dev` · `Payment & Shipping` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** My payment plugin implements `AsynchronousPaymentHandlerInterface` and is tagged `shopware.payment.method.async` — how do I write a payment handler for Shopware 6.7 instead?

**Expected answer — every fact an answer must contain:**

1. In 6.7 the handler extends the abstract class `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` — the entire `*PaymentHandlerInterface` family and every `shopware.payment.method.async/.sync/.prepared/.recurring/.refund` tag variant are gone from the tree, replaced by the single tag `shopware.payment.method`, which autoconfiguration already applies to anything extending the class.  `[code: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18]` `[code: Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:128]` `[code: Checkout/DependencyInjection/payment.xml:93]`
2. Only two methods are mandatory: `supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool` and `pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse`. Async is no longer a handler type — returning a `RedirectResponse` from `pay()` makes the flow asynchronous and causes `finalize(Request, PaymentTransactionStruct, Context): void` to run after the return; returning `null` ends it synchronously. `PaymentHandlerType` has only `RECURRING` and `REFUND`.  `[code: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24]` `[code: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:54]` `[code: Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8]`
3. The `payment_method` record the plugin creates must carry a `technicalName` — it is `Required()` on the definition and `NOT NULL` in the schema, so an insert without it fails with a write constraint violation — and it must be unique (unique index `uniq.technical_name`, surfaced as `PaymentException::duplicateTechnicalName`). The `handler_identifier` must equal the handler's service id, and the method must be deactivated rather than deleted on uninstall: deleting a payment method with a `plugin_id` throws `PaymentException::pluginPaymentMethodDeleteRestriction()`.  `[code: Checkout/Payment/PaymentMethodDefinition.php:79]` `[code: Migration/V6_7/Migration1697112044PaymentAndShippingTechnicalNameRequired.php:25]` `[code: Checkout/Payment/DataAbstractionLayer/PaymentMethodValidator.php:38]` `[code: Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:62]`

**Trap:** The whole `*PaymentHandlerInterface` family and the `shopware.payment.method.sync/.async/.prepared/.recurring/.refund` tags were replaced in 6.7.0.0 by one abstract class and one tag; the query keeps the 6.6-era names. A second trap: `executeOrder()` is not a method on the core abstract class.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| One base type: an abstract class, not an interface | `Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18` | `abstract class AbstractPaymentHandler` |
| Only `supports()` and `pay()` are abstract | `Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24-39` | `abstract public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool;` … `abstract public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse;` |
| `finalize()` runs only when `pay()` returned a `RedirectResponse` | `Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:54-63` | `If the pay method is not returning a RedirectResponse, this method will not and *cannot* be called.` |
| The processor implements that branch | `Checkout/Payment/PaymentProcessor.php:93-97` | `if ($response instanceof RedirectResponse) { $encodedToken = null; }` |
| `validate()/finalize()/refund()/recurring()` are optional; refund/recurring throw unless overridden | `Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:71-90` | `throw PaymentException::paymentHandlerTypeUnsupported($this, PaymentHandlerType::REFUND);` |
| The enum has two cases only | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8-11` | `enum PaymentHandlerType { case RECURRING; case REFUND; }` |
| The single tag is applied by autoconfiguration | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:128-130` | `->registerForAutoconfiguration(AbstractPaymentHandler::class)->addTag('shopware.payment.method');` |
| The tag is consumed by the registry | `Checkout/DependencyInjection/payment.xml:92-94` | `<argument type="tagged_locator" tag="shopware.payment.method"/>` |
| Handlers are keyed by service id and resolved via `handler_identifier` | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:28-31,62-64` | `$handlerIdentifier = $result['handler_identifier']; return $this->handlers[$handlerIdentifier] ?? null;` |
| PHPStan contract map ties the tag to the abstract class | `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:114` | `'shopware.payment.method' => AbstractPaymentHandler::class,` |
| `PaymentTransactionStruct` carries ids, not an entity | `Checkout/Payment/Cart/PaymentTransactionStruct.php:12-17` | `protected string $orderTransactionId, protected ?string $returnUrl = null, protected ?RecurringDataStruct $recurring = null` |
| `technicalName` is Required on the definition | `Checkout/Payment/PaymentMethodDefinition.php:79` | `(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required()),` |
| Column flipped to NOT NULL in 6.7 | `Migration/V6_7/Migration1697112044PaymentAndShippingTechnicalNameRequired.php:25-28` | `ALTER TABLE \`payment_method\` MODIFY COLUMN \`technical_name\` VARCHAR(255) NOT NULL` |
| Backfill migration precedes it | `Migration/V6_7/Migration1697112043TemporaryPaymentAndShippingTechnicalNames.php:33-34` | `SET technical_name = CONCAT('temporary_', LOWER(HEX(id))) WHERE technical_name IS NULL;` |
| Omitting the value on insert reaches the serializer and fails | `Framework/DataAbstractionLayer/Write/WriteCommandExtractor.php:336-343` | `(!$create \|\| !$field->is(Required::class))` — the field is not skipped on create |
| …and `NotBlank` is attached because there is no `AllowEmptyString` | `Framework/DataAbstractionLayer/FieldSerializer/StringFieldSerializer.php:97-99` | `if (!$field->is(AllowEmptyString::class)) { $constraints[] = new NotBlank(); }` |
| Uniqueness is a real index | `Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:38-39` | `ALTER TABLE \`payment_method\` ADD CONSTRAINT \`uniq.technical_name\` UNIQUE (\`technical_name\`)` |
| The 1062 error becomes a domain exception | `Framework/DataAbstractionLayer/TechnicalNameExceptionHandler.php:20-26` | `return PaymentException::duplicateTechnicalName($matches['technicalName']);` |
| Deleting a plugin payment method is blocked | `Checkout/Payment/DataAbstractionLayer/PaymentMethodValidator.php:38-53` | `SELECT id FROM payment_method WHERE id IN (:ids) AND plugin_id IS NOT NULL` … `throw PaymentException::pluginPaymentMethodDeleteRestriction();` |
| Reverse associations additionally RestrictDelete; plugin removal only nulls `plugin_id` | `Checkout/Payment/PaymentMethodDefinition.php:85-88`, `Framework/Plugin/PluginDefinition.php:79` | `(new OneToManyAssociationField('orderTransactions', …))->addFlags(new RestrictDelete()),` / `…('paymentMethods', …))->addFlags(new SetNullOnDelete()),` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `AsynchronousPaymentHandlerInterface` exists in 6.7 | absent | grep over `vendor/shopware` returns no match; the same holds for `SynchronousPaymentHandlerInterface`, `PreparedPaymentHandlerInterface`, `RefundPaymentHandlerInterface`, `RecurringPaymentHandlerInterface`, `PaymentHandlerInterface`. The directory contains only `AbstractPaymentHandler.php`, the core handlers, `PaymentHandlerRegistry.php`, `PaymentHandlerType.php`. |
| Tag `shopware.payment.method.async` is used in 6.7 | absent | only the plain `shopware.payment.method` appears anywhere; no `.async/.sync/.prepared/.recurring/.refund` variant is registered or consumed (`Checkout/DependencyInjection/payment.xml:93`). |
| A handler declares async capability via `PaymentHandlerType` | absent | the enum has only `RECURRING` and `REFUND` (`…/PaymentHandlerType.php:8-11`); redirect behaviour is expressed solely by `pay()`'s return. |
| `AbstractPaymentHandler::executeOrder()` exists | absent | not present on the abstract class; the community write-up describing it was reporting SwagPayPal's own structure. |
| Core enforces a plugin-specific prefix on `technicalName` | absent | no regex, `Choice` flag or validator constrains the value; the `payment_`/`temporary_` prefixes appear only in backfill migrations that *generate* names for pre-existing rows (`Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:60-61`). |
| A core subscriber or install helper supplies a default `technicalName` | absent | `PaymentMethodValidator` handles delete commands only and returns early otherwise (`…/PaymentMethodValidator.php:36-44`). |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A complete plugin-shaped 6.7 handler: extends the abstract class, `pay()` returns a `RedirectResponse` or `null`, `finalize()` sets the transaction state | `Test/Integration/PaymentHandler/TestPaymentHandler.php:26-86` |
| How such a handler is registered — plain service definition plus the single tag | `Framework/DependencyInjection/services_test.xml:22-25` |
| Declaring refund/recurring support through `supports()` | `Checkout/Payment/Cart/PaymentHandler/InvoicePayment.php:15-22` |
| Both branches of the plugin delete restriction | `shopware/shopware@trunk tests/unit/Core/Checkout/Payment/DataAbstractionLayer/PaymentMethodValidatorTest.php` (not in the trimmed vendor dist) |
| The administration mirrors the rules: `technicalName` auto-provided only for plugin/app methods, delete forbidden once transactions exist | `shopware/administration Resources/app/administration/src/module/sw-settings-payment/page/sw-settings-payment-detail/index.js:122-138` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware rebuilt SwagPayPal's handler for 6.7 — presented as a substantial refactor, not a rename | 6.7 | open | shopware.com news, optimizing-the-paypal-payment-handler-for-6-7-release |
| Migration write-up: interfaces deprecated, replacement is "extend AbstractPaymentHandler and use the single service tag"; "all payment methods now require a technicalName" | 6.7 | open | tobias-schaefer.com/blog/shopware-migration-66-to-67/ |
| Vendor write-up implies `executeOrder()` is the primary override point | 6.7 | open | xictron.com blog |
| `Migration1742302302RenamePaidTransitionActions` renamed every `pay`/`pay_partially`/`do_pay` transition, breaking plugin updates | 6.7.0.0 | closed | github.com/shopware/shopware/issues/11157 |
| Merged scoping fix for the above | 6.7 | merged | github.com/shopware/shopware/pull/11238 |
| Session lost after redirect back from the provider before `finalize` | 6.6 | open | forum.shopware.com/t/…/103913 |
| No tracker issue about migrating off `AsynchronousPaymentHandlerInterface` | unclear | closed | github.com/shopware/docs/issues/1409 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `AsynchronousPaymentHandlerInterface` exist in 6.7? | code lane | No — the whole interface family is removed, not deprecated. |
| Is `shopware.payment.method.async` still consumed? | code lane | No — only the plain tag exists and is consumed by the registry. |
| Exact API of `AbstractPaymentHandler`? | code lane | Two abstract methods; `validate/finalize/refund/recurring` optional; `pay(): ?RedirectResponse`. |
| Does `executeOrder()` exist? | code lane | Ruled out — not on the core class. |
| Which `PaymentHandlerType` cases exist? | code lane | `RECURRING`, `REFUND` only. |
| Does the handler get the order entity? | code lane | No — `PaymentTransactionStruct` carries `orderTransactionId`, `returnUrl`, recurring data. |
| Is `technicalName` required and enforced at write time? | deep pass | Yes — `Required()` flag plus `NOT NULL` column; an insert without it fails `NotBlank` in the string serializer. |
| Which transition action names exist after `Migration1742302302…`? | not pursued | Out of scope for this query's facts; the query asks about the handler contract. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| From 6.7.0.0 payment handling uses a single `AbstractPaymentHandler` | "From Shopware 6.7.0.0, payment handling is done with a single `AbstractPaymentHandler`." | add-payment-plugin.md:11 | yes |
| Extend `…\PaymentHandler\AbstractPaymentHandler` | "Shopware provides you with a handy … abstract class for you to extend" | add-payment-plugin.md:33 | yes |
| The service must carry `shopware.payment.method`, otherwise it is not recognised | "otherwise Shopware won't recognize your service as a payment handler" | add-payment-plugin.md:38 | partly — the tag is required, but autoconfiguration supplies it |
| Remove the old per-capability tags including `.async` | "Remove any other occurrences of the following tags: `shopware.payment.method.sync`, `shopware.payment.method.async`, …" | add-payment-plugin.md:811-813 | yes — they no longer exist |
| `finalize` is only called if `pay` returns a `RedirectResponse` | migration table row for `AsynchronousPaymentHandlerInterface` | add-payment-plugin.md:804 | yes |
| Signature `pay(Request, PaymentTransactionStruct, Context, ?Struct): ?RedirectResponse` | quoted verbatim | add-payment-plugin.md:191 | yes |
| Return URL comes from `PaymentTransactionStruct::getReturnUrl` | "which you can fetch from the passed `PaymentTransactionStruct` using the method `getReturnUrl`" | add-payment-plugin.md:258 | yes |
| Failures are signalled with `PaymentException` factories | "you'll have to throw a `PaymentException::customerCanceled` exception" | add-payment-plugin.md:267 | not examined |
| `technicalName` required from 6.7, unique, "should use a plugin-specific prefix" | quoted | add-payment-plugin.md:764-766 | required and unique: yes; prefix: no — nothing enforces it |
| Migration also requires adding own order data loading | "add your own order data loading" | add-payment-plugin.md:794 | consistent — the struct carries ids only |
| Do not delete the payment method on uninstall, only deactivate | "**Do not** … remove the payment method … Instead, only deactivate the method!" | add-payment-plugin.md:776-778 | yes, and enforced: `PaymentMethodValidator` throws |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The migration section tells readers to remove `.async` but never says whether it is deprecated or hard-removed, and the illustrative snippet at lines 828-835 still chains all the deprecated tags onto the service definition | No `.async/.sync/.prepared/.recurring/.refund` variant exists anywhere, and the whole `*PaymentHandlerInterface` family is absent from the tree — removed, not deprecated. Copying that snippet verbatim yields tags nothing consumes. | `Checkout/DependencyInjection/payment.xml:93`; `Checkout/Payment/Cart/PaymentHandler/` directory listing |
| The `shopware.payment.method` tag is unconditionally required or the handler is not recognised | Autoconfiguration adds the tag to anything extending `AbstractPaymentHandler`, so the explicit tag is optional when autoconfigure is on | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:128-130` |
| `technicalName` "should use a plugin-specific prefix" | No format validation of any kind. The prefix appears only in backfill migrations that generate names for legacy rows; the sole enforced constraint is uniqueness. | `Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:60-61` |
| A vendor write-up (community, not the official docs) names `executeOrder()` as the primary override point | No such method on `AbstractPaymentHandler` | `Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18-90` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The handler extends `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` and is registered with the single service tag `shopware.payment.method`. | revised | correct, but rewritten to state that the old interfaces and tag variants are absent (not deprecated) and that autoconfiguration applies the tag; evidence tags added |
| `supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool` declares the supported flows, `pay(Request, PaymentTransactionStruct, Context, ?Struct): ?RedirectResponse` is always called in checkout (return `null` for synchronous), and `finalize(...)` handles the return from an asynchronous provider. | revised | code shows only `supports()`/`pay()` are mandatory and that `PaymentHandlerType` cannot express async at all — `supports()` declares refund/recurring, not "the supported flows" |
| From 6.7.0.0 a plugin payment method requires a unique `technicalName` (with plugin prefix) in the `payment_method.repository` record; an omitted value can prevent installation/activation, and the method must only be deactivated, never removed, on uninstall. | revised | "with plugin prefix" removed — no code enforces a format; "can prevent installation/activation" sharpened to the actual write-constraint violation; the uninstall rule promoted from guidance to the enforced `pluginPaymentMethodDeleteRestriction`; `handler_identifier` = service id added as load-bearing |
