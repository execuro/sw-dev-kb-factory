# `func-12` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-12` · `func` · `Merchant` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` (6.6 cross-checked on `refs/heads/6.6.x`) |

**Query:** A spec asks for customer-specific pricing and for a flow that calls an external URL when an order is placed — before I build either of them, does Shopware already ship them, and what has to be licensed or installed for them to exist in the shop?

**Expected answer — every fact an answer must contain:**

1. Neither capability exists in open-source Shopware, on 6.6 or 6.7: core registers exactly 16 `flow.action` services and none of them performs an HTTP request, and there is no per-customer price — `product_price` carries a **Required** `rule_id` and no customer foreign key, and no `custom_price` entity exists in core. The `checkout.order.placed` trigger itself **is** core (`CheckoutOrderPlacedEvent implements FlowEventAware`), so it is the action, not the trigger, that is missing. `[code: Content/DependencyInjection/flow.xml:61-158; Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:64; Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27-29]`
2. Both are **Shopware Commercial** features and require that extension to be installed and activated against the booked plan — pre-installed in cloud, installed manually in self-hosted shops; without it the features are absent from the shop regardless of the contract. As the merchant documentation states it (read 2026-09-12): the Flow Builder **Call URL (webhook)** action from the **Evolve** plan up, **customer-specific pricing** on **Beyond** only, maintained exclusively through `POST /api/_action/custom-price` with no administration module. `[docs-only]`
3. Without Commercial, what core does offer instead: rule-based advanced prices (`product_price` + Rule Builder customer conditions such as `customerCustomerNumber`, `CustomerGroupRule`, `CustomerTagRule`), and promotions, which are the one core price mechanism bindable to concrete customers via `personaCustomers`; and calling an external URL requires an **app** — either an app flow action whose `Resources/flow.xml` declares a mandatory `<url>`, or an app manifest `<webhook url= event=>` on `checkout.order.placed`. `[code: Checkout/Customer/Rule/CustomerNumberRule.php:18-48; Checkout/Promotion/PromotionDefinition.php:112-115; Content/Flow/Dispatching/FlowExecutor.php:193-207; Framework/App/Flow/Schema/flow-1.0.xsd:64; Framework/App/Manifest/Schema/manifest-3.0.xsd:265-268]`

