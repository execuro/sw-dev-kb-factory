# `dev-09` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-09` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** How do I make a field on my plugin's own entity translatable per language?

**Expected answer — every fact an answer must contain:**

1. Translation is not a flag on the existing field: on the main definition the field becomes a virtual `(new TranslatedField('name'))` — its constructor takes a property name only, no storage name, so it has no column on the parent table — and the definition additionally declares `(new TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id'))`, which is a `OneToManyAssociationField` defaulting to the property `translations` and adding `CascadeDelete`.  `[code: Framework/DataAbstractionLayer/Field/TranslatedField.php:22-28]` `[code: Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10-27]` `[code: System/Tax/Aggregate/TaxRuleType/TaxRuleTypeDefinition.php:53-55]`
2. The real column lives in a second definition, `<Entity>TranslationDefinition extends EntityTranslationDefinition` with entity name `<entity>_translation`, registered with the `shopware.entity.definition` tag. It **must** override `getParentDefinitionClass()` — the base implementation throws `RuntimeException('`getParentDefinitionClass` not implemented')` — and declares only the translated storage fields; the parent FK `<entity>_id` and `language_id`, flagged `PrimaryKey`+`Required` as the composite key, plus the `parent` and `language` ManyToOne associations, are injected by `getBaseFields()`. Its entity class extends `TranslationEntity` (which supplies `languageId`/`language`), not `Entity`, and has no own id.  `[code: Framework/DataAbstractionLayer/EntityTranslationDefinition.php:50-53]` `[code: Framework/DataAbstractionLayer/EntityTranslationDefinition.php:55-76]` `[code: System/Tax/Aggregate/TaxRuleTypeTranslation/TaxRuleTypeTranslationDefinition.php:13-47]`
3. In 6.7 the attribute-based route removes the second definition entirely: `#[Field(type: FieldType::STRING, translated: true)]` on the property plus a `#[Translations]` property is enough — `AttributeEntityDefinition` converts any `translated: true` field into a `TranslatedField`, and the compiler pass generates the `<entity>_translation` definition, its service (tagged `shopware.entity.definition`) and its repository automatically, triggered solely by the presence of one `translated: true` field.  `[code: Content/MeasurementSystem/DataAbstractionLayer/MeasurementSystemEntity.php:34-47]` `[code: Framework/DataAbstractionLayer/AttributeEntityDefinition.php:69-78]` `[code: Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-translations.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Parent declares a `TranslatedField` plus a `TranslationsAssociationField` to a second definition | `System/Tax/Aggregate/TaxRuleType/TaxRuleTypeDefinition.php:47-57` | `(new TranslatedField('typeName'))->addFlags(...), (new TranslationsAssociationField(TaxRuleTypeTranslationDefinition::class, 'tax_rule_type_id'))->addFlags(new Required()),` |
| `TranslatedField` takes only `(string $propertyName, bool $useForSorting = false)`; resolves against `LanguageDefinition` | `Framework/DataAbstractionLayer/Field/TranslatedField.php:22-28,50-58` | `public function __construct(string $propertyName, private readonly bool $useForSorting = false)` |
| `TranslationsAssociationField(string $referenceClass, string $referenceField, string $propertyName = 'translations', string $localField = 'id')` extends `OneToManyAssociationField`, auto-adds `CascadeDelete`, language column hardcoded `language_id` | `Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10-27` | `$this->addFlags(new CascadeDelete()); ... public function getLanguageField(): string { return 'language_id';` |
| Translation definition extends `EntityTranslationDefinition`, overrides `getParentDefinitionClass()`, declares only translated fields | `System/Tax/Aggregate/TaxRuleTypeTranslation/TaxRuleTypeTranslationDefinition.php:13-47` | `protected function getParentDefinitionClass(): string { return TaxRuleTypeDefinition::class; }` |
| `getBaseFields()` injects the parent FK and `language_id` as the `PrimaryKey`+`Required` pair plus both ManyToOne associations | `Framework/DataAbstractionLayer/EntityTranslationDefinition.php:55-76` | `(new FkField($entityName . '_id', ...))->addFlags(new ApiAware(), new PrimaryKey(), new Required()), (new FkField('language_id', 'languageId', LanguageDefinition::ENTITY_NAME, 'id'))->addFlags(new ApiAware(), new PrimaryKey(), new Required()),` |
| Omitting `getParentDefinitionClass()` is a runtime exception, not a silent default | `Framework/DataAbstractionLayer/EntityTranslationDefinition.php:20-28,50-53` | `throw new \RuntimeException('`getParentDefinitionClass` not implemented');` |
| Translation entity class extends `TranslationEntity` | `System/Tax/Aggregate/TaxRuleTypeTranslation/TaxRuleTypeTranslationEntity.php:10-16` ; `Framework/DataAbstractionLayer/TranslationEntity.php:9-13` | `class TaxRuleTypeTranslationEntity extends TranslationEntity` / `class TranslationEntity extends Entity { protected string $languageId;` |
| `DefinitionValidator` enforces field symmetry between parent and translation definition, and requires the parent's `TranslationsAssociationField` | `Framework/DataAbstractionLayer/DefinitionValidator.php:616-632,642-672` | `'Field `%s` defined in `%s`, but missing in `%s`. Please add `new TranslatedField(\'%s\') to `%s`'` |
| Translated columns must be nullable or have a default | `Framework/DataAbstractionLayer/DefinitionValidator.php:524-531` | `if ($column->getNotnull() && $column->getDefault() === null) { ... 'Column `%s`.`%s` is not nullable'` |
| Attribute route: `translated: true` + `#[Translations]` | `Content/MeasurementSystem/DataAbstractionLayer/MeasurementSystemEntity.php:34-47` ; `Framework/DataAbstractionLayer/Attribute/Field.php:20-27` | `#[Field(type: FieldType::STRING, translated: true, api: true)] public ?string $name = null; ... #[Translations] public ?array $translations = null;` |
| `AttributeEntityDefinition` turns a `translated` field into a `TranslatedField`, discarding the declared storage class | `Framework/DataAbstractionLayer/AttributeEntityDefinition.php:69-78` | `if ($field['translated']) { $fields[] = new TranslatedField($field['name']); continue; }` |
| Compiler pass generates the `<entity>_translation` definition, service and repository | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php` (`private function translation`) ; `Framework/DataAbstractionLayer/AttributeEntityCompiler.php:296` | `$container->setDefinition($entity . '_translation.definition', $definition); ... $this->repository($container, $entity . '_translation');` / `$field instanceof Translations => [$entity . '_translation', $entity . '_id'],` |
| Generation is triggered solely by one `translated: true` field | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php` (`private function hasTranslation`) | `if (isset($field['translated']) && $field['translated']) { return true; }` |
| Translated values are read back via `Entity::getTranslated()` / `getTranslation(string $field)` | `Framework/DataAbstractionLayer/Entity.php:136-147` | `public function getTranslated(): array` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A field is made translatable by a flag, e.g. `->addFlags(new Translatable())` | absent | No `Translatable` flag exists in `Framework/DataAbstractionLayer/Field/Flag/`; the mechanism is `TranslatedField` + `TranslationsAssociationField` + a dedicated `EntityTranslationDefinition` (`Framework/DataAbstractionLayer/Field/TranslatedField.php:11`) |
| The translated column also stays on the parent table | absent | `TranslatedField` extends `Field`, not `StorageAware`, and takes no storage name — no parent column (`Framework/DataAbstractionLayer/Field/TranslatedField.php:22-28`) |
| The translation entity has its own id / uses `EntityIdTrait` | absent | `TaxRuleTypeTranslationEntity` has no `EntityIdTrait`; `getBaseFields()` flags the parent FK + `language_id` as the primary key pair (`Framework/DataAbstractionLayer/EntityTranslationDefinition.php:64-69`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Smallest complete translated-entity pair in core (definition, translation definition, both entity classes) | `System/Tax/Aggregate/TaxRuleType/TaxRuleTypeDefinition.php:53-55` |
| `DefinitionValidator` is the harness that catches an incorrectly wired translation pair | `Framework/DataAbstractionLayer/DefinitionValidator.php:499-503` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Own translatable entities stopped saving after a patch update (`Call to a member function is() on null` in `WriteCommandQueue`) | 6.4.8 → 6.4.20 | open | https://forum.shopware.com/t/problem-with-translation-of-own-entities-after-update/98827 |
| Translated field on an association/extension looked up in the base entity's translation definition | 6.6.2.0 | closed | https://github.com/shopware/shopware/issues/3743 |
| `TranslatedField` carrying the `Runtime` flag produces `Unknown column ...` SQL errors | 6.7.8.1 | closed | https://github.com/shopware/shopware/issues/15484 |
| A translation written only in a non-default language is stored but not read back | 6.6.9.0 | closed | https://github.com/shopware/shopware/issues/10843 |
| Changing the shop default language leaves entities without a default-language translation row | 6.6.x / 6.7 | closed | https://github.com/shopware/shopware/issues/11023 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Are the three pieces (`TranslatedField`, `EntityTranslationDefinition` subclass, `TranslationsAssociationField`) each mandatory in 6.7? | code | Confirmed; `DefinitionValidator` additionally enforces the symmetry (`DefinitionValidator.php:616-672`) |
| Is `getParentDefinitionClass()` still mandatory, and does the base class auto-register `language_id`, the FK and the composite PK? | code | Confirmed — it throws if not overridden; `getBaseFields()` adds both FKs, the PK flags and both associations (`EntityTranslationDefinition.php:50-53,55-76`) |
| Does `TranslationsAssociationField` still take the definition class plus FK column, default property `translations`? | code | Confirmed (`TranslationsAssociationField.php:10-27`) |
| Must the plugin still hand-write the whole translation side in 6.7? | code | No — the attribute route generates it; both routes exist in 6.7 (`AttributeEntityCompilerPass.php`, `AttributeEntityDefinition.php:69-78`) |
| How is a translated value read back? | code | `Entity::getTranslated()` / `getTranslation(string $field)` (`Entity.php:136-147`) |
| Can a `TranslatedField` legally carry the `Runtime` flag (issue #15484)? | not examined | Out of scope of the facts above; no bearing on the three facts, left unsettled |
| Is the system-language translation still mandatory on write (issues #10843, #11023)? | not examined | Out of scope of the facts above; concerns write/read fallback, not the declaration mechanism |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Translation table is the entity name with a `_translation` suffix | "Make sure to use the name of your entity appending `_translation`." | `add-data-translations.md` | yes — the generated definition is `$entity . '_translation'` (`AttributeEntityCompilerPass.php`) |
| Primary key is the composite of parent id and `language_id` | "PRIMARY KEY (`swag_example_id`, `language_id`)," | `add-data-translations.md` | yes (`EntityTranslationDefinition.php:64-69`) |
| Translation definition extends `EntityTranslationDefinition` and must override `getParentDefinitionClass()` | "we have to override a method called `getParentDefinitionClass`" | `add-data-translations.md` | yes (`EntityTranslationDefinition.php:50-53`) |
| Only the translated payload fields are declared; base fields are added automatically | "the other fields like the `language_id` will be automatically added by the `EntityTranslationDefinition`" | `add-data-translations.md` | yes (`EntityTranslationDefinition.php:55-76`) |
| Registered with the same `shopware.entity.definition` tag, after the parent entity | "Note, that we have to register the translation after the entity we want to translate." | `add-data-translations.md` | tag yes (`AttributeEntityCompilerPass.php`); the ordering requirement was not examined in code |
| Translation entity class extends `TranslationEntity` | "Our entity has to extend from the `Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity`" | `add-data-translations.md` | yes (`TranslationEntity.php:9-13`) |
| Main definition declares a `TranslatedField` plus a `TranslationsAssociationField` | "must define: a `TranslatedField` … a `TranslationsAssociationField`" | `add-data-translations.md` | yes (`TaxRuleTypeDefinition.php:53-55`) |
| `TranslatedField` takes only a property name | "(new TranslatedField('name'))->addFlags(new ApiAware(), new Required())," | `add-data-translations.md` | yes (`TranslatedField.php:22-28`) |
| Prefer `entity.translated.field` in storefront contexts, the plain field in Admin/CRUD flows | "prefer `entity.translated.field` in storefront and sales-channel contexts" | `add-data-translations.md` | partially — `getTranslated()` exists (`Entity.php:136-147`); the usage guidance is editorial |
| The DAL resolves up to three language levels on read | "current language, optional parent language, then system language" | `plain-vs-translated-fields.md` | not examined by the code lane |
| `translated: true` auto-creates the `TranslatedField` and registers an `EntityTranslationDefinition` | "This will automatically create a `TranslatedField` … and register an `EntityTranslationDefinition` for you." | `entities-via-attributes.md` | yes (`AttributeEntityDefinition.php:69-78`, `AttributeEntityCompilerPass.php`) |
| Translated properties must be nullable | "Properties with the `translated` flag must be nullable." | `entities-via-attributes.md` | not examined as an enforcement; core's example declares `public ?string $name = null` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `add-data-translations.md` requires a hand-written `ExampleTranslationDefinition`/`Entity`/`Collection`, while `entities-via-attributes.md` says none is needed; neither page says which applies in 6.7 | Both routes exist in 6.7 side by side: the classic pair (as `TaxRuleType*` still uses) and the attribute route that generates the translation definition, service and repository | `System/Tax/Aggregate/TaxRuleType/TaxRuleTypeDefinition.php:47-57` ; `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php` |
| `add-data-translations.md` shows the translated field with `new Required()` on the parent while its own migration makes the translation column nullable | `DefinitionValidator` reports a NOT NULL translated column without default as a violation, so nullable storage is the required shape | `Framework/DataAbstractionLayer/DefinitionValidator.php:524-531` |
| `add-data-translations.md` states the registration order (translation after parent) matters | The code lane did not examine any ordering requirement; the tag itself is confirmed | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Create a `<entity>_translation` table (e.g. `swag_example_translation`) whose composite primary key is the foreign keys `swag_example_id` and `language_id`. | merged into fact 2 | Not disproved — the composite `PrimaryKey`+`Required` FK pair and the `<entity>_translation` name are code-confirmed via `getBaseFields()` and the compiler pass — but as a standalone fact it left the mechanism (a second definition) implicit; folded into fact 2 with citations. |
| Add a definition extending `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition` that overrides `getParentDefinitionClass()` to return the parent definition class, declares only the translated fields in `defineFields()`, and is tagged `shopware.entity.definition` after the parent entity; its entity class extends `TranslationEntity`. | rewritten as fact 2 | Confirmed in substance; tightened with the `RuntimeException` that makes the override mandatory and with what `getBaseFields()` injects. The "after the parent entity" ordering clause was dropped: the code lane confirmed the tag but examined no ordering requirement. |
| On the main definition, replace the plain field with `(new TranslatedField('name'))` and add `(new TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id'))`. | rewritten as fact 1 | Confirmed; extended with the fact that `TranslatedField` has no storage column at all, which is the point the query turns on. |
| _(new)_ | added as fact 3 | 6.7 ships an attribute route in which no translation definition is written; an answer that presents the hand-written pair as the only 6.7 mechanism is incomplete. |
