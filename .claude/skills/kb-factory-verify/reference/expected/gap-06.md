# `gap-06` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-06` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** How do I create a shipping method from my plugin's installer or migration, including the `technicalName` that 6.7 requires?

**Expected answer — every fact an answer must contain:**

1. States that the corpus has no guide for creating a shipping method programmatically from a plugin: shipping methods are documented only for the app system (app manifest, experimental since 6.5.7.0) and the `technicalName` requirement only as an ADR / release-note statement; the payment-plugin installer guide is the nearest analogue and must not be presented as the shipping answer.  `[docs-only]`
2. Does not present a plugin route as documented. If it names one, it must be the only route that exists in 6.7: a DAL write through the `shipping_method.repository` service with the `Context` from `InstallContext::getContext()` — core ships no shipping-method registration helper or persister for plugins.  `[code: Framework/Plugin/Context/InstallContext.php:25-57]`
3. Gets the 6.7 requirement right if it states it: `technicalName` is a `Required` `StringField` on `ShippingMethodDefinition` and the column is `NOT NULL` from 6.7 and `UNIQUE` in the database; the value is not format-validated, and a duplicate fails at the database and surfaces as `ShippingException::duplicateTechnicalName()`. Invents no definition class, no migration SQL and no validator for the plugin case.  `[code: Checkout/Shipping/ShippingMethodDefinition.php:77]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/checkout/shipping-methods.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `technical_name` is a `Required` string field on the shipping-method definition | `Checkout/Shipping/ShippingMethodDefinition.php:77` | `(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required()),` |
| The entity property is a non-nullable string | `Checkout/Shipping/ShippingMethodEntity.php:72` | `protected string $technicalName;` |
| The column carries a DB-level UNIQUE constraint (added 6.5) | `Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:49-50` | `ALTER TABLE \`shipping_method\` ADD CONSTRAINT \`uniq.technical_name\` UNIQUE (\`technical_name\`)` |
| 6.7 is where the column becomes `NOT NULL` | `Migration/V6_7/Migration1697112044PaymentAndShippingTechnicalNameRequired.php:31-34` | `ALTER TABLE \`shipping_method\` MODIFY COLUMN \`technical_name\` VARCHAR(255) NOT NULL` |
| A duplicate surfaces as a domain exception, mapped from MySQL 1062 | `Framework/DataAbstractionLayer/TechnicalNameExceptionHandler.php:28-34` | `return ShippingException::duplicateTechnicalName($matches['technicalName']);` |
| …with the message `The technical name "{{ technicalName }}" is not unique.` | `Checkout/Shipping/ShippingException.php:40-47` | `self::SHIPPING_METHOD_DUPLICATE_TECHNICAL_NAME` |
| Other `Required` fields on a create: `id`, `deliveryTimeId`, `taxType`, translations; `taxType`/`position`/`active` have defaults | `Checkout/Shipping/ShippingMethodDefinition.php:58-64,82,84` | `'taxType' => ShippingMethodEntity::TAX_TYPE_AUTO,` |
| `availabilityRuleId` is NOT required in 6.7 (column made nullable in 6.6) | `Migration/V6_6/Migration1697788982ChangeColumnAvailabilityRuleIdFromShippingMethodToNullable.php:21` | `MODIFY COLUMN \`availability_rule_id\` BINARY(16) DEFAULT NULL` |
| The repository service id is `shipping_method.repository` | `Framework/DependencyInjection/demodata.xml:29` | `<argument type="service" id="shipping_method.repository"/>` |
| `InstallContext` exposes only plugin/context/version/migration accessors — no shipping helper | `Framework/Plugin/Context/InstallContext.php:25-57` | `public function getContext(): Context` |
| The write-time validator checks tax rules only, never `technicalName` | `Checkout/Shipping/Validator/ShippingMethodValidator.php:70-95` | `if ($taxType && !\in_array($taxType, self::ALLOWED_TAX_TYPES, true))` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Core ships a helper/persister for plugins to register a shipping method | absent | No `ShippingMethodPersister` or installer helper in the installed core; the only route is a DAL write via `shipping_method.repository` (or raw SQL in a `MigrationStep`) — `Framework/App/Lifecycle/Persister/` |
| `technicalName` is format-validated (e.g. must start with `shipping_`) | absent | `ShippingMethodValidator` checks only `taxType`/`taxId`; the `shipping_` prefix is a backfill convention, not a rule — `Checkout/Shipping/Validator/ShippingMethodValidator.php` |
| Uniqueness is checked in PHP before the write | absent | Only the MySQL UNIQUE constraint, translated after the fact — `Framework/DataAbstractionLayer/TechnicalNameExceptionHandler.php:28-34` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| none — the dist package strips `Checkout/Test` | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The 6.7 non-null migration fails when a method has no technical name; plugin authors add one too late | 6.7 | closed | https://github.com/shopware/shopware/issues/8238 |
| Sync-API FK resolver `shipping_method.technical_name` added; technical name described as a DB-unique stable key | 6.7 | merged | https://github.com/shopware/shopware/pull/16615 |
| Method *names* are not unique, only technical names are | 6.7 | open | https://github.com/shopware/shopware/issues/11464 |
| Forum: assigning sales channels needs id-arrays, not entity objects | 6.5 | closed | https://forum.shopware.com/t/shopware-6-5-create-a-new-shipping-method-programmatically/100714 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is `technicalName` `Required` and the column NOT NULL + UNIQUE in 6.7? | code | Yes — definition line 77, 6.5 UNIQUE migration, 6.7 NOT NULL migration |
| Is `availabilityRuleId` still required? | code | No — nullable since 6.6, no `Required` flag |
| What does a duplicate technical name produce? | code | `ShippingException::duplicateTechnicalName()` via the DAL exception handler |
| Does the 6.7 migration backfill `temporary_<id>` before the NOT NULL alter (docs/release notes) or fail hard (issue #8238)? | not settled | The code lane cited only the `MODIFY COLUMN` statement. Not load-bearing for this case's facts; no fact asserts either behaviour |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `technicalName` introduced on payment_method and shipping_method as a unique identifier | "This `technicalName` property will serve as a unique identifier for payment and shipping methods" | `resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md` | yes |
| Optional until 6.7, required in DB and API from 6.7.0.0, backed by a unique index | "Starting from version 6.7.0.0, this `technicalName` field will also become required within the database and the API." | same ADR | yes |
| Plugin developers must supply a `technicalName` from 6.7.0.0 | "Plugin developers will be required to supply a `technicalName` … beginning with version 6.7.0.0." | same ADR | yes |
| Shipping methods can be added via the App Manifest, experimental since 6.5.7.0 | "Starting with version 6.5.7.0 as **experimental feature**…" | `guides/plugins/apps/checkout/shipping-methods.md` | not checked (app path, out of scope) |
| The payment-plugin guide shows an installer writing `technicalName` through the entity repository | "'technicalName' => 'swag_example-example_payment'," | `guides/plugins/plugins/checkout/payment/add-payment-plugin.md` | analogue only — it is the payment repository |
| Live 6.7.0.0 release notes: methods without a technical name get `temporary_<method-id>` | "temporary_<method-id>" | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html | not confirmed — code lane cited only the NOT NULL alter |

Docs coverage verdict: **not-covered**. No page in the developer clone or on the live developer docs describes creating a `shipping_method` entity from a plugin installer or migration; `shipping_method.repository`, `deliveryTimeId` on a shipping method and `shipping_method_price` appear nowhere as plugin-installer instructions.

Business context code cannot express:

| point | quote | citation |
| --- | --- | --- |
| Changing a technical name breaks shipping integrations that rely on it | "A subsequent change to the technical name can cause shipping integrations that rely on it to no longer work." | merchant docs, `shopware-6/shopware-6-de/saas/Shipping/v2-1-0-0.md` |
| Intent: app servers previously had to call the Admin API to resolve method ids | "This issue is particularly significant for app servers…" | ADR 2023-10-17 |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The 6.7 requirement is stated for payment methods only in the payment-plugin guide | The `Required` flag and the NOT NULL migration apply to `shipping_method` exactly as to `payment_method` | `Checkout/Shipping/ShippingMethodDefinition.php:77` |
| Release notes state the migration assigns `temporary_<method-id>` to methods without a technical name | The cited 6.7 migration excerpt performs only `MODIFY COLUMN … NOT NULL`; no backfill was cited | `Migration/V6_7/Migration1697112044PaymentAndShippingTechnicalNameRequired.php:31-34` |
| The payment-plugin guide adds an unversioned claim that an omitted technical name "can prevent the plugin from being installed or activated" | No plugin-lifecycle validation of `technicalName` exists; enforcement is the DB constraint and the `Required` flag at write time | `Checkout/Shipping/Validator/ShippingMethodValidator.php` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source documents shipping methods for the app system (and for merchants in the administration) but has no guide for creating one programmatically from a plugin. | rewritten | Kept the gap assertion, which the docs lane confirms (`coverage: not-covered`), and replaced the loose "and for merchants in the administration" with what the docs lane actually found: the app-manifest guide plus the ADR/release-note statement of the 6.7 requirement. |
| Names the closest page actually read, and does not present the app manifest approach as the plugin answer. | rewritten | "Names the closest page actually read" is not checkable against an answer. Replaced by the code-settled constraint on which route may be named at all. |
| Invents no repository call, definition class or migration SQL for the plugin case. | rewritten | Code shows the DAL write through `shipping_method.repository` is the only route that exists, so a blanket ban on naming a repository call would penalise a correct answer. The new fact bans presenting it as *documented* and bans invented classes, SQL and validators. |