**Trap:** the build-vs-buy answer. An answer that proposes writing a custom flow action or a custom price entity without first naming the Commercial feature fails, and so does an answer that presents either capability as stock Shopware.

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/extensions/shopware-commercial
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The installation is plain open source — only `shopware/core` 6.7.13.0, administration, storefront, deployment-helper; `custom/plugins` and `custom/static-plugins` empty | `composer.json:5-13`; `vendor/shopware/` | `"shopware/core": "6.7.13.0"` |
| Core registers exactly 16 flow actions through the `flow.action` tagged iterator, none HTTP-related | `Content/DependencyInjection/flow.xml:61-158` | `<argument type="tagged_iterator" tag="flow.action" index-by="key" />` … `key="action.mail.send"` … `key="action.stop.flow"` |
| `checkout.order.placed` is a real core flow trigger | `Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27-29` | `class CheckoutOrderPlacedEvent extends Event implements SalesChannelAware, …, FlowEventAware` |
| Advanced product prices are rule-bound: `rule_id` is Required | `Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:64-66` | `(new FkField('rule_id', 'ruleId', RuleDefinition::class))->addFlags(new Required())` |
| At runtime the calculator takes the first matching rule's prices, else the base price | `Content/Product/SalesChannel/Price/ProductPriceCalculator.php:306-317` | `foreach ($context->getRuleIds() as $ruleId) { … }` |
| Rule Builder ships customer-level conditions (~40 under `Checkout/Customer/Rule`) | `Checkout/Customer/Rule/CustomerNumberRule.php:18-48` | `final public const RULE_NAME = 'customerCustomerNumber';` |
| Promotions can be bound to concrete customers without a rule | `Checkout/Promotion/PromotionDefinition.php:112-115` | `new ManyToManyAssociationField('personaCustomers', CustomerDefinition::class, PromotionPersonaCustomerDefinition::class, …)` |
| The only core path from a flow to an external URL is an app flow action | `Content/Flow/Dispatching/FlowExecutor.php:193-207` | `if ($sequence->appFlowActionId) { … $this->dispatcher->dispatch($globalEvent, $sequence->action); return; }` |
| The app flow action event becomes an outgoing webhook using the app's url and secret | `Framework/Webhook/Service/WebhookManager.php:250-270` | `$webhookHeaders = $event instanceof AppFlowActionEvent ? $event->getWebhookHeaders() : [];` |
| `<url>` is mandatory in an app's `Resources/flow.xml`; parameters/headers are Twig-rendered | `Framework/App/Flow/Schema/flow-1.0.xsd:64`; `Framework/App/Flow/Action/AppFlowActionProvider.php:52-60` | `<xs:element type="xs:string" name="url"/>` |
| An app manifest can subscribe a webhook to an event directly; url and event are required | `Framework/App/Manifest/Schema/manifest-3.0.xsd:265-268`; `Framework/Webhook/WebhookDefinition.php:59-60` | `<xs:attribute type="xs:anyURI" name="url" use="required"/>` |
| 6.6 ships the same 16 action classes and no HTTP/URL action | `github shopware/shopware tree 6.6.x src/Core/Content/Flow/Dispatching/Action` | `AddCustomerTagAction.php … SendMailAction.php … StopFlowAction.php` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Core ships a flow action that calls an arbitrary external URL ("Call URL", "HTTP request", "call API") | absent | The `flow.action` iterator has exactly 16 keys, none HTTP-related, and `Content/Flow/Dispatching/Action/` holds only those 16 classes plus `FlowAction.php`, `FlowMailVariables.php`, `CustomFieldActionTrait.php`. The only URL-calling path is an app flow action or an app manifest webhook. `Content/DependencyInjection/flow.xml:61-158` |
| Core ships per-customer price lists assigned directly to a customer | absent | `product_price` carries a Required `rule_id` and no customer or customer-group foreign key; no custom-price entity exists — the only `customPrice` occurrence in core is a cart line-item payload key. `ProductPriceDefinition.php:60-79`; `Content/Product/Cart/ProductCartProcessor.php:42` |
| A commercial package is present in this installation that could supply either feature | absent | `vendor/shopware/` holds only administration, core, deployment-helper, storefront; `custom/plugins` and `custom/static-plugins` are empty. Core references Commercial only indirectly. `Framework/Plugin.php:100`; `Service/Event/CommercialLicenseProvidedEvent.php:17` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none found_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The "Call URL (Webhook)" flow action is shipped by the Commercial extension as the admin bundle `WebhookFlowAction`, registering `action.call.webhook` | 6.7.11.1 with Commercial | closed | https://github.com/shopware/shopware/issues/17720 |
| With Commercial installed, available actions still depend on the trigger's aware-interfaces, not only on the licence | 6.7.10.x with Commercial 7.10.1 | closed | https://github.com/shopware/shopware/issues/17193 |
| Commercial webhook action passes null for `newsletter_recipient.*` parameters | 6.7.8.2 with Commercial | closed | https://github.com/shopware/shopware/issues/15776 |
| Flow WebhookAction tests run as CommercialTests; `FileUrlValidator::isValid` performs a real DNS lookup | 6.7 | closed | https://github.com/shopware/shopware/issues/13949 |
| Custom prices are imported through `POST /api/_action/custom-price`, which floods product indexing and accepts no `indexing-behavior` header | 6.6 era | open | https://github.com/shopware/shopware/issues/8802 |
| Merchants look for a customer-price module in the administration; there is none — API only | 6.6 + 6.7 | open | https://docs.shopware.com/en/shopware-6-en/extensions/customer-specific-pricing |
| Third-party store plugins exist specifically to add webhook flow actions to unlicensed shops | 6.6 + 6.7 | open | https://store.shopware.com/en/lunov57570869920m/advanced-flow-actions-webhooks-delay-microsoft-teams-slack-discord.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is there a `action.call.webhook` flow action in the platform repo? | code | No — the tagged iterator has 16 keys and none is HTTP-related; the action is not in core on 6.6 or 6.7 |
| What actions does a non-licensed shop get instead? | code | The 16 core actions: order/customer tagging, change customer group/status, grant download access, send mail, generate document, set order state, three custom-field setters, two affiliate/campaign-code actions, stop flow |
| Does a `custom_price` entity or `/api/_action/custom-price` controller exist in core? | code | No — absent from the whole core tree |
| What per-customer pricing does core offer? | code | Rule-based `product_price` with Rule Builder customer conditions, and promotion `personaCustomers` |
| Is `checkout.order.placed` a core trigger? | code | Yes — `CheckoutOrderPlacedEvent implements FlowEventAware` |
| Is there a licence/feature gate the code lane can name? | code | Not in core: only a migration-namespace exemption for `Shopware\Commercial` and `CommercialLicenseProvidedEvent`. The plan gating itself is not verifiable from open source — recorded as `[docs-only]` |
| Why does a trigger offer fewer actions than expected (#17193)? | not settled | The aware-interface filtering service was not read; immaterial to this case, which asks what ships and what must be licensed |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Customer-specific pricing requires the Beyond plan and the Commercial extension | "The customer specific pricing is available to you from the Shopware Beyond plan via the Shopware Commercial extension." | merchant `extensions/customer-specific-pricing/v1-0-0-1.md` | not verifiable from code; consistent with the feature's absence from core → `[docs-only]` |
| Custom prices are API-only — no store extension, no administration module | "Creating, reading, changing and deleting custom prices is only possible via the API." | merchant `extensions/customer-specific-pricing/v1-0-0-1.md` | not verifiable from core; corroborated by community `#8802` → `[docs-only]` |
| The API route is `/api/_action/custom-price`, modelled on the sync API | "…you can use the API endpoint `/api/_action/custom-price`." | developer `guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md` | not in core — no such controller; ships with Commercial → `[docs-only]` |
| `customerGroupId` in the custom-price payload is a non-functional stub | "…is a stub implementation to avoid breaking changes … and is not currently functional." | developer `…/commercial/customer-specific-pricing.md` | not verifiable from core |
| Customer-specific pricing is part of the Commercial plugin plus a `Custom Prices` feature activation in the merchant account | "…requires an existing Shopware 6 installation and the activated Shopware 6 Commercial plugin." | developer `…/commercial/customer-specific-pricing.md` | not verifiable from code |
| The Call URL (webhook) action is available from the Evolve plan onwards and needs the Commercial extension | "You need the Shopware Commercial extension to use the Webhook Actions." | merchant `settings/Flow-Builder/v1-3-0-1.md` (6.7) and `v1-2-2-1.md` (6.6), verbatim identical | the absence from core is confirmed; the plan gate is not verifiable from code → `[docs-only]` |
| A `checkout.order.placed` trigger exists, firing when an order is placed | "\| checkout.order.placed \| Triggers when an order is placed \|" | merchant `settings/Flow-Builder/v1-3-0-1.md` | yes — `CheckoutOrderPlacedEvent.php:27-29` |
| The per-plan table marks webhook actions for Evolve and Beyond, customer-specific pricing for Beyond only | "Flow Builder \| webhook actions … X … X" | merchant `extensions/shopware-commercial/v1-1-0-0.md` | not verifiable from code |
| Commercial is pre-installed in cloud and must be installed manually self-hosted | "In the self-hosted variant, you have to install the extension yourself before you can use it." | merchant `extensions/shopware-commercial/v1-1-0-0.md` | not verifiable from code; consistent with this install, which has no Commercial package |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The 6.7 Flow Builder article presents Flow Builder as a no-code tool that can "have URL calls … carried out", attaching the plan requirement only in the webhook section | The Flow Builder engine is core, but no core action performs an HTTP request; an unlicensed shop reaching an external URL needs an installed app (app flow action or manifest webhook) | `Content/DependencyInjection/flow.xml:61-158`; `Content/Flow/Dispatching/FlowExecutor.php:193-207` |
| The merchant features page for customer-specific pricing describes the capability with no licence statement at all, while the extensions page makes Beyond mandatory | Core ships no per-customer price at all: `product_price.rule_id` is Required and no `custom_price` entity exists, so the unlicensed answer is rule-based pricing, not an individual price | `Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:60-79` |
| No documentation page names the app-based route (app flow action `<url>` / manifest `<webhook>`) as the open-source way to call an external URL on order placed | Both paths exist in core schemas and are the only URL-calling paths | `Framework/App/Flow/Schema/flow-1.0.xsd:64`; `Framework/App/Manifest/Schema/manifest-3.0.xsd:265-268` |
| Docs version-anchoring for both features is unusable (`productVersionFrom` of `15.09.22` / `1.0.0.0`) | Code confirms the core-side facts are identical on 6.6.x and 6.7.13.0 | `github shopware/shopware tree 6.6.x src/Core/Content/Flow/Dispatching/Action` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Both capabilities already exist as Shopware Commercial features — customer-specific pricing and the Flow Builder **Call URL (webhook)** action — so the answer is to enable and configure them, not to implement them in a plugin. | rewritten | kept in substance but re-anchored: code settles the decisive half (neither is in core on 6.6 or 6.7, with citations), which the old fact only implied. The Commercial attribution itself moves to the `[docs-only]` fact |
| Shopware Commercial is the extension that delivers the booked plan's features: cloud shops have it pre-installed (it is not listed under My Extensions), self-hosted shops install it under **Extensions > My Extensions > Shopware Commercial** or via **Extensions > Store** and then activate it — without it the features are absent from the shop regardless of the contract. | rewritten | retained as `[docs-only]`; code cannot express licence packaging and contradicts nothing here. Condensed so the plan gates and the install requirement sit in one checkable fact |
| Names the plan each of the two is gated behind as the page states it (on 2026-09-06: the Call URL / webhook action from Evolve up, customer-specific pricing Beyond only), and does not present a gated feature as stock Shopware. An answer that invents a tier, or that proposes building either feature from scratch without naming the commercial one, fails Accuracy. | split | the plan assignment moved into fact 2 (re-read 2026-09-12, unchanged); the scoring instruction moved to the **Trap** line, where the template puts it |
| **Scoring note:** the plan a given capability sits in is judged against the page **as read on the day of the run**, not against the assignments below — Shopware re-cuts the tiers. What is scored is the build-vs-buy answer: the capability is identified as an existing commercial feature rather than something to reimplement, its gate is named, and no availability is claimed that the page does not state. | removed | a tolerance clause: it let an answer naming any tier pass by deferring the assignment to the day of the run. The plan gates are now stated with the date they were read, and the build-vs-buy requirement survives as the Trap |
| _(new)_ | added | what core *does* offer instead — rule-based prices with customer Rule Builder conditions, promotion `personaCustomers`, and the app flow action / manifest webhook — is the load-bearing part of a build-vs-buy answer for a shop without Commercial, and the old set had none of it |
