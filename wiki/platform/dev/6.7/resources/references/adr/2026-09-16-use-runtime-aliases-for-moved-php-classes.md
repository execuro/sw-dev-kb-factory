---
id: platform/dev/6.7/resources/references/adr/2026-09-16-use-runtime-aliases-for-moved-php-classes.md
title: Use runtime aliases for moved PHP classes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-16-use-runtime-aliases-for-moved-php-classes.html
sourceHash: e8853c490231cf0fee867a5bfa866ca6df0b2ec6
codeCheckedAgainst: "6.7.15.1"
keywords: ["ClassMoved", "ClassAliasRegistry::ALIASES", "class_alias()", "autoload.files", "BCChangeAttribute", "moved class", "namespace move", "class alias", "backwards compatibility", "deprecated service alias", "phpstan", "bc checker"]
summary: "ADR: a PHP class moved to a new namespace keeps its old FQCN via class_alias() from a central alias registry, marked by a ClassMoved BC-change attribute."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-16, area core) on keeping backwards compatibility when a supported PHP class moves to another namespace. Instead of a compatibility subclass at the old namespace, the old fully qualified class name becomes a runtime alias of the single canonical class through PHP's `class_alias()`, so both names are the same runtime class.

## When to use

- An extension references a Shopware class by a previous FQCN (type declarations, `new`, inheritance, static access, or as a DI service ID) and you need to know how long that keeps working and how it behaves.
- You move a supported class inside Shopware and need the required metadata steps.

## Key steps / config

1. Keep exactly one canonical declaration of the class in its new namespace. Do not leave a compatibility subclass at the old namespace (it creates a second class identity and an extra inheritance level, can duplicate and diverge, and cannot replace every moved class).
2. Mark the canonical class with a repeatable BC-change attribute that records the version in which the previous name will be removed and the previous FQCN. BC-change attributes implement `Shopware\Core\Framework\Deprecation\BCChange\BCChangeAttribute` and expose a public `$version` (e.g. `'v6.8.0'`).
3. Add the pair (previous name, canonical name) to the central alias registry constant. The Composer bootstrap iterates that authoritative list and registers every entry eagerly with `class_alias()` through `autoload.files`, so the alias exists before either name is first used.
4. The registry also holds an uncalled private method with explicit `class_alias()` calls so PhpStorm can index previous names. This is only an IDE aid; forgetting one does not affect runtime or tooling.
5. Core code uses only the canonical name.
6. If the class is a service, keep its previous service ID as a deprecated alias of the canonical service for the same transition period.
7. Tooling: PHPStan checks that every attribute has a registry entry and vice versa, that moved services have a deprecated service alias, and that Core adds no new references to previous names. The backwards-compatibility checker reads the registry and compares the previous API with the canonical declaration.
8. In the removal version, remove the registry entry, the attribute and the deprecated service alias together; add release information and an upgrade entry.

## Essential identifiers

- `class_alias()`
- Composer `autoload.files`
- `Shopware\Core\Framework\Deprecation\BCChange\BCChangeAttribute` (BC-change attribute family)

## Gotchas

- Reflection reports the canonical declaration; code must not rely on the previous name being a distinct subclass.
- The mechanism is only for a supported class whose implementation survives the move. Removed classes, or classes replaced with different behaviour, use the regular deprecation lifecycle.
- The ADR names the attribute `#[ClassMoved]` and the registry `ClassAliasRegistry::ALIASES`; neither exists in the installed 6.7.15.1 code.

## Version notes

- In 6.7.15.1 neither `ClassMoved` nor `ClassAliasRegistry` is present, core's `composer.json` `autoload.files` lists no alias bootstrap, and core contains no `class_alias()` call; the decision is not yet implemented in this release.

## Code check (6.7.15.1)
- absent `ClassMoved` — no such attribute class in the installed code
- absent `ClassAliasRegistry::ALIASES` — no alias registry class in the installed code
- confirmed `BCChangeAttribute` — marker interface of BC-change attributes — vendor/shopware/core/Framework/Deprecation/BCChange/BCChangeAttribute.php:32
- confirmed `ClassHierarchyChange::$version` — BC-change attributes carry a public `$version` — vendor/shopware/core/Framework/Deprecation/BCChange/ClassHierarchyChange.php:22
- confirmed `autoload.files` — core composer autoload files list, no alias bootstrap — vendor/shopware/core/composer.json:12
- unverified `class_alias()` — PHP built-in, out of scope; no call found in core
